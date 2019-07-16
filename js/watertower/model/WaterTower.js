// Copyright 2014-2017, University of Colorado Boulder

/**
 * Model for the water tower frame and fluid volume
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  class WaterTower {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

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

      this.isHoleOpenProperty = new Property( false ); // TODO: Is this unused?
      this.fluidVolumeProperty = new Property( this.TANK_VOLUME * options.initialFluidLevel );
      this.tankPositionProperty = new Property( options.tankPosition ); //water tank bottom left

      // Size of the hole in meters
      this.HOLE_SIZE = 1;
      this.fluidLevelProperty = new DerivedProperty( [ this.fluidVolumeProperty ], fluidVolume => {
        return fluidVolume / ( Math.PI * this.TANK_RADIUS * this.TANK_RADIUS );
      } );

      // TODO: Is this used?
      this.isFullProperty = new DerivedProperty( [ this.fluidVolumeProperty ], fluidVolume => {
        return fluidVolume >= this.TANK_VOLUME;
      } );
    }

    /**
     * Restore to initial conditions.
     * @public
     */
    reset() {
      this.isHoleOpenProperty.reset();
      this.fluidVolumeProperty.reset();
      this.tankPositionProperty.reset();
    }

    fill() {
      this.fluidVolumeProperty.value = this.TANK_VOLUME;
    }
  }

  return fluidPressureAndFlow.register( 'WaterTower', WaterTower );
} );