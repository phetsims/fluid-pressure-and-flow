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
  var Property = require( 'AXON/Property' );

  // images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle-with-bar.png' );

  // constants
  var LEFT_PIPE_DRAG_HANDLE_OFFSET = 10;
  var RIGHT_PIPE_DRAG_HANDLE_OFFSET = 50;
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


    this.controlHandleNodes = [];
    // add handle to drag the left pipe
    this.leftPipeMainHandleNode = new Image( handleImage,
      {
        y: flowModel.pipe.leftPipeMainHandleYPosition,
        x: layoutBounds.minX - LEFT_PIPE_DRAG_HANDLE_OFFSET,
        cursor: 'pointer',
        scale: 0.32
      }
    );

    var boundsToTouchAreaForLeftAndRightHandles = function( localBounds ) {
      return new Bounds2( localBounds.minX - HANDLE_X_TOUCH_EXPAND, localBounds.minY + 25,
          localBounds.maxX + HANDLE_X_TOUCH_EXPAND, localBounds.maxY + 60 );
    };

    // touch area for the left pipe drag handle
    this.leftPipeMainHandleNode.touchArea = boundsToTouchAreaForLeftAndRightHandles( this.leftPipeMainHandleNode.localBounds );
    this.addChild( this.leftPipeMainHandleNode );

    // add handle to drag the right pipe
    this.rightPipeMainHandleNode = new Image( handleImage,
      {
        y: flowModel.pipe.rightPipeMainHandleYPosition,
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

    this.addChild( new PipeMainDragHandle( pipeHandlesNode, 'left', modelViewTransform ) );
    this.addChild( new PipeMainDragHandle( pipeHandlesNode, 'right', modelViewTransform ) );

    var i;
    var pipeHandleNode;
    for ( i = 1; i < pipe.top.length - 1; i++ ) {
      pipeHandleNode = new PipeHandleNode( pipeHandlesNode, true, i, modelViewTransform );
      this.controlHandleNodes.push( pipeHandleNode );
      this.addChild( pipeHandleNode );
    }

    for ( i = pipe.bottom.length - 2; i > 0; i-- ) {
      pipeHandleNode = new PipeHandleNode( pipeHandlesNode, false, i, modelViewTransform );
      this.controlHandleNodes.push( pipeHandleNode );
      this.addChild( pipeHandleNode );
    }

    var numberOfControlPoints = pipe.top.length * 2 - 4;
    flowModel.pipe.leftPipeMainHandleYPositionProperty.linkAttribute( pipeHandlesNode.leftPipeMainHandleNode, 'y' );
    flowModel.pipe.rightPipeMainHandleYPositionProperty.linkAttribute( pipeHandlesNode.rightPipeMainHandleNode, 'y' );
    Property.multilink( [pipe.leftPipeTopHandleYProperty, pipe.leftPipeBottomHandleYProperty],
      function( leftTop, leftBottom ) {
        pipeHandlesNode.controlHandleNodes[ 0 ].bottom = leftTop;
        pipeHandlesNode.controlHandleNodes[ numberOfControlPoints - 1 ].top = leftBottom;
      } );

    Property.multilink( [pipe.rightPipeTopHandleYProperty, pipe.rightPipeBottomHandleYProperty],
      function( rightTop, rightBottom ) {
        pipeHandlesNode.controlHandleNodes[ numberOfControlPoints / 2 - 1 ].bottom = rightTop;
        pipeHandlesNode.controlHandleNodes[ numberOfControlPoints / 2 ].top = rightBottom;
      } );

  }

  return inherit( Node, PipeHandlesNode, {

    reset: function() {

      // reset the grid injector position
      this.gridInjectorNode.updateGridInjector();
    }
  } );

} );