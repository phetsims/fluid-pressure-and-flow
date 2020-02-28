// Copyright 2013-2020, University of Colorado Boulder

/**
 * Parent type for models of pools with faucets. Handles liquid level changes
 * based on the states of the input and output faucets.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Property from '../../../../axon/js/Property.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class PoolWithFaucetsModel {

  /**
   * @param {UnderPressureModel} underPressureModel
   * @param {FaucetModel} inputFaucet that fills the pool
   * @param {FaucetModel} outputFaucet that drains the pool
   * @param {number} maxVolume of the pool in liters
   */
  constructor( underPressureModel, inputFaucet, outputFaucet, maxVolume ) {

    // Note: Each scene could have a different volume. If we use currentVolumeProperty from the underPressureModel
    // instead of this property then volume changes in one scene will reflect in the other.
    //L @public
    this.volumeProperty = new Property( 1.5 );

    // Enable faucets and dropper based on amount of solution in the beaker.
    this.volumeProperty.link( volume => {
      inputFaucet.enabledProperty.value = ( volume < maxVolume );
      outputFaucet.enabledProperty.value = ( volume > 0 );
      underPressureModel.currentVolumeProperty.value = volume;
    } );
  }

  /**
   * Restores initial conditions.
   * @public
   */
  reset() {
    this.volumeProperty.reset();
  }

  /**
   * @public
   * Step the pool model forward in time by dt seconds.
   * @param {number} dt -- time in seconds
   */
  step( dt ) {
    this.addLiquid( dt );
    this.removeLiquid( dt );
  }

  /**
   * @public
   * Add liquid to the pool based on the input faucet's flow rate and dt.
   * @param {number} dt -- time in seconds
   */
  addLiquid( dt ) {
    const deltaVolume = this.inputFaucet.flowRateProperty.value * dt;
    if ( deltaVolume > 0 ) {
      this.volumeProperty.value = Math.min( this.maxVolume, this.volumeProperty.value + deltaVolume );
    }
  }

  /**
   * @public
   * Remove liquid from the pool based on the output faucet's flow rate and dt.
   * @param {number} dt -- time in seconds
   */
  removeLiquid( dt ) {
    const deltaVolume = this.outputFaucet.flowRateProperty.value * dt;
    if ( deltaVolume > 0 ) {
      this.volumeProperty.value = Math.max( 0, this.volumeProperty.value - deltaVolume );
    }
  }
}

fluidPressureAndFlow.register( 'PoolWithFaucetsModel', PoolWithFaucetsModel );
export default PoolWithFaucetsModel;