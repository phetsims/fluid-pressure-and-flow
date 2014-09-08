// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view for trapezoid pool.
 * * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var TrapezoidPoolBack = require( 'trapezoid-pool/view/TrapezoidPoolBack' );
  var FaucetFluidNode = require( 'UNDER_PRESSURE/common/view/FaucetFluidNode' );
  var TrapezoidPoolWaterNode = require( 'trapezoid-pool/view/TrapezoidPoolWaterNode' );
  var TrapezoidPoolGrid = require( 'trapezoid-pool/view/TrapezoidPoolGrid' );

  function TrapezoidPoolView( model, modelViewTransform ) {
    Node.call( this, { renderer: 'svg' } );

    //pool
    this.addChild( new TrapezoidPoolBack( model, modelViewTransform ) );

    //fluids
    this.addChild( new FaucetFluidNode( model.inputFaucet, model, modelViewTransform, modelViewTransform.modelToViewY( model.poolDimensions.bottomChamber.y2 - model.inputFaucet.location.y ) ) );
    this.addChild( new FaucetFluidNode( model.outputFaucet, model, modelViewTransform, 1000 ) );

    //water
    this.addChild( new TrapezoidPoolWaterNode( model, modelViewTransform ) );

    //grid
    this.addChild( new TrapezoidPoolGrid( model, modelViewTransform ) );
  }

  return inherit( Node, TrapezoidPoolView );
} );