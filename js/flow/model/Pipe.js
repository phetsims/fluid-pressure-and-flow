// Copyright 2014-2021, University of Colorado Boulder

/**
 * Model for a flexible cylindrical pipe which can be modified using a fixed number of control points.
 * Also models the flow of particles in the pipe (with and without friction).
 * All units are in metric unless otherwise mentioned.
 *
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import PipeControlPoint from './PipeControlPoint.js';
import PipeCrossSection from './PipeCrossSection.js';
import SplineEvaluation from './SplineEvaluation.js';

// constants
const CROSS_SECTION_MIN_HEIGHT = 1; //m
const TOP_CONTROL_POINT_INITIAL_Y = -3.5; //m
const BOTTOM_CONTROL_POINT_INITIAL_Y = -1.4; //m
const PIPE_INITIAL_SCALE = 0.36;

const PIPE_INITIAL_Y = 197; //from screen top in view coordinates
const TOP_HANDLE_INITIAL_Y = PIPE_INITIAL_Y + 2; //from screen top in view coordinates
const BOTTOM_HANDLE_INITIAL_Y = 324; //from screen top in view coordinates

const CONTROL_POINT_X_SPACING = 2.3; //m
const LAST_CONTROL_POINT_OFFSET = 0.2; //m
const DUMMY_CONTROL_POINT_OFFSET = 0.1; //m

class Pipe {

  constructor() {
    const mainHandleInitialY = ( TOP_HANDLE_INITIAL_Y + BOTTOM_HANDLE_INITIAL_Y ) / 2;

    this.flowRateProperty = new Property( 5000 ); // rate of fluid flow in Liter per second (L/s)
    this.frictionProperty = new Property( false ); // flag indicating whether friction should slow particles near the edges
    this.rightPipeYPositionProperty = new Property( PIPE_INITIAL_Y ); //tracks the right pipe's vertical position in pixel
    this.leftPipeYPositionProperty = new Property( PIPE_INITIAL_Y );
    this.leftPipeMainHandleYPositionProperty = new Property( mainHandleInitialY );
    this.rightPipeMainHandleYPositionProperty = new Property( mainHandleInitialY );
    this.leftPipeScaleProperty = new Property( PIPE_INITIAL_SCALE );
    this.rightPipeScaleProperty = new Property( PIPE_INITIAL_SCALE );
    this.leftPipeTopHandleYProperty = new Property( TOP_HANDLE_INITIAL_Y );
    this.leftPipeBottomHandleYProperty = new Property( BOTTOM_HANDLE_INITIAL_Y );
    this.rightPipeTopHandleYProperty = new Property( TOP_HANDLE_INITIAL_Y );
    this.rightPipeBottomHandleYProperty = new Property( BOTTOM_HANDLE_INITIAL_Y );

    // cross-sections that the user can manipulate to deform the pipe.
    const controlCrossSections = [
      //dummy cross section, not part of the pipe flow line shape. This is where the particles originate.
      new PipeCrossSection( -( 3 * CONTROL_POINT_X_SPACING - DUMMY_CONTROL_POINT_OFFSET ), TOP_CONTROL_POINT_INITIAL_Y,
        BOTTOM_CONTROL_POINT_INITIAL_Y ),

      new PipeCrossSection( -( 3 * CONTROL_POINT_X_SPACING - LAST_CONTROL_POINT_OFFSET ), TOP_CONTROL_POINT_INITIAL_Y,
        BOTTOM_CONTROL_POINT_INITIAL_Y ),
      new PipeCrossSection( -( 2 * CONTROL_POINT_X_SPACING ), TOP_CONTROL_POINT_INITIAL_Y,
        BOTTOM_CONTROL_POINT_INITIAL_Y ),
      new PipeCrossSection( -CONTROL_POINT_X_SPACING, TOP_CONTROL_POINT_INITIAL_Y, BOTTOM_CONTROL_POINT_INITIAL_Y ),
      new PipeCrossSection( 0, TOP_CONTROL_POINT_INITIAL_Y, BOTTOM_CONTROL_POINT_INITIAL_Y ),
      new PipeCrossSection( CONTROL_POINT_X_SPACING, TOP_CONTROL_POINT_INITIAL_Y, BOTTOM_CONTROL_POINT_INITIAL_Y ),
      new PipeCrossSection( 2 * CONTROL_POINT_X_SPACING, TOP_CONTROL_POINT_INITIAL_Y, BOTTOM_CONTROL_POINT_INITIAL_Y ),
      new PipeCrossSection( 3 * CONTROL_POINT_X_SPACING - LAST_CONTROL_POINT_OFFSET, TOP_CONTROL_POINT_INITIAL_Y,
        BOTTOM_CONTROL_POINT_INITIAL_Y ),

      //dummy cross section, not part of the pipe flow line shape. This is where the particles are removed.
      new PipeCrossSection( 3 * CONTROL_POINT_X_SPACING - DUMMY_CONTROL_POINT_OFFSET, TOP_CONTROL_POINT_INITIAL_Y, BOTTOM_CONTROL_POINT_INITIAL_Y )
    ];

    this.top = []; // array to store top control points
    this.bottom = []; // array to store bottom control points
    for ( let i = 0; i < controlCrossSections.length; i++ ) {
      this.top.push( new PipeControlPoint( controlCrossSections[ i ].x, controlCrossSections[ i ].yTop ) );
      this.bottom.push( new PipeControlPoint( controlCrossSections[ i ].x, controlCrossSections[ i ].yBottom ) );
    }

    // nonlinear interpolation of the control sections for particle motion and determining the velocity field
    this.splineCrossSections = [];

    // flag to improve performance
    this.dirty = true;

  }


  /**
   * reset the pipe
   * @public
   */
  reset() {

    for ( let i = 0; i < this.top.length; i++ ) {
      this.top[ i ].reset();
      this.bottom[ i ].reset();
    }
    this.dirty = true;

    this.flowRateProperty.reset();
    this.frictionProperty.reset();
    this.rightPipeYPositionProperty.reset();
    this.leftPipeYPositionProperty.reset();
    this.leftPipeMainHandleYPositionProperty.reset();
    this.rightPipeMainHandleYPositionProperty.reset();
    this.leftPipeScaleProperty.reset();
    this.rightPipeScaleProperty.reset();
    this.leftPipeTopHandleYProperty.reset();
    this.leftPipeBottomHandleYProperty.reset();
    this.rightPipeTopHandleYProperty.reset();
    this.rightPipeBottomHandleYProperty.reset();
  }

  /**
   * Interpolates the pipe control points to obtain a smooth set of cross sections
   * @returns {Array.<PipeCrossSection>} array of interpolated cross-sections
   * @private
   */
  spline() {
    const spline = [];// array to hold the pipe cross sections

    // allocate fixed size arrays for holding pipe control points' x,y values. These are used for computing the splines.
    const numCrossSections = this.top.length;

    const u = new Array( numCrossSections );
    const xBottom = new Array( numCrossSections );
    const yBottom = new Array( numCrossSections );
    const xTop = new Array( numCrossSections );
    const yTop = new Array( numCrossSections );

    // compute the spline for the pipe top line
    for ( let i = 0; i < this.top.length; i++ ) {
      u[ i ] = i / this.top.length;
      xTop[ i ] = this.top[ i ].positionProperty.value.x;
      yTop[ i ] = this.top[ i ].positionProperty.value.y;
    }
    const xSplineTop = numeric.spline( u, xTop );
    const ySplineTop = numeric.spline( u, yTop );

    // compute the spline for the pipe bottom line
    for ( let i = 0; i < this.bottom.length; i++ ) {
      u[ i ] = i / this.bottom.length;
      xBottom[ i ] = this.bottom[ i ].positionProperty.value.x;
      yBottom[ i ] = this.bottom[ i ].positionProperty.value.y;
    }
    const xSplineBottom = numeric.spline( u, xBottom );
    const ySplineBottom = numeric.spline( u, yBottom );

    // for line smoothness
    const lastPt = ( this.top.length - 1 ) / this.top.length;
    const linSpace = numeric.linspace( 0, lastPt, 20 * ( this.top.length - 1 ) );

    // compute points
    const xPointsBottom = SplineEvaluation.atArray( xSplineBottom, linSpace );
    const yPointsBottom = SplineEvaluation.atArray( ySplineBottom, linSpace );
    const xPointsTop = SplineEvaluation.atArray( xSplineTop, linSpace );
    const yPointsTop = SplineEvaluation.atArray( ySplineTop, linSpace );

    // Use spline points to build the intermediate pipe cross-sections.
    // Note: the number of cross-sections to use can be reduced (ex: alpha += 3) to get better performance
    for ( let alpha = 0; alpha < xPointsTop.length; alpha += 3 ) {

      const topPointX = xPointsTop[ alpha ];
      const bottomPointX = xPointsBottom[ alpha ];
      let topPointY = yPointsTop[ alpha ];
      let bottomPointY = yPointsBottom[ alpha ];

      //make sure pipe top doesn't go below pipe bottom
      //Note that when the velocity becomes too high, Bernoulli's equation gives a negative pressure.
      //The pressure doesn't really go negative then, it just means Bernoulli's equation is inapplicable in that situation
      //So we have to make sure the distance threshold is high enough that Bernoulli's equation never gives a negative pressure

      const min = CROSS_SECTION_MIN_HEIGHT;// maintaining a minimum pipe cross section of dia 1;
      if ( topPointY - bottomPointY < min ) {
        const center = ( topPointY + bottomPointY ) / 2;
        topPointY = center + min / 2;
        bottomPointY = center - min / 2;
      }

      spline.push( new PipeCrossSection( ( topPointX + bottomPointX ) / 2, bottomPointY, topPointY ) );
    }
    return spline;
  }

  /**
   * Gets all the pipe cross-sections, rebuilding the intermediate interpolated ones if necessary
   * @public
   */
  getSplineCrossSections() {
    // if pipe shape changes create the new cross sections else return old cross sections
    if ( this.dirty ) {
      this.splineCrossSections = this.spline();
      this.dirty = false;
    }
    return this.splineCrossSections;
  }


  /**
   * return the xPosition of the right most control point
   * @public
   */
  getMaxX() {
    return this.top[ this.top.length - 1 ].positionProperty.value.x;
  }

  /**
   * return the xPosition of the left most control point
   * @public
   */
  getMinX() {
    return this.top[ 0 ].positionProperty.value.x;
  }

  /**
   * Given a global y-position, determine the fraction to the top (point at bottom = 0, point halfway up = 0.5, etc.)
   * @param {number} x - position in meters
   * @param {number} y - position in meters
   * @returns {number} fraction
   * @private
   */
  getFractionToTop( x, y ) {
    const position = this.getCrossSection( x );
    return Utils.linear( position.yBottom, position.yTop, 0, 1, y );
  }

  /**
   * Determines the cross section for a given x-coordinate by linear interpolation between the nearest nonlinear samples.
   * @param {number} x - position in meters
   * @returns {PipeCrossSection} cross section of pipe
   * @private
   */
  getCrossSection( x ) {
    const previous = this.getPipePositionBefore( x );
    const next = this.getPipePositionAfter( x );
    const top = Utils.linear( previous.x, next.x, previous.yTop, next.yTop, x );
    const bottom = Utils.linear( previous.x, next.x, previous.yBottom, next.yBottom, x );
    return new PipeCrossSection( x, bottom, top ); //return pipe cross section
  }

  /**
   * Lookup the cross section immediately before the specified x-position for interpolation
   * @param {number} x - position in meters
   * @returns {PipeCrossSection|null} if one exists
   * @private
   */
  getPipePositionBefore( x ) {
    const crossSections = this.getCrossSections();

    // the crossSections are sorted in ascending x.
    let pipeCrossSection;
    for ( let i = crossSections.length - 1; i >= 0; i-- ) {
      pipeCrossSection = crossSections[ i ];
      if ( pipeCrossSection.getX() < x ) {
        return pipeCrossSection;
      }
    }
    return null;
  }

  /**
   * @private
   */
  getCrossSections() {
    return this.getSplineCrossSections();
  }

  /**
   * Lookup the cross section immediately after the specified x-position for interpolation
   * @param {number} x - position in meters
   * @returns {PipeCrossSection|null} if one exists
   * @private
   */
  getPipePositionAfter( x ) {
    const crossSections = this.getCrossSections();

    // the crossSections are sorted in ascending x.
    let pipeCrossSection;
    for ( let i = 0; i < crossSections.length; i++ ) {
      pipeCrossSection = crossSections[ i ];
      if ( pipeCrossSection.getX() > x ) {
        return pipeCrossSection;
      }
    }
    return null;
  }

  /**
   * Get the speed at the specified x-position in m/s.  This is before friction and vertical effects are accounted for.
   * @param { Number } x - position in meters
   * @returns {number} speed of fluid flow at given x position
   * @private
   */
  getSpeed( x ) {

    //Continuity equation: a1*v1 = a2*v2
    //treat pipes as if they are cylindrical cross sections
    const crossSectionDiameter = this.getCrossSection( x ).getHeight();
    const crossSectionRadius = crossSectionDiameter / 2;
    const crossSectionArea = Math.PI * crossSectionRadius * crossSectionRadius;

    // use rate of fluid flow in volume (m^3) per second
    return ( this.flowRateProperty.value / 1000 ) / crossSectionArea;
  }

  /**
   * I was told that the fluid flow rate falls off quadratically, so use lagrange interpolation so that at the center of the pipe
   * the velocity is full speed, and it falls off quadratically toward the sides.
   * See http://stackoverflow.com/questions/2075013/best-way-to-find-quadratic-regression-curve-in-java
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {number} x3
   * @param {number} y3
   * @param {number} x
   * @returns {number}
   * @private
   */
  lagrange( x1, y1, x2, y2, x3, y3, x ) {
    return ( x - x2 ) * ( x - x3 ) / ( x1 - x2 ) / ( x1 - x3 ) * y1 +
           ( x - x1 ) * ( x - x3 ) / ( x2 - x1 ) / ( x2 - x3 ) * y2 +
           ( x - x1 ) * ( x - x2 ) / ( x3 - x1 ) / ( x3 - x2 ) * y3;
  }

  /**
   * Get the velocity at the specified point, does not account for vertical effects or friction.
   * @param {number} x - position in meters
   * @param {number} y - position in meters
   * @returns {Vector2} velocity at x,y in metric units.
   * @public
   */
  getVelocity( x, y ) {
    const fraction = this.getFractionToTop( x, y );
    const speed = this.getSpeed( x );

    const pre = this.getCrossSection( x - 1E-7 );// pipe cross section
    const post = this.getCrossSection( x + 1E-7 );// pipe cross section

    const x0 = pre.getX();
    const y0 = Utils.linear( 0, 1, pre.yBottom, pre.yTop, fraction );
    const x1 = post.getX();
    const y1 = Utils.linear( 0, 1, post.yBottom, post.yTop, fraction );
    const velocity = new Vector2( x1 - x0, y1 - y0 );
    return velocity.setMagnitude( speed );
  }

  /**
   * Gets the x-velocity of a particle, incorporating vertical effects.
   * If this effect is ignored, then when there is a large slope in the pipe, particles closer to the edge move much faster (which is physically incorrect).
   * @param {number} x - position in meters
   * @param {number} y - position in meters
   * @returns {number} the tweaked x-velocity
   * @public
   */
  getTweakedVx( x, y ) {

    const fraction = this.getFractionToTop( x, y );
    const speed = this.getSpeed( x );

    const pre = this.getCrossSection( x - 1E-7 );// pipe cross section
    const post = this.getCrossSection( x + 1E-7 );// pipe cross section

    const x0 = pre.getX();
    const y0 = Utils.linear( 0, 1, pre.yBottom, pre.yTop, fraction );
    const x1 = post.getX();
    const y1 = Utils.linear( 0, 1, post.yBottom, post.yTop, fraction );

    const deltaX = ( x1 - x0 );
    const deltaY = ( y1 - y0 );
    const vx = ( deltaX / Math.sqrt( deltaX * deltaX + deltaY * deltaY ) ) * speed;

    // If friction is enabled, then scale down quadratically (like a parabola) as you get further from the center of the pipe.
    // But instead of reaching zero velocity at the edge of the pipe (which could cause particles to pile up indefinitely), extend the region
    // a small epsilon past the (0..1) pipe range
    if ( this.frictionProperty.value ) {
      const epsilon = 0.2;
      const fractionToTop = this.getFractionToTop( x, y );
      const scaleFactor = this.lagrange( -epsilon, 0, 0.5, 1, 1 + epsilon, 0, fractionToTop );
      return vx * scaleFactor;
    }
    else {
      return vx;
    }
  }

  /**
   * @param {number} x - position in meters
   * @param {number} y - position in meters
   * @returns {Vector2} the velocity vector at the given point
   * @public
   */
  getTweakedVelocity( x, y ) {
    return new Vector2( this.getTweakedVx( x, y ), this.getVelocity( x, y ).y );
  }

  /**
   * Find the y-value for the specified x-value and fraction (0=bottom, 1=top) of the pipe
   * @param {number} x - position in meters
   * @param {number} fraction - is in (0,1) (0=bottom, 1=top)
   * @returns {number}
   * @public
   */
  fractionToPosition( x, fraction ) {
    const position = this.getCrossSection( x );
    return Utils.linear( 0, 1, position.yBottom, position.yTop, fraction );
  }

  /**
   * Get the point at the specified position
   * @param {number} x position  is in meters
   * @param {number} fractionToTop is in (0,1)
   * @returns {Vector2} the position vector of the point
   * @public
   */
  getPoint( x, fractionToTop ) {
    return new Vector2( x, this.fractionToPosition( x, fractionToTop ) );
  }

  /**
   * Compute the circular cross sectional area (in meters squared) at the specified position
   * @param {number} x - position in meters
   * @returns {number} area of cross section at x in square meters
   * @public
   */
  getCrossSectionalArea( x ) {
    const radius = Math.abs( this.getPoint( x, 0.5 ).y - this.getPoint( x, 1 ).y );
    return Math.PI * radius * radius;
  }
}

fluidPressureAndFlow.register( 'Pipe', Pipe );
export default Pipe;