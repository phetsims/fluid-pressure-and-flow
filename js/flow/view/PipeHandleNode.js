// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for a single handle on the flexible middle pipe and the pipe head rims.
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
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle-with-bar.png' );

  // constants
  var CONTROL_HANDLE_OFFSET = 2;
  var PIPE_INITIAL_HEIGHT = 2.1; //in meters
  var PIPE_INITIAL_SCALE = 0.36;
  var CROSS_SECTION_MIN_HEIGHT = 1; //meters
  var HANDLE_TOUCH_AREA_X_DILATION = 30;

  /**
   * @param {PipeHandlesNode} pipeHandlesNode
   * @param {boolean} isTop indicates whether this handle is on top or bottom of the pipe flow line
   * @param {number} controlPointIndex
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @constructor
   */
  function PipeHandleNode( pipeHandlesNode, isTop, controlPointIndex, modelViewTransform ) {

    Node.call( this );
    var flowModel = pipeHandlesNode.flowModel;
    var pipeNode = pipeHandlesNode.pipeNode;

    var pipe = flowModel.pipe;

    var leftTopControlPointIndex = 1;
    var leftBottomControlPointIndex = 1;
    var rightTopControlPointIndex = pipe.top.length - 2;
    var rightBottomControlPointIndex = pipe.bottom.length - 2;

    var controlPoint = (isTop) ? pipe.top[ controlPointIndex ] : pipe.bottom[ controlPointIndex ];

    var leftSpace = 0; // to vertically align the handles
    var imageRotation = 0;
    if ( controlPoint.positionProperty.value.y < -2 ) {
      leftSpace = -13;
    }
    else {
      imageRotation = Math.PI;
      leftSpace = 19;
    }
    var handleNode = new Image( handleImage, { left: leftSpace, cursor: 'pointer', scale: 0.32 } );

    // expand the touch area upwards for the top handles and downwards for bottom handles
    if ( isTop ) {
      handleNode.touchArea = new Bounds2( handleNode.localBounds.minX - HANDLE_TOUCH_AREA_X_DILATION,
        handleNode.localBounds.minY,
        handleNode.localBounds.maxX + HANDLE_TOUCH_AREA_X_DILATION, handleNode.localBounds.maxY + 40 );
    }
    else {
      handleNode.touchArea = new Bounds2( handleNode.localBounds.minX - HANDLE_TOUCH_AREA_X_DILATION,
        handleNode.localBounds.minY + 30,
        handleNode.localBounds.maxX + HANDLE_TOUCH_AREA_X_DILATION, handleNode.localBounds.maxY + 60 );
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

    var dragStartY;
    var controlPointDragStartY; // the model y value of the control point at drag start
    controlHandleNode.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          dragStartY = controlHandleNode.globalToParentPoint( event.pointer.point ).y;
          controlPointDragStartY = controlPoint.positionProperty.value.y;
        },

        drag: function( event ) {
          var offSetY = controlHandleNode.globalToParentPoint( event.pointer.point ).y - dragStartY;

          // x position is constant for a control point
          var pt = new Vector2( controlPoint.positionProperty.value.x,
            controlPointDragStartY + modelViewTransform.viewToModelDeltaY( offSetY ) );

          // limit the y to (-4,0)
          pt.y = Util.clamp( pt.y, -4, 0 );

          // Prevent the two ends of the cross sections from crossing each other. Set the cross section to
          // minimum when the user tries to move the handle beyond the opposite control point.
          var oppositeControlPoint = (isTop) ? pipe.bottom[ controlPointIndex ] : pipe.top[ controlPointIndex ];
          if ( (isTop && pt.y < oppositeControlPoint.positionProperty.value.y ) ) {
            pt.y = oppositeControlPoint.positionProperty.value.y + CROSS_SECTION_MIN_HEIGHT;
          }
          else if ( (!isTop && pt.y > oppositeControlPoint.positionProperty.value.y ) ) {
            pt.y = oppositeControlPoint.positionProperty.value.y - CROSS_SECTION_MIN_HEIGHT;
          }

          // ensure that the cross section is at least 1 meter
          var yDiff = Math.abs( ( oppositeControlPoint.positionProperty.value.y ) - pt.y );
          if ( yDiff >= CROSS_SECTION_MIN_HEIGHT ) {
            controlPoint.positionProperty.value = pt;
            // When a control point is dragged, mark the pipe as dirty and update the pipe flow line shape
            pipe.dirty = true;
            pipeNode.updatePipeFlowLineShape();
            pipeHandlesNode.gridInjectorNode.updateGridInjector();
          }

          var pipeExpansionFactor;
          // handle the left pipe scaling
          if ( (controlPointIndex === leftBottomControlPointIndex && !isTop) ||
               (controlPointIndex === leftTopControlPointIndex && isTop) ) {

            // calculate the pipe scale
            pipeExpansionFactor = ( pipe.getCrossSection( pipe.top[ leftTopControlPointIndex ].positionProperty.value.x ).getHeight()) /
                                  PIPE_INITIAL_HEIGHT;

            // limit the scaling to 0.18 on the lower side
            pipe.leftPipeScaleProperty.value = Math.max( pipeExpansionFactor * PIPE_INITIAL_SCALE, 0.18 );

            pipe.leftPipeYPositionProperty.value = modelViewTransform.modelToViewY( pipe.top[ leftTopControlPointIndex ].positionProperty.value.y ) -
                                                   pipeNode.leftPipeYOffset * pipe.leftPipeScaleProperty.value;


            flowModel.pipe.leftPipeMainHandleYPositionProperty.value = pipeNode.leftPipeNode.centerY;
          }

          // handle the right  pipe scaling
          if ( (controlPointIndex === rightBottomControlPointIndex && !isTop) ||
               (controlPointIndex === rightTopControlPointIndex && isTop) ) {

            var pipeHeight = pipe.getCrossSection( pipe.top[ rightTopControlPointIndex ].positionProperty.value.x ).getHeight();
            pipeExpansionFactor = pipeHeight / PIPE_INITIAL_HEIGHT;

            // limit the scaling to 0.18 on the lower side
            pipe.rightPipeScaleProperty.value = Math.max( pipeExpansionFactor * PIPE_INITIAL_SCALE, 0.18 );

            pipe.rightPipeYPositionProperty.value = modelViewTransform.modelToViewY( pipe.top[ rightTopControlPointIndex ].positionProperty.value.y ) -
                                                    ( pipeNode.rightPipeYOffset * pipe.rightPipeScaleProperty.value );

            flowModel.pipe.rightPipeMainHandleYPositionProperty.value = pipeNode.rightPipeNode.centerY;
          }

          // reposition the particles when the sim is paused and the handle is dragged
          if ( !flowModel.isPlayingProperty.value ) {
            pipeNode.particlesLayer.step();
          }

          // setting the left/right  pipe top/bottom  control point handle positions when left/right pipe  scale.
          if ( controlPointIndex === leftTopControlPointIndex || controlPointIndex === leftBottomControlPointIndex ) {

            pipe.leftPipeTopHandleYProperty.value = pipeNode.leftPipeNode.top + CONTROL_HANDLE_OFFSET;
            pipe.leftPipeBottomHandleYProperty.value = pipeNode.leftPipeNode.bottom - CONTROL_HANDLE_OFFSET;
          }
          else if ( controlPointIndex === rightTopControlPointIndex ||
                    controlPointIndex === rightBottomControlPointIndex ) {
            pipe.rightPipeTopHandleYProperty.value = pipeNode.rightPipeNode.top + CONTROL_HANDLE_OFFSET;
            pipe.rightPipeBottomHandleYProperty.value = pipeNode.rightPipeNode.bottom - CONTROL_HANDLE_OFFSET;
          }
          // trigger an update on the flux meter only if it is visible
          if ( flowModel.isFluxMeterVisibleProperty.value ) {
            flowModel.fluxMeter.trigger( 'update' );
          }

          flowModel.speedometers.forEach( function( speedometer ) {
            speedometer.updateEmitter.emit();
          } );

          // update the barometers
          flowModel.barometers.forEach( function( barometer ) {
            barometer.updateEmitter.emit();
          } );
        }
      } ) );
  }

  fluidPressureAndFlow.register( 'PipeHandleNode', PipeHandleNode );

  return inherit( Node, PipeHandleNode );
} );