// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the pipe consisting of the right and left pipe heads and a flexible middle pipe created using splines.
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
  var ParticleCanvasNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/ParticleCanvasNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var leftPipeBackImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-left-back.png' );
  var leftPipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-left-front.png' );
  var pipeSegmentImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-segment.png' );
  var rightSidePipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-right.png' );

  // constants
  var LINE_COLOR = '#613705';
  var PIPE_INITIAL_SCALE = 0.36;

  // For stretching the pipes off the screen to the left and the right, see #225
  var PIPE_SEGMENT_X_SCALE = 100;

  /*
   * Constructor for PipeNode
   * @param {FlowModel} flowModel of the simulation.
   * @param {Pipe} pipe model for this pipe node
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @param {Bounds2} layoutBounds of the simulation
   * @constructor
   */
  function PipeNode( flowModel, modelViewTransform, layoutBounds ) {

    var self = this;
    Node.call( this );
    this.flowModel = flowModel;
    this.modelViewTransform = modelViewTransform;
    this.layoutBounds = layoutBounds;

    this.leftPipeYOffset = 30; // left pipe top offset w.r.t the left top control point
    this.rightPipeYOffset = 30; // right pipe top offset w.r.t the right top control point
    this.rightPipeLeftOffset = 75;
    var leftPipeX = -49;

    //left side pipe image.
    var leftPipeHead = new Image( leftPipeImage );

    var leftPipeSegment = new Image( pipeSegmentImage,
      {
        right: leftPipeHead.left + 30,
        scale: new Vector2( PIPE_SEGMENT_X_SCALE, 1 )
      } );

    this.leftPipeNode = new Node( {
      children: [ leftPipeHead, leftPipeSegment ],
      x: leftPipeX,
      y: flowModel.pipe.leftPipeYPosition,
      scale: flowModel.pipe.leftPipeScale
    } );

    this.leftPipeBackNode = new Image( leftPipeBackImage, {
      x: leftPipeX,
      y: flowModel.pipe.leftPipeYPosition,
      scale: flowModel.pipe.leftPipeScale
    } );

    // shape for the pipelines
    this.pipeFlowLine = new Path( null, { stroke: LINE_COLOR, lineWidth: 6 } );

    // Shape for fluid. Although this is identical in "shape" to pipeFlowLine, a separate node is used to layer
    // the particles between fluid and the pipelines so that they appear on top of fluid and don't protrude over the pipe.
    // See https://github.com/phetsims/fluid-pressure-and-flow/issues/183
    this.pipeFluidNode = new Path( null, {
      stroke: LINE_COLOR,
      lineWidth: 0,
      fill: flowModel.fluidColorModel.colorProperty.value
    } );

    // Skip bounds computation to improve performance, see energy-skate-park-basics#245
    // Qualitative tests did not show a significant improvement
    var emptyBounds = new Bounds2( 0, 0, 0, 0 );
    this.pipeFluidNode.computeShapeBounds = function() {
      return emptyBounds;
    };

    // right side pipe image.
    var rightPipeHead = new Image( rightSidePipeImage );
    var rightPipeMiddle = new Image( pipeSegmentImage,
      { left: rightPipeHead.right - 50, scale: new Vector2( PIPE_SEGMENT_X_SCALE, 1 ) } );

    this.rightPipeNode = new Node( {
      children: [ rightPipeHead, rightPipeMiddle ],
      x: layoutBounds.maxX - self.rightPipeLeftOffset,
      y: flowModel.pipe.rightPipeYPosition,
      scale: flowModel.pipe.rightPipeScale
    } );

    // order of different layers within pipe Node -- leftPipeBackNode, pipeFluidNode, preParticleLayer, pipeFlowLine,
    // leftPipeNode and rightPipeNode
    this.addChild( this.leftPipeBackNode );
    this.addChild( this.pipeFluidNode );

    this.preParticleLayer = new Node();
    this.addChild( this.preParticleLayer );

    this.particlesLayer = new ParticleCanvasNode( flowModel.flowParticles, flowModel.gridParticles, modelViewTransform,
      {
        canvasBounds: new Bounds2( 20, 80, 800, 600 )
      } );
    this.addChild( this.particlesLayer );
    this.addChild( this.pipeFlowLine );

    this.addChild( this.rightPipeNode );
    this.addChild( this.leftPipeNode );

    // link the left/right pipe scale properties to the left/right pipe nodes
    flowModel.pipe.leftPipeScaleProperty.link( function( scale ) {
      self.leftPipeNode.setScaleMagnitude( PIPE_INITIAL_SCALE, scale );
      self.leftPipeBackNode.setScaleMagnitude( PIPE_INITIAL_SCALE, scale );
    } );

    flowModel.pipe.rightPipeScaleProperty.link( function( scale ) {
      self.rightPipeNode.setScaleMagnitude( PIPE_INITIAL_SCALE, scale );
    } );

    // link the left/right pipe position properties to the left/right pipe nodes
    flowModel.pipe.leftPipeYPositionProperty.linkAttribute( self.leftPipeNode, 'y' );
    flowModel.pipe.leftPipeYPositionProperty.linkAttribute( self.leftPipeBackNode, 'y' );
    flowModel.pipe.rightPipeYPositionProperty.linkAttribute( self.rightPipeNode, 'y' );

    flowModel.fluidColorModel.colorProperty.linkAttribute( self.pipeFluidNode, 'fill' );

    // init the flexible middle pipe flow line shape
    this.updatePipeFlowLineShape();
  }

  fluidPressureAndFlow.register( 'PipeNode', PipeNode );

  return inherit( Node, PipeNode,
    {
      // update the pipe flow line shape (the flexible middle pipe)
      // @private
      updatePipeFlowLineShape: function() {

        var i; //for loop

        // getting cross sections
        var splineCrossSections = this.flowModel.pipe.getSplineCrossSections();

        var xPointsBottom = new Array( splineCrossSections.length );
        var yPointsBottom = new Array( splineCrossSections.length );
        var xPointsTop = new Array( splineCrossSections.length );
        var yPointsTop = new Array( splineCrossSections.length );

        var minXOfPipeFlowLineShape = -6.7; // model value
        var maxXOfPipeFlowLineShape = 6.7;
        var startIndex = 0;
        var endIndex = 0;
        //  points for lineTo
        for ( i = 0; i < splineCrossSections.length; i++ ) {
          xPointsBottom[ i ] = splineCrossSections[ i ].x;
          yPointsBottom[ i ] = splineCrossSections[ i ].yBottom;
          xPointsTop[ i ] = splineCrossSections[ i ].x;
          yPointsTop[ i ] = splineCrossSections[ i ].yTop;
          if ( splineCrossSections[ i ].x <= minXOfPipeFlowLineShape ) {
            startIndex = i;
          }
          if ( splineCrossSections[ i ].x <= maxXOfPipeFlowLineShape ) {
            endIndex = i;
          }
        }

        var flowLineShape = new Shape().moveTo( this.modelViewTransform.modelToViewX( xPointsBottom[ startIndex + 1 ] ),
          this.modelViewTransform.modelToViewY( yPointsBottom[ startIndex + 1 ] ) );

        // Spline points beyond the last pipe cross section are not needed.
        for ( i = startIndex + 2; i <= endIndex; i++ ) {
          flowLineShape.lineTo( this.modelViewTransform.modelToViewX( xPointsBottom[ i ] ),
            this.modelViewTransform.modelToViewY( yPointsBottom[ i ] ) );
        }

        // Spline points beyond the last pipe cross section are not needed.
        for ( i = endIndex; i > startIndex; i-- ) {
          flowLineShape.lineTo( this.modelViewTransform.modelToViewX( xPointsTop[ i ] ),
            this.modelViewTransform.modelToViewY( yPointsTop[ i ] ) );
        }
        this.pipeFlowLine.shape = flowLineShape;
        this.pipeFluidNode.shape = flowLineShape;
      },

      reset: function() {
        // mark pipe as dirty for getting new spline cross sections
        this.flowModel.pipe.dirty = true;
        this.updatePipeFlowLineShape();
        this.flowModel.fluxMeter.trigger( 'update' );
      }
    } );
} );