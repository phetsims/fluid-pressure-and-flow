// Copyright 2014-2022, University of Colorado Boulder

/**
 * View for the pipe consisting of the right and left pipe heads and a flexible middle pipe created using splines.
 *
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Image, Node, Path } from '../../../../scenery/js/imports.js';
import pipeLeftBack_png from '../../../images/pipeLeftBack_png.js';
import pipeLeftFront_png from '../../../images/pipeLeftFront_png.js';
import pipeRight_png from '../../../images/pipeRight_png.js';
import pipeSegment_png from '../../../images/pipeSegment_png.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import ParticleCanvasNode from './ParticleCanvasNode.js';

// constants
const LINE_COLOR = '#613705';
const PIPE_INITIAL_SCALE = 0.36;

// For stretching the pipes off the screen to the left and the right, see #225
const PIPE_SEGMENT_X_SCALE = 100;

class PipeNode extends Node {

  /**
   * @param {FlowModel} flowModel of the simulation.
   * @param {Pipe} pipe model for this pipe node
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @param {Bounds2} layoutBounds of the simulation
   */
  constructor( flowModel, modelViewTransform, layoutBounds ) {

    super();

    this.flowModel = flowModel;
    this.modelViewTransform = modelViewTransform;
    this.layoutBounds = layoutBounds;

    this.leftPipeYOffset = 30; // left pipe top offset w.r.t the left top control point
    this.rightPipeYOffset = 30; // right pipe top offset w.r.t the right top control point
    this.rightPipeLeftOffset = 75;
    const leftPipeX = -49;

    //left side pipe image.
    const leftPipeHead = new Image( pipeLeftFront_png );

    const leftPipeSegment = new Image( pipeSegment_png,
      {
        right: leftPipeHead.left + 30,
        scale: new Vector2( PIPE_SEGMENT_X_SCALE, 1 )
      } );

    this.leftPipeNode = new Node( {
      children: [ leftPipeHead, leftPipeSegment ],
      x: leftPipeX,
      y: flowModel.pipe.leftPipeYPositionProperty.value,
      scale: flowModel.pipe.leftPipeScaleProperty.value
    } );

    this.leftPipeBackNode = new Image( pipeLeftBack_png, {
      x: leftPipeX,
      y: flowModel.pipe.leftPipeYPositionProperty.value,
      scale: flowModel.pipe.leftPipeScaleProperty.value
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
    const emptyBounds = new Bounds2( 0, 0, 0, 0 );
    this.pipeFluidNode.computeShapeBounds = () => {
      return emptyBounds;
    };

    // right side pipe image.
    const rightPipeHead = new Image( pipeRight_png );
    const rightPipeMiddle = new Image( pipeSegment_png,
      { left: rightPipeHead.right - 50, scale: new Vector2( PIPE_SEGMENT_X_SCALE, 1 ) } );

    this.rightPipeNode = new Node( {
      children: [ rightPipeHead, rightPipeMiddle ],
      x: layoutBounds.maxX - this.rightPipeLeftOffset,
      y: flowModel.pipe.rightPipeYPositionProperty.value,
      scale: flowModel.pipe.rightPipeScaleProperty.value
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
    flowModel.pipe.leftPipeScaleProperty.link( scale => {
      this.leftPipeNode.setScaleMagnitude( PIPE_INITIAL_SCALE, scale );
      this.leftPipeBackNode.setScaleMagnitude( PIPE_INITIAL_SCALE, scale );
    } );

    flowModel.pipe.rightPipeScaleProperty.link( scale => {
      this.rightPipeNode.setScaleMagnitude( PIPE_INITIAL_SCALE, scale );
    } );

    // link the left/right pipe position properties to the left/right pipe nodes
    flowModel.pipe.leftPipeYPositionProperty.linkAttribute( this.leftPipeNode, 'y' );
    flowModel.pipe.leftPipeYPositionProperty.linkAttribute( this.leftPipeBackNode, 'y' );
    flowModel.pipe.rightPipeYPositionProperty.linkAttribute( this.rightPipeNode, 'y' );

    flowModel.fluidColorModel.colorProperty.linkAttribute( this.pipeFluidNode, 'fill' );

    // init the flexible middle pipe flow line shape
    this.updatePipeFlowLineShape();
  }

  /**
   * update the pipe flow line shape (the flexible middle pipe)
   * @private
   */
  updatePipeFlowLineShape() {

    // getting cross sections
    const splineCrossSections = this.flowModel.pipe.getSplineCrossSections();

    const xPointsBottom = new Array( splineCrossSections.length );
    const yPointsBottom = new Array( splineCrossSections.length );
    const xPointsTop = new Array( splineCrossSections.length );
    const yPointsTop = new Array( splineCrossSections.length );

    const minXOfPipeFlowLineShape = -6.7; // model value
    const maxXOfPipeFlowLineShape = 6.7;

    let startIndex = 0;
    let endIndex = 0;

    //  points for lineTo
    for ( let i = 0; i < splineCrossSections.length; i++ ) {
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

    const flowLineShape = new Shape().moveTo( this.modelViewTransform.modelToViewX( xPointsBottom[ startIndex + 1 ] ),
      this.modelViewTransform.modelToViewY( yPointsBottom[ startIndex + 1 ] ) );

    // Spline points beyond the last pipe cross section are not needed.
    for ( let i = startIndex + 2; i <= endIndex; i++ ) {
      flowLineShape.lineTo( this.modelViewTransform.modelToViewX( xPointsBottom[ i ] ),
        this.modelViewTransform.modelToViewY( yPointsBottom[ i ] ) );
    }

    // Spline points beyond the last pipe cross section are not needed.
    for ( let i = endIndex; i > startIndex; i-- ) {
      flowLineShape.lineTo( this.modelViewTransform.modelToViewX( xPointsTop[ i ] ),
        this.modelViewTransform.modelToViewY( yPointsTop[ i ] ) );
    }
    this.pipeFlowLine.shape = flowLineShape;
    this.pipeFluidNode.shape = flowLineShape;
  }

  /**
   * @public
   */
  reset() {
    // mark pipe as dirty for getting new spline cross sections
    this.flowModel.pipe.dirty = true;
    this.updatePipeFlowLineShape();
    this.flowModel.fluxMeter.updateEmitter.emit();
  }
}

fluidPressureAndFlow.register( 'PipeNode', PipeNode );
export default PipeNode;