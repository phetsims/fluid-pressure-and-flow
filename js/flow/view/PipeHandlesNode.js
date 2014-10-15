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
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Util = require( 'DOT/Util' );

  // images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle-with-bar.png' );

  // constants
  var CONTROL_HANDLE_OFFSET = 2;
  var LEFT_PIPE_DRAG_HANDLE_OFFSET = 10;
  var RIGHT_PIPE_DRAG_HANDLE_OFFSET = 50;
  var PIPE_INITIAL_HEIGHT = 2.1; //in meters
  var PIPE_SCALE = 0.6;
  var CROSS_SECTION_MIN_HEIGHT = 1; //meters
  var HANDLE_X_TOUCH_EXPAND = 30;

  /*
   * Constructor for PipeHandlesNode
   * @param {FlowModel} flowModel of the simulation
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
    var leftTopControlPointIndex = 0;
    var leftBottomControlPointIndex = numControlPoints - 1;
    var rightTopControlPointIndex = numControlPoints / 2 - 1;
    var rightBottomControlPointIndex = numControlPoints / 2;

    // scaling factors for the right, left pipe nodes.
    this.rightPipeExpansionScale = PIPE_SCALE;
    this.leftPipeExpansionScale = PIPE_SCALE;

    this.controlHandleNodes = [];
    // add handle to drag the left pipe
    this.leftPipeMainHandleNode = new Image( handleImage,
      { y: pipeNode.leftPipeNode.centerY,
        x: layoutBounds.minX - LEFT_PIPE_DRAG_HANDLE_OFFSET,
        cursor: 'pointer',
        scale: 0.32 } );


    var boundsToTouchAreaForLeftAndRightHandles = function( localBounds ) {
      return new Bounds2( localBounds.minX - HANDLE_X_TOUCH_EXPAND, localBounds.minY + 25, localBounds.maxX + HANDLE_X_TOUCH_EXPAND, localBounds.maxY + 60 );
    };

    // touch area for the left pipe drag handle
    this.leftPipeMainHandleNode.touchArea = boundsToTouchAreaForLeftAndRightHandles( this.leftPipeMainHandleNode.localBounds );
    this.addChild( this.leftPipeMainHandleNode );


    // add handle to drag the right pipe
    this.rightPipeMainHandleNode = new Image( handleImage,
      { y: pipeNode.rightPipeNode.centerY,
        x: layoutBounds.maxX - RIGHT_PIPE_DRAG_HANDLE_OFFSET,
        cursor: 'pointer',
        scale: 0.32   } );
    // touch area for the right pipe drag handle
    this.rightPipeMainHandleNode.touchArea = boundsToTouchAreaForLeftAndRightHandles( this.rightPipeMainHandleNode.localBounds );
    this.addChild( this.rightPipeMainHandleNode );

    // add control handles for dragging and scaling using the 4 control points on the left/right pipe
    for ( var i = 0; i < numControlPoints; i++ ) {
      (function( i ) {
        var controlPoint = pipe.controlPoints[ i ];
        var leftSpace = 0; // to vertically align the handles
        var imageRotation = 0;
        if ( pipe.controlPoints[ i ].position.y < -2 ) {
          leftSpace = -13;
        }
        else {
          imageRotation = Math.PI;
          leftSpace = 19;
        }

        var handleNode = new Image( handleImage, { left: leftSpace, cursor: 'pointer', scale: 0.32 } );

        // expand the touch area upwards for the top handles and downwards for bottom handles
        if ( i < rightBottomControlPointIndex ) {
          handleNode.touchArea = new Bounds2( handleNode.localBounds.minX - HANDLE_X_TOUCH_EXPAND, handleNode.localBounds.minY,
              handleNode.localBounds.maxX + HANDLE_X_TOUCH_EXPAND, handleNode.localBounds.maxY + 40 );
        }
        else {
          handleNode.touchArea = new Bounds2( handleNode.localBounds.minX - HANDLE_X_TOUCH_EXPAND, handleNode.localBounds.minY + 30,
              handleNode.localBounds.maxX + HANDLE_X_TOUCH_EXPAND, handleNode.localBounds.maxY + 60 );
        }
        handleNode.setRotation( imageRotation );

        pipeHandlesNode.controlHandleNodes[ i ] = new Node( {children: [handleNode]} );
        controlPoint.positionProperty.link( function( position ) {
          pipeHandlesNode.controlHandleNodes[ i ].setTranslation( modelViewTransform.modelToViewX( position.x ),
            modelViewTransform.modelToViewY( position.y ) );
        } );

        // set the initial position of control point handles on left pipe node and right pipe node.
        switch( i ) {
          case leftBottomControlPointIndex :
            pipeHandlesNode.controlHandleNodes[ leftBottomControlPointIndex ].top = pipeNode.leftPipeNode.bottom -
                                                                                    CONTROL_HANDLE_OFFSET;
            break;
          case rightBottomControlPointIndex :
            pipeHandlesNode.controlHandleNodes[ rightBottomControlPointIndex ].top = pipeNode.rightPipeNode.bottom -
                                                                                     CONTROL_HANDLE_OFFSET;
            break;
          case rightTopControlPointIndex :
            pipeHandlesNode.controlHandleNodes[ rightTopControlPointIndex ].bottom = pipeNode.rightPipeNode.top +
                                                                                     CONTROL_HANDLE_OFFSET;
            break;
          case leftTopControlPointIndex :
            pipeHandlesNode.controlHandleNodes[ leftTopControlPointIndex ].bottom = pipeNode.leftPipeNode.top +
                                                                                    CONTROL_HANDLE_OFFSET;
            break;
        }

        var dragStartY;
        var controlPointDragStartY; // the model y value of the control point at drag start

        pipeHandlesNode.controlHandleNodes[ i ].addInputListener( new SimpleDragHandler(
          {
            start: function( event ) {
              dragStartY = pipeHandlesNode.controlHandleNodes[ i ].globalToParentPoint( event.pointer.point ).y;
              controlPointDragStartY = pipe.controlPoints[ i ].position.y;
            },

            drag: function( event ) {

              var offSetY = pipeHandlesNode.controlHandleNodes[ i ].globalToParentPoint( event.pointer.point ).y -
                            dragStartY;

              // x position is constant for a control point
              var pt = new Vector2( pipe.controlPoints[ i ].position.x,
                  controlPointDragStartY + modelViewTransform.viewToModelDeltaY( offSetY ) );

              // limit the y to (-4,0)
              pt.y = Util.clamp( pt.y, -4, 0 );

              // Prevent the two ends of the cross sections from crossing each other. Set the cross section to
              // minimum when the user tries to move the handle beyond the opposite control point.
              if ( ( i < rightBottomControlPointIndex &&
                     pt.y < pipe.controlPoints[ numControlPoints - ( i + 1 ) ].position.y ) ) {
                pt.y = pipe.controlPoints[ numControlPoints - ( i + 1 ) ].position.y + CROSS_SECTION_MIN_HEIGHT;
              }
              else if ( ( i >= rightBottomControlPointIndex &&
                          pt.y > pipe.controlPoints[ numControlPoints - ( i + 1 ) ].position.y ) ) {
                pt.y = pipe.controlPoints[ numControlPoints - ( i + 1 ) ].position.y - CROSS_SECTION_MIN_HEIGHT;
              }

              var yDiff = Math.abs( ( pipe.controlPoints[ numControlPoints - ( i + 1 ) ].position.y ) - pt.y );

              // ensure that the cross section is at least 1 meter
              if ( yDiff >= CROSS_SECTION_MIN_HEIGHT ) {
                controlPoint.position = pt;
                // When a control point is dragged, mark the pipe as dirty and update the pipe flow line shape
                pipe.dirty = true;
                pipeNode.updatePipeFlowLineShape();
                pipeHandlesNode.gridInjectorNode.updateGridInjector();
              }

              var pipeExpansionFactor;
              // handle the left pipe scaling
              if ( i === leftBottomControlPointIndex || i === leftTopControlPointIndex ) {

                // calculate the pipe scale
                pipeExpansionFactor = ( pipe.getCrossSection( pipe.controlPoints[ leftTopControlPointIndex ].position.x ).getHeight()) /
                                      PIPE_INITIAL_HEIGHT;

                pipeHandlesNode.leftPipeExpansionScale = ( pipeExpansionFactor * PIPE_SCALE );

                // limit the scaling to 0.3
                pipeHandlesNode.leftPipeExpansionScale = pipeHandlesNode.leftPipeExpansionScale < 0.3 ? 0.3 :
                                                         pipeHandlesNode.leftPipeExpansionScale;
                pipeNode.leftPipeNode.setScaleMagnitude( PIPE_SCALE, pipeHandlesNode.leftPipeExpansionScale );
                pipeNode.leftPipeBackNode.setScaleMagnitude( PIPE_SCALE, pipeHandlesNode.leftPipeExpansionScale );

                pipeNode.leftPipeNode.setTranslation( layoutBounds.minX - pipeNode.leftPipeLeftOffset,
                    modelViewTransform.modelToViewY( pipe.controlPoints[ leftTopControlPointIndex ].position.y ) -
                    pipeNode.leftPipeYOffset * pipeHandlesNode.leftPipeExpansionScale );
                pipeNode.leftPipeBackNode.setTranslation( layoutBounds.minX - pipeNode.leftPipeLeftOffset,
                    modelViewTransform.modelToViewY( pipe.controlPoints[ leftTopControlPointIndex ].position.y ) -
                    pipeNode.leftPipeYOffset * pipeHandlesNode.leftPipeExpansionScale );

                pipeHandlesNode.leftPipeMainHandleNode.setTranslation( layoutBounds.minX - 10,
                  pipeNode.leftPipeNode.centerY );
              }

              // handle the right  pipe scaling
              if ( i === rightBottomControlPointIndex || i === (rightTopControlPointIndex) ) {

                pipeExpansionFactor = ( pipe.getCrossSection( pipe.controlPoints[ rightTopControlPointIndex ].position.x ).getHeight() ) /
                                      PIPE_INITIAL_HEIGHT;

                pipeHandlesNode.rightPipeExpansionScale = pipeExpansionFactor * PIPE_SCALE;

                // limit the scaling to 0.3 on the lower side
                pipeHandlesNode.rightPipeExpansionScale = pipeHandlesNode.rightPipeExpansionScale < 0.3 ? 0.3 :
                                                          pipeHandlesNode.rightPipeExpansionScale;
                pipeNode.rightPipeNode.setScaleMagnitude( PIPE_SCALE, pipeHandlesNode.rightPipeExpansionScale );

                pipeNode.rightPipeNode.setTranslation( layoutBounds.maxX - pipeNode.rightPipeLeftOffset,
                    modelViewTransform.modelToViewY( pipe.controlPoints[ rightTopControlPointIndex ].position.y ) -
                    pipeNode.rightPipeYOffset * pipeHandlesNode.rightPipeExpansionScale );

                pipeHandlesNode.rightPipeMainHandleNode.setTranslation( layoutBounds.maxX - 50,
                  pipeNode.rightPipeNode.centerY );

              }
              // reposition the particles when the sim is paused and the handle is dragged
              if ( !flowModel.isPlay ) {
                pipeNode.particlesLayer.step();
              }

              // setting the left/right  pipe top/bottom  control point handle positions when left/right pipe  scale.
              if ( i === leftTopControlPointIndex || i === leftBottomControlPointIndex ) {
                pipeHandlesNode.controlHandleNodes[ leftTopControlPointIndex ].bottom = pipeNode.leftPipeNode.top +
                                                                                        CONTROL_HANDLE_OFFSET;
                pipeHandlesNode.controlHandleNodes[ leftBottomControlPointIndex ].top = pipeNode.leftPipeNode.bottom -
                                                                                        CONTROL_HANDLE_OFFSET;
              }
              else if ( i === rightTopControlPointIndex || i === rightBottomControlPointIndex ) {

                pipeHandlesNode.controlHandleNodes[ rightTopControlPointIndex ].bottom = pipeNode.rightPipeNode.top +
                                                                                         CONTROL_HANDLE_OFFSET;
                pipeHandlesNode.controlHandleNodes[ rightBottomControlPointIndex ].top = pipeNode.rightPipeNode.bottom -
                                                                                         CONTROL_HANDLE_OFFSET;
              }

              // update the flux meter
              flowModel.fluxMeter.trigger( 'update' );

              // update the velocity sensors
              flowModel.speedometers[ 0 ].trigger( 'update' );
              flowModel.speedometers[ 1 ].trigger( 'update' );

              // update the barometers
              flowModel.barometers[ 0 ].trigger( 'update' );
              flowModel.barometers[ 1 ].trigger( 'update' );
            }
          } ) );
        pipeHandlesNode.addChild( pipeHandlesNode.controlHandleNodes[ i ] );
      })( i );
    }

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

              pipeMainDragHandles[ j ].setTranslation( layoutBounds.minX - LEFT_PIPE_DRAG_HANDLE_OFFSET,
                pipeNode.leftPipeNode.centerY );
            }
            else {

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
              pipeMainDragHandles[ j ].setTranslation( layoutBounds.maxX - RIGHT_PIPE_DRAG_HANDLE_OFFSET,
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
      })( j );
    }
  }

  return inherit( Node, PipeHandlesNode, {

    reset: function() {

      // reset the left and right pipe drag handle
      this.leftPipeMainHandleNode.setTranslation( this.layoutBounds.minX - LEFT_PIPE_DRAG_HANDLE_OFFSET,
        this.pipeNode.leftPipeNode.getCenterY() );
      this.rightPipeMainHandleNode.setTranslation( this.layoutBounds.maxX - RIGHT_PIPE_DRAG_HANDLE_OFFSET,
        this.pipeNode.rightPipeNode.getCenterY() );

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
    }
  } );

} );