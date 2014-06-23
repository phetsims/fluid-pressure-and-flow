// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the water tower, water, tower legs, hose
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var inherit = require( 'PHET_CORE/inherit' );

  function WaterTower() {

    //Layout parameters for the water tower
    this.MAX_Y = 18;
    this.INITIAL_Y = 15;
    this.TANK_RADIUS = 50;
    this.PANEL_OFFSET = this.TANK_RADIUS + 0.25;
    this.TANK_HEIGHT = 100;
    this.LEG_EXTENSION = 3;

    //Assume the tank is a cylinder ond compute the max volume
    this.TANK_VOLUME = Math.PI * this.TANK_RADIUS * this.TANK_RADIUS * this.TANK_HEIGHT;

    //Location of the bottom center of the water tower
    this.tankBottomCenter = new Vector2( 0, this.INITIAL_Y );

    //Start the tank partly full so that the "fill" button and faucet slider are initially enabled
    this.fluidVolume = this.TANK_VOLUME * 0.8;

    //The movable panel that can cover the hole.
    this.panelOffset = new Vector2( this.PANEL_OFFSET, 0 );

    //Size of the hole in meters
    this.HOLE_SIZE = 1;

    PropertySet.call( this, {
      isFull: false, //Flag indicating whether the tank is full, for purposes of disabling controls that can be used to fill the tank
      isHoleOpen: false
    } );
  }

  return inherit( PropertySet, WaterTower, {

    getTankShape: function() {
      return new Shape()
        .moveTo( this.tankBottomCenter.x - this.TANK_RADIUS, this.tankBottomCenter.y )
        .lineTo( this.tankBottomCenter.x + this.TANK_RADIUS, this.tankBottomCenter.y )
        .lineTo( this.tankBottomCenter.x + this.TANK_RADIUS, this.tankBottomCenter.y + this.TANK_HEIGHT )
        .lineTo( this.tankBottomCenter.x - this.TANK_RADIUS, this.tankBottomCenter.y + this.TANK_HEIGHT )
        .lineTo( this.tankBottomCenter.x - this.TANK_RADIUS, this.tankBottomCenter.y );
    },

    getSupportShape: function() {
      this.bottomCenter = this.tankBottomCenter;
      this.leftLegTop = new Vector2( this.bottomCenter.x - this.TANK_RADIUS / 2, this.bottomCenter.y );
      this.leftLegBottom = new Vector2( this.bottomCenter.x - this.TANK_RADIUS / 2 - this.LEG_EXTENSION, 0 );
      this.rightLegTop = new Vector2( this.bottomCenter.x + this.TANK_RADIUS / 2, this.bottomCenter.y );
      this.rightLegBottom = new Vector2( this.bottomCenter.x + this.TANK_RADIUS / 2 + this.LEG_EXTENSION, 0 );
    },

    getTankTopCenter: function() {
      return new Vector2( this.tankBottomCenter.x, this.tankBottomCenter.y + this.TANK_HEIGHT );
    },

    waterLevel: function() {
      return this.fluidVolume / (Math.PI * this.TANK_RADIUS * this.TANK_RADIUS);
    },

    getWaterShape: function() {
      return new Shape()
        .moveTo( this.tankBottomCenter.x - this.TANK_RADIUS, this.tankBottomCenter.y )
        .lineTo( this.tankBottomCenter.x + this.TANK_RADIUS, this.tankBottomCenter.y )
        .lineTo( this.tankBottomCenter.x + this.TANK_RADIUS, this.tankBottomCenter.y + this.waterLevel() )
        .lineTo( this.tankBottomCenter.x - this.TANK_RADIUS, this.tankBottomCenter.y + this.waterLevel() )
        .lineTo( this.tankBottomCenter.x - this.TANK_RADIUS, this.tankBottomCenter.y );
    },

    getHoleLocation: function() {
      return new Vector2( this.tankBottomCenter.x + this.TANK_RADIUS + 0.55 / 2, this.tankBottomCenter.y - 0.15 );
    },

    setFluidVolume: function( volume ) {
      this.fluidVolume = volume;
    },

    fill: function() {
      this.fluidVolume = this.TANK_VOLUME;
    }
  } );
} );