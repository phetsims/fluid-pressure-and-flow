// Copyright 2014-2022, University of Colorado Boulder

/**
 * View for handles on the pipe node. The pipe can be dragged and scaled using these handles.
 * Handles on the middle pipe are used for deforming the pipe shape and handles on the pipe ends are used for
 * scaling and dragging.
 *
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import handleWithBar_png from '../../../images/handleWithBar_png.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import PipeHandleNode from './PipeHandleNode.js';
import PipeMainDragHandle from './PipeMainDragHandle.js';

// constants
const LEFT_PIPE_DRAG_HANDLE_OFFSET = 10;
const RIGHT_PIPE_DRAG_HANDLE_OFFSET = 50;
const HANDLE_X_TOUCH_EXPAND = 30;

class PipeHandlesNode extends Node {

  /*
 * @param {FlowModel} flowModel of the simulation
 * @param {PipeNode} pipeNode
 * @param {GridInjectorNode} gridInjectorNode that sits on the pipe
 * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
 * @param {Bounds2} layoutBounds of the simulation
 */
  constructor( flowModel, pipeNode, gridInjectorNode, modelViewTransform, layoutBounds ) {

    super();

    this.flowModel = flowModel;
    this.pipeNode = pipeNode;
    this.layoutBounds = layoutBounds;
    this.gridInjectorNode = gridInjectorNode;

    const pipe = flowModel.pipe;

    const topControlHandleNodes = [];
    const bottomControlHandleNodes = [];

    // add handle to drag the left pipe
    this.leftPipeMainHandleNode = new Image( handleWithBar_png,
      {
        y: flowModel.pipe.leftPipeMainHandleYPositionProperty.value,
        x: layoutBounds.minX - LEFT_PIPE_DRAG_HANDLE_OFFSET,
        cursor: 'pointer',
        scale: 0.32
      }
    );

    //TODO this should be private, outside of constructor
    function boundsToTouchAreaForLeftAndRightHandles( localBounds ) {
      return new Bounds2( localBounds.minX - HANDLE_X_TOUCH_EXPAND, localBounds.minY + 25,
        localBounds.maxX + HANDLE_X_TOUCH_EXPAND, localBounds.maxY + 60 );
    }

    // touch area for the left pipe drag handle
    this.leftPipeMainHandleNode.touchArea = boundsToTouchAreaForLeftAndRightHandles( this.leftPipeMainHandleNode.localBounds );
    this.addChild( this.leftPipeMainHandleNode );

    // add handle to drag the right pipe
    this.rightPipeMainHandleNode = new Image( handleWithBar_png,
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

    this.addChild( new PipeMainDragHandle( this, 'left', modelViewTransform ) );
    this.addChild( new PipeMainDragHandle( this, 'right', modelViewTransform ) );

    for ( let i = 1; i < pipe.top.length - 1; i++ ) {
      const pipeHandleNode = new PipeHandleNode( this, true, i, modelViewTransform );
      topControlHandleNodes.push( pipeHandleNode );
      this.addChild( pipeHandleNode );
    }

    for ( let i = 1; i < pipe.bottom.length - 1; i++ ) {
      const pipeHandleNode = new PipeHandleNode( this, false, i, modelViewTransform );
      bottomControlHandleNodes.push( pipeHandleNode );
      this.addChild( pipeHandleNode );
    }

    flowModel.pipe.leftPipeMainHandleYPositionProperty.linkAttribute( this.leftPipeMainHandleNode, 'y' );
    flowModel.pipe.rightPipeMainHandleYPositionProperty.linkAttribute( this.rightPipeMainHandleNode, 'y' );
    Multilink.multilink( [ pipe.leftPipeTopHandleYProperty, pipe.leftPipeBottomHandleYProperty ],
      ( leftTop, leftBottom ) => {
        topControlHandleNodes[ 0 ].bottom = leftTop;
        bottomControlHandleNodes[ 0 ].top = leftBottom;
      } );

    Multilink.multilink( [ pipe.rightPipeTopHandleYProperty, pipe.rightPipeBottomHandleYProperty ],
      ( rightTop, rightBottom ) => {
        topControlHandleNodes[ topControlHandleNodes.length - 1 ].bottom = rightTop;
        bottomControlHandleNodes[ bottomControlHandleNodes.length - 1 ].top = rightBottom;
      } );

  }

  /**
   * @public
   */
  reset() {

    // reset the grid injector position
    this.gridInjectorNode.updateGridInjector();
  }
}

fluidPressureAndFlow.register( 'PipeHandlesNode', PipeHandlesNode );
export default PipeHandlesNode;