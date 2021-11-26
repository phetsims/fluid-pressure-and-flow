// Copyright 2013-2021, University of Colorado Boulder

/**
 * View for trapezoid pool.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import { Node } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FaucetFluidNode from './FaucetFluidNode.js';
import TrapezoidPoolBack from './TrapezoidPoolBack.js';
import TrapezoidPoolGrid from './TrapezoidPoolGrid.js';
import TrapezoidPoolWaterNode from './TrapezoidPoolWaterNode.js';

class TrapezoidPoolView extends Node {

  /**
   * @param {TrapezoidPoolModel} trapezoidPoolModel
   * @param {ModelViewTransform2 } modelViewTransform to convert between model and view co-ordinates
   */
  constructor( trapezoidPoolModel, modelViewTransform ) {

    super();

    const poolDimensions = trapezoidPoolModel.poolDimensions;

    // add pool back
    this.addChild( new TrapezoidPoolBack( trapezoidPoolModel, modelViewTransform ) );

    // add fluids
    const inputFaucetFluidMaxHeight = Math.abs( modelViewTransform.modelToViewDeltaY( trapezoidPoolModel.inputFaucet.position.y -
                                                                                      poolDimensions.bottomChamber.y2 ) );
    this.addChild( new FaucetFluidNode(
      trapezoidPoolModel.inputFaucet, trapezoidPoolModel, modelViewTransform, inputFaucetFluidMaxHeight ) );

    const outputFaucetFluidMaxHeight = 1000;
    this.addChild( new FaucetFluidNode( trapezoidPoolModel.outputFaucet, trapezoidPoolModel, modelViewTransform,
      outputFaucetFluidMaxHeight ) );

    // add water
    this.addChild( new TrapezoidPoolWaterNode( trapezoidPoolModel, modelViewTransform ) );

    // pool dimensions in view values
    const poolLeftX = poolDimensions.leftChamber.centerTop - poolDimensions.leftChamber.widthBottom / 2;
    const poolTopY = poolDimensions.leftChamber.y;
    const poolRightX = poolDimensions.rightChamber.centerTop + poolDimensions.rightChamber.widthTop / 2;
    const poolBottomY = poolDimensions.leftChamber.y - poolDimensions.leftChamber.height - 0.3;
    const poolHeight = poolDimensions.leftChamber.height;

    const labelXPosition = modelViewTransform.modelToViewX(
      ( poolDimensions.leftChamber.centerTop + poolDimensions.leftChamber.widthTop / 2 +
        poolDimensions.rightChamber.centerTop - poolDimensions.rightChamber.widthTop / 2 ) / 2 );

    const slantMultiplier = 0.45; // Empirically determined to make labels line up in space between the pools

    // add grid
    this.addChild( new TrapezoidPoolGrid( trapezoidPoolModel.underPressureModel, modelViewTransform, poolLeftX,
      poolTopY, poolRightX, poolBottomY, poolHeight, labelXPosition, slantMultiplier ) );
  }
}

fluidPressureAndFlow.register( 'TrapezoidPoolView', TrapezoidPoolView );
export default TrapezoidPoolView;