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
    this.modelViewTransform = modelViewTransform;
    this.pipe = pipe;
    this.skyNodegroundY = this.modelViewTransform.modelToViewY( 0 );
    this.pipeNodeYOffset = 57;
    var PIPE_INITIAL_HEIGHT = 2.4;
    //left side pipe image.
    var leftPipe = new Image( leftPipeImage, { scale: options.pipeScale} );
    var leftPipeMiddle = [];
    this.leftPipeBackNode = new Node( {children: [new Image( leftPipeBackImage, { scale: options.pipeScale} )], top: this.skyNodegroundY + this.pipeNodeYOffset, left: layoutBounds.minX - 50, scale: options.pipeScale} );

    leftPipeMiddle[0] = new Image( pipeMiddleImage, { right: leftPipe.left + 20, scale: options.pipeScale} );
    for ( var j = 1; j < 40; j++ ) {
      leftPipeMiddle[j] = new Image( pipeMiddleImage, { right: leftPipeMiddle[j - 1].left + 1, scale: options.pipeScale} );
    }
    this.leftPipeNode = new Node( {children: [leftPipe], top: this.skyNodegroundY + this.pipeNodeYOffset, left: layoutBounds.minX - 50, scale: options.pipeScale} );
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
    this.addChild( this.leftPipeBackNode );
    this.addChild( this.pipeFlowLine );
    this.particlesLayer = new ParticleCanvasNode( flowModel.flowParticles, flowModel.gridParticles, modelViewTransform, {
      canvasBounds: new Bounds2( 40, 120, 700, 600 )
    } );
    this.addChild( this.particlesLayer );
    this.addChild( this.rightPipeNode );
    this.addChild( this.leftPipeNode );


    // add handles to drag the pipe
    this.leftPipeMainHandleNode = new Image( handleImage, { top: this.leftPipeNode.top + 60, right: 20, cursor: 'pointer', scale: 0.35} );
    this.leftPipeMainHandleNode.touchArea = this.leftPipeMainHandleNode.localBounds.dilatedXY( 20, 20 );
    this.addChild( this.leftPipeMainHandleNode );
    this.rightPipeMainHandleNode = new Image( handleImage, {top: this.rightPipeNode.top + 60, left: layoutBounds.maxX - 50, cursor: 'pointer', scale: 0.35} );
    this.rightPipeMainHandleNode.touchArea = this.rightPipeMainHandleNode.localBounds.dilatedXY( 20, 20 );
    this.addChild( this.rightPipeMainHandleNode );

    this.layoutBounds = layoutBounds;

    flowModel.fluidColorModel.colorProperty.linkAttribute( pipeNode.pipeFlowLine, 'fill' );

    // for line smoothness
    var lastPt = (pipe.controlPoints.length - 1) / pipe.controlPoints.length;
    var linSpace = numeric.linspace( 0, lastPt, 20 * (pipe.controlPoints.length - 1) );

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
        if ( xPointsBottom[i] < 6.8/* &&xPointsBottom[i]>-6.7*/ ) {
          shape.lineTo( modelViewTransform.modelToViewX( xPointsBottom[i] ), modelViewTransform.modelToViewY( yPointsBottom[i] ) );
        }
      }
      for ( i = xPointsTop.length; i > 0; i = i - 1 ) {
        // some spline points are beyond the last pipe cross section. Don't need them.
        if ( xPointsBottom[i] < 6.8/*&&xPointsBottom[i]>-6.7*/ ) {
          shape.lineTo( modelViewTransform.modelToViewX( xPointsTop[i] ), modelViewTransform.modelToViewY( yPointsTop[i] ) );
        }
      }
      this.pipeFlowLine.shape = shape;
    };

    this.controlPointNodes = [];
    this.scaleControlPointYPositions = {};
    var numControlPoints = pipe.controlPoints.length;

    // control points dragging
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
          leftSpace = 15;
        }

        var handleNode = new Image( handleImage, {left: leftSpace, cursor: 'pointer', scale: 0.35} );
        handleNode.touchArea = handleNode.localBounds.dilatedXY( 20, 20 );
        handleNode.setRotation( imageRotation );
        pipeNode.controlPointNodes[i] = new Node( {children: [handleNode ]} );
        controlPoint.positionProperty.link( function( position ) {
          pipeNode.controlPointNodes[i].setTranslation( modelViewTransform.modelToViewX( position.x ), modelViewTransform.modelToViewY( position.y ) );
        } );

        if ( i === 0 || i === (numControlPoints / 2 - 1) ) {
          pipeNode.controlPointNodes[i].bottom -= 10;
          pipeNode.scaleControlPointYPositions[i] = pipeNode.controlPointNodes[i].bottom;
        }
        else if ( i === numControlPoints - 1 || i === numControlPoints / 2 ) {
          pipeNode.controlPointNodes[i].bottom += 10;
          pipeNode.scaleControlPointYPositions[i] = pipeNode.controlPointNodes[i].bottom;
        }

        pipeNode.controlPointNodes[i].addInputListener( new SimpleDragHandler(
          {
            drag: function( event ) {
              var globalPoint = pipeNode.controlPointNodes[i].globalToParentPoint( event.pointer.point );
              var pt = modelViewTransform.viewToModelPosition( globalPoint );
              pt.x = pipe.controlPoints[i].position.x;
              pt.y = (pt.y > 0 ? 0 : ( pt.y < -4 ? -4 : pt.y));
              if ( (i < numControlPoints / 2 && pt.y < pipe.controlPoints[numControlPoints - (i + 1)].position.y) || (i >= numControlPoints / 2 && pt.y > pipe.controlPoints[numControlPoints - (i + 1)].position.y) ) {
                return;
              }

              var pipeScale = 0.35;
              var matrix;
              if ( i === numControlPoints - 1 || i === 0 ) {
                pipeScale = (Math.abs( pipe.controlPoints[numControlPoints - 1].position.y - pipe.controlPoints[0].position.y )) / PIPE_INITIAL_HEIGHT;
                pipeScale = pipeScale < 0.45 ? 0.45 : pipeScale;
                matrix = Matrix3.translation( layoutBounds.minX - 50, modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y ) );
                pipeNode.leftPipeNode.setMatrix( matrix );
                pipeNode.leftPipeNode.setScaleMagnitude( 0.6, pipeScale * 0.6 );
                pipeNode.leftPipeBackNode.setScaleMagnitude( 0.6, pipeScale * 0.6 );
                if ( i === 0 ) {
                  pipeNode.leftPipeNode.top = modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y );
                  pipeNode.leftPipeBackNode.top = modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y );
                  pipeNode.leftPipeMainHandleNode.setTranslation( pipeNode.layoutBounds.minX - 10, pipeNode.leftPipeNode.getCenterY() );
                }
                else {
                  pipeNode.leftPipeNode.bottom = modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y );
                  pipeNode.leftPipeBackNode.bottom = modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y );
                  pipeNode.leftPipeMainHandleNode.setTranslation( pipeNode.layoutBounds.minX - 10, pipeNode.leftPipeNode.getCenterY() );
                }

              }
              if ( i === numControlPoints / 2 || i === (numControlPoints / 2 - 1) ) {
                pipeScale = (Math.abs( pipe.controlPoints[numControlPoints / 2].position.y - pipe.controlPoints[numControlPoints / 2 - 1].position.y )) / PIPE_INITIAL_HEIGHT;

                pipeScale = pipeScale < 0.45 ? 0.45 : pipeScale;
                matrix = Matrix3.translation( layoutBounds.maxX - 75, modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y ) );
                pipeNode.rightPipeNode.setMatrix( matrix );
                pipeNode.rightPipeNode.setScaleMagnitude( 0.6, pipeScale * 0.6 );
                if ( i === (numControlPoints / 2 - 1) ) {
                  pipeNode.rightPipeNode.top = modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y );
                  pipeNode.rightPipeMainHandleNode.setTranslation( layoutBounds.maxX - 50, pipeNode.rightPipeNode.getCenterY() );
                }
                else {
                  pipeNode.rightPipeNode.bottom = modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y );
                  pipeNode.rightPipeMainHandleNode.setTranslation( layoutBounds.maxX - 50, pipeNode.rightPipeNode.getCenterY() );
                }
              }
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

              if ( yDiff > 1 ) {
                controlPoint.position = pt;
                // When a control point is dragged, update the pipe flow line shape and the node shape
                pipe.dirty = true;
                pipe.createSpline();
                pipeNode.updatePipeFlowLineShape();
              }
              // update the flux meter
              flowModel.fluxMeter.trigger( 'update' );

              // update the velocity sensors
              flowModel.speedometers[0].trigger( 'update' );
              flowModel.speedometers[1].trigger( 'update' );
            }

          } ) );
        pipeNode.addChild( pipeNode.controlPointNodes[i] );
      })( i );
    }

    var pipeMainDragHandles = [];
    pipeMainDragHandles.push( this.leftPipeMainHandleNode );
    pipeMainDragHandles.push( this.rightPipeMainHandleNode );

    // left and right side of pipe main handles dragging
    for ( j = 0; j < pipeMainDragHandles.length; j++ ) {
      (function( j ) {
        pipeMainDragHandles[j].addInputListener( new SimpleDragHandler( {
          drag: function( e ) {
            var y = pipeMainDragHandles[j].globalToParentPoint( e.pointer.point ).y;
            var pt = modelViewTransform.viewToModelPosition( pipeMainDragHandles[j].globalToParentPoint( e.pointer.point ) );
            var index = j === 0 ? 0 : numControlPoints / 2;
            var x = pipe.controlPoints[index].position.x;
            var yUp;
            var yLow;
            if ( pt.y >= 0 || pt.y < -4 ) {
              return;
            }
            if ( j === 0 ) {
              yUp = modelViewTransform.viewToModelY( pipeNode.leftPipeNode.getTop() ) - 0.4;
              yLow = modelViewTransform.viewToModelY( pipeNode.leftPipeNode.getBottom() ) + 0.4;
              // left pipe handle
              pipe.controlPoints[0].position = new Vector2( x, yUp );
              pipe.controlPoints[numControlPoints - 1].position = new Vector2( x, yLow );
              /*pipeNode.controlPointNodes[0].bottom -= 10;
               pipeNode.controlPointNodes[numControlPoints - 1 ].bottom += 10;*/
              pipeNode.leftPipeNode.setTranslation( layoutBounds.minX - 50, y - 60 );
              pipeNode.leftPipeBackNode.setTranslation( layoutBounds.minX - 50, y - 60 );
              pipeMainDragHandles[j].setTranslation( layoutBounds.minX - 10, y );

            }
            else {
              yUp = modelViewTransform.viewToModelY( pipeNode.rightPipeNode.getTop() ) - 0.4;
              yLow = modelViewTransform.viewToModelY( pipeNode.rightPipeNode.getBottom() ) + 0.4;
              // right pipe handle
              pipe.controlPoints[numControlPoints / 2 - 1].position = new Vector2( x, yUp );
              pipe.controlPoints[numControlPoints / 2].position = new Vector2( x, yLow );
              pipeMainDragHandles[j].setTranslation( layoutBounds.maxX - 50, y );
              pipeNode.rightPipeNode.setTranslation( layoutBounds.maxX - 75, y - 60 );

            }

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
        this.leftPipeNode.setMatrix( Matrix3.translation( this.layoutBounds.minX - 50, this.skyNodegroundY + this.pipeNodeYOffset ) );
        this.leftPipeNode.scale( 0.6, 0.6, false );
        this.leftPipeBackNode.setMatrix( Matrix3.translation( this.layoutBounds.minX - 50, this.skyNodegroundY + this.pipeNodeYOffset ) );
        this.leftPipeBackNode.scale( 0.6, 0.6, false );
        this.rightPipeNode.setMatrix( Matrix3.translation( this.layoutBounds.maxX - 75, this.skyNodegroundY + this.pipeNodeYOffset ) );
        this.rightPipeNode.scale( 0.6, 0.6, false );
        this.leftPipeMainHandleNode.setTranslation( this.layoutBounds.minX - 10, this.leftPipeNode.getCenterY() );
        this.rightPipeMainHandleNode.setTranslation( this.layoutBounds.maxX - 50, this.rightPipeNode.getCenterY() );
        // for getting new spline cross sections
        this.pipe.dirty = true;
        this.pipe.createSpline();
        this.updatePipeFlowLineShape();
        var numControlPoints = this.pipe.controlPoints.length;
        for ( var i = 0; i < numControlPoints; i++ ) {
          if ( i === 0 || i === (numControlPoints / 2 - 1) ) {
            this.controlPointNodes[i].bottom = this.scaleControlPointYPositions[i];
          }
          else if ( i === numControlPoints - 1 || i === numControlPoints / 2 ) {
            this.controlPointNodes[i].bottom = this.scaleControlPointYPositions[i];
          }
        }
      }
    } );
} );