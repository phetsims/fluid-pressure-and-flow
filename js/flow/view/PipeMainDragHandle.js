// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the handles on the pipe segment.
 * Handles on the left/right pipe segment are used for dragging the pipe up/down .
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );

  // constants
  var CONTROL_HANDLE_OFFSET = 2;
  var PIPE_INITIAL_HEIGHT = 2.1; //in meters
  var PIPE_INITIAL_SCALE = 0.36;

  /**
   * @param {PipeHandlesNode} pipeHandlesNode
   * @param {string} dragHandlePosition indicates whether it is left or right. Can take values 'left' or 'right'
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @constructor
   */
  function PipeMainDragHandle( pipeHandlesNode, dragHandlePosition, modelViewTransform ) {

    Node.call( this );

    var pipeNode = pipeHandlesNode.pipeNode;
    var flowModel = pipeHandlesNode.flowModel;
    var pipe = flowModel.pipe;

    var leftTopControlPointIndex = 1;
    var leftBottomControlPointIndex = 1;
    var rightTopControlPointIndex = pipe.top.length - 2;
    var rightBottomControlPointIndex = pipe.bottom.length - 2;

    var initialMainHandleY;
    var dragStartY;

    // left and right side of pipe main handles dragging
    pipeHandlesNode.pipeMainDragHandles[ dragHandlePosition ].addInputListener( new SimpleDragHandler( {

      start: function( e ) {
        dragStartY = pipeHandlesNode.pipeMainDragHandles[ dragHandlePosition ].globalToParentPoint( e.pointer.point ).y;
        initialMainHandleY = dragHandlePosition === 'left' ? pipeNode.leftPipeNode.centerY :
                             pipeNode.rightPipeNode.centerY;
      },
      drag: function( e ) {
        var currentDragPoint = pipeHandlesNode.pipeMainDragHandles[ dragHandlePosition ].globalToParentPoint( e.pointer.point );
        var offSetY = currentDragPoint.y - dragStartY;
        var pt = modelViewTransform.viewToModelPosition( currentDragPoint );
        pt.y = modelViewTransform.viewToModelY( initialMainHandleY + offSetY );

        // limit the pipe drag between [ -3, -1 ]
        pt.y = Util.clamp( pt.y, -3, -1 );

        var yUp;
        var yLow;
        var x;
        if ( dragHandlePosition === 'left' ) {
          // Left handle
          // calculate top and bottom control point positions
          yUp = pt.y + pipe.leftPipeScale / PIPE_INITIAL_SCALE * PIPE_INITIAL_HEIGHT / 2;
          yLow = pt.y - pipe.leftPipeScale / PIPE_INITIAL_SCALE * PIPE_INITIAL_HEIGHT / 2;

          // set the left pipe top and bottom control point
          x = pipe.top[ leftTopControlPointIndex ].positionProperty.value.x;
          pipe.top[ leftTopControlPointIndex ].positionProperty.value = new Vector2( x, yUp );
          pipe.bottom[ leftBottomControlPointIndex ].positionProperty.value = new Vector2( x, yLow );

          pipe.leftPipeYPosition = modelViewTransform.modelToViewY( pipe.top[ leftTopControlPointIndex ].positionProperty.value.y ) -
                                   pipeNode.leftPipeYOffset * pipe.leftPipeScale;

          // set the left pipe  top/bottom control point handle positions
          pipe.leftPipeTopHandleY = pipeNode.leftPipeNode.top + CONTROL_HANDLE_OFFSET;
          pipe.leftPipeBottomHandleY = pipeNode.leftPipeNode.bottom - CONTROL_HANDLE_OFFSET;
          flowModel.pipe.leftPipeMainHandleYPosition = pipeNode.leftPipeNode.centerY;
        }
        else {
          // Right handle
          // calculate  top and bottom control point positions
          yUp = pt.y + ( pipe.rightPipeScale / PIPE_INITIAL_SCALE ) * PIPE_INITIAL_HEIGHT / 2;
          yLow = pt.y - ( pipe.rightPipeScale / PIPE_INITIAL_SCALE ) * PIPE_INITIAL_HEIGHT / 2;

          // set the right pipe top and bottom control points positions
          x = pipe.top[ rightTopControlPointIndex ].positionProperty.value.x;
          pipe.top[ rightTopControlPointIndex ].positionProperty.value = new Vector2( x, yUp );
          pipe.bottom[ rightBottomControlPointIndex ].positionProperty.value = new Vector2( x, yLow );
          pipe.rightPipeYPosition = modelViewTransform.modelToViewY( pipe.top[ rightTopControlPointIndex ].positionProperty.value.y ) -
                                    pipeNode.rightPipeYOffset * pipe.rightPipeScale;

          // set the right pipe top/bottom control point handle positions
          pipe.rightPipeTopHandleY = pipeNode.rightPipeNode.top + CONTROL_HANDLE_OFFSET;
          pipe.rightPipeBottomHandleY = pipeNode.rightPipeNode.bottom - CONTROL_HANDLE_OFFSET;

          flowModel.pipe.rightPipeMainHandleYPosition = pipeNode.rightPipeNode.centerY;
        }

        // reposition the particles when the sim is paused and the handle is dragged
        if ( !flowModel.isPlaying ) {
          pipeNode.particlesLayer.step();
        }

        // When a control point is dragged, update the pipe flow line shape and the node shape
        pipe.dirty = true;
        pipeNode.updatePipeFlowLineShape();
        flowModel.fluxMeter.trigger( 'update' );

        // update the velocity sensors
        flowModel.speedometers[ 0 ].trigger( 'update' );
        flowModel.speedometers[ 1 ].trigger( 'update' );

        // update the barometers
        flowModel.barometers[ 0 ].trigger( 'update' );
        flowModel.barometers[ 1 ].trigger( 'update' );
        pipeHandlesNode.gridInjectorNode.updateGridInjector();
      }
    } ) );

  }

  fluidPressureAndFlow.register( 'PipeMainDragHandle', PipeMainDragHandle );

  return inherit( Node, PipeMainDragHandle );
} );