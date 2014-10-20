// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * View for the pipe consisting of the right and left pipe heads and a flexible middle pipe created using splines.
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var ParticleCanvasNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/ParticleCanvasNode' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // images
  var leftPipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-left-front.png' );
  var pipeSegmentImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-segment.png' );
  var rightSidePipeImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-right.png' );
  var leftPipeBackImage = require( 'image!FLUID_PRESSURE_AND_FLOW/pipe-left-back.png' );

  // constants
  var LINE_COLOR = '#613705';
  var PIPE_INITIAL_SCALE = 0.36;
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

    var pipeNode = this;
    Node.call( this );
    this.flowModel = flowModel;
    this.modelViewTransform = modelViewTransform;
    this.layoutBounds = layoutBounds;

    this.leftPipeYOffset = 30; // left pipe top offset w.r.t the left top control point
    this.rightPipeYOffset = 30; // right pipe top offset w.r.t the right top control point
    this.leftPipeRightOffset = 55;
    this.rightPipeLeftOffset = 75;

    //left side pipe image.
    var leftPipeHead = new Image( leftPipeImage );

    var leftPipeSegment = new Image( pipeSegmentImage,
      {
        right: leftPipeHead.left + 30,
        scale: new Vector2( PIPE_SEGMENT_X_SCALE, 1 )
      } );

    this.leftPipeNode = new Node( {
      children: [ leftPipeHead, leftPipeSegment ],
      x: flowModel.pipe.leftPipePosition.x,
      y: flowModel.pipe.leftPipePosition.y,
      scale: flowModel.pipe.leftPipeScale
    } );

    var leftPipeWidth = leftPipeHead.getImageWidth() * PIPE_INITIAL_SCALE;
    this.leftPipeLeftOffset = leftPipeWidth - this.leftPipeRightOffset;

    this.leftPipeBackNode = new Node( {
      children: [ new Image( leftPipeBackImage ) ],
      x: flowModel.pipe.leftPipePosition.x,
      y: flowModel.pipe.leftPipePosition.y,
      scale: flowModel.pipe.leftPipeScale
    } );

    // shape for the pipelines
    this.pipeFlowLine = new Path( null, { stroke: LINE_COLOR, lineWidth: 6 } );

    // Shape for fluid. Although this is identical in "shape" to pipeFlowLine, a separate node is used to layer
    // the particles between fluid and the pipelines so that they appear on top of fluid and don't protrude over the pipe.
    // See https://github.com/phetsims/fluid-pressure-and-flow/issues/183
    this.pipeFluidNode = new Path( null, { stroke: LINE_COLOR, lineWidth: 0, fill: flowModel.fluidColorModel.color } );

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
      x: flowModel.pipe.rightPipePosition.x,
      y: flowModel.pipe.rightPipePosition.y,
      scale: flowModel.pipe.rightPipeScale
    } );

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

    // link the left/right pipe scale properties to the left/right pipe nodes
    flowModel.pipe.leftPipeScaleProperty.link( function( scale ) {
      pipeNode.leftPipeNode.setScaleMagnitude( PIPE_INITIAL_SCALE, scale );
      pipeNode.leftPipeBackNode.setScaleMagnitude( PIPE_INITIAL_SCALE, scale );
    } );

    flowModel.pipe.rightPipeScaleProperty.link( function( scale ) {
      pipeNode.rightPipeNode.setScaleMagnitude( PIPE_INITIAL_SCALE, scale );
    } );

    // link the left/right pipe position properties to the left/right pipe nodes
    flowModel.pipe.leftPipePositionProperty.linkAttribute( pipeNode.leftPipeNode, 'translation' );
    flowModel.pipe.leftPipePositionProperty.linkAttribute( pipeNode.leftPipeBackNode, 'translation' );
    flowModel.pipe.rightPipePositionProperty.linkAttribute( pipeNode.rightPipeNode, 'translation' );

    flowModel.fluidColorModel.colorProperty.linkAttribute( pipeNode.pipeFluidNode, 'fill' );

    // init the flexible middle pipe flow line shape
    this.updatePipeFlowLineShape();
  }

  return inherit( Node, PipeNode,
    {
      // update the pipe flow line shape (the flexible middle pipe)
      // @private
      updatePipeFlowLineShape: function() {

        var i;

        // getting cross sections
        var splineCrossSections = this.flowModel.pipe.getSplineCrossSections();

        var xPointsBottom = new Array( splineCrossSections.length );
        var yPointsBottom = new Array( splineCrossSections.length );
        var xPointsTop = new Array( splineCrossSections.length );
        var yPointsTop = new Array( splineCrossSections.length );

        //  points for lineTo
        for ( i = 0; i < splineCrossSections.length; i++ ) {
          xPointsBottom[i] = splineCrossSections[i].x;
          yPointsBottom[i] = splineCrossSections[i].yBottom;
          xPointsTop[i] = splineCrossSections[i].x;
          yPointsTop[i] = splineCrossSections[i].yTop;
        }

        var flowLineShape = new Shape().moveTo( this.modelViewTransform.modelToViewX( xPointsBottom[ 0 ] ),
          this.modelViewTransform.modelToViewY( yPointsBottom[ 0 ] ) );

        var minXOfPipeFlowLineShape = -6.7; // model value
        var maxXOfPipeFlowLineShape = 6.8;

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

        // mark pipe as dirty for getting new spline cross sections
        this.flowModel.pipe.dirty = true;
        this.updatePipeFlowLineShape();
        this.flowModel.fluxMeter.trigger( 'update' );
      }
    } );
} );