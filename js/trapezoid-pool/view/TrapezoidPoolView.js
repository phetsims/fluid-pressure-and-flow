// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for trapezoid pool.
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var TrapezoidPoolBack = require( 'UNDER_PRESSURE/trapezoid-pool/view/TrapezoidPoolBack' );
  var FaucetFluidNode = require( 'UNDER_PRESSURE/common/view/FaucetFluidNode' );
  var TrapezoidPoolWaterNode = require( 'UNDER_PRESSURE/trapezoid-pool/view/TrapezoidPoolWaterNode' );
  var TrapezoidPoolGrid = require( 'UNDER_PRESSURE/trapezoid-pool/view/TrapezoidPoolGrid' );

  /**
   * @param {TrapezoidPoolModel} trapezoidPoolModel
   * @param {ModelViewTransform2 } modelViewTransform to convert between model and view co-ordinates
   * @constructor
   */
  function TrapezoidPoolView( trapezoidPoolModel, modelViewTransform ) {

    Node.call( this, { renderer: 'svg' } );

    // add pool back
    this.addChild( new TrapezoidPoolBack( trapezoidPoolModel, modelViewTransform ) );

    // add fluids
    this.addChild( new FaucetFluidNode( trapezoidPoolModel.inputFaucet, trapezoidPoolModel, modelViewTransform, modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.bottomChamber.y2 - trapezoidPoolModel.inputFaucet.location.y ) ) );
    this.addChild( new FaucetFluidNode( trapezoidPoolModel.outputFaucet, trapezoidPoolModel, modelViewTransform, 1000 ) );

    // add water
    this.addChild( new TrapezoidPoolWaterNode( trapezoidPoolModel, modelViewTransform ) );

    // pool dimensions in view values
    var poolLeftX = trapezoidPoolModel.poolDimensions.leftChamber.centerTop - trapezoidPoolModel.poolDimensions.leftChamber.widthBottom / 2;
    var poolTopY = trapezoidPoolModel.poolDimensions.leftChamber.y;
    var poolRightX = trapezoidPoolModel.poolDimensions.rightChamber.centerTop + trapezoidPoolModel.poolDimensions.rightChamber.widthTop / 2;
    var poolBottomY = trapezoidPoolModel.poolDimensions.leftChamber.y + trapezoidPoolModel.poolDimensions.leftChamber.height + 0.3;
    var poolHeight = trapezoidPoolModel.poolDimensions.leftChamber.height;
    var labelXPosition = modelViewTransform.modelToViewX( ( trapezoidPoolModel.poolDimensions.leftChamber.centerTop + trapezoidPoolModel.poolDimensions.leftChamber.widthTop / 2 + trapezoidPoolModel.poolDimensions.rightChamber.centerTop - trapezoidPoolModel.poolDimensions.rightChamber.widthTop / 2 ) / 2 );
    var slantMultiplier = 0.45; // Empirically determined to make label line up in space between the pools

    // add grid
    this.addChild( new TrapezoidPoolGrid( trapezoidPoolModel.underPressureModel, modelViewTransform, poolLeftX, poolTopY, poolRightX, poolBottomY, poolHeight, labelXPosition, slantMultiplier ) );
  }

  return inherit( Node, TrapezoidPoolView );
} );