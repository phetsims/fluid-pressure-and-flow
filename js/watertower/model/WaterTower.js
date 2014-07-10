// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the water tower frame and fluid volume
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );

  function WaterTower( options ) {
    var waterTower = this;

    this.options = _.extend( {
      initialFluidLevel: 0.8
    }, options );

    this.TANK_RADIUS = 0.8;
    this.TANK_HEIGHT = 1.6;

    // Offset of the inlet (hole which receives water from the faucet) as measured from tank left
    this.INLET_X_OFFSET = 0.15;

    // Assume the tank is a cylinder and compute the max volume
    this.TANK_VOLUME = Math.PI * this.TANK_RADIUS * this.TANK_RADIUS * this.TANK_HEIGHT;

    PropertySet.call( this, {
      isHoleOpen: false,
      fluidVolume: this.TANK_VOLUME * this.options.initialFluidLevel,
      tankPosition: new Vector2( 1, 1.5 ) //water tank bottom left
    } );

    // Size of the hole in meters
    this.HOLE_SIZE = 0.3;
    this.addDerivedProperty( 'fluidLevel', ['fluidVolume'], function( fluidVolume ) {
      return fluidVolume / (Math.PI * waterTower.TANK_RADIUS * waterTower.TANK_RADIUS);
    } );

    this.addDerivedProperty( 'isFull', ['fluidVolume'], function( fluidVolume ) {
      return fluidVolume >= waterTower.TANK_VOLUME;
    } );
  }

  return inherit( PropertySet, WaterTower, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
    },

    fill: function() {
      this.fluidVolume = this.TANK_VOLUME;
    }
  } );
} );