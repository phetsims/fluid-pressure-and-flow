// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet node for this sim.
 * @author Chris Malley (PixelZoom, Inc.), Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );

  /**
   * @param {Faucet} faucet model
   * @param {Number} width of horizontal part of pipe
   * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
   * @constructor
   */
  function UPFaucetNode( faucet, width, modelViewTransform ) {

    FaucetNode.call( this, faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty,
      {
        horizontalPipeLength: width,
        scale: faucet.scale,
        x: modelViewTransform.modelToViewX( faucet.location.x ),
        y: modelViewTransform.modelToViewY( faucet.location.y ),
        tapToDispenseInterval: 250
      } );
  }

  return inherit( FaucetNode, UPFaucetNode );
} );