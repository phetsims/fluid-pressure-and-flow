// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model for the faucet, which is user controlled and allows fluid to flow in from the top left of the screen or down
 * through the bottom of the pool.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Property = require( 'AXON/Property' );

  class FaucetModel {

    /**
     * @param {Vector2} location center of output pipe
     * @param {number} maxFlowRate L/sec
     * @param {number} scale of Faucet (the top faucet is larger than the bottom faucet)
     */
    constructor( location, maxFlowRate, scale ) {

      this.location = location;
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

  return fluidPressureAndFlow.register( 'FaucetModel', FaucetModel );
} );
