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
  var GridInjectorNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/GridInjectorNode' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle-with-bar.png' );
  var leftPipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-left-front.png' );
  var pipeSegmentImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-segment.png' );
  var rightSidePipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-right.png' );
  var leftPipeBackImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-left-back.png' );

  /*
   * Constructor for PipeNode
   * @param {FlowModel} flowModel of the simulation.
   * @param {Pipe} pipe model for this pipe node
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @param {Bounds2} layoutBounds of the simulation
   * @param {Object} [options] that can be passed on to the underlying node
   * @constructor
   */
  function PipeNode( flowModel, pipe, modelViewTransform, layoutBounds, options ) {

    var pipeNode = this;
    Node.call( this );
    options = _.extend( {
      lineColor: '#613705',
      pipeScale: 0.6
    }, options );

    this.flowModel = flowModel;
    this.modelViewTransform = modelViewTransform;
    this.pipe = pipe;
    this.layoutBounds = layoutBounds;

    // y offset of left pipe main drag handle with top/bottom control points
    this.yDiffFromLeftPipeDrageHandleToLeftTopControlPoint = 1.05; // model value, 1m
    this.yDiffFromLeftPipeDrageHandleToLeftBottomControlPoint = 1.05;

    // y offset of right  pipe main drag handle with top/bottom control points
    this.yDiffFromRightPipeDrageHandleToRightTopControlPoint = 1.05; // model value, 1m
    this.yDiffFromRightPipeDrageHandleToRightBottomControlPoint = 1.05;

    this.groundY = this.modelViewTransform.modelToViewY( 0 );
    this.pipeNodeYOffset = 57; // w.r.t to ground in px

    this.leftPipeXOffest = 50;
    this.rightPipeXOffest = 75;
    this.gridInjectorNodeXOffset = 60;
    this.gridInjectorNodeYOffset = 150;
    this.gridInjectorX = -6; // model value

    var PIPE_INITIAL_HEIGHT = 2.1; //in meters
    var middlePipeInset = 20;
    var numberOfPipeSegments = 100;

    //left side pipe image.
    var leftPipe = new Image( leftPipeImage, { scale: options.pipeScale } );
    var leftPipeMiddle = [];
    this.leftPipeBackNode = new Node( { children: [ new Image( leftPipeBackImage, { scale: options.pipeScale } ) ], top: this.groundY + this.pipeNodeYOffset, left: layoutBounds.minX - pipeNode.leftPipeXOffest, scale: options.pipeScale } );

    leftPipeMiddle[ 0 ] = new Image( pipeSegmentImage, { right: leftPipe.left + middlePipeInset, scale: options.pipeScale} );
    // extend the left pipe by repeating the pipe segment image
    for ( var j = 1; j < numberOfPipeSegments; j++ ) {
      leftPipeMiddle[ j ] = new Image( pipeSegmentImage, { right: leftPipeMiddle[ j - 1 ].left + 1, scale: options.pipeScale } );
    }
    this.leftPipeNode = new Node( { children: [ leftPipe ], top: this.groundY + this.pipeNodeYOffset, left: layoutBounds.minX - pipeNode.leftPipeXOffest, scale: options.pipeScale } );
    for ( j = 0; j < numberOfPipeSegments; j++ ) {
      this.leftPipeNode.addChild( leftPipeMiddle[ j ] );
    }

    // shape for the pipelines
    this.pipeFlowLine = new Path( null, { stroke: options.lineColor, lineWidth: '6' } );

    // shape for fluid
    this.pipeFluidNode = new Path( null, { stroke: options.lineColor, lineWidth: '0', fill: flowModel.fluidColorModel.color } );

    // right side pipe image.
    var rightPipe = new Image( rightSidePipeImage, { scale: options.pipeScale } );
    var rightPipeMiddle = [];
    rightPipeMiddle[ 0 ] = new Image( pipeSegmentImage, { right: rightPipe.right - 1, scale: options.pipeScale } );
    // extend the right pipe by repeating the pipe segment image
    for ( j = 1; j < numberOfPipeSegments; j++ ) {
      rightPipeMiddle[ j ] = new Image( pipeSegmentImage, { left: rightPipeMiddle[ j - 1 ].right - 1, scale: options.pipeScale } );
    }
    this.rightPipeNode = new Node( { children: [ rightPipe ], bottom: this.leftPipeNode.bottom, left: layoutBounds.maxX - pipeNode.rightPipeXOffest, scale: options.pipeScale } );
    for ( j = 0; j < numberOfPipeSegments; j++ ) {
      this.rightPipeNode.addChild( rightPipeMiddle[ j ] );
    }

    // Injector which generates grid particles
    this.gridInjectorNode = new GridInjectorNode( flowModel );
    this.addChild( this.gridInjectorNode );

    this.gridInjectorNode.setTranslation( modelViewTransform.modelToViewX( pipeNode.gridInjectorX ) - pipeNode.gridInjectorNodeXOffset, modelViewTransform.modelToViewY( this.pipe.getCrossSection( pipeNode.gridInjectorX ).yTop ) - pipeNode.gridInjectorNodeYOffset );

    // order of different layers within pipe Node -- leftPipeBackNode, pipeFluidNode, preParticleLayer, pipeFlowLine,
    // leftPipeNode and rightPipeNode
    this.addChild( this.leftPipeBackNode );
    this.addChild( this.pipeFluidNode );

    this.preParticleLayer = new Node();
    this.addChild( this.preParticleLayer );

    this.particlesLayer = new ParticleCanvasNode( flowModel.flowParticles, flowModel.gridParticles, modelViewTransform, {
      canvasBounds: new Bounds2( 20, 80, 800, 600 )
    } );
    this.addChild( this.particlesLayer );
    this.addChild( this.pipeFlowLine );


    this.addChild( this.rightPipeNode );
    this.addChild( this.leftPipeNode );

    // add handle to drag the left pipe
    this.leftPipeMainHandleNode = new Image( handleImage, { y: this.leftPipeNode.centerY, x: pipeNode.layoutBounds.minX - 10, cursor: 'pointer', scale: 0.32 } );
    // touch area for the left pipe drag handle
    this.leftPipeMainHandleNode.touchArea = new Bounds2( this.leftPipeMainHandleNode.localBounds.minX - 20, this.leftPipeMainHandleNode.localBounds.minY + 25,
        this.leftPipeMainHandleNode.localBounds.maxX + 20, this.leftPipeMainHandleNode.localBounds.maxY + 60 );
    this.addChild( this.leftPipeMainHandleNode );

    // add handle to drag the right pipe
    this.rightPipeMainHandleNode = new Image( handleImage, { y: this.rightPipeNode.centerY, x: layoutBounds.maxX - 50, cursor: 'pointer', scale: 0.35 } );
    // touch area for the right pipe drag handle
    this.rightPipeMainHandleNode.touchArea = new Bounds2( this.rightPipeMainHandleNode.localBounds.minX - 20, this.rightPipeMainHandleNode.localBounds.minY + 25,
        this.rightPipeMainHandleNode.localBounds.maxX + 20, this.rightPipeMainHandleNode.localBounds.maxY + 60 );
    this.addChild( this.rightPipeMainHandleNode );

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
        var leftSpace = 0;
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
          pipeNode.controlHandleNodes[ i ].setTranslation( modelViewTransform.modelToViewX( position.x ), modelViewTransform.modelToViewY( position.y ) );
        } );

        // set the initial position of control point handles on left pipe node and right pipe node.
        switch( i ) {
          case leftBottomControlPointIndex :
            pipeNode.controlHandleNodes[ leftBottomControlPointIndex ].top = pipeNode.leftPipeNode.bottom - 2;
            break;
          case rightBottomControlPointIndex :
            pipeNode.controlHandleNodes[ rightBottomControlPointIndex ].top = pipeNode.rightPipeNode.bottom - 2;
            break;
          case rightTopControlPointIndex :
            pipeNode.controlHandleNodes[ rightTopControlPointIndex ].bottom = pipeNode.rightPipeNode.top + 2;
            break;
          case leftTopControlPointIndex :
            pipeNode.controlHandleNodes[ leftTopControlPointIndex ].bottom = pipeNode.leftPipeNode.top + 2;
            break;
        }

        var dragStartY;
        var pipeTop;
        var pipeBottom;
        var controlPointDragStartY; // the model y value of the control point at drag start

        pipeNode.controlHandleNodes[ i ].addInputListener( new SimpleDragHandler(
          {
            start: function( event ) {
              dragStartY = pipeNode.controlHandleNodes[ i ].globalToParentPoint( event.pointer.point ).y;
              switch( i ) {
                case leftBottomControlPointIndex :
                  pipeTop = pipeNode.leftPipeNode.top;
                  break;
                case rightBottomControlPointIndex :
                  pipeTop = pipeNode.rightPipeNode.top;
                  break;
                case rightTopControlPointIndex :
                  pipeBottom = pipeNode.rightPipeNode.bottom;
                  break;
                case leftTopControlPointIndex :
                  pipeBottom = pipeNode.leftPipeNode.bottom;
                  break;
              }
              controlPointDragStartY = pipe.controlPoints[ i ].position.y;
            },

            drag: function( event ) {

              var globalPointY = pipeNode.controlHandleNodes[ i ].globalToParentPoint( event.pointer.point ).y;
              var offSetY = globalPointY - dragStartY;
              var pt = new Vector2( 0, 0 );

              // getting fixed x position(constant) of control point that is dragged
              pt.x = pipe.controlPoints[ i ].position.x;
              pt.y = controlPointDragStartY + modelViewTransform.viewToModelDeltaY( offSetY );
              // limit the y to (0, -4)
              pt.y = ( pt.y > 0 ? 0 : ( pt.y < -4 ? -4 : pt.y ) );

              // prevent the two ends of the cross sections from crossing each other
              if ( ( i < rightBottomControlPointIndex && pt.y < pipe.controlPoints[ numControlPoints - ( i + 1 ) ].position.y ) ||
                   ( i >= rightBottomControlPointIndex && pt.y > pipe.controlPoints[ numControlPoints - ( i + 1 ) ].position.y ) ) {
                return;
              }
              var yDiff = Math.abs( ( pipe.controlPoints[ numControlPoints - ( i + 1 ) ].position.y ) - pt.y );

              // ensure that the cross section is at least 1 meter
              if ( yDiff >= 1 ) {
                controlPoint.position = pt;
                // When a control point is dragged, mark the pipe as dirty and update the pipe flow line shape
                pipe.dirty = true;
                pipe.createSpline();
                pipeNode.updatePipeFlowLineShape();

                // reposition the grid injector
                pipeNode.gridInjectorNode.setTranslation( modelViewTransform.modelToViewX( pipeNode.gridInjectorX ) - pipeNode.gridInjectorNodeXOffset, modelViewTransform.modelToViewY( pipeNode.pipe.getCrossSection( pipeNode.gridInjectorX ).yTop ) - pipeNode.gridInjectorNodeYOffset );
              }

              var pipeScale;
              // handle the left pipe scaling
              if ( i === leftBottomControlPointIndex || i === leftTopControlPointIndex ) {

                if ( i === leftBottomControlPointIndex ) {
                  // fix the top end of the pipe if the bottom control point is used for scaling
                  pipeNode.leftPipeNode.top = pipeTop;
                  pipeNode.leftPipeBackNode.top = pipeTop;
                }

                // calculate the pipe scale
                pipeScale = (pipe.getCrossSection( pipe.controlPoints[ leftTopControlPointIndex ].position.x + 0.3 ).getHeight()) / PIPE_INITIAL_HEIGHT;
                pipeScale = pipeScale < 0.5 ? 0.5 : pipeScale;

                pipeNode.leftPipeNode.setScaleMagnitude( 0.6, pipeScale * 0.6 );
                pipeNode.leftPipeBackNode.setScaleMagnitude( 0.6, pipeScale * 0.6 );

                // calculate distance from left pipe main drag handle to left pipe top/bottom control points
                pipeNode.yDiffFromLeftPipeDrageHandleToLeftTopControlPoint = modelViewTransform.viewToModelY( pipeNode.leftPipeNode.centerY ) - pipe.controlPoints[ leftTopControlPointIndex ].position.y;
                pipeNode.yDiffFromLeftPipeDrageHandleToLeftBottomControlPoint = modelViewTransform.viewToModelY( pipeNode.leftPipeNode.centerY ) - pipe.controlPoints[ leftBottomControlPointIndex ].position.y;

                if ( i === leftTopControlPointIndex ) {
                  // fix the bottom end of the pipe if the top control point is used for scaling
                  pipeNode.leftPipeNode.bottom = pipeBottom;
                  pipeNode.leftPipeBackNode.bottom = pipeBottom;
                }

                pipeNode.leftPipeMainHandleNode.setTranslation( pipeNode.layoutBounds.minX - 10, pipeNode.leftPipeNode.centerY );
              }

              // handle the right  pipe scaling
              if ( i === rightBottomControlPointIndex || i === (rightTopControlPointIndex) ) {

                if ( i === rightBottomControlPointIndex ) {
                  // fix the top end of the pipe if the bottom control point is used for scaling
                  pipeNode.rightPipeNode.top = pipeTop;
                }

                pipeScale = ( pipe.getCrossSection( pipe.controlPoints[ rightTopControlPointIndex ].position.x - 0.3 ).getHeight() ) / PIPE_INITIAL_HEIGHT;

                // limit the scaling to 0.5 on the lower side
                pipeScale = pipeScale < 0.5 ? 0.5 : pipeScale;

                pipeNode.rightPipeNode.setScaleMagnitude( 0.6, pipeScale * 0.6 );

                // calculate distance from the right pipe main drag handle to right pipe top/bottom control points
                pipeNode.yDiffFromRightPipeDrageHandleToRightTopControlPoint = modelViewTransform.viewToModelY( pipeNode.rightPipeNode.centerY ) - pipe.controlPoints[ rightTopControlPointIndex ].position.y;
                pipeNode.yDiffFromRightPipeDrageHandleToRightBottomControlPoint = modelViewTransform.viewToModelY( pipeNode.rightPipeNode.centerY ) - pipe.controlPoints[ rightBottomControlPointIndex ].position.y;


                if ( i === rightTopControlPointIndex ) {
                  // fix the bottom end of the pipe if the top control point is used for scaling
                  pipeNode.rightPipeNode.bottom = pipeBottom;
                }
                pipeNode.rightPipeMainHandleNode.setTranslation( layoutBounds.maxX - 50, pipeNode.rightPipeNode.centerY );

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

              // setting the left/right  pipe top/bottom  control point handle positions when left/right pipe drag
              pipeNode.controlHandleNodes[ leftTopControlPointIndex ].bottom = pipeNode.leftPipeNode.top + 2;
              pipeNode.controlHandleNodes[ leftBottomControlPointIndex ].top = pipeNode.leftPipeNode.bottom - 2;
              pipeNode.controlHandleNodes[ rightTopControlPointIndex ].bottom = pipeNode.rightPipeNode.top + 2;
              pipeNode.controlHandleNodes[ rightBottomControlPointIndex ].top = pipeNode.rightPipeNode.bottom - 2;

              // update the flux meter
              flowModel.fluxMeter.trigger( 'update' );

              // update the velocity sensors
              flowModel.speedometers[ 0 ].trigger( 'update' );
              flowModel.speedometers[ 1 ].trigger( 'update' );

            }

          } ) );
        pipeNode.addChild( pipeNode.controlHandleNodes[ i ] );
      })( i );
    }

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
            var draY = pipeMainDragHandles[ j ].globalToParentPoint( e.pointer.point ).y;
            var offSetY = draY - dragStartY;
            var pt = modelViewTransform.viewToModelPosition( pipeMainDragHandles[ j ].globalToParentPoint( e.pointer.point ) );
            var index = j === 0 ? 0 : rightBottomControlPointIndex;
            var x = pipe.controlPoints[ index ].position.x;
            var yUp;
            var yLow;

            pt.y = modelViewTransform.viewToModelY( initialMainHandleY + offSetY );

            if ( pt.y >= 0 || pt.y < -4 || ( pt.y + 1 >= 0 ) || pt.y - 1 < -4 ) {

              return;
            }

            if ( j === 0 ) {
              // calculate top and bottom control point positions
              yUp = pt.y + Math.abs( pipeNode.yDiffFromLeftPipeDrageHandleToLeftTopControlPoint );
              yLow = pt.y - Math.abs( pipeNode.yDiffFromLeftPipeDrageHandleToLeftBottomControlPoint );

              // set the  left pipe  top  and bottom control point.
              pipe.controlPoints[ leftTopControlPointIndex ].position = new Vector2( x, yUp );
              pipe.controlPoints[ leftBottomControlPointIndex ].position = new Vector2( x, yLow );

              pipeNode.leftPipeNode.setTranslation( layoutBounds.minX - pipeNode.leftPipeXOffest, modelViewTransform.modelToViewY( pipe.controlPoints[ leftTopControlPointIndex ].position.y ) - 13 );
              pipeNode.leftPipeBackNode.setTranslation( layoutBounds.minX - pipeNode.leftPipeXOffest, modelViewTransform.modelToViewY( pipe.controlPoints[ leftTopControlPointIndex ].position.y ) - 13 );

              // set the left pipe  top/bottom control point handle positions
              pipeNode.controlHandleNodes[ leftTopControlPointIndex ].bottom = pipeNode.leftPipeNode.top + 2;
              pipeNode.controlHandleNodes[ leftBottomControlPointIndex ].top = pipeNode.leftPipeNode.bottom - 2;

              pipeMainDragHandles[ j ].setTranslation( layoutBounds.minX - 10, pipeNode.leftPipeNode.centerY );

            }
            else {
              // calculate  top and bottom control point positions
              yUp = pt.y + Math.abs( pipeNode.yDiffFromRightPipeDrageHandleToRightTopControlPoint );
              yLow = pt.y - Math.abs( pipeNode.yDiffFromRightPipeDrageHandleToRightBottomControlPoint );

              // set the right pipe top and bottom control points positions
              pipe.controlPoints[ rightTopControlPointIndex ].position = new Vector2( x, yUp );
              pipe.controlPoints[ rightBottomControlPointIndex ].position = new Vector2( x, yLow );

              pipeNode.rightPipeNode.setTranslation( layoutBounds.maxX - pipeNode.rightPipeXOffest, modelViewTransform.modelToViewY( pipe.controlPoints[ rightTopControlPointIndex ].position.y ) - 13 );

              // set the right pipe top/bottom control point handle positions
              pipeNode.controlHandleNodes[ rightTopControlPointIndex ].bottom = pipeNode.rightPipeNode.top + 2;
              pipeNode.controlHandleNodes[ rightBottomControlPointIndex ].top = pipeNode.rightPipeNode.bottom - 2;

              pipeMainDragHandles[ j ].setTranslation( layoutBounds.maxX - 50, pipeNode.rightPipeNode.centerY );

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

            // reposition the grid injector
            pipeNode.gridInjectorNode.setTranslation( modelViewTransform.modelToViewX( pipeNode.gridInjectorX ) - pipeNode.gridInjectorNodeXOffset, modelViewTransform.modelToViewY( pipeNode.pipe.getCrossSection( pipeNode.gridInjectorX ).yTop ) - pipeNode.gridInjectorNodeYOffset );

          }
        } ) );
      })( j );
    }

    // init the PipeFlow Line shape
    pipe.createSpline();
    this.updatePipeFlowLineShape();
    this.mutate( options );
  }

  return inherit( Node, PipeNode,
    {
      // update the pipe flow line shape (the flexible middle pipe)
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

        var flowLineShape = new Shape().moveTo( this.modelViewTransform.modelToViewX( xPointsBottom[ 0 ] ), this.modelViewTransform.modelToViewY( yPointsBottom[ 0 ] ) );

        var minXOfPipeFlowLineShape = -6.7; // model value
        var maxXOfPipeFlowLineShape = 6.8;
        for ( var i = 1; i < xPointsBottom.length; i = i + 1 ) {
          // Spline points beyond the last pipe cross section are not needed.
          if ( xPointsBottom[ i ] < maxXOfPipeFlowLineShape && xPointsBottom[ i ] > minXOfPipeFlowLineShape ) {
            flowLineShape.lineTo( this.modelViewTransform.modelToViewX( xPointsBottom[ i ] ), this.modelViewTransform.modelToViewY( yPointsBottom[ i ] ) );
          }
        }

        for ( i = xPointsTop.length; i > 0; i = i - 1 ) {
          // Spline points beyond the last pipe cross section are not needed.
          if ( xPointsBottom[ i ] < maxXOfPipeFlowLineShape && xPointsBottom[ i ] > minXOfPipeFlowLineShape ) {
            flowLineShape.lineTo( this.modelViewTransform.modelToViewX( xPointsTop[ i ] ), this.modelViewTransform.modelToViewY( yPointsTop[ i ] ) );
          }
        }
        this.pipeFlowLine.shape = flowLineShape;

        // make a copy of the line shape for the fluid node
        this.pipeFluidNode.shape = flowLineShape.copy();

      },

      reset: function() {
        // reset the left and right pipe position and scale
        this.leftPipeNode.setMatrix( Matrix3.translation( this.layoutBounds.minX - this.leftPipeXOffest, this.groundY + this.pipeNodeYOffset ) );
        this.leftPipeNode.scale( 0.6, 0.6, false );
        this.leftPipeBackNode.setMatrix( Matrix3.translation( this.layoutBounds.minX - this.leftPipeXOffest, this.groundY + this.pipeNodeYOffset ) );
        this.leftPipeBackNode.scale( 0.6, 0.6, false );
        this.rightPipeNode.setMatrix( Matrix3.translation( this.layoutBounds.maxX - this.rightPipeXOffest, this.groundY + this.pipeNodeYOffset ) );
        this.rightPipeNode.scale( 0.6, 0.6, false );
        this.leftPipeMainHandleNode.setTranslation( this.layoutBounds.minX - 10, this.leftPipeNode.getCenterY() );
        this.rightPipeMainHandleNode.setTranslation( this.layoutBounds.maxX - 50, this.rightPipeNode.getCenterY() );

        // mark pipe as dirty for getting new spline cross sections
        this.pipe.dirty = true;
        this.pipe.createSpline();
        this.updatePipeFlowLineShape();
        this.flowModel.fluxMeter.trigger( 'update' );

        // reset the distance from left/right pipe main drag handle to left/right pipe top/bottom control points
        this.yDiffFromLeftPipeDrageHandleToLeftTopControlPoint = 1.05; //model value
        this.yDiffFromLeftPipeDrageHandleToLeftBottomControlPoint = 1.05;
        this.yDiffFromRightPipeDrageHandleToRightTopControlPoint = 1.05;
        this.yDiffFromRightPipeDrageHandleToRightBottomControlPoint = 1.05;

        // reset the handle positions
        var numControlPoints = this.pipe.controlPoints.length;
        this.controlHandleNodes[ numControlPoints / 2 - 1 ].bottom = this.rightPipeNode.top + 2;
        this.controlHandleNodes[ numControlPoints / 2 ].top = this.rightPipeNode.bottom - 2;
        this.controlHandleNodes[ 0 ].bottom = this.leftPipeNode.top + 2;
        this.controlHandleNodes[ numControlPoints - 1 ].top = this.leftPipeNode.bottom - 2;

        this.gridInjectorNode.setTranslation( this.modelViewTransform.modelToViewX( this.gridInjectorX ) - this.gridInjectorNodeXOffset, this.modelViewTransform.modelToViewY( this.pipe.getCrossSection( this.gridInjectorX ).yTop ) - this.gridInjectorNodeYOffset );
      }
    } );
} );