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

  // images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle-with-bar.png' );
  var leftPipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-left.png' );
  var pipeMiddleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-segment.png' );
  var rightSidePipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-right.png' );

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
      pipeScale: 0.6,
      imageRotation: Math.PI
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
    //console.log(this.leftPipeNode.bottom);
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
              pt.y  = (pt.y > 0 ? 0 : ( pt.y < -4 ? -4 : pt.y));
              if ( (i < numControlPoints / 2 && pt.y < pipe.controlPoints[numControlPoints - (i + 1)].position.y) || (i >= numControlPoints / 2 && pt.y > pipe.controlPoints[numControlPoints - (i + 1)].position.y) ) {
                return;
              }

              var yDiff = Math.abs( (pipe.controlPoints[numControlPoints - (i + 1)].position.y) - pt.y );
              if ( yDiff > 1 ) {
                controlPoint.position = pt;
                // When a control point is dragged, update the pipe flow line shape and the node shape
                pipe.dirty = true;
                pipe.createSpline();
                pipeNode.updatePipeFlowLineShape();
              }
            }

          } ) );
        pipeNode.addChild( controlPointNode[i] );
      })( i );
    }

    //Init the PipeFlow Line shape
    pipe.createSpline();
    this.updatePipeFlowLineShape();
    this.mutate( options );
  }

  return inherit( Node, PipeNode,
    {
      reset: function() {
        this.pipe.createSpline();
        this.updatePipeFlowLineShape();
      }
    } );
} );