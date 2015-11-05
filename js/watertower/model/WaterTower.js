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

    options = _.extend( {
      initialFluidLevel: 0.8,
      tankPosition: new Vector2( 0, 0 ) // tank frame bottom left, position in meters
    }, options );

    this.TANK_RADIUS = 5; // meters
    this.TANK_HEIGHT = 10; // meters

    // Offset of the inlet (hole which receives water from the faucet) as measured from tank left
    this.INLET_X_OFFSET = 1.4;

    // Assume the tank is a cylinder and compute the max volume
    this.TANK_VOLUME = Math.PI * this.TANK_RADIUS * this.TANK_RADIUS * this.TANK_HEIGHT;

    PropertySet.call( this, {
      isHoleOpen: false,
      fluidVolume: this.TANK_VOLUME * options.initialFluidLevel,
      tankPosition: options.tankPosition //water tank bottom left
    } );

    // Size of the hole in meters
    this.HOLE_SIZE = 1;
    this.addDerivedProperty( 'fluidLevel', [ 'fluidVolume' ], function( fluidVolume ) {
      return fluidVolume / (Math.PI * waterTower.TANK_RADIUS * waterTower.TANK_RADIUS);
    } );

    this.addDerivedProperty( 'isFull', [ 'fluidVolume' ], function( fluidVolume ) {
      return fluidVolume >= waterTower.TANK_VOLUME;
    } );
  }

  return inherit( PropertySet, WaterTower, {
    fill: function() {
      this.fluidVolume = this.TANK_VOLUME;
    }
  } );
} );