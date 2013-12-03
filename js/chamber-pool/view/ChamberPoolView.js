// Copyright 2002-2013, University of Colorado Boulder

/**
 * main ScreenView container for trapezoid pool.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  "use strict";
  var inherit = require( "PHET_CORE/inherit" );
  var CommonNode = require( "common/view/CommonNode" );
  var ScreenView = require( "JOIST/ScreenView" );
  var ChamberPoolBack = require( "chamber-pool/view/ChamberPoolBack" );
  var ChamberPoolWaterNode = require( "chamber-pool/view/ChamberPoolWaterNode" );


  function TrapezoidPoolView( model ) {
    ScreenView.call( this, { renderer: "svg" } );

    //sky, earth and controls
    this.addChild( new CommonNode( model ) );

    //pool
    this.addChild( new ChamberPoolBack( model ) );

    //water
    this.addChild( new ChamberPoolWaterNode( model ) );

  }

  return inherit( ScreenView, TrapezoidPoolView );
} );