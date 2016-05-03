// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for a flexible cylindrical pipe which can be modified using a fixed number of control points.
 * Also models the flow of particles in the pipe (with and without friction).
 * All units are in metric unless otherwise mentioned.
 *
 * @author Siddhartha Chinthapally (Actual Concepts).
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var PipeControlPoint = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/PipeControlPoint' );
  var PipeCrossSection = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/PipeCrossSection' );
  var SplineEvaluation = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/SplineEvaluation' );

  // constants
  var CROSS_SECTION_MIN_HEIGHT = 1; //m
  var TOP_CONTROL_POINT_INITIAL_Y = -3.5; //m
  var BOTTOM_CONTROL_POINT_INITIAL_Y = -1.4; //m
  var PIPE_INITIAL_SCALE = 0.36;

  var PIPE_INITIAL_Y = 197; //from screen top in view coordinates
  var TOP_HANDLE_INITIAL_Y = PIPE_INITIAL_Y + 2; //from screen top in view coordinates
  var BOTTOM_HANDLE_INITIAL_Y = 324; //from screen top in view coordinates

  var CONTROL_POINT_X_SPACING = 2.3; //m
  var LAST_CONTROL_POINT_OFFSET = 0.2; //m
  var DUMMY_CONTROL_POINT_OFFSET = 0.1; //m

  /**
   * Default constructor for the pipe.
   * @constructor
   */
  function Pipe() {
    var mainHandleInitialY = (TOP_HANDLE_INITIAL_Y + BOTTOM_HANDLE_INITIAL_Y) / 2;

    PropertySet.call( this, {
      flowRate: 5000, // rate of fluid flow in Liter per second (L/s)
      friction: false, // flag indicating whether friction should slow particles near the edges
      rightPipeYPosition: PIPE_INITIAL_Y, //tracks the right pipe's vertical position in pixel
      leftPipeYPosition: PIPE_INITIAL_Y,
      leftPipeMainHandleYPosition: mainHandleInitialY,
      rightPipeMainHandleYPosition: mainHandleInitialY,
      leftPipeScale: PIPE_INITIAL_SCALE,
      rightPipeScale: PIPE_INITIAL_SCALE,
      leftPipeTopHandleY: TOP_HANDLE_INITIAL_Y,
      leftPipeBottomHandleY: BOTTOM_HANDLE_INITIAL_Y,
      rightPipeTopHandleY: TOP_HANDLE_INITIAL_Y,
      rightPipeBottomHandleY: BOTTOM_HANDLE_INITIAL_Y
    } );

    // cross-sections that the user can manipulate to deform the pipe.
    var controlCrossSections = [
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
    for ( var i = 0; i < controlCrossSections.length; i++ ) {
      this.top.push( new PipeControlPoint( controlCrossSections[ i ].x, controlCrossSections[ i ].yTop ) );
      this.bottom.push( new PipeControlPoint( controlCrossSections[ i ].x, controlCrossSections[ i ].yBottom ) );
    }

    // nonlinear interpolation of the control sections for particle motion and determining the velocity field
    this.splineCrossSections = [];

    // flag to improve performance
    this.dirty = true;

  }

  fluidPressureAndFlow.register( 'Pipe', Pipe );

  return inherit( PropertySet, Pipe, {

    // reset the pipe
    reset: function() {

      for ( var i = 0; i < this.top.length; i++ ) {
        this.top[ i ].reset();
        this.bottom[ i ].reset();
      }
      this.dirty = true;
      PropertySet.prototype.reset.call( this );
    },

    /**
     * Interpolates the pipe control points to obtain a smooth set of cross sections
     * @returns {Array<PipeCrossSection>} array of interpolated cross-sections
     * @private
     */
    spline: function() {
      var spline = [];// array to hold the pipe cross sections

      var i; // for-loop

      // allocate fixed size arrays for holding pipe control points' x,y values. These are used for computing the splines.
      var numCrossSections = this.top.length;

      var u = new Array( numCrossSections );
      var xBottom = new Array( numCrossSections );
      var yBottom = new Array( numCrossSections );
      var xTop = new Array( numCrossSections );
      var yTop = new Array( numCrossSections );

      // compute the spline for the pipe top line
      for ( i = 0; i < this.top.length; i++ ) {
        u[ i ] = i / this.top.length;
        xTop[ i ] = this.top[ i ].position.x;
        yTop[ i ] = this.top[ i ].position.y;
      }
      var xSplineTop = numeric.spline( u, xTop );
      var ySplineTop = numeric.spline( u, yTop );

      // compute the spline for the pipe bottom line
      for ( i = 0; i < this.bottom.length; i++ ) {
        u[ i ] = i / this.bottom.length;
        xBottom[ i ] = this.bottom[ i ].position.x;
        yBottom[ i ] = this.bottom[ i ].position.y;
      }
      var xSplineBottom = numeric.spline( u, xBottom );
      var ySplineBottom = numeric.spline( u, yBottom );

      // for line smoothness
      var lastPt = ( this.top.length - 1) / this.top.length;
      var linSpace = numeric.linspace( 0, lastPt, 20 * ( this.top.length - 1) );
      // compute points
      var xPointsBottom = SplineEvaluation.atArray( xSplineBottom, linSpace );
      var yPointsBottom = SplineEvaluation.atArray( ySplineBottom, linSpace );
      var xPointsTop = SplineEvaluation.atArray( xSplineTop, linSpace );
      var yPointsTop = SplineEvaluation.atArray( ySplineTop, linSpace );

      // Use spline points to build the intermediate pipe cross-sections.
      // Note: the number of cross-sections to use can be reduced (ex: alpha += 3) to get better performance
      for ( var alpha = 0; alpha < xPointsTop.length; alpha += 3 ) {
        var topPointX = xPointsTop[ alpha ];
        var topPointY = yPointsTop[ alpha ];
        var bottomPointX = xPointsBottom[ alpha ];
        var bottomPointY = yPointsBottom[ alpha ];
        //make sure pipe top doesn't go below pipe bottom
        //Note that when the velocity becomes too high, Bernoulli's equation gives a negative pressure.
        //The pressure doesn't really go negative then, it just means Bernoulli's equation is inapplicable in that situation
        //So we have to make sure the distance threshold is high enough that Bernoulli's equation never gives a negative pressure

        var min = CROSS_SECTION_MIN_HEIGHT;// maintaining a minimum pipe cross section of dia 1;
        if ( topPointY - bottomPointY < min ) {
          var center = ( topPointY + bottomPointY ) / 2;
          topPointY = center + min / 2;
          bottomPointY = center - min / 2;
        }

        spline.push( new PipeCrossSection( ( topPointX + bottomPointX ) / 2, bottomPointY, topPointY ) );
      }
      return spline;
    },

    // Gets all the pipe cross-sections, rebuilding the intermediate interpolated ones if necessary
    getSplineCrossSections: function() {
      // if pipe shape changes create the new cross sections else return old cross sections
      if ( this.dirty ) {
        this.splineCrossSections = this.spline();
        this.dirty = false;
      }
      return this.splineCrossSections;
    },

    // return the xPosition of the right most control point
    getMaxX: function() {
      return this.top[ this.top.length - 1 ].position.x;
    },

    // return the xPosition of the left most control point
    getMinX: function() {
      return this.top[ 0 ].position.x;
    },

    /**
     * Given a global y-position, determine the fraction to the top (point at bottom = 0, point halfway up = 0.5, etc.)
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {*} fraction
     */
    getFractionToTop: function( x, y ) {
      var position = this.getCrossSection( x );
      return Util.linear( position.yBottom, position.yTop, 0, 1, y );
    },


    /**
     * Determines the cross section for a given x-coordinate by linear interpolation between the nearest nonlinear samples.
     * @param {number} x position in meters
     * @returns {PipeCrossSection} cross section of pipe
     */
    getCrossSection: function( x ) {
      var previous = this.getPipePositionBefore( x );
      var next = this.getPipePositionAfter( x );
      var top = Util.linear( previous.x, next.x, previous.yTop, next.yTop, x );
      var bottom = Util.linear( previous.x, next.x, previous.yBottom, next.yBottom, x );
      return new PipeCrossSection( x, bottom, top ); //return pipe cross section
    },


    /**
     * Lookup the cross section immediately before the specified x-location for interpolation
     * @param {number} x position in meters
     * @returns {PipeCrossSection} if one exists
     */
    getPipePositionBefore: function( x ) {
      var crossSections = this.getCrossSections();
      var pipeCrossSection;

      // the crossSections are sorted in ascending x.
      for ( var i = crossSections.length - 1; i >= 0; i-- ) {
        pipeCrossSection = crossSections[ i ];
        if ( pipeCrossSection.getX() < x ) {
          return pipeCrossSection;
        }
      }
    },

    getCrossSections: function() {
      return this.getSplineCrossSections();
    },


    /**
     * Lookup the cross section immediately after the specified x-location for interpolation
     * @param {number} x position in meters
     * @returns {PipeCrossSection} if one exists
     */
    getPipePositionAfter: function( x ) {
      var crossSections = this.getCrossSections();
      var pipeCrossSection;

      // the crossSections are sorted in ascending x.
      for ( var i = 0; i < crossSections.length; i++ ) {
        pipeCrossSection = crossSections[ i ];
        if ( pipeCrossSection.getX() > x ) {
          return pipeCrossSection;
        }
      }
    },

    /**
     * Get the speed at the specified x-location in m/s.  This is before friction and vertical effects are accounted for.
     * @param { Number } x position in meters
     * @returns {number} speed of fluid flow at given x position
     */
    getSpeed: function( x ) {
      //Continuity equation: a1*v1 = a2*v2
      //treat pipes as if they are cylindrical cross sections
      var crossSectionDiameter = this.getCrossSection( x ).getHeight();
      var crossSectionRadius = crossSectionDiameter / 2;
      var crossSectionArea = Math.PI * crossSectionRadius * crossSectionRadius;
      // use rate of fluid flow in volume (m^3) per second
      return ( this.flowRate / 1000 ) / crossSectionArea;
    },

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
     */
    lagrange: function( x1, y1, x2, y2, x3, y3, x ) {
      return ( x - x2 ) * ( x - x3 ) / ( x1 - x2 ) / ( x1 - x3 ) * y1 +
             ( x - x1 ) * ( x - x3 ) / ( x2 - x1 ) / ( x2 - x3 ) * y2 +
             ( x - x1 ) * ( x - x2 ) / ( x3 - x1 ) / ( x3 - x2 ) * y3;
    },


    /**
     * Get the velocity at the specified point, does not account for vertical effects or friction.
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {Vector2} velocity at x,y in metric units.
     */
    getVelocity: function( x, y ) {
      var fraction = this.getFractionToTop( x, y );
      var speed = this.getSpeed( x );

      var pre = this.getCrossSection( x - 1E-7 );// pipe cross section
      var post = this.getCrossSection( x + 1E-7 );// pipe cross section

      var x0 = pre.getX();
      var y0 = Util.linear( 0, 1, pre.yBottom, pre.yTop, fraction );
      var x1 = post.getX();
      var y1 = Util.linear( 0, 1, post.yBottom, post.yTop, fraction );
      var velocity = new Vector2( x1 - x0, y1 - y0 );
      return velocity.setMagnitude( speed );
    },

    /**
     * Gets the x-velocity of a particle, incorporating vertical effects.
     * If this effect is ignored, then when there is a large slope in the pipe, particles closer to the edge move much faster (which is physically incorrect).
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {number} the tweaked x-velocity
     */
    getTweakedVx: function( x, y ) {

      var fraction = this.getFractionToTop( x, y );
      var speed = this.getSpeed( x );

      var pre = this.getCrossSection( x - 1E-7 );// pipe cross section
      var post = this.getCrossSection( x + 1E-7 );// pipe cross section

      var x0 = pre.getX();
      var y0 = Util.linear( 0, 1, pre.yBottom, pre.yTop, fraction );
      var x1 = post.getX();
      var y1 = Util.linear( 0, 1, post.yBottom, post.yTop, fraction );

      var deltaX = ( x1 - x0 );
      var deltaY = ( y1 - y0 );
      var vx = ( deltaX / Math.sqrt( deltaX * deltaX + deltaY * deltaY ) ) * speed;

      // If friction is enabled, then scale down quadratically (like a parabola) as you get further from the center of the pipe.
      // But instead of reaching zero velocity at the edge of the pipe (which could cause particles to pile up indefinitely), extend the region
      // a small epsilon past the (0..1) pipe range
      if ( this.friction ) {
        var epsilon = 0.2;
        var fractionToTop = this.getFractionToTop( x, y );
        var scaleFactor = this.lagrange( -epsilon, 0, 0.5, 1, 1 + epsilon, 0, fractionToTop );
        return vx * scaleFactor;
      }
      else {
        return vx;
      }
    },

    /**
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {Vector2} the velocity vector at the given point
     */
    getTweakedVelocity: function( x, y ) {
      return new Vector2( this.getTweakedVx( x, y ), this.getVelocity( x, y ).y );
    },

    /**
     * Find the y-value for the specified x-value and fraction (0=bottom, 1=top) of the pipe
     * @param {number} x position in meters
     * @param {number} fraction is in (0,1) (0=bottom, 1=top)
     * @returns {*}
     */
    fractionToLocation: function( x, fraction ) {
      var position = this.getCrossSection( x );
      return Util.linear( 0, 1, position.yBottom, position.yTop, fraction );
    },

    /**
     * Get the point at the specified location
     * @param {number} x position  is in meters
     * @param {number} fractionToTop is in (0,1)
     * @returns {Vector2} the position vector of the point
     */
    getPoint: function( x, fractionToTop ) {
      return new Vector2( x, this.fractionToLocation( x, fractionToTop ) );
    },

    /**
     * Compute the circular cross sectional area (in meters squared) at the specified location
     * @param {number} x position in meters
     * @returns {number} area of cross section at x in square meters
     */
    getCrossSectionalArea: function( x ) {
      var radius = Math.abs( this.getPoint( x, 0.5 ).y - this.getPoint( x, 1 ).y );
      return Math.PI * radius * radius;
    }

  } );
} );
