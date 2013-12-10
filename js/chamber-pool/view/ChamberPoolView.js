// Copyright 2002-2013, University of Colorado Boulder

/**
 * main ScreenView container for trapezoid pool.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  "use strict";
  var inherit = require( "PHET_CORE/inherit" );
  var CommonNode = require( "UNDER_PRESSURE/common/view/CommonNode" );
  var ScreenView = require( "JOIST/ScreenView" );
  var ChamberPoolBack = require( "chamber-pool/view/ChamberPoolBack" );
  var ChamberPoolWaterNode = require( "chamber-pool/view/ChamberPoolWaterNode" );
  var MassViewNode = require( "chamber-pool/view/MassViewNode" );
  var BarometersContainer = require( "UNDER_PRESSURE/common/view/BarometersContainer" );


  function ChamberPoolView( model ) {
    var self = this;

    ScreenView.call( this, { renderer: "svg" } );

    //sky, earth and controls
    this.addChild( new CommonNode( model ) );

    //pool
    this.addChild( new ChamberPoolBack( model ) );

    //water
    this.addChild( new ChamberPoolWaterNode( model ) );

    model.masses.forEach( function( massModel ) {
      self.addChild( new MassViewNode( massModel, model ) );
    } );

    //barometers
    this.addChild( new BarometersContainer( model ) );

  }

  return inherit( ScreenView, ChamberPoolView );
} );