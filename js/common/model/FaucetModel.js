// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the faucet, which is user controlled and allows fluid to flow in from the top left of the screen or down through the bottom of the pool.
 * @author Chris Malley (PixelZoom, Inc.), Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Vector2} location center of output pipe
   * @param {Number} maxFlowRate L/sec
   * @param {Number} scale of Faucet
   * @constructor
   */
  function FaucetModel( location, maxFlowRate, scale ) {
    var thisFaucet = this;

    thisFaucet.location = location;
    thisFaucet.maxFlowRate = maxFlowRate;
    thisFaucet.scale = scale;
    thisFaucet.spoutWidth = 1.35 * scale;

    PropertySet.call( this, {
      flowRate: 0,
      enabled: true
    } );

    // when disabled, turn off the faucet.
    thisFaucet.enabledProperty.link( function( enabled ) {
      if ( !enabled ) {
        thisFaucet.flowRate = 0;
      }
    } );
  }

  return inherit( PropertySet, FaucetModel, {
    reset: function() {
      this.flowRateProperty.reset();
      this.enabledProperty.reset();
    }
  } );
} );

