// Copyright 2014-2019, University of Colorado Boulder

/**
 * Change fluid color when fluid density changes. For a given density the fluid color is got by linearly interpolating
 * the RGB values between min (gas) and max (honey).
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const Property = require( 'AXON/Property' );

  // Color constants, from the Java version
  const GAS_COLOR = new Color( 149, 142, 139 );
  const WATER_COLOR = new Color( 20, 244, 255 );
  const HONEY_COLOR = new Color( 255, 191, 0 );

  class FluidColorModel {

    /**
     * @param {Property.<number>} fluidDensityProperty
     * @param {Range} fluidDensityRange
     */
    constructor( fluidDensityProperty, fluidDensityRange ) {

      this.fluidDensityProperty = fluidDensityProperty;

      this.getRedLow = new LinearFunction( fluidDensityRange.min, Constants.WATER_DENSITY, GAS_COLOR.red,
        WATER_COLOR.red ); // @private
      this.getGreenLow = new LinearFunction( fluidDensityRange.min, Constants.WATER_DENSITY, GAS_COLOR.green,
        WATER_COLOR.green ); // @private
      this.getBlueLow = new LinearFunction( fluidDensityRange.min, Constants.WATER_DENSITY, GAS_COLOR.blue,
        WATER_COLOR.blue ); // @private

      this.getRedHigh = new LinearFunction( Constants.WATER_DENSITY, fluidDensityRange.max, WATER_COLOR.red,
        HONEY_COLOR.red ); // @private
      this.getGreenHigh = new LinearFunction( Constants.WATER_DENSITY, fluidDensityRange.max,
        WATER_COLOR.green, HONEY_COLOR.green ); // @private
      this.getBlueHigh = new LinearFunction( Constants.WATER_DENSITY, fluidDensityRange.max, WATER_COLOR.blue,
        HONEY_COLOR.blue ); // @private

      // @public (read-only)
      this.colorProperty = new Property( WATER_COLOR );

      // @private indicates whether fluid density changed since the previous step
      this.densityChanged = false; //TODO rename fluidDensityChanged

      fluidDensityProperty.link( () => {
        this.densityChanged = true;
      } );
    }

    /**
     * @public
     */
    reset() {
      this.colorProperty.reset();
    }

    step() {
      if ( this.densityChanged ) {
        const density = this.fluidDensityProperty.get();
        if ( density < Constants.WATER_DENSITY ) {
          this.colorProperty.value = new Color( this.getRedLow( density ), this.getGreenLow( density ), this.getBlueLow( density ) );
        }
        else {
          this.colorProperty.value = new Color( this.getRedHigh( density ), this.getGreenHigh( density ), this.getBlueHigh( density ) );
        }
        this.densityChanged = false;
      }
    }
  }

  return fluidPressureAndFlow.register( 'FluidColorModel', FluidColorModel );
} );
