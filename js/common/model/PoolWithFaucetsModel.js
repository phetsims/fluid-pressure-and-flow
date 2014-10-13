// Copyright 2002-2013, University of Colorado Boulder

/**
 * Parent type for models of pools with faucets. Handles liquid level changes
 * based on the states of the input and output faucets.
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {UnderPressureModel} underPressureModel of the sim.
   * @constructor
   */
  function PoolWithFaucetsModel( underPressureModel ) {

    var poolWithFaucetModel = this;
    PropertySet.call( this, {
      volume: 1.5
    } );

    // Enable faucets and dropper based on amount of solution in the beaker.
    this.volumeProperty.link( function( volume ) {
      poolWithFaucetModel.inputFaucet.enabled = ( volume < poolWithFaucetModel.MAX_VOLUME );
      poolWithFaucetModel.outputFaucet.enabled = ( volume > 0 );
      underPressureModel.currentVolume = volume;
    } );
  }

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
        this.volume = Math.min( this.MAX_VOLUME, this.volume + deltaVolume );
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