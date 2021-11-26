// Copyright 2013-2021, University of Colorado Boulder

/**
 * View for square pool.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import { Node } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FaucetFluidNode from './FaucetFluidNode.js';
import SquarePoolBack from './SquarePoolBack.js';
import SquarePoolGrid from './SquarePoolGrid.js';
import SquarePoolWaterNode from './SquarePoolWaterNode.js';

class SquarePoolView extends Node {

  /**
   * @param {SquarePoolModel} squarePoolModel
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   */
  constructor( squarePoolModel, modelViewTransform ) {

    super();

    // pool background with grass, cement, faucets
    this.addChild( new SquarePoolBack( squarePoolModel, modelViewTransform ) );

    // fluids from faucets
    this.addChild( new FaucetFluidNode( squarePoolModel.inputFaucet, squarePoolModel, modelViewTransform,
      modelViewTransform.modelToViewDeltaY( squarePoolModel.poolDimensions.y2 -
                                            squarePoolModel.inputFaucet.position.y ) ) );
    this.addChild( new FaucetFluidNode( squarePoolModel.outputFaucet, squarePoolModel, modelViewTransform, 1000 ) );

    // add water
    this.addChild( new SquarePoolWaterNode( squarePoolModel, modelViewTransform ) );

    // add grid
    this.addChild( new SquarePoolGrid( squarePoolModel, modelViewTransform ) );
  }
}

fluidPressureAndFlow.register( 'SquarePoolView', SquarePoolView );
export default SquarePoolView;