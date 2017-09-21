// Copyright 2013-2017, University of Colorado Boulder

/**
 * Faucet node for this sim.  Extends the scenery-phet faucet component and simplifies positioning within the
 * Under Pressure scenes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Faucet} faucet model
   * @param {number} width of horizontal part of pipe
   * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
   * @constructor
   */
  function UnderPressureFaucetNode( faucet, width, modelViewTransform ) {

    FaucetNode.call( this, faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, {
      horizontalPipeLength: width,
      scale: faucet.scale,
      x: modelViewTransform.modelToViewX( faucet.location.x ),
      y: modelViewTransform.modelToViewY( faucet.location.y ),
      tapToDispenseInterval: 250
    } );
  }

  fluidPressureAndFlow.register( 'UnderPressureFaucetNode', UnderPressureFaucetNode );

  return inherit( FaucetNode, UnderPressureFaucetNode );
} );