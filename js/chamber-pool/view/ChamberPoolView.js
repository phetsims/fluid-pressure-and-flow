// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view container for chamber pool.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ChamberPoolBack = require( 'chamber-pool/view/ChamberPoolBack' );
  var ChamberPoolWaterNode = require( 'chamber-pool/view/ChamberPoolWaterNode' );
  var MassViewNode = require( 'chamber-pool/view/MassViewNode' );
  var MassStackNode = require( 'chamber-pool/view/MassStackNode' );
  var ChamberPoolGrid = require( 'chamber-pool/view/ChamberPoolGrid' );

  function ChamberPoolView( model, modelViewTransform, dragBounds ) {
    var self = this;

    Node.call( this, { renderer: 'svg' } );

    //pool
    this.addChild( new ChamberPoolBack( model, modelViewTransform ) );

    //water
    this.addChild( new ChamberPoolWaterNode( model, modelViewTransform ) );

    model.masses.forEach( function( massModel ) {
      self.addChild( new MassViewNode( massModel, model, modelViewTransform, dragBounds ) );
    } );

    this.addChild( new MassStackNode( model, modelViewTransform ) );

    //grid
    this.addChild( new ChamberPoolGrid( model, modelViewTransform ) );
  }

  return inherit( Node, ChamberPoolView );
} );