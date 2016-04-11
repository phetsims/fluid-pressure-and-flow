// Copyright 2013-2015, University of Colorado Boulder

/**
 * Parent type for models of pools with faucets. Handles liquid level changes
 * based on the states of the input and output faucets.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {UnderPressureModel} underPressureModel of the sim.
   * @param {FaucetModel} inputFaucet that fills the pool
   * @param {FaucetModel} outputFaucet that drains the pool
   * @param {Number} maxVolume of the pool in liters
   * @constructor
   */
  function PoolWithFaucetsModel( underPressureModel, inputFaucet, outputFaucet, maxVolume ) {

    PropertySet.call( this, {
      // Note: Each scene could have a different volume. If we use currentVolumeProperty from the underPressureModel
      // instead of this property then volume changes in one scene will reflect in the other.
      volume: 1.5 //L
    } );

    // Enable faucets and dropper based on amount of solution in the beaker.
    this.volumeProperty.link( function( volume ) {
      inputFaucet.enabled = ( volume < maxVolume );
      outputFaucet.enabled = ( volume > 0 );
      underPressureModel.currentVolume = volume;
    } );
  }

  fluidPressureAndFlow.register( 'PoolWithFaucetsModel', PoolWithFaucetsModel );

  return inherit( PropertySet, PoolWithFaucetsModel, {

    /**
     * Step the pool model forward in time by dt seconds.
     * @param {number} dt -- time in seconds
     */
    step: function( dt ) {
      this.addLiquid( dt );
      this.removeLiquid( dt );
    },

    /**
     * Add liquid to the pool based on the input faucet's flow rate and dt.
     * @param {number} dt -- time in seconds
     */
    addLiquid: function( dt ) {
      var deltaVolume = this.inputFaucet.flowRate * dt;
      if ( deltaVolume > 0 ) {
        this.volume = Math.min( this.maxVolume, this.volume + deltaVolume );
      }
    },

    /**
     * Remove liquid from the pool based on the output faucet's flow rate and dt.
     * @param {number} dt -- time in seconds
     */
    removeLiquid: function( dt ) {
      var deltaVolume = this.outputFaucet.flowRate * dt;
      if ( deltaVolume > 0 ) {
        this.volume = Math.max( 0, this.volume - deltaVolume );
      }
    }
  } );
} );