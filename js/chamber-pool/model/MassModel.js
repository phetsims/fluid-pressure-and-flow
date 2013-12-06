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
  var UnderPressureModel = require( 'common/model/UnderPressureModel' );
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

    self.isDraggingProperty.link( function( isDragging ) {
        if ( !isDragging ) { //dragging just have stopped
          if ( self.isInTargetDroppedArea() ) {

          }

          else if ( self.cannotFall() ) {
            self.reset();
          }
          else {
            self.isDropping = true;
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
    },
    reset: function() {
      this.positionProperty.reset();
      this.position = new Vector2( this.position.x, this.position.y );
      this.velocityProperty.reset();
    },
    isInTargetDroppedArea: function() {
      return false;
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