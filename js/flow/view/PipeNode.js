// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * PipeNode
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Shape = require( 'KITE/Shape' );
  var SplineEvaluation = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/SplineEvaluation' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Vector2 = require( 'DOT/Vector2' );
  var ParticleCanvasNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/ParticleCanvasNode' );
  var GridInjectorNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/GridInjectorNode' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle-with-bar.png' );
  var leftPipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-left-front.png' );
  var pipeMiddleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-segment.png' );
  var rightSidePipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-right.png' );
  var leftPipeBackImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-left-back.png' );

  /*
   * Constructor for PipeNode
   * @param {FlowModel} flowModel of the simulation.
   * @param {Pipe} pipe model for this pipe node
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @param {Bounds2} layoutBounds of the simulation
   * @param {options}
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

    this.isLeftPipeScaled = false;
    this.isRightPipeScaled = false;

    var leftTopScaleHandleYDiffWithDragHandle = 1; //model value
    var leftBottomScaleHandleYDiffWithDragHandle = 1;
    var rightTopScaleHandleYDiffWithDragHandle = 1;
    var rightBottomScaleHandleYDiffWithDragHandle = 1;

    this.leftMainHandleYOffset = 60; // view value
    this.rightMainHandleYOffset = 60;

    this.groundY = this.modelViewTransform.modelToViewY( 0 );
    this.pipeNodeYOffset = 57; // w.r.t to ground
    var PIPE_INITIAL_HEIGHT = 2.1;
    //left side pipe image.
    var leftPipe = new Image( leftPipeImage, { scale: options.pipeScale} );
    var leftPipeMiddle = [];
    this.leftPipeBackNode = new Node( {children: [new Image( leftPipeBackImage, { scale: options.pipeScale} )], top: this.groundY + this.pipeNodeYOffset, left: layoutBounds.minX - 50, scale: options.pipeScale} );

    leftPipeMiddle[0] = new Image( pipeMiddleImage, { right: leftPipe.left + 20, scale: options.pipeScale} );
    for ( var j = 1; j < 40; j++ ) {
      leftPipeMiddle[j] = new Image( pipeMiddleImage, { right: leftPipeMiddle[j - 1].left + 1, scale: options.pipeScale} );
    }
    this.leftPipeNode = new Node( {children: [leftPipe], top: this.groundY + this.pipeNodeYOffset, left: layoutBounds.minX - 50, scale: options.pipeScale} );
    for ( j = 0; j < 40; j++ ) {
      this.leftPipeNode.addChild( leftPipeMiddle[j] );
    }

    this.pipeFlowLine = new Path( null, {stroke: options.lineColor, lineWidth: '6', fill: flowModel.fluidColorModel.color } );

    // right side pipe image.
    var rightPipe = new Image( rightSidePipeImage, { scale: options.pipeScale} );
    var rightPipeMiddle = [];
    rightPipeMiddle[0] = new Image( pipeMiddleImage, { right: rightPipe.right - 1, scale: options.pipeScale} );
    for ( j = 1; j < 40; j++ ) {
      rightPipeMiddle[j] = new Image( pipeMiddleImage, { left: rightPipeMiddle[j - 1].right - 1, scale: options.pipeScale} );
    }
    this.rightPipeNode = new Node( {children: [rightPipe], bottom: this.leftPipeNode.bottom, left: layoutBounds.maxX - 75, scale: options.pipeScale } );
    for ( j = 0; j < 40; j++ ) {
      this.rightPipeNode.addChild( rightPipeMiddle[j] );
    }

    // Injector which generates grid particles
    this.gridInjectorNode = new GridInjectorNode( flowModel );
    this.addChild( this.gridInjectorNode );
    this.gridInjectorNode.setTranslation( modelViewTransform.modelToViewX( -6 ) - 60, modelViewTransform.modelToViewY( this.pipe.getCrossSection( -6 ).yTop ) - 150 );

    this.addChild( this.leftPipeBackNode );
    this.addChild( this.pipeFlowLine );

    this.particlesLayer = new ParticleCanvasNode( flowModel.flowParticles, flowModel.gridParticles, modelViewTransform, {
      canvasBounds: new Bounds2( 40, 120, 700, 600 )
    } );
    this.addChild( this.particlesLayer );

    this.addChild( this.rightPipeNode );
    this.addChild( this.leftPipeNode );

    // add handles to drag the pipe
    this.leftPipeMainHandleNode = new Image( handleImage, { top: this.leftPipeNode.top + 60, right: 20, cursor: 'pointer', scale: 0.32} );
    this.leftPipeMainHandleNode.touchArea = new Bounds2( this.leftPipeMainHandleNode.localBounds.minX - 20, this.leftPipeMainHandleNode.localBounds.minY + 25,
        this.leftPipeMainHandleNode.localBounds.maxX + 20, this.leftPipeMainHandleNode.localBounds.maxY + 30 );
    this.addChild( this.leftPipeMainHandleNode );

    this.rightPipeMainHandleNode = new Image( handleImage, {top: this.rightPipeNode.top + 60, left: layoutBounds.maxX - 50, cursor: 'pointer', scale: 0.35} );
    this.rightPipeMainHandleNode.touchArea = new Bounds2( this.rightPipeMainHandleNode.localBounds.minX - 20, this.rightPipeMainHandleNode.localBounds.minY + 25,
        this.rightPipeMainHandleNode.localBounds.maxX + 20, this.rightPipeMainHandleNode.localBounds.maxY + 30 );
    this.addChild( this.rightPipeMainHandleNode );

    flowModel.fluidColorModel.colorProperty.linkAttribute( pipeNode.pipeFlowLine, 'fill' );

    // for line smoothness
    var lastPt = (pipe.controlPoints.length - 1) / pipe.controlPoints.length;
    var linSpace = numeric.linspace( 0, lastPt, 5 * (pipe.controlPoints.length - 1) );

    // update the PipeFlowLineShape
    this.updatePipeFlowLineShape = function() {
      var i;

      //Compute points for lineTo
      var xPointsBottom = SplineEvaluation.atArray( pipe.xSplineBottom, linSpace );
      var yPointsBottom = SplineEvaluation.atArray( pipe.ySplineBottom, linSpace );
      var xPointsTop = SplineEvaluation.atArray( pipe.xSplineTop, linSpace );
      var yPointsTop = SplineEvaluation.atArray( pipe.ySplineTop, linSpace );
      var shape = new Shape().moveTo( modelViewTransform.modelToViewX( xPointsBottom[0] ), modelViewTransform.modelToViewY( yPointsBottom[0] ) );

      // Show the pipe flow line at reduced resolution while dragging so it will be smooth and responsive while dragging
      for ( i = 1; i < xPointsBottom.length; i = i + 1 ) {
        // some spline points are beyond the last pipe cross section. Don't need them.
        if ( xPointsBottom[i] < 6.8 && xPointsBottom[i] > -6.7 ) {
          shape.lineTo( modelViewTransform.modelToViewX( xPointsBottom[i] ), modelViewTransform.modelToViewY( yPointsBottom[i] ) );
        }
      }
      for ( i = xPointsTop.length; i > 0; i = i - 1 ) {
        // some spline points are beyond the last pipe cross section. Don't need them.
        if ( xPointsBottom[i] < 6.8 && xPointsBottom[i] > -6.7 ) {
          shape.lineTo( modelViewTransform.modelToViewX( xPointsTop[i] ), modelViewTransform.modelToViewY( yPointsTop[i] ) );
        }
      }
      this.pipeFlowLine.shape = shape;
    };

    this.controlHandleNodes = [];
    this.scaleControlPointYPositions = {};
    var numControlPoints = pipe.controlPoints.length;
    var leftTopControlPointIndex = 0;
    var leftBottomControlPointIndex = numControlPoints - 1;
    var rightTopControlPointIndex = numControlPoints / 2 - 1;
    var rightBottomControlPointIndex = numControlPoints / 2;


    // add control handles for dragging and scaling using the 4 control points on the left/right pipe
    for ( var i = 0; i < numControlPoints; i++ ) {
      (function( i ) {
        var controlPoint = pipe.controlPoints[i];
        var leftSpace = 0;
        var imageRotation = 0;
        if ( pipe.controlPoints[i].position.y < -2 ) {
          leftSpace = -15;
        }
        else {
          imageRotation = Math.PI;
          leftSpace = 17;
        }

        var handleNode = new Image( handleImage, {left: leftSpace, cursor: 'pointer', scale: 0.32} );

        // expand the touch area upwards for the top handles and downwards for bottom handles
        if ( i < numControlPoints / 2 ) {
          handleNode.touchArea = new Bounds2( handleNode.localBounds.minX - 30, handleNode.localBounds.minY,
              handleNode.localBounds.maxX + 30, handleNode.localBounds.maxY + 30 );
        }
        else {
          handleNode.touchArea = new Bounds2( handleNode.localBounds.minX - 30, handleNode.localBounds.minY + 30,
              handleNode.localBounds.maxX + 30, handleNode.localBounds.maxY + 30 );
        }
        handleNode.setRotation( imageRotation );

        pipeNode.controlHandleNodes[i] = new Node( {children: [handleNode ]} );
        controlPoint.positionProperty.link( function( position ) {
          pipeNode.controlHandleNodes[i].setTranslation( modelViewTransform.modelToViewX( position.x ), modelViewTransform.modelToViewY( position.y ) );
        } );

        if ( i === leftTopControlPointIndex || i === (rightTopControlPointIndex) ) {
          pipeNode.controlHandleNodes[i].bottom -= 10;
          pipeNode.scaleControlPointYPositions[i] = pipeNode.controlHandleNodes[i].bottom;
        }
        else if ( i === leftBottomControlPointIndex || i === rightBottomControlPointIndex ) {
          pipeNode.controlHandleNodes[i].bottom += 10;
          pipeNode.scaleControlPointYPositions[i] = pipeNode.controlHandleNodes[i].bottom;
        }

        var dragStartY;
        var pipeTop;
        var pipeBottom;
        var controlPointDragStartY; // the model y value of the control point at drag start

        pipeNode.controlHandleNodes[i].addInputListener( new SimpleDragHandler(
          {
            start: function( event ) {
              dragStartY = pipeNode.controlHandleNodes[i].globalToParentPoint( event.pointer.point ).y;

              if ( i === leftBottomControlPointIndex ) {
                pipeTop = pipeNode.leftPipeNode.top;
              }
              else if ( i === rightBottomControlPointIndex ) {
                pipeTop = pipeNode.rightPipeNode.top;
              }
              else if ( i === rightTopControlPointIndex ) {
                pipeBottom = pipeNode.rightPipeNode.bottom;
              }
              else if ( i === leftTopControlPointIndex ) {
                pipeBottom = pipeNode.leftPipeNode.bottom;
              }
              controlPointDragStartY = pipe.controlPoints[i].position.y;
            },

            drag: function( event ) {

              var globalPointY = pipeNode.controlHandleNodes[i].globalToParentPoint( event.pointer.point ).y;
              var offSetY = globalPointY - dragStartY;
              var pt = new Vector2( 0, 0 );
              pt.x = pipe.controlPoints[i].position.x;
              pt.y = controlPointDragStartY + modelViewTransform.viewToModelDeltaY( offSetY );
              // limit the y to (0, -4)
              pt.y = (pt.y > 0 ? 0 : ( pt.y < -4 ? -4 : pt.y));

              // prevent the two ends of the cross sections from crossing each other
              if ( (i < rightBottomControlPointIndex && pt.y < pipe.controlPoints[numControlPoints - (i + 1)].position.y) ||
                   (i >= rightBottomControlPointIndex && pt.y > pipe.controlPoints[numControlPoints - (i + 1)].position.y) ) {
                return;
              }

              var pipeScale;
              // handle the left pipe scaling
              if ( i === leftBottomControlPointIndex || i === leftTopControlPointIndex ) {

                if ( i === leftBottomControlPointIndex ) {
                  // fix the top end of the pipe if the bottom control point is used for scaling
                  pipeNode.leftPipeNode.top = pipeTop;
                  pipeNode.leftPipeBackNode.top = pipeTop;
                }

                pipeScale = (pipe.getCrossSection( pipe.controlPoints[leftTopControlPointIndex].position.x + 0.3 ).getHeight()) / PIPE_INITIAL_HEIGHT;
                pipeScale = pipeScale < 0.45 ? 0.45 : pipeScale;

                pipeNode.leftPipeNode.setScaleMagnitude( 0.6, pipeScale * 0.6 );
                pipeNode.leftPipeBackNode.setScaleMagnitude( 0.6, pipeScale * 0.6 );
                pipeNode.leftMainHandleYOffset = ( pipeScale * 60 ) + 20;

                leftTopScaleHandleYDiffWithDragHandle = modelViewTransform.viewToModelY( pipeNode.leftPipeMainHandleNode.getCenterY() ) - pipe.controlPoints[leftTopControlPointIndex].position.y;
                leftBottomScaleHandleYDiffWithDragHandle = modelViewTransform.viewToModelY( pipeNode.leftPipeMainHandleNode.getCenterY() ) - pipe.controlPoints[numControlPoints - 1].position.y;
                pipeNode.isLeftPipeScaled = true;

                if ( i === leftTopControlPointIndex ) {
                  // fix the bottom end of the pipe if the top control point is used for scaling
                  pipeNode.leftPipeNode.bottom = pipeBottom;
                  pipeNode.leftPipeBackNode.bottom = pipeBottom;
                }

                pipeNode.leftPipeMainHandleNode.setTranslation( pipeNode.layoutBounds.minX - 10, pipeNode.leftPipeNode.centerY );
              }

              if ( i === rightBottomControlPointIndex || i === (rightTopControlPointIndex) ) {

                if ( i === rightBottomControlPointIndex ) {
                  // fix the top end of the pipe if the bottom control point is used for scaling
                  pipeNode.rightPipeNode.top = pipeTop;
                }

                pipeScale = (pipe.getCrossSection( pipe.controlPoints[rightTopControlPointIndex].position.x - 0.3 ).getHeight()) / PIPE_INITIAL_HEIGHT;

                pipeScale = pipeScale < 0.45 ? 0.45 : pipeScale;

                pipeNode.rightPipeNode.setScaleMagnitude( 0.6, pipeScale * 0.6 );
                pipeNode.rightMainHandleYOffset = ((pipeScale * 0.6 ) * 10 + 2) * 10;

                pipeNode.rightPipeMainHandleNode.setTranslation( layoutBounds.maxX - 50, pipeNode.rightPipeNode.getCenterY() );

                rightTopScaleHandleYDiffWithDragHandle = modelViewTransform.viewToModelY( pipeNode.rightPipeMainHandleNode.getCenterY() ) - pipe.controlPoints[rightTopControlPointIndex].position.y;
                rightBottomScaleHandleYDiffWithDragHandle = modelViewTransform.viewToModelY( pipeNode.rightPipeMainHandleNode.getCenterY() ) - pipe.controlPoints[rightBottomControlPointIndex].position.y;

                pipeNode.isRightPipeScaled = true;

                if ( i === rightTopControlPointIndex ) {
                  // fix the bottom end of the pipe if the top control point is used for scaling
                  pipeNode.rightPipeNode.bottom = pipeBottom;
                }

              }

              // reposition the particles when the sim is paused and the handle is dragged
              if ( !flowModel.isPlay ) {
                var particle;

                for ( var k = 0; k < flowModel.flowParticles.length; k++ ) {
                  particle = flowModel.flowParticles.get( k );
                  particle.position.y = particle.getY();
                }

                for ( k = 0; k < flowModel.gridParticles.length; k++ ) {
                  particle = flowModel.gridParticles.get( k );
                  particle.position.y = particle.getY();
                }
              }

              var yDiff = Math.abs( (pipe.controlPoints[numControlPoints - (i + 1)].position.y) - pt.y );

              // ensure that the cross section is aleast 1 meter
              if ( yDiff >= 1 ) {
                controlPoint.position = pt;
                // When a control point is dragged, update the pipe flow line shape and the node shape
                pipe.dirty = true;
                pipe.createSpline();
                pipeNode.updatePipeFlowLineShape();

                // reposition the grid injector
                pipeNode.gridInjectorNode.setTranslation( modelViewTransform.modelToViewX( -6 ) - 60, modelViewTransform.modelToViewY( pipeNode.pipe.getCrossSection( -6 ).yTop ) - 150 );
              }

              // update the flux meter
              flowModel.fluxMeter.trigger( 'update' );

              // update the velocity sensors
              flowModel.speedometers[0].trigger( 'update' );
              flowModel.speedometers[1].trigger( 'update' );

            }

          } ) );
        pipeNode.addChild( pipeNode.controlHandleNodes[i] );
      })( i );
    }

    var pipeMainDragHandles = [];
    pipeMainDragHandles.push( this.leftPipeMainHandleNode );
    pipeMainDragHandles.push( this.rightPipeMainHandleNode );

    var dragStartY;
    // left and right side of pipe main handles dragging
    for ( j = 0; j < pipeMainDragHandles.length; j++ ) {
      (function( j ) {

        pipeMainDragHandles[j].addInputListener( new SimpleDragHandler( {
          start: function( e ) {
            dragStartY = pipeMainDragHandles[j].globalToParentPoint( e.pointer.point ).y;
          },

          drag: function( e ) {
            var y = pipeMainDragHandles[j].globalToParentPoint( e.pointer.point ).y;
            var pt = modelViewTransform.viewToModelPosition( pipeMainDragHandles[j].globalToParentPoint( e.pointer.point ) );
            var index = j === 0 ? 0 : rightBottomControlPointIndex;
            var x = pipe.controlPoints[index].position.x;
            var yUp;
            var yLow;
            if ( pt.y >= 0 || pt.y < -4 || (pt.y + 1 >= 0) || pt.y - 1 < -4 ) {
              return;
            }

            if ( j === 0 ) {
              yUp = pipeNode.isLeftPipeScaled ? pt.y + Math.abs( leftTopScaleHandleYDiffWithDragHandle ) - 0.1 : pt.y + 1;
              yLow = pipeNode.isLeftPipeScaled ? pt.y - Math.abs( leftBottomScaleHandleYDiffWithDragHandle ) : pt.y - 1;
              // left pipe handle
              pipe.controlPoints[leftTopControlPointIndex].position = new Vector2( x, yUp );
              pipe.controlPoints[leftBottomControlPointIndex].position = new Vector2( x, yLow );
              pipeNode.leftPipeNode.setTranslation( layoutBounds.minX - 50, y - pipeNode.leftMainHandleYOffset );
              pipeNode.leftPipeBackNode.setTranslation( layoutBounds.minX - 50, y - pipeNode.leftMainHandleYOffset );
              pipeMainDragHandles[j].setTranslation( layoutBounds.minX - 10, y );

            }
            else {
              yUp = pipeNode.isRightPipeScaled ? pt.y + Math.abs( rightTopScaleHandleYDiffWithDragHandle ) - 0.2 : pt.y + 1;
              yLow = pipeNode.isRightPipeScaled ? pt.y - Math.abs( rightBottomScaleHandleYDiffWithDragHandle ) : pt.y - 1;
              // right pipe handle
              pipe.controlPoints[rightTopControlPointIndex].position = new Vector2( x, yUp );
              pipe.controlPoints[rightBottomControlPointIndex].position = new Vector2( x, yLow );
              pipeMainDragHandles[j].setTranslation( layoutBounds.maxX - 50, y );
              pipeNode.rightPipeNode.setTranslation( layoutBounds.maxX - 75, y - (pipeNode.rightMainHandleYOffset) );

              pipeNode.controlHandleNodes[leftTopControlPointIndex].bottom = pipeNode.leftPipeNode.top;
              pipeNode.controlHandleNodes[leftBottomControlPointIndex].top = pipeNode.leftPipeNode.bottom;
            }

            // reposition the particles when the sim is paused and the handle is dragged
            if ( !flowModel.isPlay ) {
              var particle;

              for ( var k = 0; k < flowModel.flowParticles.length; k++ ) {
                particle = flowModel.flowParticles.get( k );
                particle.position.y = particle.getY();
              }

              for ( k = 0; k < flowModel.gridParticles.length; k++ ) {
                particle = flowModel.gridParticles.get( k );
                particle.position.y = particle.getY();
              }
            }

            pipe.dirty = true;
            pipe.createSpline();
            pipeNode.updatePipeFlowLineShape();
            flowModel.fluxMeter.trigger( 'update' );

            // reposition the grid injector
            pipeNode.gridInjectorNode.setTranslation( modelViewTransform.modelToViewX( -6 ) - 60, modelViewTransform.modelToViewY( pipeNode.pipe.getCrossSection( -6 ).yTop ) - 150 );

          }
        } ) );
      })( j );
    }

    // Init the PipeFlow Line shape
    pipe.createSpline();
    this.updatePipeFlowLineShape();
    this.mutate( options );
  }

  return inherit( Node, PipeNode,
    {
      reset: function() {
        this.leftPipeNode.setMatrix( Matrix3.translation( this.layoutBounds.minX - 50, this.groundY + this.pipeNodeYOffset ) );
        this.leftPipeNode.scale( 0.6, 0.6, false );
        this.leftPipeBackNode.setMatrix( Matrix3.translation( this.layoutBounds.minX - 50, this.groundY + this.pipeNodeYOffset ) );
        this.leftPipeBackNode.scale( 0.6, 0.6, false );
        this.rightPipeNode.setMatrix( Matrix3.translation( this.layoutBounds.maxX - 75, this.groundY + this.pipeNodeYOffset ) );
        this.rightPipeNode.scale( 0.6, 0.6, false );
        this.leftPipeMainHandleNode.setTranslation( this.layoutBounds.minX - 10, this.leftPipeNode.getCenterY() );
        this.rightPipeMainHandleNode.setTranslation( this.layoutBounds.maxX - 50, this.rightPipeNode.getCenterY() );
        // for getting new spline cross sections
        this.pipe.dirty = true;
        this.pipe.createSpline();
        this.updatePipeFlowLineShape();
        this.flowModel.fluxMeter.trigger( 'update' );
        var numControlPoints = this.pipe.controlPoints.length;

        for ( var i = 0; i < numControlPoints; i++ ) {
          if ( i === 0 || i === (numControlPoints / 2 - 1) ) {
            this.controlHandleNodes[i].bottom = this.scaleControlPointYPositions[i];
          }
          else if ( i === numControlPoints - 1 || i === numControlPoints / 2 ) {
            this.controlHandleNodes[i].bottom = this.scaleControlPointYPositions[i];
          }
        }
        this.isLeftPipeScaled = false;
        this.isRightPipeScaled = false;
        this.leftMainHandleYOffset = 60;
        this.rightMainHandleYOffset = 60;
        this.gridInjectorNode.setTranslation( this.modelViewTransform.modelToViewX( -6 ) - 60, this.modelViewTransform.modelToViewY( this.pipe.getCrossSection( -6 ).yTop ) - 150 );
      }
    } );
} );