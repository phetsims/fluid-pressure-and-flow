// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for a draggable, rectangular "mass" object containing its mass, position, width, height, velocity etc.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds = require( 'DOT/bounds2' );

  // constants
  var frictionCoefficient = 0.98;

  /**
   * @param {ChamberPoolModel} chamberPoolModel of the simulation
   * @param {number} mass of object in grams
   * @param {number} x coordinate of the mass in meters
   * @param {number} y coordinate of the mass in meters
   * @param {number} width of the mass in meters
   * @param {number} height of the mass in meters
   * @constructor
   */

  function MassModel( chamberPoolModel, mass, x, y, width, height ) {

    var massModel = this;

    this.chamberPoolModel = chamberPoolModel;
    this.mass = mass;

    // all coordinates in meters
    this.width = width;
    this.height = height;
   
    PropertySet.call( this, {

      // The position is the center of the block.
      position: new Vector2( x, y ),
      isDragging: false
    } );

    this.isFalling = false;
    this.velocity = 0;

    this.isDraggingProperty.link( function( isDragging, oldValue ) {

        // If the user dropped the mass, then let it fall.
        if ( !isDragging ) {
          if ( massModel.isInTargetDroppedArea() ) {
            chamberPoolModel.stack.push( massModel );
          }
          else if ( massModel.cannotFall() ) {
            massModel.reset();
          }
          else {
            massModel.isFalling = true;
          }
        }
        else {

          // The user grabbed the mass.  If it was in the stack, remove it.
          if ( chamberPoolModel.stack.contains( massModel ) ) {
            chamberPoolModel.stack.remove( massModel );
          }
        }
      }
    );
  }

  return inherit( PropertySet, MassModel, {

    step: function( dt ) {
      var acceleration;

      // move the masses only when the velocity is greater than than this, see #60
      var epsilonVelocity = 0.01;

      if ( this.isFalling && !this.isDragging ) {
        acceleration = this.chamberPoolModel.underPressureModel.gravity;
        this.velocity = this.velocity + acceleration * dt;
        if ( Math.abs( this.velocity ) > epsilonVelocity ) {
          this.position.y += this.velocity * dt;

          // If it landed, then stop the block.
          if ( this.position.y > this.chamberPoolModel.MAX_Y - this.height / 2 ) {
            this.position.y = this.chamberPoolModel.MAX_Y - this.height / 2;
            this.isFalling = false;
            this.velocity = 0;
          }
          this.positionProperty.notifyObserversStatic();
        }
      }
      else if ( this.chamberPoolModel.stack.contains( this ) ) {

        //use newton’s laws to equalize pressure/force at interface
        var m = this.chamberPoolModel.stackMass;
        var rho = this.chamberPoolModel.underPressureModel.fluidDensity;
        var g = this.chamberPoolModel.underPressureModel.gravity;

        //difference between water levels in left and right opening
        var h = this.chamberPoolModel.leftDisplacement +
                this.chamberPoolModel.leftDisplacement / this.chamberPoolModel.LENGTH_RATIO;
        var gravityForce = m * g;
        var pressureForce = -rho * h * g;
        var force = gravityForce + pressureForce;
        acceleration = force / m;
        this.velocity = (this.velocity + acceleration * dt) * frictionCoefficient;
        if ( Math.abs( this.velocity ) > epsilonVelocity ) {
          this.position.y += this.velocity * dt;
          this.positionProperty.notifyObserversStatic();
        }
      }
    },

    // checks if the mass intersects with the the target drop area.
    isInTargetDroppedArea: function() {
      var waterLine = this.chamberPoolModel.poolDimensions.leftOpening.y2 - this.chamberPoolModel.LEFT_WATER_HEIGHT +
                      this.chamberPoolModel.leftDisplacement;
      var bottomLine = waterLine - this.chamberPoolModel.stack.reduce( 0, function( a, b ) {return a + b.height;} );
      return new Bounds( this.position.x - this.width / 2, this.position.y - this.height / 2,
          this.position.x + this.width, this.position.y + this.height ).intersectsBounds( new Bounds(
          this.chamberPoolModel.poolDimensions.leftOpening.x1, bottomLine - this.height / 2,
          this.chamberPoolModel.poolDimensions.leftOpening.x2, bottomLine ) );
    },

    // If the user drops the mass underground or above a pool opening, it will teleport back to its initial location.
    cannotFall: function() {
      return this.position.y > this.chamberPoolModel.MAX_Y + this.height / 2 || this.isMassOverOpening();
    },

    // checks if the mass is over the left or the right opening
    isMassOverOpening: function() {
      var left = this.position.x;
      var right = this.position.x + this.width / 2;
      var dimensions = this.chamberPoolModel.poolDimensions;
      return ( dimensions.leftOpening.x1 < left && left < dimensions.leftOpening.x2 ) ||
             ( dimensions.leftOpening.x1 < right && right < dimensions.leftOpening.x2 ) ||
             ( dimensions.rightOpening.x1 < left && left < dimensions.rightOpening.x2 ) ||
             ( dimensions.rightOpening.x1 < right && right < dimensions.rightOpening.x2 );
    }
  } );
} );