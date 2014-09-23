// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the chamber pool. Chamber pool is a connected pool with two openings on the ground.
 * All the corner angles are 90 degrees.
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

  /**
   * Constructor for the chamber pool.
   * @param {ChamberPoolModel} chamberPoolModel
   * @param {ModelViewTransform2} modelViewTransform for transforming between model and view co-ordinates
   * @param {Bounds2} dragBounds - bounds for limiting the dragging of mass nodes.
   * @constructor
   */
  function ChamberPoolView( chamberPoolModel, modelViewTransform, dragBounds ) {

    var chamberPoolView = this;
    Node.call( this, { renderer: 'svg' } );

    // add pool
    this.addChild( new ChamberPoolBack( chamberPoolModel, modelViewTransform ) );

    // add water
    this.addChild( new ChamberPoolWaterNode( chamberPoolModel, modelViewTransform ) );

    // add masses
    chamberPoolModel.masses.forEach( function( massModel ) {
      chamberPoolView.addChild( new MassViewNode( massModel, chamberPoolModel, modelViewTransform, dragBounds ) );
    } );

    this.addChild( new MassStackNode( chamberPoolModel, modelViewTransform ) );

    //grid
    this.addChild( new ChamberPoolGrid( chamberPoolModel, modelViewTransform ) );
  }

  return inherit( Node, ChamberPoolView );
} );