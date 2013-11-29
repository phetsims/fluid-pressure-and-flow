// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet node for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.), Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );

  /**
   * @param {Faucet} faucet
   * @param {Vector2} location
   * @param {} width
   * @constructor
   */
  function UPFaucetNode( model, faucet, width ) {
    FaucetNode.call( this, faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, { horizontalPipeLength: width, scale:0.42,x:faucet.location.x*model.pxToMetersRatio,y:faucet.location.y*model.pxToMetersRatio} );
  }

  return inherit( FaucetNode, UPFaucetNode );
} );