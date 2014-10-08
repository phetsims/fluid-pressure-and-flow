// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for a "mass" object containing its mass, position, width, height, velocity etc.
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

  /**
   * @param {ChamberPoolModel} chamberPoolModel of the simulation
   * @param {Number} mass of object in grams
   * @param {Number} x coordinate of the mass in meters
   * @param {Number} y coordinate of the mass in meters
   * @param {Number} width of the mass in meters
   * @param {Number} height of the mass in meters
   * @constructor
   */

  function MassModel( chamberPoolModel, mass, x, y, width, height ) {

    var massModel = this;

    // all coordinates in meters
    this.width = width;
    this.height = height;
    this.chamberPoolModel = chamberPoolModel;
    this.mass = mass;

    PropertySet.call( this, {
      position: new Vector2( x, y ),
      isDragging: false,
      isDropping: false,
      velocity: 0
    } );

    massModel.isDraggingProperty.link( function( isDragging, oldValue ) {
        if ( !isDragging && oldValue ) { //dragging just have stopped
          if ( massModel.isInTargetDroppedArea() ) {
            chamberPoolModel.stack.push( massModel );
          }
          else if ( massModel.cannotFall() ) {
            massModel.reset();
          }
          else {
            massModel.isDropping = true;
          }
        }
        else {
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
      // move the masses only when the velocity is greater than than this.
      // See https://github.com/phetsims/under-pressure/issues/60
      var epsilonVelocity = 0.01;

      if ( this.isDropping && !this.isDragging ) {
        acceleration = this.chamberPoolModel.underPressureModel.gravity;
        this.velocity = this.velocity + acceleration * dt;
        if ( this.velocity > epsilonVelocity ) {
          this.position.y += this.velocity * dt;
          if ( this.position.y > this.chamberPoolModel.MAX_Y - this.height / 2 ) {
            this.position.y = this.chamberPoolModel.MAX_Y - this.height / 2;
            this.isDropping = false;
            this.velocityProperty.reset();
          }
          this.positionProperty._notifyObservers();
        }
      }
      else if ( this.chamberPoolModel.stack.contains( this ) ) {
        //use newton’s laws to equalize pressure/force at interface
        var m = this.chamberPoolModel.stackMass;
        var rho = this.chamberPoolModel.underPressureModel.fluidDensity;
        var g = this.chamberPoolModel.underPressureModel.gravity;
        //difference between water levels in left and right opening
        var h = this.chamberPoolModel.underPressureModel.leftDisplacement +
                this.chamberPoolModel.underPressureModel.leftDisplacement / this.chamberPoolModel.LENGTH_RATIO;
        var gravityForce = +m * g;
        var pressureForce = -rho * h * g;
        var force = gravityForce + pressureForce;
        acceleration = force / m;
        var frictionCoefficient = 0.98;
        this.velocity = (this.velocity + acceleration * dt) * frictionCoefficient;
        if ( this.velocity > epsilonVelocity ) {
          this.position.y += this.velocity * dt;
          this.positionProperty._notifyObservers();
        }
      }

    },

    // checks if the mass intersects with the the target drop area.
    isInTargetDroppedArea: function() {
      var waterLine = this.chamberPoolModel.poolDimensions.leftOpening.y2 - this.chamberPoolModel.LEFT_WATER_HEIGHT +
                      this.chamberPoolModel.underPressureModel.leftDisplacement;
      var bottomLine = waterLine - this.chamberPoolModel.stack.reduce( 0, function( a, b ) {return a + b.height;} );
      return new Bounds( this.position.x - this.width / 2, this.position.y - this.height / 2,
          this.position.x + this.width, this.position.y + this.height ).intersectsBounds( new Bounds(
          this.chamberPoolModel.poolDimensions.leftOpening.x1, bottomLine - this.height / 2,
          this.chamberPoolModel.poolDimensions.leftOpening.x2, bottomLine ) );
    },

    cannotFall: function() {
      //mass dropped under earth or over opening
      return this.position.y > this.chamberPoolModel.MAX_Y + this.height / 2 || this.isMassOverOpening();
    },

    // checks if the mass is over the left or the right opening
    isMassOverOpening: function() {
      var isOverOpening = false;
      var leftCorner = this.position.x,
        rightCorner = this.position.x + this.width / 2;
      if ( this.chamberPoolModel.poolDimensions.leftOpening.x1 < leftCorner &&
           leftCorner < this.chamberPoolModel.poolDimensions.leftOpening.x2 ) {
        isOverOpening = true;
      }
      else if ( this.chamberPoolModel.poolDimensions.leftOpening.x1 < rightCorner &&
                rightCorner < this.chamberPoolModel.poolDimensions.leftOpening.x2 ) {
        isOverOpening = true;
      }
      else if ( this.chamberPoolModel.poolDimensions.rightOpening.x1 < leftCorner &&
                leftCorner < this.chamberPoolModel.poolDimensions.rightOpening.x2 ) {
        isOverOpening = true;
      }
      else if ( this.chamberPoolModel.poolDimensions.rightOpening.x1 < rightCorner &&
                rightCorner < this.chamberPoolModel.poolDimensions.rightOpening.x2 ) {
        isOverOpening = true;
      }
      return isOverOpening;
    }
  } );
} )
;