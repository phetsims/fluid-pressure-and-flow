// Copyright 2013-2015, University of Colorado Boulder

/**
 * View for the chamber pool. Chamber pool is a connected pool with two openings on the ground.
 * All the corner angles are 90 degrees.
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ChamberPoolBack = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/ChamberPoolBack' );
  var ChamberPoolWaterNode = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/ChamberPoolWaterNode' );
  var MassNode = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/MassNode' );
  var MassStackNode = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/MassStackNode' );
  var TrapezoidPoolGrid = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/TrapezoidPoolGrid' );

  /**
   *
   * @param {ChamberPoolModel} chamberPoolModel
   * @param {ModelViewTransform2} modelViewTransform for transforming between model and view co-ordinates
   * @param {Bounds2} dragBounds - bounds for limiting the dragging of mass nodes.
   * @constructor
   */
  function ChamberPoolView( chamberPoolModel, modelViewTransform, dragBounds ) {

    var chamberPoolView = this;
    Node.call( this );

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
    var poolDimensions = chamberPoolModel.poolDimensions;

    var poolLeftX = poolDimensions.leftChamber.x1;
    var poolTopY = poolDimensions.leftOpening.y1;
    var poolRightX = poolDimensions.rightOpening.x2;
    var poolBottomY = poolDimensions.leftChamber.y2 - 0.3;
    var poolHeight = -poolDimensions.leftChamber.y2;
    var labelXPosition = modelViewTransform.modelToViewX( ( poolDimensions.leftChamber.x2 +
                                                            poolDimensions.rightOpening.x1 ) / 2 );

    // add grid
    this.addChild( new TrapezoidPoolGrid( chamberPoolModel.underPressureModel, modelViewTransform, poolLeftX, poolTopY,
      poolRightX, poolBottomY, poolHeight, labelXPosition, 0 ) );
  }

  fluidPressureAndFlow.register( 'ChamberPoolView', ChamberPoolView );

  return inherit( Node, ChamberPoolView );
} );