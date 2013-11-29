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
  var TrapezoidPoolBack = require( "trapezoid-pool/view/TrapezoidPoolBack" );
  var FaucetFluidNode = require( "common/view/FaucetFluidNode" );
  var TrapezoidPoolWaterNode = require( "trapezoid-pool/view/TrapezoidPoolWaterNode" );


  function TrapezoidPoolView( model ) {
    ScreenView.call( this, { renderer: "svg" } );

    //sky, earth and controls
    this.addChild( new CommonNode( model ) );

    //pool
    this.addChild( new TrapezoidPoolBack( model ) );

    //fluids
    this.addChild( new FaucetFluidNode( model.inputFaucet, model, (model.poolDimensions.bottomChamber.y2 - model.inputFaucet.location.y) * model.pxToMetersRatio ) );
    this.addChild( new FaucetFluidNode( model.outputFaucet, model, 1000 ) );

    //water
    this.addChild( new TrapezoidPoolWaterNode( model ) );

  }

  return inherit( ScreenView, TrapezoidPoolView );
} );