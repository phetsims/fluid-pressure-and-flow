// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * View for a single handle on the flexible middle pipe and the pipe head rims.
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
  var PIPE_INITIAL_HEIGHT = 2.1; //in meters
  var PIPE_INITIAL_SCALE = 0.36;
  var CROSS_SECTION_MIN_HEIGHT = 1; //meters
  var HANDLE_X_TOUCH_EXPAND = 30;

  /**
   * @param {PipeHandlesNode} pipeHandlesNode
   * @param {Number} controlPointIndex
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @param {Bounds2} layoutBounds of the simulation
   * @constructor
   */
  function PipeHandleNode( pipeHandlesNode, controlPointIndex, modelViewTransform, layoutBounds ) {

    Node.call( this );
    var flowModel = pipeHandlesNode.flowModel;
    var pipeNode = pipeHandlesNode.pipeNode;

    var pipe = flowModel.pipe;

    var numControlPoints = pipe.controlPoints.length;
    var leftTopControlPointIndex = 0;
    var leftBottomControlPointIndex = numControlPoints - 1;
    var rightTopControlPointIndex = numControlPoints / 2 - 1;
    var rightBottomControlPointIndex = numControlPoints / 2;

    var controlPoint = pipe.controlPoints[controlPointIndex ];
    var leftSpace = 0; // to vertically align the handles
    var imageRotation = 0;
    if ( controlPoint.position.y < -2 ) {
      leftSpace = -13;
    }
    else {
      imageRotation = Math.PI;
      leftSpace = 19;
    }
    var handleNode = new Image( handleImage, { left: leftSpace, cursor: 'pointer', scale: 0.32 } );

    // expand the touch area upwards for the top handles and downwards for bottom handles
    if ( controlPointIndex < rightBottomControlPointIndex ) {
      handleNode.touchArea = new Bounds2( handleNode.localBounds.minX - HANDLE_X_TOUCH_EXPAND,
        handleNode.localBounds.minY,
          handleNode.localBounds.maxX + HANDLE_X_TOUCH_EXPAND, handleNode.localBounds.maxY + 40 );
    }
    else {
      handleNode.touchArea = new Bounds2( handleNode.localBounds.minX - HANDLE_X_TOUCH_EXPAND,
          handleNode.localBounds.minY + 30,
          handleNode.localBounds.maxX + HANDLE_X_TOUCH_EXPAND, handleNode.localBounds.maxY + 60 );
    }
    handleNode.setRotation( imageRotation );

    // handleNode is in charge of performing the rotation for the top control handles, whereas
    // the parent node controlHandleNode is in change of doing the translations
    var controlHandleNode = new Node( { children: [ handleNode ] } );
    this.addChild( controlHandleNode );

    controlPoint.positionProperty.link( function( position ) {
      controlHandleNode.setTranslation( modelViewTransform.modelToViewX( position.x ),
        modelViewTransform.modelToViewY( position.y ) );
    } );

    // set the initial position of control point handles on left pipe node and right pipe node.
    switch( controlPointIndex ) {
      case leftBottomControlPointIndex :
        controlHandleNode.top = pipeNode.leftPipeNode.bottom - CONTROL_HANDLE_OFFSET;
        break;
      case rightBottomControlPointIndex :
        controlHandleNode.top = pipeNode.rightPipeNode.bottom - CONTROL_HANDLE_OFFSET;
        break;
      case rightTopControlPointIndex :
        controlHandleNode.bottom = pipeNode.rightPipeNode.top + CONTROL_HANDLE_OFFSET;
        break;
      case leftTopControlPointIndex :
        controlHandleNode.bottom = pipeNode.leftPipeNode.top + CONTROL_HANDLE_OFFSET;
        break;
    }

    var dragStartY;
    var controlPointDragStartY; // the model y value of the control point at drag start
    controlHandleNode.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          dragStartY = controlHandleNode.globalToParentPoint( event.pointer.point ).y;
          controlPointDragStartY = controlPoint.position.y;
        },

        drag: function( event ) {
          var offSetY = controlHandleNode.globalToParentPoint( event.pointer.point ).y - dragStartY;

          // x position is constant for a control point
          var pt = new Vector2( controlPoint.position.x,
              controlPointDragStartY + modelViewTransform.viewToModelDeltaY( offSetY ) );

          // limit the y to (-4,0)
          pt.y = Util.clamp( pt.y, -4, 0 );

          // Prevent the two ends of the cross sections from crossing each other. Set the cross section to
          // minimum when the user tries to move the handle beyond the opposite control point.
          var oppositeControlPoint = pipe.controlPoints[ numControlPoints - (controlPointIndex + 1 ) ];
          if ( (controlPointIndex < rightBottomControlPointIndex && pt.y < oppositeControlPoint.position.y ) ) {
            pt.y = oppositeControlPoint.position.y + CROSS_SECTION_MIN_HEIGHT;
          }
          else if ( (controlPointIndex >= rightBottomControlPointIndex && pt.y > oppositeControlPoint.position.y ) ) {
            pt.y = oppositeControlPoint.position.y - CROSS_SECTION_MIN_HEIGHT;
          }

          // ensure that the cross section is at least 1 meter
          var yDiff = Math.abs( ( oppositeControlPoint.position.y ) - pt.y );
          if ( yDiff >= CROSS_SECTION_MIN_HEIGHT ) {
            controlPoint.position = pt;
            // When a control point is dragged, mark the pipe as dirty and update the pipe flow line shape
            pipe.dirty = true;
            pipeNode.updatePipeFlowLineShape();
            pipeHandlesNode.gridInjectorNode.updateGridInjector();
          }

          var pipeExpansionFactor;
          // handle the left pipe scaling
          if ( controlPointIndex === leftBottomControlPointIndex || controlPointIndex === leftTopControlPointIndex ) {

            // calculate the pipe scale
            pipeExpansionFactor = ( pipe.getCrossSection( pipe.controlPoints[ leftTopControlPointIndex ].position.x ).getHeight()) /
                                  PIPE_INITIAL_HEIGHT;


            // limit the scaling to 0.18 on the lower side
            pipe.leftPipeScale = Math.max( pipeExpansionFactor * PIPE_INITIAL_SCALE, 0.18 );


            var leftPipeY = modelViewTransform.modelToViewY( pipe.controlPoints[ leftTopControlPointIndex ].position.y ) -
                            pipeNode.leftPipeYOffset * pipe.leftPipeScale;

            pipe.leftPipePosition = new Vector2( layoutBounds.minX - pipeNode.leftPipeLeftOffset, leftPipeY );
            flowModel.pipe.leftPipeMainHandleYPosition = pipeNode.leftPipeNode.centerY;
          }

          // handle the right  pipe scaling
          if ( controlPointIndex === rightBottomControlPointIndex || controlPointIndex === rightTopControlPointIndex ) {

            var pipeHeight = pipe.getCrossSection( pipe.controlPoints[ rightTopControlPointIndex ].position.x ).getHeight();
            pipeExpansionFactor = pipeHeight / PIPE_INITIAL_HEIGHT;

            // limit the scaling to 0.18 on the lower side
            pipe.rightPipeScale = Math.max( pipeExpansionFactor * PIPE_INITIAL_SCALE, 0.18 );

            var rightPipeY = modelViewTransform.modelToViewY( pipe.controlPoints[ rightTopControlPointIndex ].position.y ) -
                             ( pipeNode.rightPipeYOffset * pipe.rightPipeScale );
            var rightPipeX = layoutBounds.maxX - pipeNode.rightPipeLeftOffset;

            pipe.rightPipePosition = new Vector2( rightPipeX, rightPipeY );
            flowModel.pipe.rightPipeMainHandleYPosition = pipeNode.rightPipeNode.centerY;
          }

          // reposition the particles when the sim is paused and the handle is dragged
          if ( !flowModel.isPlay ) {
            pipeNode.particlesLayer.step();
          }

          // setting the left/right  pipe top/bottom  control point handle positions when left/right pipe  scale.
          if ( controlPointIndex === leftTopControlPointIndex || controlPointIndex === leftBottomControlPointIndex ) {
            pipeHandlesNode.controlHandleNodes[ leftTopControlPointIndex ].bottom = pipeNode.leftPipeNode.top +
                                                                                    CONTROL_HANDLE_OFFSET;
            pipeHandlesNode.controlHandleNodes[ leftBottomControlPointIndex ].top = pipeNode.leftPipeNode.bottom -
                                                                                    CONTROL_HANDLE_OFFSET;
          }
          else if ( controlPointIndex === rightTopControlPointIndex ||
                    controlPointIndex === rightBottomControlPointIndex ) {

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
  }

  return inherit( Node, PipeHandleNode );
} );