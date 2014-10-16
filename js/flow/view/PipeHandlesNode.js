// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * View for handles on the pipe node. The pipe can be dragged and scaled using these handles.
 * Handles on the middle pipe are used for deforming the pipe shape and handles on the pipe ends are used for
 * scaling and dragging.
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var PipeMainDragHandle = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/PipeMainDragHandle' );
  var PipeHandleNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/PipeHandleNode' );

  // images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle-with-bar.png' );

  // constants
  var CONTROL_HANDLE_OFFSET = 2;
  var LEFT_PIPE_DRAG_HANDLE_OFFSET = 10;
  var RIGHT_PIPE_DRAG_HANDLE_OFFSET = 50;
  var PIPE_SCALE = 0.6;
  var HANDLE_X_TOUCH_EXPAND = 30;

  /*
   * Constructor for PipeHandlesNode
   * @param {FlowModel} flowModel of the simulation
   * @param {PipeNode} pipeNode
   * @param {GridInjectorNode} gridInjectorNode that sits on the pipe
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @param {Bounds2} layoutBounds of the simulation
   * @constructor
   */
  function PipeHandlesNode( flowModel, pipeNode, gridInjectorNode, modelViewTransform, layoutBounds ) {

    Node.call( this );
    var pipeHandlesNode = this;
    this.flowModel = flowModel;
    this.pipeNode = pipeNode;
    this.layoutBounds = layoutBounds;
    this.gridInjectorNode = gridInjectorNode;

    var pipe = flowModel.pipe;

    var numControlPoints = pipe.controlPoints.length;

    // scaling factors for the right, left pipe nodes.
    this.rightPipeExpansionScale = PIPE_SCALE;
    this.leftPipeExpansionScale = PIPE_SCALE;

    this.controlHandleNodes = [];
    // add handle to drag the left pipe
    this.leftPipeMainHandleNode = new Image( handleImage,
      {
        y: pipeNode.leftPipeNode.centerY,
        x: layoutBounds.minX - LEFT_PIPE_DRAG_HANDLE_OFFSET,
        cursor: 'pointer',
        scale: 0.32
      }
    );

    var boundsToTouchAreaForLeftAndRightHandles = function( localBounds ) {
      return new Bounds2( localBounds.minX - HANDLE_X_TOUCH_EXPAND, localBounds.minY + 25, localBounds.maxX + HANDLE_X_TOUCH_EXPAND, localBounds.maxY + 60 );
    };

    // touch area for the left pipe drag handle
    this.leftPipeMainHandleNode.touchArea = boundsToTouchAreaForLeftAndRightHandles( this.leftPipeMainHandleNode.localBounds );
    this.addChild( this.leftPipeMainHandleNode );

    // add handle to drag the right pipe
    this.rightPipeMainHandleNode = new Image( handleImage,
      {
        y: pipeNode.rightPipeNode.centerY,
        x: layoutBounds.maxX - RIGHT_PIPE_DRAG_HANDLE_OFFSET,
        cursor: 'pointer',
        scale: 0.32
      }
    );
    // touch area for the right pipe drag handle
    this.rightPipeMainHandleNode.touchArea = boundsToTouchAreaForLeftAndRightHandles( this.rightPipeMainHandleNode.localBounds );
    this.addChild( this.rightPipeMainHandleNode );

    this.pipeMainDragHandles = {
      left: this.leftPipeMainHandleNode,
      right: this.rightPipeMainHandleNode
    };

    // this.pipeMainDragHandles.push( this.leftPipeMainHandleNode );
    // this.pipeMainDragHandles.push( this.rightPipeMainHandleNode );

    this.addChild( new PipeMainDragHandle( pipeHandlesNode, 'left', modelViewTransform, this.layoutBounds ) );
    this.addChild( new PipeMainDragHandle( pipeHandlesNode, 'right', modelViewTransform, this.layoutBounds ) );

    /*for ( var j = 0; j < this.pipeMainDragHandles.length; j++ ) {
     // add the  left/right pipe main drag handles
     var pipeMainDragHandle = new PipeMainDragHandle( pipeHandlesNode, j, modelViewTransform, this.layoutBounds );
     this.addChild( pipeMainDragHandle );
     }*/


    for ( var i = 0; i < numControlPoints; i++ ) {
      var pipeHandleNode = new PipeHandleNode( pipeHandlesNode, i, modelViewTransform, layoutBounds );
      this.controlHandleNodes.push( pipeHandleNode );
      this.addChild( pipeHandleNode );
    }
  }

  return inherit( Node, PipeHandlesNode, {

    reset: function() {

      // reset the handle positions
      var numControlPoints = this.flowModel.pipe.controlPoints.length;
      this.controlHandleNodes[ numControlPoints / 2 - 1 ].bottom = this.pipeNode.rightPipeNode.top +
                                                                   CONTROL_HANDLE_OFFSET;
      this.controlHandleNodes[ numControlPoints / 2 ].top = this.pipeNode.rightPipeNode.bottom - CONTROL_HANDLE_OFFSET;
      this.controlHandleNodes[ 0 ].bottom = this.pipeNode.leftPipeNode.top + CONTROL_HANDLE_OFFSET;
      this.controlHandleNodes[ numControlPoints - 1 ].top = this.pipeNode.leftPipeNode.bottom - CONTROL_HANDLE_OFFSET;

      this.rightPipeExpansionScale = PIPE_SCALE;
      this.leftPipeExpansionScale = PIPE_SCALE;

      // reset the grid injector position
      this.gridInjectorNode.updateGridInjector();

      // reset the left and right pipe drag handle
      this.leftPipeMainHandleNode.setTranslation( this.layoutBounds.minX - LEFT_PIPE_DRAG_HANDLE_OFFSET,
        this.pipeNode.leftPipeNode.getCenterY() );
      this.rightPipeMainHandleNode.setTranslation( this.layoutBounds.maxX - RIGHT_PIPE_DRAG_HANDLE_OFFSET,
        this.pipeNode.rightPipeNode.getCenterY() );
    }
  } );

} );