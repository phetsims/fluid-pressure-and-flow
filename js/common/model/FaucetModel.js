// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet model, used for input and output faucets.
 *
 * @author Chris Malley (PixelZoom, Inc.), Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // imports
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Vector2} location center of output pipe
   * @param {Number} maxFlowRate L/sec
   * @constructor
   */
  function Faucet( location, maxFlowRate ) {
    var thisFaucet = this;

    thisFaucet.location = location;
    thisFaucet.maxFlowRate = maxFlowRate;
    thisFaucet.spoutWidth = 0.57;



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

  return inherit( PropertySet, Faucet, {
    reset: function() {
      this.flowRateProperty.reset();
      this.enabledProperty.reset();
    }
  } );

} );

