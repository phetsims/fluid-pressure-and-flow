// Copyright 2014-2021, University of Colorado Boulder

/**
 * Change fluid color when fluid density changes. For a given density the fluid color is got by linearly interpolating
 * the RGB values between min (gas) and max (honey).
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Property from '../../../../axon/js/Property.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import { Color } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import Constants from '../Constants.js';

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

  /**
   * @public
   */
  step() {
    if ( this.densityChanged ) {
      const density = this.fluidDensityProperty.get();
      if ( density < Constants.WATER_DENSITY ) {
        this.colorProperty.value = new Color( this.getRedLow.evaluate( density ), this.getGreenLow.evaluate( density ), this.getBlueLow.evaluate( density ) );
      }
      else {
        this.colorProperty.value = new Color( this.getRedHigh.evaluate( density ), this.getGreenHigh.evaluate( density ), this.getBlueHigh.evaluate( density ) );
      }
      this.densityChanged = false;
    }
  }
}

fluidPressureAndFlow.register( 'FluidColorModel', FluidColorModel );
export default FluidColorModel;