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
  var UnderPressureModel = require( 'UNDER_PRESSURE/common/model/UnderPressureModel' );
  var LinearFunction = require( 'DOT/LinearFunction' );


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
      if ( this.isDropping ) {
        var acceleration = this.model.gravity;
        this.velocity = this.velocity + acceleration * dt;
        this.position = new Vector2( this.position.x, this.velocity * dt + this.position.y );
        if ( this.position.y > this.model.MAX_Y - this.height ) {
          this.position = new Vector2( this.position.x, this.model.MAX_Y - this.height );
          this.isDropping = false;
          this.velocityProperty.reset();
        }
      }
      else if(this.model.stack.contains(this)){
        //use newton’s laws to equalize pressure/force at interface
        var m = this.model.stackMass.get();
        var rho = this.model.fluidDensity;
        var g = this.model.gravity;
        //difference between water levels in left and right opening
        var h = this.model.leftDisplacement + this.model.leftDisplacement / this.model.LENGTH_RATIO;
        var gravityForce = +m * g;
        var pressureForce = -rho * h * g;
        var force = gravityForce + pressureForce;
        var acceleration = force / m;
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
      return true;
    },
    cannotFall: function() {
      //mass dropped under earth or over opening
      return this.position.y > this.model.MAX_Y + this.height || this.isMassOverOpening();
    },
    isMassOverOpening: function() {
      var isOverOpening = false;
      var leftCorner = this.position.x,
        rightCorner = this.position.x + this.width;
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