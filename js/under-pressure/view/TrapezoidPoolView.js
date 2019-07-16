// Copyright 2013-2019, University of Colorado Boulder

/**
 * View for trapezoid pool.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const FaucetFluidNode = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/FaucetFluidNode' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Node = require( 'SCENERY/nodes/Node' );
  const TrapezoidPoolBack = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/TrapezoidPoolBack' );
  const TrapezoidPoolGrid = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/TrapezoidPoolGrid' );
  const TrapezoidPoolWaterNode = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/TrapezoidPoolWaterNode' );

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
      const inputFaucetFluidMaxHeight = Math.abs( modelViewTransform.modelToViewDeltaY( trapezoidPoolModel.inputFaucet.location.y -
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

  return fluidPressureAndFlow.register( 'TrapezoidPoolView', TrapezoidPoolView );
} );