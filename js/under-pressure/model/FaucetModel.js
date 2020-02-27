// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model for the faucet, which is user controlled and allows fluid to flow in from the top left of the screen or down
 * through the bottom of the pool.
 *
 * @author Vasily Shakhov (Mlearner)
 */

import Property from '../../../../axon/js/Property.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class FaucetModel {

  /**
   * @param {Vector2} position center of output pipe
   * @param {number} maxFlowRate L/sec
   * @param {number} scale of Faucet (the top faucet is larger than the bottom faucet)
   */
  constructor( position, maxFlowRate, scale ) {

    this.position = position;
    this.maxFlowRate = maxFlowRate;
    this.scale = scale;
    this.spoutWidth = 1.35 * scale; // empirically determined

    // @public
    this.flowRateProperty = new Property( 0 );

    // @public
    this.enabledProperty = new Property( true );

    // when disabled, turn off the faucet.
    this.enabledProperty.link( enabled => {
      if ( !enabled ) {
        this.flowRateProperty.value = 0;
      }
    } );
  }
}

fluidPressureAndFlow.register( 'FaucetModel', FaucetModel );
export default FaucetModel;