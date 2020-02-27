// Copyright 2013-2020, University of Colorado Boulder

/**
 * Faucet node for this sim.  Extends the scenery-phet faucet component and simplifies positioning within the
 * Under Pressure scenes.
 *
 * @author Vasily Shakhov (Mlearner)
 */

import FaucetNode from '../../../../scenery-phet/js/FaucetNode.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class UnderPressureFaucetNode extends FaucetNode {

  /**
   * @param {Faucet} faucet model
   * @param {number} width of horizontal part of pipe
   * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
   */
  constructor( faucet, width, modelViewTransform ) {

    super( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, {
      horizontalPipeLength: width,
      scale: faucet.scale,
      x: modelViewTransform.modelToViewX( faucet.position.x ),
      y: modelViewTransform.modelToViewY( faucet.position.y ),
      tapToDispenseInterval: 250,
      shooterOptions: {
        touchAreaXDilation: 37,
        touchAreaYDilation: 60
      }
    } );
  }
}

fluidPressureAndFlow.register( 'UnderPressureFaucetNode', UnderPressureFaucetNode );
export default UnderPressureFaucetNode;