// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view for square pool.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  "use strict";
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( 'SCENERY/nodes/Node' );
  var SquarePoolBack = require( "square-pool/view/SquarePoolBack" );
  var FaucetFluidNode = require( "UNDER_PRESSURE/common/view/FaucetFluidNode" );
  var SquarePoolWaterNode = require( "square-pool/view/SquarePoolWaterNode" );
  var SquarePoolGrid = require( "square-pool/view/SquarePoolGrid" );


  function SquarePoolView( model, mvt ) {
    Node.call( this, { renderer: "svg" } );

    //pool
    this.addChild( new SquarePoolBack( model, mvt ) );

    //fluids
    this.addChild( new FaucetFluidNode( model.inputFaucet, model, mvt, mvt.modelToViewY( model.poolDimensions.y2 - model.inputFaucet.location.y ) ) );
    this.addChild( new FaucetFluidNode( model.outputFaucet, model, mvt, 1000 ) );

    //water
    this.addChild( new SquarePoolWaterNode( model, mvt ) );

    //grid
    this.addChild( new SquarePoolGrid( model, mvt ) );
  }

  return inherit( Node, SquarePoolView );
} );