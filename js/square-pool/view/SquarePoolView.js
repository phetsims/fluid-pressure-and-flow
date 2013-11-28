// Copyright 2002-2013, University of Colorado Boulder

/**
 * main ScreenView container.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  "use strict";
  var inherit = require( "PHET_CORE/inherit" );
  var CommonNode = require( "common/view/CommonNode" );
  var ScreenView = require( "JOIST/ScreenView" );
  var SquarePoolBack = require( "square-pool/view/SquarePoolBack" );
  var FaucetFluidNode = require( "common/view/FaucetFluidNode" );
  var SquarePoolWaterNode = require("square-pool/view/SquarePoolWaterNode");


  function SquarePoolView( model ) {
    ScreenView.call( this, { renderer: "svg" } );

    console.log(this)

    //sky, earth and controls
    this.addChild( new CommonNode( model ) );

    //pool
    this.addChild( new SquarePoolBack( model ) );

    //fluids
    this.addChild( new FaucetFluidNode( model.inputFaucet, model, model.poolDimensions.y2 - model.inputFaucet.location.y ) );
    this.addChild( new FaucetFluidNode( model.outputFaucet, model, 1000 ) );

    //water
    this.addChild(new SquarePoolWaterNode(model));

  }

  return inherit( ScreenView, SquarePoolView );
} );