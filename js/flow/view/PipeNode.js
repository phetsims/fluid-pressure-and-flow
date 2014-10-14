// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * View for the pipe consisting of the flexible middle pipe with handles (for dragging) and left and right pipe ends
 * with handles (for scaling and dragging).
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Shape = require( 'KITE/Shape' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Vector2 = require( 'DOT/Vector2' );
  var ParticleCanvasNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/ParticleCanvasNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Util = require( 'DOT/Util' );

  // images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle-with-bar.png' );
  var leftPipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-left-front.png' );
  var pipeSegmentImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-segment.png' );
  var rightSidePipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-right.png' );
  var leftPipeBackImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-left-back.png' );

  // constants
  var CONTROL_HANDLE_OFFSET = 2; //px
  var PIPE_INITIAL_HEIGHT = 2.1; //meters
  var LINE_COLOR = '#613705';
  var PIPE_SCALE = 0.6;
  var PIPE_SEGMENT_X_SCALE = 100;
  var CROSS_SECTION_MIN_HEIGHT = 1; //meters

  /*
   * Constructor for PipeNode
   * @param {FlowView} flowView of the simulation.
   * @param {FlowModel} flowModel of the simulation.
   * @param {Pipe} pipe model for this pipe node
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @param {Bounds2} layoutBounds of the simulation
   * @constructor
   */
  function PipeNode( flowView, flowModel, pipe, modelViewTransform, layoutBounds ) {

    var pipeNode = this;
    this.flowView = flowView;
    Node.call( this );

    this.flowModel = flowModel;
    this.modelViewTransform = modelViewTransform;
    this.pipe = pipe;
    this.layoutBounds = layoutBounds;

    this.rightPipeExpansionScale = PIPE_SCALE;
    this.leftPipeExpansionScale = PIPE_SCALE;
    this.leftPipeYOffset = 25; // left pipe top offset w.r.t the left top control point
    this.rightPipeYOffset = 25; // right pipe top offset w.r.t the right top control point

    this.groundY = this.modelViewTransform.modelToViewY( 0 );
    this.pipeNodeYOffset = 57; // w.r.t to ground in px

    this.leftPipeRightOffset = 55;
    this.rightPipeLeftOffset = 75;

    //left side pipe image.
    var leftPipeHead = new Image( leftPipeImage, { scale: PIPE_SCALE } );

    var leftPipeSegment = new Image( pipeSegmentImage,
      {
        right: leftPipeHead.left + 20,
        scale: new Vector2( PIPE_SEGMENT_X_SCALE, PIPE_SCALE )
      } );

    this.leftPipeNode = new Node( {
      children: [ leftPipeHead, leftPipeSegment ],
      top: this.groundY + this.pipeNodeYOffset,
      right: layoutBounds.minX + this.leftPipeRightOffset,
      scale: PIPE_SCALE } );

    var leftPipeWidth = leftPipeHead.getImageWidth() * PIPE_SCALE * PIPE_SCALE;

    this.leftPipeLeftOffset = leftPipeWidth - this.leftPipeRightOffset;

    this.leftPipeBackNode = new Node( {
      children: [ new Image( leftPipeBackImage, { scale: PIPE_SCALE } ) ],
      top: this.groundY + this.pipeNodeYOffset,
      right: layoutBounds.minX + this.leftPipeRightOffset,
      scale: PIPE_SCALE } );

    // shape for the pipelines
    this.pipeFlowLine = new Path( null, { stroke: LINE_COLOR, lineWidth: '6' } );

    // shape for fluid
    this.pipeFluidNode = new Path( null,
      { stroke: LINE_COLOR, lineWidth: '0', fill: flowModel.fluidColorModel.color } );

    // Skip bounds computation to improve performance, see energy-skate-park-basics#245
    // Qualitative tests did not show a significant improvement
    var emptyBounds = new Bounds2( 0, 0, 0, 0 );
    this.pipeFluidNode.computeShapeBounds = function() {
      return emptyBounds;
    };

    // right side pipe image.
    var rightPipeHead = new Image( rightSidePipeImage, { scale: PIPE_SCALE } );
    var rightPipeMiddle = new Image( pipeSegmentImage,
      { left: rightPipeHead.right - 30, scale: new Vector2( PIPE_SEGMENT_X_SCALE, PIPE_SCALE ) } );

    this.rightPipeNode = new Node( {
      children: [ rightPipeHead, rightPipeMiddle ],
      bottom: this.leftPipeNode.bottom,
      left: layoutBounds.maxX - pipeNode.rightPipeLeftOffset,
      scale: PIPE_SCALE } );

    // order of different layers within pipe Node -- leftPipeBackNode, pipeFluidNode, preParticleLayer, pipeFlowLine,
    // leftPipeNode and rightPipeNode
    this.addChild( this.leftPipeBackNode );
    this.addChild( this.pipeFluidNode );

    this.preParticleLayer = new Node();
    this.addChild( this.preParticleLayer );

    this.particlesLayer = new ParticleCanvasNode( flowModel.flowParticles, flowModel.gridParticles, modelViewTransform,
      { canvasBounds: new Bounds2( 20, 80, 800, 600 )
      } );
    this.addChild( this.particlesLayer );
    this.addChild( this.pipeFlowLine );

    this.addChild( this.rightPipeNode );
    this.addChild( this.leftPipeNode );

    flowModel.fluidColorModel.colorProperty.linkAttribute( pipeNode.pipeFluidNode, 'fill' );

    this.controlHandleNodes = []; // control point drag handles
    var numControlPoints = pipe.controlPoints.length;
    var leftTopControlPointIndex = 0;
    var leftBottomControlPointIndex = numControlPoints - 1;
    var rightTopControlPointIndex = numControlPoints / 2 - 1;
    var rightBottomControlPointIndex = numControlPoints / 2;

    // add control handles for dragging and scaling using the 4 control points on the left/right pipe
    for ( var i = 0; i < numControlPoints; i++ ) {
      (function( i ) {
        var controlPoint = pipe.controlPoints[ i ];
        var leftSpace = 0; // to vertically align the handles
        var imageRotation = 0;
        if ( pipe.controlPoints[ i ].position.y < -2 ) {
          leftSpace = -15;
        }
        else {
          imageRotation = Math.PI;
          leftSpace = 17;
        }

        var handleNode = new Image( handleImage, { left: leftSpace, cursor: 'pointer', scale: 0.32 } );

        // expand the touch area upwards for the top handles and downwards for bottom handles
        if ( i < rightBottomControlPointIndex ) {
          handleNode.touchArea = new Bounds2( handleNode.localBounds.minX - 30, handleNode.localBounds.minY,
              handleNode.localBounds.maxX + 30, handleNode.localBounds.maxY + 40 );
        }
        else {
          handleNode.touchArea = new Bounds2( handleNode.localBounds.minX - 30, handleNode.localBounds.minY + 30,
              handleNode.localBounds.maxX + 30, handleNode.localBounds.maxY + 60 );
        }
        handleNode.setRotation( imageRotation );

        pipeNode.controlHandleNodes[ i ] = new Node( { children: [ handleNode ] } );
        controlPoint.positionProperty.link( function( position ) {
          pipeNode.controlHandleNodes[ i ].setTranslation( modelViewTransform.modelToViewX( position.x ),
            modelViewTransform.modelToViewY( position.y ) );
        } );

        // set the initial position of control point handles on left pipe node and right pipe node.
        switch( i ) {
          case leftBottomControlPointIndex :
            pipeNode.controlHandleNodes[ leftBottomControlPointIndex ].top = pipeNode.leftPipeNode.bottom -
                                                                             CONTROL_HANDLE_OFFSET;
            break;
          case rightBottomControlPointIndex :
            pipeNode.controlHandleNodes[ rightBottomControlPointIndex ].top = pipeNode.rightPipeNode.bottom -
                                                                              CONTROL_HANDLE_OFFSET;
            break;
          case rightTopControlPointIndex :
            pipeNode.controlHandleNodes[ rightTopControlPointIndex ].bottom = pipeNode.rightPipeNode.top +
                                                                              CONTROL_HANDLE_OFFSET;
            break;
          case leftTopControlPointIndex :
            pipeNode.controlHandleNodes[ leftTopControlPointIndex ].bottom = pipeNode.leftPipeNode.top +
                                                                             CONTROL_HANDLE_OFFSET;
            break;
        }

        var dragStartY;
        var controlPointDragStartY; // the model y value of the control point at drag start

        pipeNode.controlHandleNodes[ i ].addInputListener( new SimpleDragHandler(
          {
            start: function( event ) {
              dragStartY = pipeNode.controlHandleNodes[ i ].globalToParentPoint( event.pointer.point ).y;
              controlPointDragStartY = pipe.controlPoints[ i ].position.y;
            },

            drag: function( event ) {

              var offSetY = pipeNode.controlHandleNodes[ i ].globalToParentPoint( event.pointer.point ).y - dragStartY;

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
                flowView.gridInjectorNode.updateGridInjector();
              }

              var pipeExpansionFactor;
              // handle the left pipe scaling
              if ( i === leftBottomControlPointIndex || i === leftTopControlPointIndex ) {

                // calculate the pipe scale
                pipeExpansionFactor = ( pipe.getCrossSection( pipe.controlPoints[ leftTopControlPointIndex ].position.x ).getHeight()) /
                                      PIPE_INITIAL_HEIGHT;

                pipeNode.leftPipeExpansionScale = ( pipeExpansionFactor * PIPE_SCALE );

                // limit the scaling to 0.3
                pipeNode.leftPipeExpansionScale = pipeNode.leftPipeExpansionScale < 0.3 ? 0.3 :
                                                  pipeNode.leftPipeExpansionScale;
                pipeNode.leftPipeNode.setScaleMagnitude( PIPE_SCALE, pipeNode.leftPipeExpansionScale );
                pipeNode.leftPipeBackNode.setScaleMagnitude( PIPE_SCALE, pipeNode.leftPipeExpansionScale );

                pipeNode.leftPipeNode.setTranslation( layoutBounds.minX - pipeNode.leftPipeLeftOffset,
                    modelViewTransform.modelToViewY( pipe.controlPoints[ leftTopControlPointIndex ].position.y ) -
                    pipeNode.leftPipeYOffset * pipeNode.leftPipeExpansionScale );
                pipeNode.leftPipeBackNode.setTranslation( layoutBounds.minX - pipeNode.leftPipeLeftOffset,
                    modelViewTransform.modelToViewY( pipe.controlPoints[ leftTopControlPointIndex ].position.y ) -
                    pipeNode.leftPipeYOffset * pipeNode.leftPipeExpansionScale );

                flowView.pipeNodeDragHandle.leftPipeMainHandleNode.setTranslation(
                    pipeNode.layoutBounds.minX - 10, pipeNode.leftPipeNode.centerY );
              }

              // handle the right  pipe scaling
              if ( i === rightBottomControlPointIndex || i === (rightTopControlPointIndex) ) {

                pipeExpansionFactor = ( pipe.getCrossSection( pipe.controlPoints[ rightTopControlPointIndex ].position.x ).getHeight() ) /
                                      PIPE_INITIAL_HEIGHT;

                pipeNode.rightPipeExpansionScale = ( pipeExpansionFactor * PIPE_SCALE );

                // limit the scaling to 0.3 on the lower side
                pipeNode.rightPipeExpansionScale = pipeNode.rightPipeExpansionScale < 0.3 ? 0.3 :
                                                   pipeNode.rightPipeExpansionScale;
                pipeNode.rightPipeNode.setScaleMagnitude( PIPE_SCALE, pipeNode.rightPipeExpansionScale );

                pipeNode.rightPipeNode.setTranslation( layoutBounds.maxX - pipeNode.rightPipeLeftOffset,
                    modelViewTransform.modelToViewY( pipe.controlPoints[ rightTopControlPointIndex ].position.y ) -
                    pipeNode.rightPipeYOffset * pipeNode.rightPipeExpansionScale );

                flowView.pipeNodeDragHandle.rightPipeMainHandleNode.setTranslation( layoutBounds.maxX - 50,
                  pipeNode.rightPipeNode.centerY );

              }
              // reposition the particles when the sim is paused and the handle is dragged
              if ( !flowModel.isPlay ) {
                pipeNode.particlesLayer.step();
              }

              // setting the left/right  pipe top/bottom  control point handle positions when left/right pipe  scale.
              if ( i === leftTopControlPointIndex || i === leftBottomControlPointIndex ) {
                pipeNode.controlHandleNodes[ leftTopControlPointIndex ].bottom = pipeNode.leftPipeNode.top +
                                                                                 CONTROL_HANDLE_OFFSET;
                pipeNode.controlHandleNodes[ leftBottomControlPointIndex ].top = pipeNode.leftPipeNode.bottom -
                                                                                 CONTROL_HANDLE_OFFSET;
              }
              else if ( i === rightTopControlPointIndex || i === rightBottomControlPointIndex ) {

                pipeNode.controlHandleNodes[ rightTopControlPointIndex ].bottom = pipeNode.rightPipeNode.top +
                                                                                  CONTROL_HANDLE_OFFSET;
                pipeNode.controlHandleNodes[ rightBottomControlPointIndex ].top = pipeNode.rightPipeNode.bottom -
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
        pipeNode.addChild( pipeNode.controlHandleNodes[ i ] );
      })( i );
    }
    // init the PipeFlow Line shape
    this.updatePipeFlowLineShape();
  }

  return inherit( Node, PipeNode,
    {
      // update the pipe flow line shape (the flexible middle pipe)
      // @private
      updatePipeFlowLineShape: function() {

        // getting cross sections
        var splineCrossSections = this.pipe.getSplineCrossSections();

        var xPointsBottom = new Array( splineCrossSections.length );
        var yPointsBottom = new Array( splineCrossSections.length );
        var xPointsTop = new Array( splineCrossSections.length );
        var yPointsTop = new Array( splineCrossSections.length );

        //  points for lineTo
        for ( var l = 0; l < splineCrossSections.length; l++ ) {
          xPointsBottom[l] = splineCrossSections[l].x;
          yPointsBottom[l] = splineCrossSections[l].yBottom;
          xPointsTop[l] = splineCrossSections[l].x;
          yPointsTop[l] = splineCrossSections[l].yTop;
        }

        var flowLineShape = new Shape().moveTo( this.modelViewTransform.modelToViewX( xPointsBottom[ 0 ] ),
          this.modelViewTransform.modelToViewY( yPointsBottom[ 0 ] ) );

        var minXOfPipeFlowLineShape = -6.7; // model value
        var maxXOfPipeFlowLineShape = 6.8;
        var i;
        for ( i = 1; i < xPointsBottom.length; i = i + 1 ) {
          // Spline points beyond the last pipe cross section are not needed.
          if ( xPointsBottom[ i ] < maxXOfPipeFlowLineShape && xPointsBottom[ i ] > minXOfPipeFlowLineShape ) {
            flowLineShape.lineTo( this.modelViewTransform.modelToViewX( xPointsBottom[ i ] ),
              this.modelViewTransform.modelToViewY( yPointsBottom[ i ] ) );
          }
        }

        for ( i = xPointsTop.length; i > 0; i = i - 1 ) {
          // Spline points beyond the last pipe cross section are not needed.
          if ( xPointsBottom[ i ] < maxXOfPipeFlowLineShape && xPointsBottom[ i ] > minXOfPipeFlowLineShape ) {
            flowLineShape.lineTo( this.modelViewTransform.modelToViewX( xPointsTop[ i ] ),
              this.modelViewTransform.modelToViewY( yPointsTop[ i ] ) );
          }
        }
        this.pipeFlowLine.shape = flowLineShape;

        // make a copy of the line shape for the fluid node
        this.pipeFluidNode.shape = flowLineShape.copy();

      },

      reset: function() {

        // reset the left and right pipe position and scale
        this.leftPipeNode.setMatrix( Matrix3.translation( this.layoutBounds.minX - this.leftPipeLeftOffset,
            this.groundY + this.pipeNodeYOffset ) );
        this.leftPipeNode.scale( PIPE_SCALE );
        this.leftPipeBackNode.setMatrix( Matrix3.translation( this.layoutBounds.minX - this.leftPipeLeftOffset,
            this.groundY + this.pipeNodeYOffset ) );
        this.leftPipeBackNode.scale( PIPE_SCALE );
        this.rightPipeNode.setMatrix( Matrix3.translation( this.layoutBounds.maxX - this.rightPipeLeftOffset,
            this.groundY + this.pipeNodeYOffset ) );
        this.rightPipeNode.scale( PIPE_SCALE );

        // mark pipe as dirty for getting new spline cross sections
        this.pipe.dirty = true;
        this.updatePipeFlowLineShape();
        this.flowModel.fluxMeter.trigger( 'update' );

        // reset the handle positions
        var numControlPoints = this.pipe.controlPoints.length;
        this.controlHandleNodes[ numControlPoints / 2 - 1 ].bottom = this.rightPipeNode.top + CONTROL_HANDLE_OFFSET;
        this.controlHandleNodes[ numControlPoints / 2 ].top = this.rightPipeNode.bottom - CONTROL_HANDLE_OFFSET;
        this.controlHandleNodes[ 0 ].bottom = this.leftPipeNode.top + CONTROL_HANDLE_OFFSET;
        this.controlHandleNodes[ numControlPoints - 1 ].top = this.leftPipeNode.bottom - CONTROL_HANDLE_OFFSET;

        this.rightPipeExpansionScale = PIPE_SCALE;
        this.leftPipeExpansionScale = PIPE_SCALE;
      }
    } );
} );