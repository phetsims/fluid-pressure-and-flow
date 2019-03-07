// Copyright 2013-2018, University of Colorado Boulder

/**
 * Model for a draggable, rectangular "mass" object containing its mass, position, width, height, velocity etc.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2Property = require( 'DOT/Vector2Property' );

  // constants
  var frictionCoefficient = 0.98;

  /**
   * @param {ChamberPoolModel} chamberPoolModel - of the simulation
   * @param {number} mass - of object in grams
   * @param {number} x - coordinate of the mass in meters
   * @param {number} y - coordinate of the mass in meters
   * @param {number} width - of the mass in meters
   * @param {number} height - of the mass in meters
   * @constructor
   */

  function MassModel( chamberPoolModel, mass, x, y, width, height ) {

    var self = this;

    this.chamberPoolModel = chamberPoolModel;
    this.mass = mass;

    // all coordinates in meters
    this.width = width; // @public
    this.height = height; // @public

    // @public
    // The position is the center of the block.
    this.positionProperty = new Vector2Property( new Vector2( x, y ) );

    this.isDraggingProperty = new Property( false );

    this.isFalling = false; // @private
    this.velocity = 0; // @private

    this.isDraggingProperty.link( function( isDragging ) {

        // If the user dropped the mass, then let it fall.
        if ( !isDragging ) {
          if ( self.isInTargetDroppedArea() ) {
            chamberPoolModel.stack.push( self );
          }
          else if ( self.cannotFall() ) {
            self.reset();
          }
          else {
            self.isFalling = true;
          }
        }
        else {
          // The user grabbed the mass.  If it was in the stack, remove it.
          if ( chamberPoolModel.stack.contains( self ) ) {
            chamberPoolModel.stack.remove( self );
          }
        }
      }
    );
  }

  fluidPressureAndFlow.register( 'MassModel', MassModel );

  return inherit( Object, MassModel, {

    // @public
    step: function( dt ) {
      var acceleration;

      // move the masses only when the velocity is greater than than this, see #60 for under-pressure repo
      var epsilonVelocity = 0.05;

      if ( this.chamberPoolModel.stack.contains( this ) ) {

        //use newton’s laws to equalize pressure/force at interface
        var m = this.chamberPoolModel.stackMassProperty.value;
        var rho = this.chamberPoolModel.underPressureModel.fluidDensityProperty.value;
        var g = this.chamberPoolModel.underPressureModel.gravityProperty.value;

        //difference between water levels in left and right opening
        var h = this.chamberPoolModel.leftDisplacementProperty.value +
                this.chamberPoolModel.leftDisplacementProperty.value / this.chamberPoolModel.lengthRatio;
        var gravityForce = -m * g;
        var pressureForce = rho * h * g;
        var force = gravityForce + pressureForce;
        acceleration = force / m;
        this.velocity = (this.velocity + acceleration * dt) * frictionCoefficient;
        if ( Math.abs( this.velocity ) > epsilonVelocity ) {
          this.positionProperty.value.y += this.velocity * dt;
          this.positionProperty.notifyListenersStatic();
        }
      }
      else if ( this.isFalling && !this.isDraggingProperty.value ) {
        acceleration = -this.chamberPoolModel.underPressureModel.gravityProperty.value;
        this.velocity = this.velocity + acceleration * dt;
        if ( Math.abs( this.velocity ) > epsilonVelocity ) {
          this.positionProperty.value.y += this.velocity * dt;

          // If it landed, then stop the block.
          if ( this.positionProperty.value.y < this.chamberPoolModel.maxY + this.height / 2 ) {
            this.positionProperty.value.y = this.chamberPoolModel.maxY + this.height / 2;
            this.isFalling = false;
            this.velocity = 0;
          }
          this.positionProperty.notifyListenersStatic();
        }
      }
    },

    // @public -- checks if the mass intersects with the target drop area.
    isInTargetDroppedArea: function() {
      var waterLine = this.chamberPoolModel.poolDimensions.leftOpening.y2 + this.chamberPoolModel.leftWaterHeight -
                      this.chamberPoolModel.leftDisplacementProperty.value;
      var bottomLine = waterLine + this.chamberPoolModel.stack.reduce( 0, function( a, b ) {return a + b.height;} );
      var massBounds = new Bounds2(
        this.positionProperty.value.x - this.width / 2,
        this.positionProperty.value.y - this.height / 2,
        this.positionProperty.value.x + this.width,
        this.positionProperty.value.y + this.height
      );

      var dropAreaBounds = new Bounds2(
        this.chamberPoolModel.poolDimensions.leftOpening.x1,
        bottomLine,
        this.chamberPoolModel.poolDimensions.leftOpening.x2,
        ( bottomLine + this.height )
      );
      return massBounds.intersectsBounds( dropAreaBounds );
    },

    // @private - If the user drops the mass underground or above a pool opening, it will teleport back to its initial location.
    cannotFall: function() {
      return this.positionProperty.value.y < this.chamberPoolModel.maxY - this.height / 2 || this.isMassOverOpening();
    },

    /**
     * Restore the initial conditions
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
      this.isDraggingProperty.reset();
    },

    // @private - checks if the mass is over the left or the right opening
    isMassOverOpening: function() {
      var left = this.positionProperty.value.x;
      var right = this.positionProperty.value.x + this.width / 2;
      var dimensions = this.chamberPoolModel.poolDimensions;
      return ( dimensions.leftOpening.x1 < left && left < dimensions.leftOpening.x2 ) ||
             ( dimensions.leftOpening.x1 < right && right < dimensions.leftOpening.x2 ) ||
             ( dimensions.rightOpening.x1 < left && left < dimensions.rightOpening.x2 ) ||
             ( dimensions.rightOpening.x1 < right && right < dimensions.rightOpening.x2 );
    }
  } );
} );