// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Model for a flexible cylindrical pipe which can be modified using a fixed number of control points.
 * Also models the flow of particles in the pipe (with and without friction).
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var PipeControlPoint = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/PipeControlPoint' );
  var PipeCrossSection = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/PipeCrossSection' );
  var SplineEvaluation = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/SplineEvaluation' );

  /**
   * Default constructor for the pipe.
   * @constructor
   */
  function Pipe() {

    PropertySet.call( this, {
      flowRate: 5000,// rate of fluid flow in Liter per second (L/s)
      friction: false  // flag indicating whether friction should slow particles near the edges
    } );

    // cross-sections that the user can manipulate to deform the pipe.
    this.controlCrossSections = [];
    this.controlCrossSections[ 0 ] = new PipeCrossSection( -6.7, -3.5, -1.4 );
    this.controlCrossSections[ 1 ] = new PipeCrossSection( -4.6, -3.5, -1.4 );
    this.controlCrossSections[ 2 ] = new PipeCrossSection( -2.3, -3.5, -1.4 );
    this.controlCrossSections[ 3 ] = new PipeCrossSection( -0, -3.5, -1.4 );
    this.controlCrossSections[ 4 ] = new PipeCrossSection( 2.3, -3.5, -1.4 );
    this.controlCrossSections[ 5 ] = new PipeCrossSection( 4.6, -3.5, -1.4 );
    this.controlCrossSections[ 6 ] = new PipeCrossSection( 6.7, -3.5, -1.4 );

    // nonlinear interpolation of the control sections for particle motion and determining the velocity field
    this.splineCrossSections = [];

    // flag to improve performance
    this.dirty = true;

    // control points to drag/scale the pipe
    this.controlPoints = [];

    // add pipe top control points
    for ( var m = 0; m < this.controlCrossSections.length; m++ ) {
      this.controlPoints.push( new PipeControlPoint( this.controlCrossSections[ m ].x, this.controlCrossSections[ m ].yTop ) );
    }

    // add pipe bottom control points
    for ( m = this.controlCrossSections.length - 1; m >= 0; m-- ) {
      this.controlPoints.push( new PipeControlPoint( this.controlCrossSections[ m ].x, this.controlCrossSections[ m ].yBottom ) );
    }
  }

  return inherit( PropertySet, Pipe, {

    // reset the pipe
    reset: function() {
      PropertySet.prototype.reset.call( this );
      // reset the control points.
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        this.controlPoints[ i ].reset();
      }
      this.dirty = true;
    },

    // creates the set of interpolated cross section samples from the control cross sections.
    createSpline: function() {
      // update the control cross section with the new pipe cross sections by using updated control points
      this.controlCrossSections[ 0 ] = new PipeCrossSection( this.controlPoints[ 0 ].position.x, this.controlPoints[ 13 ].position.y, this.controlPoints[ 0 ].position.y );
      this.controlCrossSections[ 1 ] = new PipeCrossSection( this.controlPoints[ 1 ].position.x, this.controlPoints[ 12 ].position.y, this.controlPoints[ 1 ].position.y );
      this.controlCrossSections[ 2 ] = new PipeCrossSection( this.controlPoints[ 2 ].position.x, this.controlPoints[ 11 ].position.y, this.controlPoints[ 2 ].position.y );
      this.controlCrossSections[ 3 ] = new PipeCrossSection( this.controlPoints[ 3 ].position.x, this.controlPoints[ 10 ].position.y, this.controlPoints[ 3 ].position.y );
      this.controlCrossSections[ 4 ] = new PipeCrossSection( this.controlPoints[ 4 ].position.x, this.controlPoints[ 9 ].position.y, this.controlPoints[ 4 ].position.y );
      this.controlCrossSections[ 5 ] = new PipeCrossSection( this.controlPoints[ 5 ].position.x, this.controlPoints[ 8 ].position.y, this.controlPoints[ 5 ].position.y );
      this.controlCrossSections[ 6 ] = new PipeCrossSection( this.controlPoints[ 6 ].position.x, this.controlPoints[ 7 ].position.y, this.controlPoints[ 6 ].position.y );

      var pipePositions = [ new PipeCrossSection( this.getMinX(), this.getBottomLeft().y, this.getTopLeft().y )].concat( this.controlCrossSections );
      var dx = 0.3;//extend water flow so it looks like it enters the pipe cutaway
      pipePositions.push( new PipeCrossSection( this.getMaxX() + dx, this.getBottomRight().y, this.getTopRight().y ) );
      return this.spline( pipePositions );
    },

    /**
     * Interpolates the specified control points to obtain a smooth set of cross sections
     * @param {PipeCrossSection[]} controlCrossSections that are used to generate the spline
     * @returns {PipeCrossSection[]} array of interpolated cross-sections
     */
    spline: function( controlCrossSections ) {
      var spline = [];// array to hold the pipe cross sections
      var top = [];
      var bottom = [];

      // allocate fixed size arrays for holding pipe control points' x,y values. These are used for computing the splines.
      var u = new Array( this.controlPoints.length / 2 );
      var xBottom = new Array( this.controlPoints.length / 2 );
      var yBottom = new Array( this.controlPoints.length / 2 );
      var xTop = new Array( this.controlPoints.length / 2 );
      var yTop = new Array( this.controlPoints.length / 2 );

      for ( var i = 0; i < controlCrossSections.length; i++ ) {
        top.push( new PipeControlPoint( controlCrossSections[ i ].x, controlCrossSections[ i ].yTop ) );
        bottom.push( new PipeControlPoint( controlCrossSections[ i ].x, controlCrossSections[ i ].yBottom ) );
      }

      // compute the spline for the pipe top line
      for ( i = 0; i < top.length; i++ ) {
        u[ i ] = i / top.length;
        xTop[ i ] = top[ i ].position.x;
        yTop[ i ] = top[ i ].position.y;
      }
      var xSplineTop = numeric.spline( u, xTop );
      var ySplineTop = numeric.spline( u, yTop );

      // compute the spline for the pipe bottom line
      for ( i = 0; i < bottom.length; i++ ) {
        u[ i ] = i / bottom.length;
        xBottom[ i ] = bottom[ i ].position.x;
        yBottom[ i ] = bottom[ i ].position.y;
      }
      var xSplineBottom = numeric.spline( u, xBottom );
      var ySplineBottom = numeric.spline( u, yBottom );

      // for line smoothness
      var lastPt = ( this.controlPoints.length - 1) / this.controlPoints.length;
      var linSpace = numeric.linspace( 0, lastPt, 20 * ( this.controlPoints.length - 1) );

      // compute points
      var xPointsBottom = SplineEvaluation.atArray( xSplineBottom, linSpace );
      var yPointsBottom = SplineEvaluation.atArray( ySplineBottom, linSpace );
      var xPointsTop = SplineEvaluation.atArray( xSplineTop, linSpace );
      var yPointsTop = SplineEvaluation.atArray( ySplineTop, linSpace );

      // Use spline points to build the intermediate pipe cross-sections.
      // Note: the number of cross-sections to use can be reduced (ex: alpha += 3) to get better performance
      for ( var alpha = 0; alpha < xPointsTop.length; alpha++ ) {
        var topPt = new Vector2( xPointsTop[ alpha ], yPointsTop[ alpha ] );
        var bottomPt = new Vector2( xPointsBottom[ alpha ], yPointsBottom[ alpha ] );
        //make sure pipe top doesn't go below pipe bottom
        //Note that when the velocity becomes too high, Bernoulli's equation gives a negative pressure.
        //The pressure doesn't really go negative then, it just means Bernoulli's equation is inapplicable in that situation
        //So we have to make sure the distance threshold is high enough that Bernoulli's equation never gives a negative pressure

        var min = 1;// maintaining a minimum pipe cross section of dia 1;
        var bottomY = bottomPt.y;
        var topY = topPt.y;
        if ( topY - bottomY < min ) {
          var center = ( topY + bottomY ) / 2;
          topY = center + min / 2;
          bottomY = center - min / 2;
        }

        spline.push( new PipeCrossSection( (topPt.x + bottomPt.x ) / 2, bottomY, topY ) );
      }
      return spline;
    },

    // Gets all the pipe cross-sections, rebuilding the intermediate interpolated ones if necessary
    getSplineCrossSections: function() {
      // if pipe  shape changes create the new cross sections else return old cross sections
      if ( this.dirty ) {
        this.splineCrossSections = this.createSpline();
        this.dirty = false;
      }
      return this.splineCrossSections;
    },

    // return the xPosition of the right most cross section
    getMaxX: function() {
      return this.controlCrossSections[ this.controlCrossSections.length - 1 ].getX();
    },

    // return the xPosition of the left most cross section
    getMinX: function() {
      return this.controlCrossSections[ 0 ].getX();
    },

    // Given a global y-position, determine the fraction to the top (point at bottom = 0, point halfway up = 0.5, etc.)
    getFractionToTop: function( x, y ) {
      var position = this.getCrossSection( x );
      return Util.linear( position.yBottom, position.yTop, 0, 1, y );
    },

    // Determines the cross section for a given x-coordinate by linear interpolation between the nearest nonlinear samples.
    getCrossSection: function( x ) {
      var previous = this.getPipePositionBefore( x );
      var next = this.getPipePositionAfter( x );
      var top = Util.linear( previous.x, next.x, previous.yTop, next.yTop, x );
      var bottom = Util.linear( previous.x, next.x, previous.yBottom, next.yBottom, x );
      return new PipeCrossSection( x, bottom, top ); //return pipe cross section
    },

    // Lookup the cross section immediately before the specified x-location for interpolation
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

    // Lookup the cross section immediately after the specified x-location for interpolation
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

    // Get the pipe left side top position
    getTopLeft: function() {
      return new Vector2( this.getMinX(), this.controlCrossSections[ 0 ].yTop );
    },

    // Get the pipe left side bottom position
    getBottomLeft: function() {
      return new Vector2( this.getMinX(), this.controlCrossSections[ 0 ].yBottom );
    },

    // Get the pipe right side top position
    getTopRight: function() {
      var controlCrossSections = this.controlCrossSections;
      return new Vector2( this.getMaxX(), controlCrossSections[ controlCrossSections.length - 1 ].yTop );
    },

    // Get the pipe right side bottom position
    getBottomRight: function() {
      var controlCrossSections = this.controlCrossSections;
      return new Vector2( this.getMaxX(), controlCrossSections[ controlCrossSections.length - 1 ].yBottom );
    },

    // Get the speed at the specified x-location.  This is before friction and vertical effects are accounted for
    getSpeed: function( x ) {
      //Continuity equation: a1*v1 = a2*v2
      //treat pipes as if they are cylindrical cross sections
      var crossSectionDiameter = this.getCrossSection( x ).getHeight();
      var crossSectionRadius = crossSectionDiameter / 2;
      var crossSectionArea = Math.PI * crossSectionRadius * crossSectionRadius;
      // use rate of fluid flow in volume (m^3) per second
      return  ( this.flowRate / 1000 ) / crossSectionArea;
    },

    // I was told that the fluid flow rate falls off quadratically, so use lagrange interpolation so that at the center of the pipe
    // the velocity is full speed, and it falls off quadratically toward the sides.
    // See http://stackoverflow.com/questions/2075013/best-way-to-find-quadratic-regression-curve-in-java
    lagrange: function( x1, y1, x2, y2, x3, y3, x ) {
      return ( x - x2 ) * ( x - x3 ) / ( x1 - x2 ) / ( x1 - x3 ) * y1 +
             ( x - x1 ) * ( x - x3 ) / ( x2 - x1 ) / ( x2 - x3 ) * y2 +
             ( x - x1 ) * ( x - x2 ) / ( x3 - x1 ) / ( x3 - x2 ) * y3;
    },

    // Get the velocity at the specified point, does not account for vertical effects or friction.
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

    // Gets the x-velocity of a particle, incorporating vertical effects.
    // If this effect is ignored, then when there is a large slope in the pipe, particles closer to the edge move much faster (which is physically incorrect).
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

    getTweakedVelocity: function( x, y ) {
      return new Vector2( this.getTweakedVx( x, y ), this.getVelocity( x, y ).y );
    },

    // Find the y-value for the specified x-value and fraction (0=bottom, 1=top) of the pipe
    fractionToLocation: function( x, fraction ) {
      var position = this.getCrossSection( x );
      return Util.linear( 0, 1, position.yBottom, position.yTop, fraction );
    },


    /**
     * Get the point at the specified location
     * @param {Number} x position  is in meters
     * @param {Number}  fractionToTop is in (0,1)
     * @returns {Vector2 } the position vector of the point
     */
    getPoint: function( x, fractionToTop ) {
      return new Vector2( x, this.fractionToLocation( x, fractionToTop ) );
    },

    // Compute the circular cross sectional area (in meters squared) at the specified location
    getCrossSectionalArea: function( x ) {
      var radius = Math.abs( this.getPoint( x, 0.5 ).y - this.getPoint( x, 1 ).y );
      return Math.PI * radius * radius;
    }

  } );
} );
