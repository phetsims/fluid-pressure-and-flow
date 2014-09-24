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
  var TrapezoidPoolBack = require( 'trapezoid-pool/view/TrapezoidPoolBack' );
  var FaucetFluidNode = require( 'UNDER_PRESSURE/common/view/FaucetFluidNode' );
  var TrapezoidPoolWaterNode = require( 'trapezoid-pool/view/TrapezoidPoolWaterNode' );
  var TrapezoidPoolGrid = require( 'trapezoid-pool/view/TrapezoidPoolGrid' );

  /**
   * @param {TrapezoidPoolModel} trapezoidPoolModel
   * @param {ModelViewTransform2 } modelViewTransform to convert between model and view co-ordinates
   * @constructor
   */
  function TrapezoidPoolView( trapezoidPoolModel, modelViewTransform ) {

    Node.call( this, { renderer: 'svg' } );
    //pool
    this.addChild( new TrapezoidPoolBack( trapezoidPoolModel, modelViewTransform ) );

    // add fluids
    this.addChild( new FaucetFluidNode( trapezoidPoolModel.inputFaucet, trapezoidPoolModel, modelViewTransform, modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.bottomChamber.y2 - trapezoidPoolModel.inputFaucet.location.y ) ) );
    this.addChild( new FaucetFluidNode( trapezoidPoolModel.outputFaucet, trapezoidPoolModel, modelViewTransform, 1000 ) );

    // add water
    this.addChild( new TrapezoidPoolWaterNode( trapezoidPoolModel, modelViewTransform ) );

    // add grid
    this.addChild( new TrapezoidPoolGrid( trapezoidPoolModel, modelViewTransform ) );
  }

  return inherit( Node, TrapezoidPoolView );
} );