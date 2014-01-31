// Copyright 2002-2013, University of Colorado Boulder

/**
 * Parent type for models of pools with faucets. Handles liquid level changes
 * based on the states of the input and output faucets.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );

  function PoolWithFaucetsModel( globalModel ) {
    var self = this;

    PropertySet.call( this, {
      volume: 1.5
    } );

    // Enable faucets and dropper based on amount of solution in the beaker.
    this.volumeProperty.link( function( volume ) {
      self.inputFaucet.enabled = ( volume < self.MAX_VOLUME );
      self.outputFaucet.enabled = ( volume > 0 );
      globalModel.currentVolume = volume;
    } );
  }

  return inherit( PropertySet, PoolWithFaucetsModel, {
    step: function( dt ) {
      this.addLiquid( dt );
      this.removeLiquid( dt );
    },
    addLiquid: function( dt ) {
      var deltaVolume = this.inputFaucet.flowRate * dt;
      if ( deltaVolume > 0 ) {
        this.volume = Math.min( this.MAX_VOLUME, this.volume + deltaVolume );
      }
    },
    removeLiquid: function( dt ) {
      var deltaVolume = this.outputFaucet.flowRate * dt;
      if ( deltaVolume > 0 ) {
        this.volume = Math.max( 0, this.volume - deltaVolume );
      }
    }
  } );
} );