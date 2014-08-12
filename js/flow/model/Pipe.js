// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Model for a pipe, which has a fixed number of points.
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Model for a pipe, which has a fixed number of points.
   * @param {Array<PipeControlPoint>} controlPoints that define the shape of the pipe
   * @constructor
   */

  function Pipe( controlPoints ) {
    var pipe = this;
    PropertySet.call( this, {
      scale: 0.5
    } );

    this.controlPoints = controlPoints;

    this.u = new Array( pipe.controlPoints.length );
    this.x = new Array( pipe.controlPoints.length );
    this.y = new Array( pipe.controlPoints.length );
    //when points change, update the spline instance
    this.updateSplines = function() {

      //Arrays are fixed length, so just overwrite values
      for ( var i = 0; i < pipe.controlPoints.length; i++ ) {
        pipe.u[i] = i / pipe.controlPoints.length;
        pipe.x[i] = pipe.controlPoints[i].position.x;
        pipe.y[i] = pipe.controlPoints[i].position.y;
      }
      pipe.xSpline = numeric.spline( pipe.u, pipe.x );
      pipe.ySpline = numeric.spline( pipe.u, pipe.y );

      //Mark search points as dirty
      pipe.xSearchPoints = null;
      pipe.ySearchPoints = null;

      //Mark derivatives as dirty
      pipe.xSplineDiff = null;
      pipe.ySplineDiff = null;

      pipe.xSplineDiffDiff = null;
      pipe.ySplineDiffDiff = null;
    };

    this.updateSplines();
  }

  return inherit( PropertySet, Pipe, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        this.controlPoints[i].reset();
      }
      //Broadcast message so that PipeNode can update the shape
      this.updateSplines();
      this.trigger( 'reset' );
    },
    getBottomControlPointY: function() {
      var best = Number.POSITIVE_INFINITY;
      var length = this.controlPoints.length;
      for ( var i = 0; i < length; i++ ) {
        if ( this.controlPoints[i].sourcePosition.y < best ) {
          best = this.controlPoints[i].sourcePosition.y;
        }
      }
      return best;
    },

    getTopControlPointY: function() {
      var best = Number.NEGATIVE_INFINITY;
      var length = this.controlPoints.length;
      for ( var i = 0; i < length; i++ ) {
        if ( this.controlPoints[i].sourcePosition.y > best ) {
          best = this.controlPoints[i].sourcePosition.y;
        }
      }
      return best;
    },

    getLeftControlPointX: function() {
      var best = Number.POSITIVE_INFINITY;
      var length = this.controlPoints.length;
      for ( var i = 0; i < length; i++ ) {
        if ( this.controlPoints[i].sourcePosition.x < best ) {
          best = this.controlPoints[i].sourcePosition.x;
        }
      }
      return best;
    },

    getRightControlPointX: function() {
      var best = Number.NEGATIVE_INFINITY;
      var length = this.controlPoints.length;
      for ( var i = 0; i < length; i++ ) {
        if ( this.controlPoints[i].sourcePosition.x > best ) {
          best = this.controlPoints[i].sourcePosition.x;
        }
      }
      return best;
    },

    containsControlPoint: function( controlPoint ) {
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        if ( this.controlPoints[i] === controlPoint ) {
          return true;
        }
      }
      return false;
    }

  } );
} );
