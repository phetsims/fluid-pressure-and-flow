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
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle-with-bar.png' );
  var leftPipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-left.png' );
  var pipeMiddleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-segment.png' );
  var rightSidePipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-right.png' );

  // functions for determining image scaling
  var upToDownScale = new LinearFunction( 0, 1, 0.9, 0.5 );
  var downToUpScale = new LinearFunction( 2, 4, 0.6, 0.9 );
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

    //left side pipe image.
    var leftPipe = new Image( leftPipeImage, { scale: options.pipeScale} );
    var leftPipeMiddle = [];
    leftPipeMiddle[0] = new Image( pipeMiddleImage, { right: leftPipe.left + 20, scale: options.pipeScale} );
    for ( var j = 1; j < 40; j++ ) {
      leftPipeMiddle[j] = new Image( pipeMiddleImage, { right: leftPipeMiddle[j - 1].left + 1, scale: options.pipeScale} );
    }
    this.leftPipeNode = new Node( {children: [leftPipe], top: 143 + 30, left: layoutBounds.minX - 40, scale: options.pipeScale} );
    for ( j = 0; j < 40; j++ ) {
      this.leftPipeNode.addChild( leftPipeMiddle[j] );
    }

    this.pipeFlowLine = new Path( null, {stroke: options.lineColor, left: this.leftPipeNode.right, lineWidth: '6', fill: flowModel.fluidColorModel.color} );

    // right side pipe image.
    var rightPipe = new Image( rightSidePipeImage, { scale: options.pipeScale} );
    var rightPipeMiddle = [];
    rightPipeMiddle[0] = new Image( pipeMiddleImage, { right: rightPipe.right - 1, scale: options.pipeScale} );
    for ( j = 1; j < 40; j++ ) {
      rightPipeMiddle[j] = new Image( pipeMiddleImage, { left: rightPipeMiddle[j - 1].right - 1, scale: options.pipeScale} );
    }
    this.rightPipeNode = new Node( {children: [rightPipe], bottom: this.leftPipeNode.bottom, left: layoutBounds.maxX - 80, scale: options.pipeScale } );
    for ( j = 0; j < 40; j++ ) {
      this.rightPipeNode.addChild( rightPipeMiddle[j] );
    }

    this.addChild( this.pipeFlowLine );
    this.addChild( this.rightPipeNode );
    this.addChild( this.leftPipeNode );

    // add handles to drag the pipe
    this.leftPipeMainHandleNode = new Image( handleImage, { top: this.leftPipeNode.top + 60, right: 20, cursor: 'pointer', scale: 0.3} );
    this.addChild( this.leftPipeMainHandleNode );
    this.rightPipeMainHandleNode = new Image( handleImage, {top: this.rightPipeNode.top + 60, left: layoutBounds.maxX - 50, cursor: 'pointer', scale: 0.3} );
    this.addChild( this.rightPipeMainHandleNode );

    this.layoutBounds = layoutBounds;

    flowModel.fluidColorModel.colorProperty.linkAttribute( this.pipeFlowLine, 'fill' );

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
        shape.lineTo( modelViewTransform.modelToViewX( xPointsBottom[i] ), modelViewTransform.modelToViewY( yPointsBottom[i] ) );
      }
      for ( i = xPointsTop.length - 1; i > 0; i = i - 1 ) {
        shape.lineTo( modelViewTransform.modelToViewX( xPointsTop[i] ), modelViewTransform.modelToViewY( yPointsTop[i] ) );
      }
      this.pipeFlowLine.shape = shape;
    };

    var controlPointNode = [];
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

        var handleNode = new Image( handleImage, {left: leftSpace, cursor: 'pointer', scale: 0.3} );
        handleNode.setRotation( imageRotation );
        controlPointNode[i] = new Node( {children: [handleNode ]} );
        controlPoint.positionProperty.link( function( position ) {
          controlPointNode[i].setTranslation( modelViewTransform.modelToViewX( position.x ), modelViewTransform.modelToViewY( position.y ) );
        } );

        controlPointNode[i].addInputListener( new SimpleDragHandler(
          {

            drag: function( event ) {
              var globalPoint = controlPointNode[i].globalToParentPoint( event.pointer.point );
              var pt = modelViewTransform.viewToModelPosition( globalPoint );
              pt.x = pipe.controlPoints[i].position.x;
              pt.y = (pt.y > 0 ? 0 : ( pt.y < -4 ? -4 : pt.y));
              if ( (i < numControlPoints / 2 && pt.y < pipe.controlPoints[numControlPoints - (i + 1)].position.y) || (i >= numControlPoints / 2 && pt.y > pipe.controlPoints[numControlPoints - (i + 1)].position.y) ) {
                return;
              }


              var pipeScale = 0.4;
              var matrix;
              if ( i === numControlPoints - 1 || i === 0 ) {
                pipeScale = (i === numControlPoints - 1 ? downToUpScale( Math.abs( pt.y ) ) : upToDownScale( Math.abs( pt.y ) ));
                pipeScale = pipeScale < 0.4 ? 0.4 : pipeScale;
                matrix = Matrix3.translation( layoutBounds.minX, modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y ) );
                pipeNode.leftPipeNode.setMatrix( matrix );
                pipeNode.leftPipeNode.scale( 0.3, pipeScale, false );
                if ( i === 0 ) {
                  pipeNode.leftPipeNode.top = modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y );
                  pipeNode.leftPipeMainHandleNode.setTranslation( pipeNode.layoutBounds.minX - 10, modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y ) + 60 );
                }
                else {
                  pipeNode.leftPipeNode.bottom = modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y );
                  pipeNode.leftPipeMainHandleNode.setTranslation( pipeNode.layoutBounds.minX - 10, modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y ) - 60 );
                }
              }
              if ( i === numControlPoints / 2 || i === (numControlPoints / 2 - 1) ) {
                pipeScale = (i === numControlPoints / 2 ? downToUpScale( Math.abs( pt.y ) ) : upToDownScale( Math.abs( pt.y ) ));
                pipeScale = pipeScale < 0.4 ? 0.4 : pipeScale;
                console.log( modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y ) + " pipe node y position" );
                matrix = Matrix3.translation( layoutBounds.maxX - 80, modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y ) );
                pipeNode.rightPipeNode.setMatrix( matrix );
                pipeNode.rightPipeNode.scale( 0.5, pipeScale, false );
                if ( i === (numControlPoints / 2 - 1) ) {
                  pipeNode.rightPipeNode.top = modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y );
                  pipeNode.rightPipeMainHandleNode.setTranslation( layoutBounds.maxX - 50, modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y ) + 60 );
                }
                else {
                  pipeNode.rightPipeNode.bottom = modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y );
                  pipeNode.rightPipeMainHandleNode.setTranslation( layoutBounds.maxX - 50, modelViewTransform.modelToViewY( pipe.controlPoints[i].position.y ) - 60 );
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
              //todo: find a better way. This is to trigger an update on the fluxMeter
              flowModel.fluxMeter.xPosition += 1E-9;
            }

          } ) );
        pipeNode.addChild( controlPointNode[i] );
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
            var yUp = pt.y + 1;
            var yLow = pt.y - 1;
            if ( pt.y > -1 || pt.y < -3 ) {
              return;
            }
            y < 192 ? y = 192 : y > 290 ? y = 290 : y;

            if ( j === 0 ) {
              // left pipe handle
              pipe.controlPoints[0].position = new Vector2( x, yUp );
              pipe.controlPoints[numControlPoints - 1].position = new Vector2( x, yLow );
              pipeMainDragHandles[j].setTranslation( layoutBounds.minX - 10, y );
              pipeNode.leftPipeNode.setTranslation( layoutBounds.minX - 40, y - 60 );
            }
            else {
              // right pipe handle
              pipe.controlPoints[numControlPoints / 2 - 1].position = new Vector2( x, yUp );
              pipe.controlPoints[numControlPoints / 2].position = new Vector2( x, yLow );
              pipeMainDragHandles[j].setTranslation( layoutBounds.maxX - 50, y );
              pipeNode.rightPipeNode.setTranslation( layoutBounds.maxX - 80, y - 60 );
            }
            pipe.dirty = true;
            pipe.createSpline();
            pipeNode.updatePipeFlowLineShape();
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
        this.leftPipeNode.setTranslation( this.layoutBounds.minX - 40, this.modelViewTransform.modelToViewY( 0 ) + 33 );
        this.rightPipeNode.setTranslation( this.layoutBounds.maxX - 80, this.modelViewTransform.modelToViewY( 0 ) + 33 );
        this.leftPipeMainHandleNode.setTranslation( this.layoutBounds.minX - 10, this.modelViewTransform.modelToViewY( 0 ) + 33 + 60 );
        this.rightPipeMainHandleNode.setTranslation( this.layoutBounds.maxX - 50, this.modelViewTransform.modelToViewY( 0 ) + 33 + 60 );
        // for getting new spline cross sections
        this.pipe.dirty = true;
        this.pipe.createSpline();
        this.updatePipeFlowLineShape();
      }
    } );
} );