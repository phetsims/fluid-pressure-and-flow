// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for handles on the pipe node. The pipe can be dragged and scaled using these handles.
 * Handles on the middle pipe are used for deforming the pipe shape and handles on the pipe ends are used for
 * scaling and dragging.
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PipeHandleNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/PipeHandleNode' );
  var PipeMainDragHandle = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/PipeMainDragHandle' );
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
    var self = this;
    this.flowModel = flowModel;
    this.pipeNode = pipeNode;
    this.layoutBounds = layoutBounds;
    this.gridInjectorNode = gridInjectorNode;

    var pipe = flowModel.pipe;

    var topControlHandleNodes = [];
    var bottomControlHandleNodes = [];

    // add handle to drag the left pipe
    this.leftPipeMainHandleNode = new Image( handleImage,
      {
        y: flowModel.pipe.leftPipeMainHandleYPositionProperty.value,
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
        y: flowModel.pipe.rightPipeMainHandleYPositionProperty.value,
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

    this.addChild( new PipeMainDragHandle( self, 'left', modelViewTransform ) );
    this.addChild( new PipeMainDragHandle( self, 'right', modelViewTransform ) );

    var i;
    var pipeHandleNode;
    for ( i = 1; i < pipe.top.length - 1; i++ ) {
      pipeHandleNode = new PipeHandleNode( self, true, i, modelViewTransform );
      topControlHandleNodes.push( pipeHandleNode );
      this.addChild( pipeHandleNode );
    }

    for ( i = 1; i < pipe.bottom.length - 1; i++ ) {
      pipeHandleNode = new PipeHandleNode( self, false, i, modelViewTransform );
      bottomControlHandleNodes.push( pipeHandleNode );
      this.addChild( pipeHandleNode );
    }

    flowModel.pipe.leftPipeMainHandleYPositionProperty.linkAttribute( self.leftPipeMainHandleNode, 'y' );
    flowModel.pipe.rightPipeMainHandleYPositionProperty.linkAttribute( self.rightPipeMainHandleNode, 'y' );
    Property.multilink( [ pipe.leftPipeTopHandleYProperty, pipe.leftPipeBottomHandleYProperty ],
      function( leftTop, leftBottom ) {
        topControlHandleNodes[ 0 ].bottom = leftTop;
        bottomControlHandleNodes[ 0 ].top = leftBottom;
      } );

    Property.multilink( [ pipe.rightPipeTopHandleYProperty, pipe.rightPipeBottomHandleYProperty ],
      function( rightTop, rightBottom ) {
        topControlHandleNodes[ topControlHandleNodes.length - 1 ].bottom = rightTop;
        bottomControlHandleNodes[ bottomControlHandleNodes.length - 1 ].top = rightBottom;
      } );

  }

  fluidPressureAndFlow.register( 'PipeHandlesNode', PipeHandlesNode );

  return inherit( Node, PipeHandlesNode, {

    reset: function() {

      // reset the grid injector position
      this.gridInjectorNode.updateGridInjector();
    }
  } );

} );