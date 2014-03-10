// Copyright 2002-2013, University of Colorado Boulder

/**
 * main Model container for mass object.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds = require( 'DOT/bounds2' );

  /**
   * @param {UnderPressureModel} model of simulation
   * @param {Number} mass of object, gramm
   * @param {Number} x coord, m
   * @param {Number} y coord, m
   * @param {Number} width , m
   * @param {Number} height , m
   * @constructor
   */

  function MassModel( model, mass, x, y, width, height ) {
    var self = this;

    // all coordinates in meters
    self.width = width;
    self.height = height;
    self.model = model;
    self.mass = mass;

    PropertySet.call( this, {
      position: new Vector2( x, y ),
      isDragging: false,
      isDropping: false,
      velocity: 0
    } );

    self.isDraggingProperty.link( function( isDragging, oldValue ) {
        if ( !isDragging && oldValue ) { //dragging just have stopped
          if ( self.isInTargetDroppedArea() ) {
            model.stack.push( self );
          }
          else if ( self.cannotFall() ) {
            self.reset();
          }
          else {
            self.isDropping = true;
          }
        }
        else {
          if ( model.stack.contains( self ) ) {
            model.stack.remove( self );
          }
        }
      }
    );
  }

  return inherit( PropertySet, MassModel, {
    step: function( dt ) {
      var acceleration;
      if ( this.isDropping ) {
        acceleration = this.model.globalModel.gravity;
        this.velocity = this.velocity + acceleration * dt;
        this.position = new Vector2( this.position.x, this.velocity * dt + this.position.y );
        if ( this.position.y > this.model.MAX_Y - this.height / 2 ) {
          this.position = new Vector2( this.position.x, this.model.MAX_Y - this.height / 2 );
          this.isDropping = false;
          this.velocityProperty.reset();
        }
      }
      else if ( this.model.stack.contains( this ) ) {
        //use newton’s laws to equalize pressure/force at interface
        var m = this.model.stackMass;
        var rho = this.model.globalModel.fluidDensity;
        var g = this.model.globalModel.gravity;
        //difference between water levels in left and right opening
        var h = this.model.globalModel.leftDisplacement + this.model.globalModel.leftDisplacement / this.model.LENGTH_RATIO;
        var gravityForce = +m * g;
        var pressureForce = -rho * h * g;
        var force = gravityForce + pressureForce;
        acceleration = force / m;
        var frictionCoefficient = 0.98;
        this.velocity = (this.velocity + acceleration * dt) * frictionCoefficient;
        this.position = new Vector2( this.position.x, this.position.y + this.velocity * dt );
      }
    },
    reset: function() {
      this.positionProperty.reset();
      this.position = new Vector2( this.position.x, this.position.y );
      this.velocityProperty.reset();
    },
    isInTargetDroppedArea: function() {
      var waterLine = this.model.poolDimensions.leftOpening.y2 - this.model.LEFT_WATER_HEIGHT + this.model.globalModel.leftDisplacement;
      var bottomLine = waterLine - this.model.stack.reduce( 0, function( a, b ) {return a + b.height;} );
      return new Bounds( this.position.x - this.width / 2, this.position.y - this.height / 2, this.position.x + this.width, this.position.y + this.height ).intersectsBounds( new Bounds(
        this.model.poolDimensions.leftOpening.x1, bottomLine - this.height / 2, this.model.poolDimensions.leftOpening.x2, bottomLine ) );
    },
    cannotFall: function() {
      //mass dropped under earth or over opening
      return this.position.y > this.model.MAX_Y + this.height / 2 || this.isMassOverOpening();
    },
    isMassOverOpening: function() {
      var isOverOpening = false;
      var leftCorner = this.position.x,
        rightCorner = this.position.x + this.width / 2;
      if ( this.model.poolDimensions.leftOpening.x1 < leftCorner && leftCorner < this.model.poolDimensions.leftOpening.x2 ) {
        isOverOpening = true;
      }
      else if ( this.model.poolDimensions.leftOpening.x1 < rightCorner && rightCorner < this.model.poolDimensions.leftOpening.x2 ) {
        isOverOpening = true;
      }
      else if ( this.model.poolDimensions.rightOpening.x1 < leftCorner && leftCorner < this.model.poolDimensions.rightOpening.x2 ) {
        isOverOpening = true;
      }
      else if ( this.model.poolDimensions.rightOpening.x1 < rightCorner && rightCorner < this.model.poolDimensions.rightOpening.x2 ) {
        isOverOpening = true;
      }
      return isOverOpening;
    }
  } );
} )
;