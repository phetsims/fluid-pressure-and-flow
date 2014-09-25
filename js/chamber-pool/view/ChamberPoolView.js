// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the chamber pool. Chamber pool is a connected pool with two openings on the ground.
 * All the corner angles are 90 degrees.
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ChamberPoolBack = require( 'chamber-pool/view/ChamberPoolBack' );
  var ChamberPoolWaterNode = require( 'chamber-pool/view/ChamberPoolWaterNode' );
  var MassNode = require( 'chamber-pool/view/MassNode' );
  var MassStackNode = require( 'chamber-pool/view/MassStackNode' );
  var TrapezoidPoolGrid = require( 'trapezoid-pool/view/TrapezoidPoolGrid' );

  /**
   *
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
      chamberPoolView.addChild( new MassNode( massModel, chamberPoolModel, modelViewTransform, dragBounds ) );
    } );
    // add mass stack
    this.addChild( new MassStackNode( chamberPoolModel, modelViewTransform ) );

    // pool dimensions in view values
    var poolLeftX = chamberPoolModel.poolDimensions.leftChamber.x1;
    var poolTopY = chamberPoolModel.poolDimensions.leftOpening.y1;
    var poolRightX = chamberPoolModel.poolDimensions.rightOpening.x2;
    var poolBottomY = chamberPoolModel.poolDimensions.leftChamber.y2 + 0.3;
    var poolHeight = chamberPoolModel.poolDimensions.leftChamber.y2 - chamberPoolModel.underPressureModel.skyGroundBoundY;
    var labelXPosition = modelViewTransform.modelToViewX( ( chamberPoolModel.poolDimensions.leftChamber.x2 + chamberPoolModel.poolDimensions.rightOpening.x1 ) / 2 );

    // add grid
    this.addChild( new TrapezoidPoolGrid( chamberPoolModel.underPressureModel, modelViewTransform, poolLeftX, poolTopY, poolRightX, poolBottomY, poolHeight, labelXPosition, 0 ) );
  }

  return inherit( Node, ChamberPoolView );
} );