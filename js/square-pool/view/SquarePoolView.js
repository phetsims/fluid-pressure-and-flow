// Copyright 2002-2013, University of Colorado Boulder

/**
 * main ScreenView container for square pool.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  "use strict";
  var inherit = require( "PHET_CORE/inherit" );
  var CommonNode = require( "UNDER_PRESSURE/common/view/CommonNode" );
  var ScreenView = require( "JOIST/ScreenView" );
  var SquarePoolBack = require( "square-pool/view/SquarePoolBack" );
  var FaucetFluidNode = require( "UNDER_PRESSURE/common/view/FaucetFluidNode" );
  var SquarePoolWaterNode = require("square-pool/view/SquarePoolWaterNode");
  var BarometersContainer = require( "UNDER_PRESSURE/common/view/BarometersContainer" );


  function SquarePoolView( model ) {
    var self = this;
    ScreenView.call( this, { renderer: "svg" } );

    //sky, earth and controls
    this.addChild( new CommonNode( model ) );

    //pool
    this.addChild( new SquarePoolBack( model ) );

    //fluids
    this.addChild( new FaucetFluidNode( model.inputFaucet, model, (model.poolDimensions.y2 - model.inputFaucet.location.y)*model.pxToMetersRatio ) );
    this.addChild( new FaucetFluidNode( model.outputFaucet, model, 1000 ) );

    //water
    this.addChild(new SquarePoolWaterNode(model));

    //barometers
    this.addChild(new BarometersContainer(model));

  }

  return inherit( ScreenView, SquarePoolView );
} );