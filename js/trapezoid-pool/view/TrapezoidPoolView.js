// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view for trapezoid pool.
 * * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  "use strict";
  var inherit = require( "PHET_CORE/inherit" );
  var CommonNode = require( "UNDER_PRESSURE/common/view/CommonNode" );
  var Node = require( 'SCENERY/nodes/Node' );
  var TrapezoidPoolBack = require( "trapezoid-pool/view/TrapezoidPoolBack" );
  var FaucetFluidNode = require( "UNDER_PRESSURE/common/view/FaucetFluidNode" );
  var TrapezoidPoolWaterNode = require( "trapezoid-pool/view/TrapezoidPoolWaterNode" );
  var BarometersContainer = require( "UNDER_PRESSURE/common/view/BarometersContainer" );
  var TrapezoidPoolGrid = require( "trapezoid-pool/view/TrapezoidPoolGrid" );


  function TrapezoidPoolView( model, mvt ) {
    Node.call( this, { renderer: "svg" } );

    //pool
    this.addChild( new TrapezoidPoolBack( model, mvt ) );

    //fluids
    this.addChild( new FaucetFluidNode( model.inputFaucet, model, mvt, mvt.modelToViewY( model.poolDimensions.bottomChamber.y2 - model.inputFaucet.location.y ) ) );
    this.addChild( new FaucetFluidNode( model.outputFaucet, model, mvt, 1000 ) );

    //water
    this.addChild( new TrapezoidPoolWaterNode( model, mvt ) );

    //grid
    this.addChild( new TrapezoidPoolGrid( model, mvt ) );

  }

  return inherit( Node, TrapezoidPoolView );
} );