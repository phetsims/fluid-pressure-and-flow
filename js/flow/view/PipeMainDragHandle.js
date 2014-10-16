// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * View for the handles on the pipe segment.
 * Handles on the left/right pipe segment are used for dragging the pipe up/down .
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var CONTROL_HANDLE_OFFSET = 2;
  var LEFT_PIPE_DRAG_HANDLE_OFFSET = 10;
  var RIGHT_PIPE_DRAG_HANDLE_OFFSET = 50;
  var PIPE_INITIAL_HEIGHT = 2.1; //in meters
  var PIPE_SCALE = 0.6;

  /**
   * @param {PipeHandlesNode} pipeHandlesNode
   * @param {string} dragHandlePosition indicates whether it is left or right. Can take values 'left' or 'right'
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @param {Bounds2} layoutBounds of the simulation
   * @constructor
   */
  function PipeMainDragHandle( pipeHandlesNode, dragHandlePosition, modelViewTransform, layoutBounds ) {

    Node.call( this );

    var pipeNode = pipeHandlesNode.pipeNode;
    var flowModel = pipeHandlesNode.flowModel;
    var pipe = flowModel.pipe;

    var numControlPoints = pipe.controlPoints.length;
    var leftTopControlPointIndex = 0;
    var leftBottomControlPointIndex = numControlPoints - 1;
    var rightTopControlPointIndex = numControlPoints / 2 - 1;
    var rightBottomControlPointIndex = numControlPoints / 2;

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
        var index = dragHandlePosition === 'left' ? 0 : rightBottomControlPointIndex;
        var x = pipe.controlPoints[ index ].position.x;
        var yUp;
        var yLow;
        pt.y = modelViewTransform.viewToModelY( initialMainHandleY + offSetY );

        // limit the pipe drag between [0,-4]
        if ( pt.y + 1 >= 0 || pt.y - 1 < -4 ) {
          return;
        }

        if ( dragHandlePosition === 'left' ) {
          // Left handle
          // calculate top and bottom control point positions
          yUp = pt.y + pipeHandlesNode.leftPipeExpansionScale / PIPE_SCALE * PIPE_INITIAL_HEIGHT / 2;
          yLow = pt.y - pipeHandlesNode.leftPipeExpansionScale / PIPE_SCALE * PIPE_INITIAL_HEIGHT / 2;

          // set the  left pipe  top  and bottom control point.
          pipe.controlPoints[ leftTopControlPointIndex ].position = new Vector2( x, yUp );
          pipe.controlPoints[ leftBottomControlPointIndex ].position = new Vector2( x, yLow );
          pipeNode.leftPipeNode.setTranslation( layoutBounds.minX - pipeNode.leftPipeLeftOffset,
              modelViewTransform.modelToViewY( pipe.controlPoints[ leftTopControlPointIndex ].position.y ) -
              pipeNode.leftPipeYOffset * pipeHandlesNode.leftPipeExpansionScale );
          pipeNode.leftPipeBackNode.setTranslation( layoutBounds.minX - pipeNode.leftPipeLeftOffset,
              modelViewTransform.modelToViewY( pipe.controlPoints[ leftTopControlPointIndex ].position.y ) -
              pipeNode.leftPipeYOffset * pipeHandlesNode.leftPipeExpansionScale );

          // set the left pipe  top/bottom control point handle positions
          pipeHandlesNode.controlHandleNodes[ leftTopControlPointIndex ].bottom = pipeNode.leftPipeNode.top +
                                                                                  CONTROL_HANDLE_OFFSET;
          pipeHandlesNode.controlHandleNodes[ leftBottomControlPointIndex ].top = pipeNode.leftPipeNode.bottom -
                                                                                  CONTROL_HANDLE_OFFSET;
          pipeHandlesNode.pipeMainDragHandles.left.setTranslation( layoutBounds.minX - LEFT_PIPE_DRAG_HANDLE_OFFSET,
            pipeNode.leftPipeNode.centerY );
        }
        else {
          // Right handle
          // calculate  top and bottom control point positions
          yUp = pt.y + pipeHandlesNode.rightPipeExpansionScale / PIPE_SCALE * PIPE_INITIAL_HEIGHT / 2;
          yLow = pt.y - pipeHandlesNode.rightPipeExpansionScale / PIPE_SCALE * PIPE_INITIAL_HEIGHT / 2;

          // set the right pipe top and bottom control points positions
          pipe.controlPoints[ rightTopControlPointIndex ].position = new Vector2( x, yUp );
          pipe.controlPoints[ rightBottomControlPointIndex ].position = new Vector2( x, yLow );
          pipeNode.rightPipeNode.setTranslation( layoutBounds.maxX - pipeNode.rightPipeLeftOffset,
              modelViewTransform.modelToViewY( pipe.controlPoints[ rightTopControlPointIndex ].position.y ) -
              pipeNode.rightPipeYOffset * pipeHandlesNode.rightPipeExpansionScale );

          // set the right pipe top/bottom control point handle positions
          pipeHandlesNode.controlHandleNodes[ rightTopControlPointIndex ].bottom = pipeNode.rightPipeNode.top +
                                                                                   CONTROL_HANDLE_OFFSET;
          pipeHandlesNode.controlHandleNodes[ rightBottomControlPointIndex ].top = pipeNode.rightPipeNode.bottom -
                                                                                   CONTROL_HANDLE_OFFSET;
          pipeHandlesNode.pipeMainDragHandles.right.setTranslation( layoutBounds.maxX - RIGHT_PIPE_DRAG_HANDLE_OFFSET,
            pipeNode.rightPipeNode.centerY );
        }

        // reposition the particles when the sim is paused and the handle is dragged
        if ( !flowModel.isPlay ) {
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

  return inherit( Node, PipeMainDragHandle );
} );