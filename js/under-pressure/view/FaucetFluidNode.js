// Copyright 2013-2021, University of Colorado Boulder

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's output pipe.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import { Rectangle } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class FaucetFluidNode extends Rectangle {

  /**
   * @param {FaucetModel} faucet model of the sim.
   * @param {PoolWithFaucetsModel} model square-pool/mystery-pool/trapezoid model
   * @param {ModelViewTransform2} modelViewTransform that is used to transform between model and view coordinate frames
   * @param {number} maxHeight
   */
  constructor( faucet, model, modelViewTransform, maxHeight ) {

    super( 0, 0, 0, 0, { lineWidth: 1 } );

    this.currentHeight = 0;
    this.viewWidth = 0;

    const redrawRect = () => {
      if ( faucet.flowRateProperty.value === 0 ) {
        this.setRect( 0, 0, 0, 0 );
      }
      else {
        this.setRect( modelViewTransform.modelToViewX( faucet.position.x ) - ( this.viewWidth / 2 ),
          modelViewTransform.modelToViewY( faucet.position.y ),
          this.viewWidth,
          this.currentHeight );
      }
    };

    model.underPressureModel.fluidColorModel.colorProperty.linkAttribute( this, 'fill' );

    faucet.flowRateProperty.link( flowRate => {
      this.viewWidth = modelViewTransform.modelToViewX( faucet.spoutWidth ) * flowRate / faucet.maxFlowRate;
      redrawRect();
    } );

    model.volumeProperty.link( volume => {
      this.currentHeight = maxHeight - Math.abs( modelViewTransform.modelToViewDeltaY( volume * model.maxHeight /
                                                                                       model.maxVolume ) );
      redrawRect();
    } );
  }
}

fluidPressureAndFlow.register( 'FaucetFluidNode', FaucetFluidNode );
export default FaucetFluidNode;