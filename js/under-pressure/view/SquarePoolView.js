// Copyright 2013-2019, University of Colorado Boulder

/**
 * View for square pool.
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
  const SquarePoolBack = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/SquarePoolBack' );
  const SquarePoolGrid = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/SquarePoolGrid' );
  const SquarePoolWaterNode = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/SquarePoolWaterNode' );

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
                                              squarePoolModel.inputFaucet.location.y ) ) );
      this.addChild( new FaucetFluidNode( squarePoolModel.outputFaucet, squarePoolModel, modelViewTransform, 1000 ) );

      // add water
      this.addChild( new SquarePoolWaterNode( squarePoolModel, modelViewTransform ) );

      // add grid
      this.addChild( new SquarePoolGrid( squarePoolModel, modelViewTransform ) );
    }
  }

  return fluidPressureAndFlow.register( 'SquarePoolView', SquarePoolView );
} );