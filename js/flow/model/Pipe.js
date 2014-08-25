// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Model for a pipe, which has a fixed number of points.
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PipeControlPoint = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/PipeControlPoint' );
  var PipeCrossSection = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/PipeCrossSection' );
  var SplineEvaluation = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/SplineEvaluation' );

  /**
   * Model for a pipe, which has a fixed number of points.
   * @constructor
   */
  function Pipe() {
    var pipe = this;
    PropertySet.call( this, {
      //Rate of fluid flow in volume (m^3) per second
      flowRate: 2,
      //Flag indicating whether friction should slow particles near the edges
      friction: false

    } );

    // Cross sections that the user can manipulate to deform the pipe.
    this.controlCrossSections = []; // ArrayList<PipeCrossSection>();
    this.controlCrossSections[0] = new PipeCrossSection( 0.2, -3, -1 );
    this.controlCrossSections[1] = new PipeCrossSection( 0.8, -3, -1 );
    this.controlCrossSections[2] = new PipeCrossSection( 1.6, -3, -1 );
    this.controlCrossSections[3] = new PipeCrossSection( 2.4, -3, -1 );
    this.controlCrossSections[4] = new PipeCrossSection( 3.2, -3, -1 );
    this.controlCrossSections[5] = new PipeCrossSection( 4.2, -3, -1 );
    this.controlCrossSections[6] = new PipeCrossSection( 5.1, -3, -1 );

    // Nonlinear interpolation of the control sections for particle motion and determining the velocity field
    this.splineCrossSections = new ObservableArray();//ArrayList<PipeCrossSection>

    // Flag to improve performance
    this.dirty = true;
    this.controlPoints = [];

    for ( var m = 0; m < pipe.controlCrossSections.length; m++ ) {
      pipe.controlPoints.push( new PipeControlPoint( pipe.controlCrossSections[m].getTop().x, pipe.controlCrossSections[m].getTop().y ) );
    }
    for ( m = pipe.controlCrossSections.length - 1; m >= 0; m-- ) {
      pipe.controlPoints.push( new PipeControlPoint( pipe.controlCrossSections[m].getBottom().x, this.controlCrossSections[m].getBottom().y ) );
    }

    this.u = new Array( pipe.controlPoints.length / 2 );
    this.xBottom = new Array( pipe.controlPoints.length / 2 );
    this.yBottom = new Array( pipe.controlPoints.length / 2 );
    this.xTop = new Array( pipe.controlPoints.length / 2 );
    this.yTop = new Array( pipe.controlPoints.length / 2 );


    var j = 0;

    //Arrays are fixed length, so just overwrite values.
    for ( var i = pipe.controlPoints.length / 2; i < pipe.controlPoints.length; i++ ) {
      pipe.u[j] = j / (pipe.controlPoints.length / 2);
      pipe.xBottom[j] = pipe.controlPoints[i].position.x;
      pipe.yBottom[j] = pipe.controlPoints[i].position.y;
      j++;
    }
    this.xSplineBottom = numeric.spline( pipe.u, pipe.xBottom );
    this.ySplineBottom = numeric.spline( pipe.u, pipe.yBottom );

    //Arrays are fixed length, so just overwrite values
    for ( i = 0; i < pipe.controlPoints.length / 2; i++ ) {
      pipe.u[i] = i / (pipe.controlPoints.length / 2);
      pipe.xTop[i] = pipe.controlPoints[i].position.x;
      pipe.yTop[i] = pipe.controlPoints[i].position.y;
    }
    this.xSplineTop = numeric.spline( pipe.u, pipe.xTop );
    this.ySplineTop = numeric.spline( pipe.u, pipe.yTop );
  }

  return inherit( PropertySet, Pipe, {
    reset: function() {
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        this.controlPoints[i].reset();
      }
    },


    //Creates the set of interpolated cross section samples from the control cross sections.
    createSpline: function() {
      this.controlCrossSections[0] = new PipeCrossSection( this.controlPoints[0].position.x, this.controlPoints[13].position.y, this.controlPoints[0].position.y );
      this.controlCrossSections[1] = new PipeCrossSection( this.controlPoints[1].position.x, this.controlPoints[12].position.y, this.controlPoints[1].position.y );
      this.controlCrossSections[2] = new PipeCrossSection( this.controlPoints[2].position.x, this.controlPoints[11].position.y, this.controlPoints[2].position.y );
      this.controlCrossSections[3] = new PipeCrossSection( this.controlPoints[3].position.x, this.controlPoints[10].position.y, this.controlPoints[3].position.y );
      this.controlCrossSections[4] = new PipeCrossSection( this.controlPoints[4].position.x, this.controlPoints[9].position.y, this.controlPoints[4].position.y );
      this.controlCrossSections[5] = new PipeCrossSection( this.controlPoints[5].position.x, this.controlPoints[8].position.y, this.controlPoints[5].position.y );
      this.controlCrossSections[6] = new PipeCrossSection( this.controlPoints[6].position.x, this.controlPoints[7].position.y, this.controlPoints[6].position.y );
      var pipePositions = new ObservableArray();//new ArrayList<PipeCrossSection>();
      var dx = 0.2;//extend water flow so it looks like it enters the pipe cutaway
      pipePositions.add( new PipeCrossSection( this.getMinX(), this.getBottomLeft().y, this.getTopLeft().y ) );
      pipePositions.addAll( this.controlCrossSections );
      pipePositions.add( new PipeCrossSection( this.getMaxX() + dx, this.getBottomRight().y, this.getTopRight().y ) );
      return this.spline( pipePositions );
    },

    //Interpolates the specified control points to obtain a smooth set of cross sections
    /*
     *param@<PipeCrossSection> controlPoints[]
     */
    spline: function( controlPoints ) {
      var spline = new ObservableArray();// array of pipe cross section.
      var pipeControlCrossSections = [];
      this.top = [];
      var i;
      for ( i = 0; i < controlPoints.length; i++ ) {
        this.top.push( new PipeControlPoint( controlPoints.get( i ).getTop().x, controlPoints.get( i ).getTop().y ) );
      }
      this.bottom = [];
      for ( i = 0; i < controlPoints.length; i++ ) {
        this.bottom.push( new PipeControlPoint( controlPoints.get( i ).getBottom().x, controlPoints.get( i ).getBottom().y ) );
      }
      for ( i = 0; i < this.top.length; i++ ) {
        this.u[i] = i / this.top.length;
        this.xTop[i] = this.top[i].position.x;
        this.yTop[i] = this.top[i].position.y;
      }
      this.xSplineTop = numeric.spline( this.u, this.xTop );
      this.ySplineTop = numeric.spline( this.u, this.yTop );

      for ( i = 0; i < this.bottom.length; i++ ) {
        this.u[i] = i / this.bottom.length;
        this.xBottom[i] = this.bottom[i].position.x;
        this.yBottom[i] = this.bottom[i].position.y;

      }
      this.xSplineBottom = numeric.spline( this.u, this.xBottom );
      this.ySplineBottom = numeric.spline( this.u, this.yBottom );

      // for line smoothness
      var lastPt = (this.controlPoints.length - 1) / this.controlPoints.length;
      var linSpace = numeric.linspace( 0, lastPt, 20 * (this.controlPoints.length - 1) );

      //Compute points
      var xPointsBottom = SplineEvaluation.atArray( this.xSplineBottom, linSpace );
      var yPointsBottom = SplineEvaluation.atArray( this.ySplineBottom, linSpace );
      var xPointsTop = SplineEvaluation.atArray( this.xSplineTop, linSpace );
      var yPointsTop = SplineEvaluation.atArray( this.ySplineTop, linSpace );

      for ( var alpha = 0; alpha < xPointsTop.length; alpha++ ) {
        var topPt = new Vector2( xPointsTop[alpha ], yPointsTop[alpha ] );//topSpline.evaluate( alpha );
        var bottomPt = new Vector2( xPointsBottom[alpha], yPointsBottom[alpha] );// bottomSpline.evaluate( alpha );
        //make sure pipe top doesn't go below pipe bottom
        //Note that when the velocity becomes too high, Bernoulli's equation gives a negative pressure.
        //The pressure doesn't really go negative then, it just means Bernoulli's equation is inapplicable in that situation
        //So we have to make sure the distance threshold is high enough that Bernoulli's equation never gives a negative pressure
        var min = 1;//PipeCrossSectionControl.DISTANCE_THRESHOLD;
        var bottomY = bottomPt.y;
        var topY = topPt.y;
        if ( topY - bottomY < min ) {
          var center = ( topY + bottomY ) / 2;
          topY = center + min / 2;
          bottomY = center - min / 2;
        }
        pipeControlCrossSections.push( new PipeCrossSection( (topPt.x + bottomPt.x ) / 2, bottomY, topY ) );
      }
      spline.addAll( pipeControlCrossSections );
      console.log( spline );
      return spline;
    },

    getSplineCrossSections: function() {
      if ( this.dirty ) {
        this.splineCrossSections = this.createSpline();
        this.dirty = false;
      }
      return this.splineCrossSections;
    },

    getMaxX: function() {
      var sortedPipePositions = this.getPipePositionsSortedByX();
      // this.getPipePositionsSortedByX();//get pipe cross section list
      return  sortedPipePositions[ sortedPipePositions.length - 1 ].getX();
    },

    getMinX: function() {
      return this.getPipePositionsSortedByX()[0].getX();
    },
    getPipePositionsSortedByX: function() {
      return this.controlCrossSections;
    },

    //Given a global y-position, determine the fraction to the top (point at bottom = 0, point halfway up = 0.5, etc.)
    getFractionToTop: function( x, y ) {
      var position = this.getCrossSection( x );
      return Util.linear( position.getBottom().y, position.getTop().y, 0, 1, y );
    },

    //Determines the cross section for a given x-coordinate by linear interpolation between the nearest nonlinear samples.
    getCrossSection: function( x ) {
      var previous = this.getPipePositionBefore( x );
      var next = this.getPipePositionAfter( x );
      var top = Util.linear( previous.getTop().x, next.getTop().x, previous.getTop().y, next.getTop().y, x );
      var bottom = Util.linear( previous.getBottom().x, next.getBottom().x, previous.getBottom().y, next.getBottom().y, x );
      return new PipeCrossSection( x, bottom, top ); //return pipe cross section
    },

    //Lookup the cross section immediately before the specified x-location for interpolation
    getPipePositionBefore: function( x ) {
      var crossSections = this.getCrossSections();
      var pipeCrossSection;
      var i;
      // Assuming the crossSections are sorted in ascending x. TODO: Verify this
      for ( i = crossSections.length - 1; i >= 0; i-- ) {
        pipeCrossSection = crossSections.get( i );
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
      var i;
      // Assuming the crossSections are sorted in ascending x. TODO: Verify this
      for ( i = 0; i < crossSections.length; i++ ) {
        pipeCrossSection = crossSections.get( i );
        if ( pipeCrossSection.getX() > x ) {
          return pipeCrossSection;
        }
      }
    },

    contains: function( x, y ) {
      return this.getShape().contains( x, y );
    },

    getTopLeft: function() {
      return new Vector2( this.getMinX(), this.controlCrossSections[0].getTop().y );
    },

    getBottomLeft: function() {
      return new Vector2( this.getMinX(), this.controlCrossSections[0].getBottom().y );
    },

    getTopRight: function() {
      var controlCrossSections = this.controlCrossSections;
      return new Vector2( this.getMaxX(), controlCrossSections[controlCrossSections.length - 1].getTop().y );
    },

    getBottomRight: function() {
      var controlCrossSections = this.controlCrossSections;
      return new Vector2( this.getMaxX(), controlCrossSections[controlCrossSections.length - 1].getBottom().y );
    },

    // Get the speed at the specified x-location.  This is before friction and vertical effects are accounted for
    getSpeed: function( x ) {
      //Continuity equation: a1*v1 = a2*v2
      //treat pipes as if they are cylindrical cross sections?
      var crossSectionDiameter = this.getCrossSection( x ).getHeight();
      var crossSectionRadius = crossSectionDiameter / 2;
      var crossSectionArea = Math.PI * crossSectionRadius * crossSectionRadius;
      return this.flowRate / crossSectionArea;
    },

    //I was told that the fluid flow rate falls off quadratically, so use lagrange interpolation so that at the center of the pipe
    //The velocity is full speed, and it falls off quadratically toward the sides
    //See http://stackoverflow.com/questions/2075013/best-way-to-find-quadratic-regression-curve-in-java
    lagrange: function( x1, y1, x2, y2, x3, y3, x ) {
      return ( x - x2 ) * ( x - x3 ) / ( x1 - x2 ) / ( x1 - x3 ) * y1 +
             ( x - x1 ) * ( x - x3 ) / ( x2 - x1 ) / ( x2 - x3 ) * y2 +
             ( x - x1 ) * ( x - x2 ) / ( x3 - x1 ) / ( x3 - x2 ) * y3;
    },

    //Get the velocity at the specified point, does not account for vertical effects or friction.
    getVelocity: function( x, y ) {
      var fraction = this.getFractionToTop( x, y );
      var speed = this.getSpeed( x );

      var pre = this.getCrossSection( x - 1E-7 );// pipe cross section
      var post = this.getCrossSection( x + 1E-7 );// pipe cross section

      var x0 = pre.getX();
      var y0 = Util.linear( 0, 1, pre.getBottom().y, pre.getTop().y, fraction );
      var x1 = post.getX();
      var y1 = Util.linear( 0, 1, post.getBottom().y, post.getTop().y, fraction );
      var velocity = new Vector2( x1 - x0, y1 - y0 );
      return velocity.setMagnitude( speed );
    },

    //Gets the x-velocity of a particle, incorporating vertical effects.
    //If this effect is ignored, then when there is a large slope in the pipe, particles closer to the edge move much faster (which is physically incorrect).
    getTweakedVx: function( x, y ) {
      var velocity = this.getVelocity( x, y );
      var xVelocity = new Vector2( velocity.x, 0 );
      var vx = this.getSpeed( x ) / ( velocity.magnitude() / xVelocity.magnitude() );

      //If friction is enabled, then scale down quadratically (like a parabola) as you get further from the center of the pipe.
      //But instead of reaching zero velocity at the edge of the pipe (which could cause particles to pile up indefinitely), extend the region
      //a small epsilon past the (0..1) pipe range
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

    //Find the y-value for the specified x-value and fraction (0=bottom, 1=top) of the pipe
    fractionToLocation: function( x, fraction ) {
      var position = this.getCrossSection( x );
      return Util.linear( 0, 1, position.getBottom().y, position.getTop().y, fraction );
    },


    //Get the point at the specified location, where x is in meters and fractionToTop is in (0,1)
    getPoint: function( x, fractionToTop ) {
      return new Vector2( x, this.fractionToLocation( x, fractionToTop ) );
    },

    //Compute the circular cross sectional area (in meters squared) at the specified location
    getCrossSectionalArea: function( x ) {
      var radius = Math.abs( this.getPoint( x, 0.5 ).y - this.getPoint( x, 1 ).y );
      return Math.PI * radius * radius;
    }

  } );
} );
