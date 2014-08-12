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
  var RoundStickyToggleButton = require( 'SUN/Buttons/RoundStickyToggleButton' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Shape = require( 'KITE/Shape' );
  var SplineEvaluation = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/SplineEvaluation' );

  // images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle-with-bar.png' );
  var leftPipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-left.png' );
  var pipeMiddleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-segment.png' );
  var rightSidePipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-right.png' );
  var injectorBulbImage = require( 'image!FLUID_PRESSURE_AND_FLOW/injector-bulb.png' );

  /*
   * Constructor for PipeNode
   * @param {flowModel} the entire model.
   * @param {pipe} the pipe model  for this pipe node
   * @param {modelViewTransform }the model view transform for the view
   * @param {layBounds}
   *  @param {options}
   * @constructor
   */
  function PipeNode( flowModel, pipe, modelViewTransform, layBounds, options ) {
    var pipeNode = this;
    Node.call( this );
    options = _.extend( {
      lineColor: '#613705',
      x: 0,
      y: 300,
      pipeScale: 0.6,
      imageRotation: Math.PI
    }, options );
    this.modelViewTransform = modelViewTransform;


    //left side pipe image.
    var leftPipe = new Image( leftPipeImage, { scale: options.pipeScale} );
    var leftPipeMiddle = [];
    leftPipeMiddle[0] = new Image( pipeMiddleImage, { right: leftPipe.left + 20, scale: options.pipeScale} );
    for ( var j = 1; j < 14; j++ ) {
      leftPipeMiddle[j] = new Image( pipeMiddleImage, { right: leftPipeMiddle[j - 1].left + 1, scale: options.pipeScale} );
    }
    this.leftPipeNode = new Node( {children: [leftPipe], left: layBounds.minX - 40, scale: options.pipeScale} );

    for ( j = 0; j < 14; j++ ) {
      this.leftPipeNode.addChild( leftPipeMiddle[j] );
    }


    var pipeFlowLine = new Path( null, {stroke: options.lineColor, top: this.leftPipeNode.bottom, lineWidth: '6', fill: flowModel.fluidColorModel.color} );

    // right side pipe image.
    var rightPipe = new Image( rightSidePipeImage, { scale: options.pipeScale} );
    var rightPipeMiddle = [];
    rightPipeMiddle[0] = new Image( pipeMiddleImage, { right: rightPipe.right - 1, scale: options.pipeScale} );
    for ( j = 1; j < 14; j++ ) {
      rightPipeMiddle[j] = new Image( pipeMiddleImage, { left: rightPipeMiddle[j - 1].right - 1, scale: options.pipeScale} );
    }
    this.rightPipeNode = new Node( {children: [rightPipe], bottom: this.leftPipeNode.bottom, left: layBounds.maxX - 80, scale: options.pipeScale } );
    for ( j = 0; j < 14; j++ ) {
      this.rightPipeNode.addChild( rightPipeMiddle[j] );
    }


    var injector = new Image( injectorBulbImage, {scale: 0.3, left: leftPipe.right - 130, bottom: leftPipe.top + 20} );
    var redButton = new RoundStickyToggleButton( 0, 23, flowModel.isFluxMeterVisibleProperty, {radius: 20, center: injector.center, top: injector.top + 25, baseColor: 'red', stroke: 'red', fill: 'red'} );
    this.gridParticleButton = new Node( {children: [injector, redButton]} );
    pipeNode.addChild( this.gridParticleButton );
    this.addChild( pipeFlowLine );

    this.addChild( this.rightPipeNode );
    this.addChild( this.leftPipeNode );


    flowModel.fluidColorModel.colorProperty.linkAttribute( pipeFlowLine, 'fill' );

    // for line smoothness
    var lastPt = (pipe.controlPoints.length - 1) / pipe.controlPoints.length;
    var linSpace = numeric.linspace( 0, lastPt, 20 * (pipe.controlPoints.length - 1) );

    // update the PipeFlowLineShape
    this.updatePipeFlowLineShape = function() {
      var i;
      //Compute points for lineTo
      var xPoints = SplineEvaluation.atArray( pipe.xSpline, linSpace );
      var yPoints = SplineEvaluation.atArray( pipe.ySpline, linSpace );

      var shape = new Shape().moveTo( modelViewTransform.modelToViewX( xPoints[0] ), modelViewTransform.modelToViewY( yPoints[0] ) );
      //Show the pipe flow line at reduced resolution while dragging so it will be smooth and responsive while dragging
      for ( i = 1; i < xPoints.length; i = i + 1 ) {
        shape.lineTo( modelViewTransform.modelToViewX( xPoints[i] ), modelViewTransform.modelToViewY( yPoints[i] ) );
      }
      //If at reduced resolution, still make sure we draw to the end point
      if ( i !== xPoints.length - 1 ) {
        i = xPoints.length - 1;
        shape.lineTo( modelViewTransform.modelToViewX( xPoints[i] ), modelViewTransform.modelToViewY( yPoints[i] ) );
      }
      pipeFlowLine.shape = shape;

    };

    // control points dragging
    for ( var i = 0; i < pipe.controlPoints.length; i++ ) {
      (function( i ) {
        var controlPoint = pipe.controlPoints[i];

        var leftSpace = 20;
        if ( pipe.controlPoints[i].position.y < 30 ) {
          options.imageRotation = 0;
          leftSpace = 0;
        }
        else {
          options.imageRotation = Math.PI;
          leftSpace = 30;
        }
        var handleNode = new Image( handleImage, {bottom: 25, left: leftSpace, cursor: 'pointer', scale: 0.3} );
        handleNode.setRotation( options.imageRotation );
        var controlPointNode = new Node( {children: [handleNode ], translation: modelViewTransform.modelToViewPosition( controlPoint.position )} );
        controlPoint.positionProperty.link( function( position ) {
          controlPointNode.translation = modelViewTransform.modelToViewPosition( position );
        } );

        controlPointNode.addInputListener( new SimpleDragHandler(
          {
            drag: function( event ) {
              var globalPoint = controlPointNode.globalToParentPoint( event.pointer.point );
              var pt = modelViewTransform.viewToModelPosition( globalPoint );
              pt.x = flowModel.pipeControlPoints[i].position.x;
              pt.y > 35 ? pt.y = 35 : pt.y < -20 ? pt.y = -20 : pt.y;
              if ( i === 2 || i === 1 ) {
                pipeNode.gridParticleButton.setTranslation( modelViewTransform.modelToViewX( flowModel.pipeControlPoints[2].position.x ) - 100, modelViewTransform.modelToViewY( flowModel.pipeControlPoints[i].position.y ) );
                controlPoint.sourcePosition = pt;
              }
              else {
                controlPoint.sourcePosition = pt;
              }

              // When a control point is dragged, update the pipe flow line shape and the node shape
              pipe.updateSplines();
              pipeNode.updatePipeFlowLineShape();
            }

          } ) );
        pipeNode.addChild( controlPointNode );
      })( i );
    }

    //Init the PipeFlow Line shape
    this.updatePipeFlowLineShape();
    pipe.on( 'reset', pipeNode.updatePipeFlowLineShape );
    this.mutate( options );
  }

  return inherit( Node, PipeNode,
    {
      reset: function() {
        this.gridParticleButton.reset();
      }
    } );
} );