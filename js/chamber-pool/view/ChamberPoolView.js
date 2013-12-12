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
  var Node = require( 'SCENERY/nodes/Node' );
  var ChamberPoolBack = require( "chamber-pool/view/ChamberPoolBack" );
  var ChamberPoolWaterNode = require( "chamber-pool/view/ChamberPoolWaterNode" );
  var MassViewNode = require( "chamber-pool/view/MassViewNode" );
  var BarometersContainer = require( "UNDER_PRESSURE/common/view/BarometersContainer" );
  var MassStackNode = require( "chamber-pool/view/MassStackNode" );
  var ChamberPoolGrid = require("chamber-pool/view/ChamberPoolGrid");


  function ChamberPoolView( model ) {
    var self = this;

    Node.call( this, { renderer: "svg" } );

    //pool
    this.addChild( new ChamberPoolBack( model ) );

    //water
    this.addChild( new ChamberPoolWaterNode( model ) );

    model.masses.forEach( function( massModel ) {
      self.addChild( new MassViewNode( massModel, model ) );
    } );

    this.addChild(new MassStackNode(model));

    //grid
    this.addChild(new ChamberPoolGrid(model));

  }

  return inherit( Node, ChamberPoolView );
} );