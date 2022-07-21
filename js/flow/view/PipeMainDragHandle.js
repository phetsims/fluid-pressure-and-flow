// Copyright 2014-2022, University of Colorado Boulder

/**
 * View for the handles on the pipe segment.
 * Handles on the left/right pipe segment are used for dragging the pipe up/down.
 *
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Node, SimpleDragHandler } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

// constants
const CONTROL_HANDLE_OFFSET = 2;
const PIPE_INITIAL_HEIGHT = 2.1; //in meters
const PIPE_INITIAL_SCALE = 0.36;

class PipeMainDragHandle extends Node {

  /**
   * @param {PipeHandlesNode} pipeHandlesNode
   * @param {string} dragHandlePosition indicates whether it is left or right. Can take values 'left' or 'right'
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   */
  constructor( pipeHandlesNode, dragHandlePosition, modelViewTransform ) {

    super();

    const pipeNode = pipeHandlesNode.pipeNode;
    const flowModel = pipeHandlesNode.flowModel;
    const pipe = flowModel.pipe;

    const leftTopControlPointIndex = 1;
    const leftBottomControlPointIndex = 1;
    const rightTopControlPointIndex = pipe.top.length - 2;
    const rightBottomControlPointIndex = pipe.bottom.length - 2;

    let initialMainHandleY;
    let dragStartY;

    // left and right side of pipe main handles dragging
    pipeHandlesNode.pipeMainDragHandles[ dragHandlePosition ].addInputListener( new SimpleDragHandler( {

      start: event => {
        dragStartY = pipeHandlesNode.pipeMainDragHandles[ dragHandlePosition ].globalToParentPoint( event.pointer.point ).y;
        initialMainHandleY = dragHandlePosition === 'left' ? pipeNode.leftPipeNode.centerY :
                             pipeNode.rightPipeNode.centerY;
      },
      drag: event => {
        const currentDragPoint = pipeHandlesNode.pipeMainDragHandles[ dragHandlePosition ].globalToParentPoint( event.pointer.point );
        const offSetY = currentDragPoint.y - dragStartY;
        const pt = modelViewTransform.viewToModelPosition( currentDragPoint );
        pt.y = modelViewTransform.viewToModelY( initialMainHandleY + offSetY );

        // limit the pipe drag between [ -3, -1 ]
        pt.y = Utils.clamp( pt.y, -3, -1 );

        let yUp;
        let yLow;
        let x;
        if ( dragHandlePosition === 'left' ) {
          // Left handle
          // calculate top and bottom control point positions
          yUp = pt.y + pipe.leftPipeScaleProperty.value / PIPE_INITIAL_SCALE * PIPE_INITIAL_HEIGHT / 2;
          yLow = pt.y - pipe.leftPipeScaleProperty.value / PIPE_INITIAL_SCALE * PIPE_INITIAL_HEIGHT / 2;

          // set the left pipe top and bottom control point
          x = pipe.top[ leftTopControlPointIndex ].positionProperty.value.x;
          pipe.top[ leftTopControlPointIndex ].positionProperty.value = new Vector2( x, yUp );
          pipe.bottom[ leftBottomControlPointIndex ].positionProperty.value = new Vector2( x, yLow );

          pipe.leftPipeYPositionProperty.value = modelViewTransform.modelToViewY( pipe.top[ leftTopControlPointIndex ].positionProperty.value.y ) -
                                                 pipeNode.leftPipeYOffset * pipe.leftPipeScaleProperty.value;

          // set the left pipe  top/bottom control point handle positions
          pipe.leftPipeTopHandleYProperty.value = pipeNode.leftPipeNode.top + CONTROL_HANDLE_OFFSET;
          pipe.leftPipeBottomHandleYProperty.value = pipeNode.leftPipeNode.bottom - CONTROL_HANDLE_OFFSET;
          flowModel.pipe.leftPipeMainHandleYPositionProperty.value = pipeNode.leftPipeNode.centerY;
        }
        else {
          // Right handle
          // calculate  top and bottom control point positions
          yUp = pt.y + ( pipe.rightPipeScaleProperty.value / PIPE_INITIAL_SCALE ) * PIPE_INITIAL_HEIGHT / 2;
          yLow = pt.y - ( pipe.rightPipeScaleProperty.value / PIPE_INITIAL_SCALE ) * PIPE_INITIAL_HEIGHT / 2;

          // set the right pipe top and bottom control points positions
          x = pipe.top[ rightTopControlPointIndex ].positionProperty.value.x;
          pipe.top[ rightTopControlPointIndex ].positionProperty.value = new Vector2( x, yUp );
          pipe.bottom[ rightBottomControlPointIndex ].positionProperty.value = new Vector2( x, yLow );
          pipe.rightPipeYPositionProperty.value = modelViewTransform.modelToViewY( pipe.top[ rightTopControlPointIndex ].positionProperty.value.y ) -
                                                  pipeNode.rightPipeYOffset * pipe.rightPipeScaleProperty.value;

          // set the right pipe top/bottom control point handle positions
          pipe.rightPipeTopHandleYProperty.value = pipeNode.rightPipeNode.top + CONTROL_HANDLE_OFFSET;
          pipe.rightPipeBottomHandleYProperty.value = pipeNode.rightPipeNode.bottom - CONTROL_HANDLE_OFFSET;

          flowModel.pipe.rightPipeMainHandleYPositionProperty.value = pipeNode.rightPipeNode.centerY;
        }

        // reposition the particles when the sim is paused and the handle is dragged
        if ( !flowModel.isPlayingProperty.value ) {
          pipeNode.particlesLayer.step();
        }

        // When a control point is dragged, update the pipe flow line shape and the node shape
        pipe.dirty = true;
        pipeNode.updatePipeFlowLineShape();
        flowModel.fluxMeter.updateEmitter.emit();

        // update the velocity sensors
        flowModel.speedometers.forEach( speedometer => {
          speedometer.updateEmitter.emit();
        } );

        // update the barometers
        flowModel.barometers.forEach( barometer => {
          barometer.updateEmitter.emit();
        } );

        pipeHandlesNode.gridInjectorNode.updateGridInjector();
      }
    } ) );
  }
}

fluidPressureAndFlow.register( 'PipeMainDragHandle', PipeMainDragHandle );
export default PipeMainDragHandle;