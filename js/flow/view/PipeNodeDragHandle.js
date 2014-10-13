// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * View for the drag handle that can move the pipe up or down.
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle-with-bar.png' );

  // constants
  var CONTROL_HANDLE_OFFSET = 2;
  var LEFT_PIPE_DRAG_HANDLE_OFFSET = 10;
  var RIGHT_PIPE_DRAG_HANDLE_OFFSET = 50;
  var PIPE_INITIAL_HEIGHT = 2.1; //in meters
  var PIPE_SCALE = 0.6;


  /*
   * Constructor for PipeNodeDragHandle
   * @param {FlowModel} flowModel of the simulation.
   * @param {Pipe} pipe model of the  pipe node
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @param {PipeNode} PipeNode of the simulation
   * @param {Bounds2} layoutBounds of the simulation
   * @constructor
   */
  function PipeNodeDragHandle( flowModel, modelViewTransform, pipeNode, layoutBounds ) {

    Node.call( this );

    this.pipeNode = pipeNode;
    this.layoutBounds = layoutBounds;

    var pipe = flowModel.pipe;
    var numControlPoints = pipe.controlPoints.length;
    var leftTopControlPointIndex = 0;
    var leftBottomControlPointIndex = numControlPoints - 1;
    var rightTopControlPointIndex = numControlPoints / 2 - 1;
    var rightBottomControlPointIndex = numControlPoints / 2;

    // add handle to drag the left pipe
    this.leftPipeMainHandleNode = new Image( handleImage,
      { y: pipeNode.leftPipeNode.centerY,
        x: pipeNode.layoutBounds.minX - LEFT_PIPE_DRAG_HANDLE_OFFSET,
        cursor: 'pointer',
        scale: 0.32 } );

    // touch area for the left pipe drag handle
    this.leftPipeMainHandleNode.touchArea = new Bounds2( this.leftPipeMainHandleNode.localBounds.minX - 20,
        this.leftPipeMainHandleNode.localBounds.minY + 25, this.leftPipeMainHandleNode.localBounds.maxX + 20,
        this.leftPipeMainHandleNode.localBounds.maxY + 60 );
    this.addChild( this.leftPipeMainHandleNode );

    // add handle to drag the right pipe
    this.rightPipeMainHandleNode = new Image( handleImage,
      { y: pipeNode.rightPipeNode.centerY,
        x: layoutBounds.maxX - RIGHT_PIPE_DRAG_HANDLE_OFFSET,
        cursor: 'pointer',
        scale: 0.32   } );
    // touch area for the right pipe drag handle
    this.rightPipeMainHandleNode.touchArea = new Bounds2( this.rightPipeMainHandleNode.localBounds.minX - 20,
        this.rightPipeMainHandleNode.localBounds.minY + 25, this.rightPipeMainHandleNode.localBounds.maxX + 20,
        this.rightPipeMainHandleNode.localBounds.maxY + 60 );
    this.addChild( this.rightPipeMainHandleNode );

    var j;
    var pipeMainDragHandles = [];
    pipeMainDragHandles.push( this.leftPipeMainHandleNode );
    pipeMainDragHandles.push( this.rightPipeMainHandleNode );
    var initialMainHandleY;
    var dragStartY;
    // left and right side of pipe main handles dragging
    for ( j = 0; j < pipeMainDragHandles.length; j++ ) {
      (function( j ) {

        pipeMainDragHandles[ j ].addInputListener( new SimpleDragHandler( {

          start: function( e ) {
            dragStartY = pipeMainDragHandles[ j ].globalToParentPoint( e.pointer.point ).y;
            initialMainHandleY = j === 0 ? pipeNode.leftPipeNode.centerY : pipeNode.rightPipeNode.centerY;
          },
          drag: function( e ) {
            var currentDragPoint = pipeMainDragHandles[ j ].globalToParentPoint( e.pointer.point );
            var offSetY = currentDragPoint.y - dragStartY;
            var pt = modelViewTransform.viewToModelPosition( currentDragPoint );
            var index = j === 0 ? 0 : rightBottomControlPointIndex;
            var x = pipe.controlPoints[ index ].position.x;
            var yUp;
            var yLow;
            pt.y = modelViewTransform.viewToModelY( initialMainHandleY + offSetY );

            // limit the pipe drag between [0,-4]
            if ( pt.y + 1 >= 0 || pt.y - 1 < -4 ) {
              return;
            }

            if ( j === 0 ) {
              // calculate top and bottom control point positions

              yUp = pt.y + pipeNode.leftPipeExpansionScale / PIPE_SCALE * PIPE_INITIAL_HEIGHT / 2;
              yLow = pt.y - pipeNode.leftPipeExpansionScale / PIPE_SCALE * PIPE_INITIAL_HEIGHT / 2;


              // set the  left pipe  top  and bottom control point.
              pipe.controlPoints[ leftTopControlPointIndex ].position = new Vector2( x, yUp );
              pipe.controlPoints[ leftBottomControlPointIndex ].position = new Vector2( x, yLow );
              pipeNode.leftPipeNode.setTranslation( layoutBounds.minX - pipeNode.leftPipeLeftOffset,
                  modelViewTransform.modelToViewY( pipe.controlPoints[ leftTopControlPointIndex ].position.y ) -
                  pipeNode.leftPipeYOffset * pipeNode.leftPipeExpansionScale );
              pipeNode.leftPipeBackNode.setTranslation( layoutBounds.minX - pipeNode.leftPipeLeftOffset,
                  modelViewTransform.modelToViewY( pipe.controlPoints[ leftTopControlPointIndex ].position.y ) -
                  pipeNode.leftPipeYOffset * pipeNode.leftPipeExpansionScale );

              // set the left pipe  top/bottom control point handle positions
              pipeNode.controlHandleNodes[ leftTopControlPointIndex ].bottom = pipeNode.leftPipeNode.top +
                                                                               CONTROL_HANDLE_OFFSET;
              pipeNode.controlHandleNodes[ leftBottomControlPointIndex ].top = pipeNode.leftPipeNode.bottom -
                                                                               CONTROL_HANDLE_OFFSET;

              pipeMainDragHandles[ j ].setTranslation( layoutBounds.minX - LEFT_PIPE_DRAG_HANDLE_OFFSET,
                pipeNode.leftPipeNode.centerY );

            }
            else {
              // calculate  top and bottom control point positions
              yUp = pt.y + pipeNode.rightPipeExpansionScale / PIPE_SCALE * PIPE_INITIAL_HEIGHT / 2;
              yLow = pt.y - pipeNode.rightPipeExpansionScale / PIPE_SCALE * PIPE_INITIAL_HEIGHT / 2;

              // set the right pipe top and bottom control points positions
              pipe.controlPoints[ rightTopControlPointIndex ].position = new Vector2( x, yUp );
              pipe.controlPoints[ rightBottomControlPointIndex ].position = new Vector2( x, yLow );
              pipeNode.rightPipeNode.setTranslation( layoutBounds.maxX - pipeNode.rightPipeLeftOffset,
                  modelViewTransform.modelToViewY( pipe.controlPoints[ rightTopControlPointIndex ].position.y ) -
                  pipeNode.rightPipeYOffset * pipeNode.rightPipeExpansionScale );

              // set the right pipe top/bottom control point handle positions
              pipeNode.controlHandleNodes[ rightTopControlPointIndex ].bottom = pipeNode.rightPipeNode.top +
                                                                                CONTROL_HANDLE_OFFSET;
              pipeNode.controlHandleNodes[ rightBottomControlPointIndex ].top = pipeNode.rightPipeNode.bottom -
                                                                                CONTROL_HANDLE_OFFSET;

              pipeMainDragHandles[ j ].setTranslation( layoutBounds.maxX - RIGHT_PIPE_DRAG_HANDLE_OFFSET,
                pipeNode.rightPipeNode.centerY );

            }

            // reposition the particles when the sim is paused and the handle is dragged
            if ( !flowModel.isPlay ) {
              var particle;

              for ( var k = 0; k < flowModel.flowParticles.length; k++ ) {
                particle = flowModel.flowParticles.get( k );
              }

              for ( k = 0; k < flowModel.gridParticles.length; k++ ) {
                particle = flowModel.gridParticles.get( k );
              }
            }

            // When a control point is dragged, update the pipe flow line shape and the node shape
            pipe.dirty = true;
            pipe.createSpline();
            pipeNode.updatePipeFlowLineShape();
            flowModel.fluxMeter.trigger( 'update' );
            // update the velocity sensors
            flowModel.speedometers[ 0 ].trigger( 'update' );
            flowModel.speedometers[ 1 ].trigger( 'update' );

            // update the barometers
            flowModel.barometers[ 0 ].trigger( 'update' );
            flowModel.barometers[ 1 ].trigger( 'update' );
            pipeNode.flowView.gridInjectorNode.updateGridInjector();
          }
        } ) );
      })( j );
    }
  }

  return inherit( Node, PipeNodeDragHandle,
    {
      reset: function() {
        this.leftPipeMainHandleNode.setTranslation( this.layoutBounds.minX - LEFT_PIPE_DRAG_HANDLE_OFFSET,
          this.pipeNode.leftPipeNode.getCenterY() );
        this.rightPipeMainHandleNode.setTranslation( this.layoutBounds.maxX - RIGHT_PIPE_DRAG_HANDLE_OFFSET,
          this.pipeNode.rightPipeNode.getCenterY() );
      }
    } );
} );