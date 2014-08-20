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
  // var Shape = require( 'KITE/Shape' );
  // var SplineEvaluation = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/SplineEvaluation' );

  /**
   * Model for a pipe, which has a fixed number of points.
   * @constructor
   */
  function Pipe() {
    var pipe = this;
    PropertySet.call( this, {
      //Rate of fluid flow in volume (m^3) per second
      flowRate: 5.0,
      //Flag indicating whether friction should slow particles near the edges
      friction: false

    } );
    //Cross sections that the user can manipulate to deform the pipe.
    this.controlCrossSections = [];//new ObservableArray(); // ArrayList<PipeCrossSection>();
    this.controlCrossSections[0] = new PipeCrossSection( 0.2, 9, -10 );
    this.controlCrossSections[1] = new PipeCrossSection( 0.8, 9, -10 );
    this.controlCrossSections[2] = new PipeCrossSection( 1.6, 9, -10 );
    this.controlCrossSections[3] = new PipeCrossSection( 2.4, 9, -10 );
    this.controlCrossSections[4] = new PipeCrossSection( 3.2, 9, -10 );
    this.controlCrossSections[5] = new PipeCrossSection( 4.9, 9, -10 );
    this.controlCrossSections[6] = new PipeCrossSection( 5.2, 9, -10 );

    //Nonlinear interpolation of the control sections for particle motion and determining the velocity field
    this.splineCrossSections = [];//ArrayList<PipeCrossSection>

    //Flag to improve performance
    this.dirty = true;


    this.pipeControlPoints = [];

    for ( var m = 0; m < pipe.controlCrossSections.length; m++ ) {
      pipe.pipeControlPoints.push( new PipeControlPoint( pipe.controlCrossSections[m].getTop().x, pipe.controlCrossSections[m].getTop().y ) );

    }
    for ( m = pipe.controlCrossSections.length - 1; m > 0; m-- ) {
      pipe.pipeControlPoints.push( new PipeControlPoint( pipe.controlCrossSections[m].getBottom().x, this.controlCrossSections[m].getBottom().y ) );

    }

    this.controlPoints = this.pipeControlPoints;
    this.u = new Array( pipe.controlPoints.length );
    this.x = new Array( pipe.controlPoints.length );
    this.y = new Array( pipe.controlPoints.length );

    //when points change, update the spline instance
    this.updateSplines = function() {
      //Arrays are fixed length, so just overwrite values,
      for ( var i = 0; i < pipe.controlPoints.length; i++ ) {
        pipe.u[i] = i / pipe.controlPoints.length;
        pipe.x[i] = pipe.controlPoints[i].position.x;
        pipe.y[i] = pipe.controlPoints[i].position.y;
      }
      pipe.xSpline = numeric.spline( pipe.u, pipe.x );
      pipe.ySpline = numeric.spline( pipe.u, pipe.y );
    };
    this.updateSplines();
  }

  return inherit( PropertySet, Pipe, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        this.controlPoints[i].reset();
      }
      //Broadcast message so that pipe node can update the shape
      this.updateSplines();
      this.trigger( 'reset' );
    },

    getControlCrossSections: function() {
      return this.controlCrossSections;
    },
    getShape: function() {
      //draw the shape of flow lines.//return getShape( getSplineCrossSections() );
    },

    // Creates the set of interpolated cross section samples from the control cross sections.
    createSpline: function() {
      var pipePositions = new ObservableArray();//new ArrayList<PipeCrossSection>();
      var dx = 0.2;//extend water flow so it looks like it enters the pipe cutaway
      pipePositions.add( new PipeCrossSection( null, this.getMinX() - dx, this.getBottomLeft().getY(), this.getTopLeft().getY() ) );
      pipePositions.addAll( this.controlCrossSections );
      pipePositions.add( new PipeCrossSection( null, this.getMaxX() + dx, this.getBottomRight().getY(), this.getTopRight().getY() ) );
      return this.spline( pipePositions );
    },

    /**
     * Interpolates the specified control points to obtain a smooth set of cross sections
     * @param {PipeCrossSection[]} controlPoints that define the shape of the pipe
     * @returns {ObservableArray}
     */
    spline: function( controlPoints ) {
      var spline = new ObservableArray();// array of pipe cross section.
      var top = [controlPoints.size()];
      for ( var i = 0; i < top.length; i++ ) {
        top[i] = new Vector2( controlPoints.get( i ).getTop() );
      }
      var topSpline = [];//new CubicSpline2D( top );
      var bottom = [controlPoints.size()];
      for ( i = 0; i < bottom.length; i++ ) {
        bottom[i] = new Vector2( controlPoints.get( i ).getBottom() );
      }
      var bottomSpline = [];//new ( bottom );
      for ( var alpha = 0; alpha <= 1; alpha += 1.0 / 70 ) {
        var topPt = topSpline.evaluate( alpha );
        var bottomPt = bottomSpline.evaluate( alpha );

        //make sure pipe top doesn't go below pipe bottom
        //Note that when the velocity becomes too high, Bernoulli's equation gives a negative pressure.
        //The pressure doesn't really go negative then, it just means Bernoulli's equation is inapplicable in that situation
        //So we have to make sure the distance threshold is high enough that Bernoulli's equation never gives a negative pressure
        var min = 1;//PipeCrossSectionControl.DISTANCE_THRESHOLD;
        var bottomY = bottomPt.getY();
        var topY = topPt.getY();
        if ( topY - bottomY < min ) {
          var center = ( topY + bottomY ) / 2;
          topY = center + min / 2;
          bottomY = center - min / 2;
        }
        spline.add( new PipeCrossSection( null, ( topPt.getX() + bottomPt.getX() ) / 2, bottomY, topY ) );
      }
      return spline;
    },

    getSplineCrossSections: function() {
      if ( this.dirty ) {
        this.splineCrossSections = this.createSpline();
        this.dirty = false;
      }
      return this.splineCrossSections;
    },
    splineCrossSections: function() {

    },
    getMaxX: function() {
      var list = this.getPipePositionsSortedByX();//get pipe cross section list
      return list.get( list.size() - 1 ).getX();
    },

    getMinX: function() {
      return this.getPipePositionsSortedByX().get( 0 ).getX();
    },
    getPipePositionsSortedByX: function() {

    },

    getTopPath: function() {
      /* return getPath( new Function1<PipeCrossSection, Point2D>() {
       public Point2D apply( PipeCrossSection pipePosition ) {
       return pipePosition.getTop();
       }
       } );*/
    },

    getBottomPath: function() {
      /*return getPath( new Function1<PipeCrossSection, Point2D>() {
       public Point2D apply( PipeCrossSection pipePosition ) {
       return pipePosition.getBottom();
       }
       } );*/
    },
    //Given a global y-position, determine the fraction to the top (point at bottom = 0, point halfway up = 0.5, etc.)
    getFractionToTop: function( x, y ) {
      var position = this.getCrossSection( x );
      return new Function.LinearFunction( position.getBottom().getY(), position.getTop().getY(), 0, 1 ).evaluate( y );
    },

    //Determines the cross section for a given x-coordinate by linear interpolation between the nearest nonlinear samples.
    getCrossSection: function( x ) {
      var previous = this.getPipePositionBefore( x );
      var next = this.getPipePositionAfter( x );
      var top = new Function.LinearFunction( previous.getTop(), next.getTop() ).evaluate( x );
      var bottom = new Function.LinearFunction( previous.getBottom(), next.getBottom() ).evaluate( x );
      return new PipeCrossSection( null, x, bottom, top );
      //return pipe cross section
    },
    //Lookup the cross section immediately before the specified x-location for interpolation
    getPipePositionBefore: function( x ) {
      /*  ArrayList<PipeCrossSection> list = new ArrayList<PipeCrossSection>() {{
       for ( PipeCrossSection pipePosition : getCrossSections() ) {
       if ( pipePosition.getX() < x ) {
       add( pipePosition );
       }
       }
       }};
       if ( list.size() == 0 ) {
       throw new RuntimeException( "No pipe segments before x= " + x );
       }
       return min( list, new PipeCrossSectionXComparator( x ) );*/
    },

    getCrossSections: function() {
      return this.getSplineCrossSections();
    },

    //Lookup the cross section immediately after the specified x-location for interpolation
    getPipePositionAfter: function( x ) {
      /* ArrayList<PipeCrossSection> list = new ArrayList<PipeCrossSection>() {{
       for ( PipeCrossSection pipePosition : getCrossSections() ) {
       if ( pipePosition.getX() > x ) {
       add( pipePosition );
       }
       }
       }};
       return Collections.min( list, new PipeCrossSectionXComparator( x ) );*/
    },
    contains: function( x, y ) {
      return this.getShape().contains( x, y );
    },

    getTopLeft: function() {
      return new Vector2( this.getMinX(), this.getControlCrossSections().get( 0 ).getTop().getY() );
    },

    getBottomLeft: function() {
      return new Vector2( this.getMinX(), this.getControlCrossSections().get( 0 ).getBottom().getY() );
    },

    getTopRight: function() {
      return new Vector2( this.getMaxX(), this.getControlCrossSections().get( this.getControlCrossSections().size() - 1 ).getTop().getY() );
    },

    getBottomRight: function() {
      return new Vector2( this.getMaxX(), this.getControlCrossSections().get( this.getControlCrossSections().size() - 1 ).getBottom().getY() );
    },
    //Get the speed at the specified x-location.  This is before friction and vertical effects are accounted for
    getSpeed: function( x ) {
      //Continuity equation: a1 v1 = a2 v2
      //treat pipes as if they are cylindrical cross sections?
      var crossSectionDiameter = this.getCrossSection( x ).getHeight();
      var crossSectionRadius = crossSectionDiameter / 2;
      var crossSectionArea = Math.PI * crossSectionRadius * crossSectionRadius;
      return this.flowRate.get() / crossSectionArea;
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
      // var y0 = new Function.LinearFunction( 0, 1, pre.getBottom().getY(), pre.getTop().getY() ).evaluate( fraction );
      var y0 = Util.linear( 0, 1, pre.getBottom().getY(), pre.getTop().getY(), fraction );
      var x1 = post.getX();
      // var y1 = new Function.LinearFunction( 0, 1, post.getBottom().getY(), post.getTop().getY() ).evaluate( fraction );
      var y1 = Util.linear( 0, 1, post.getBottom().getY(), post.getTop().getY(), fraction );
      var velocity = new Vector2( x1 - x0, y1 - y0 );
      return velocity.setMagnitude( speed );
    },

    //Gets the x-velocity of a particle, incorporating vertical effects.
    //If this effect is ignored, then when there is a large slope in the pipe, particles closer to the edge move much faster (which is physically incorrect).
    getTweakedVx: function( x, y ) {
      var velocity = this.getVelocity( x, y );
      var xVelocity = new Vector2( velocity.getX(), 0 );
      var vx = this.getSpeed( x ) / ( velocity.magnitude() / xVelocity.magnitude() );

      //If friction is enabled, then scale down quadratically (like a parabola) as you get further from the center of the pipe.
      //But instead of reaching zero velocity at the edge of the pipe (which could cause particles to pile up indefinitely), extend the region
      //a small epsilon past the (0..1) pipe range
      if ( this.friction.get() ) {
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
      return new Vector2( this.getTweakedVx( x, y ), this.getVelocity( x, y ).getY() );
    },

    //Find the y-value for the specified x-value and fraction (0=bottom, 1=top) of the pipe
    fractionToLocation: function( x, fraction ) {
      var position = this.getCrossSection( x );
      return new Function.LinearFunction( 0, 1, position.getBottom().getY(), position.getTop().getY() ).evaluate( fraction );
    },


    //Get the point at the specified location, where x is in meters and fractionToTop is in (0,1)
    getPoint: function( x, fractionToTop ) {
      return new Vector2( x, this.fractionToLocation( x, fractionToTop ) );
    },

    //Compute the circular cross sectional area (in meters squared) at the specified location
    getCrossSectionalArea: function( x ) {
      var radius = Math.abs( this.getPoint( x, 0.5 ).getY() - this.getPoint( x, 1 ).getY() );
      return Math.PI * radius * radius;
    }


  } );
} );

