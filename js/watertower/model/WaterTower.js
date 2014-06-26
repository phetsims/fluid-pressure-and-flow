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
  var inherit = require( 'PHET_CORE/inherit' );

  function WaterTower( options ) {

    this.options = _.extend( {
      initialWaterLevel: 0.8
    }, options );

    PropertySet.call( this, {
      isFull: false, //Flag indicating whether the tank is full, for purposes of disabling controls that can be used to fill the tank
      isHoleOpen: false,
      fluidVolume: 0
    } );
    //Layout parameters for the water tower
    this.MAX_Y = 18;
    this.INITIAL_Y = 15;
    this.TANK_RADIUS = 0.8;
    this.PANEL_OFFSET = this.TANK_RADIUS + 0.25;
    this.TANK_HEIGHT = 1.6;
    this.INLET_X_OFFSET = 0.1;

    //Assume the tank is a cylinder ond compute the max volume
    this.TANK_VOLUME = Math.PI * this.TANK_RADIUS * this.TANK_RADIUS * this.TANK_HEIGHT;

    //Location of the bottom center of the water tower
    this.tankBottomCenter = new Vector2( this.TANK_RADIUS, this.INITIAL_Y );

    //Start the tank partly full so that the "fill" button and faucet slider are initially enabled
    this.fluidVolume = this.TANK_VOLUME * this.options.initialWaterLevel;

    //The movable panel that can cover the hole.
    this.panelOffset = new Vector2( this.PANEL_OFFSET, 0 );

    //Size of the hole in meters
    this.HOLE_SIZE = 0.2;
  }

  return inherit( PropertySet, WaterTower, {

    waterLevel: function() {
      return this.fluidVolume / (Math.PI * this.TANK_RADIUS * this.TANK_RADIUS);
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