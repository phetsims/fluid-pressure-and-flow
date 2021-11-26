// Copyright 2013-2021, University of Colorado Boulder

/**
 * View for the chamber pool. Chamber pool is a connected pool with two openings on the ground.
 * All the corner angles are 90 degrees.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import { Node } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import ChamberPoolBack from './ChamberPoolBack.js';
import ChamberPoolWaterNode from './ChamberPoolWaterNode.js';
import MassNode from './MassNode.js';
import MassStackNode from './MassStackNode.js';
import TrapezoidPoolGrid from './TrapezoidPoolGrid.js';

class ChamberPoolView extends Node {

  /**
   * @param {ChamberPoolModel} chamberPoolModel
   * @param {ModelViewTransform2} modelViewTransform for transforming between model and view co-ordinates
   * @param {Bounds2} dragBounds - bounds for limiting the dragging of mass nodes.
   */
  constructor( chamberPoolModel, modelViewTransform, dragBounds ) {

    super();

    // add pool
    this.addChild( new ChamberPoolBack( chamberPoolModel, modelViewTransform ) );

    // add water
    this.addChild( new ChamberPoolWaterNode( chamberPoolModel, modelViewTransform ) );

    // add masses
    chamberPoolModel.masses.forEach( massModel => {
      this.addChild( new MassNode( massModel, chamberPoolModel, modelViewTransform, dragBounds ) );
    } );
    // add mass stack
    this.addChild( new MassStackNode( chamberPoolModel, modelViewTransform ) );

    // pool dimensions in view values
    const poolDimensions = chamberPoolModel.poolDimensions;

    const poolLeftX = poolDimensions.leftChamber.x1;
    const poolTopY = poolDimensions.leftOpening.y1;
    const poolRightX = poolDimensions.rightOpening.x2;
    const poolBottomY = poolDimensions.leftChamber.y2 - 0.3;
    const poolHeight = -poolDimensions.leftChamber.y2;
    const labelXPosition = modelViewTransform.modelToViewX( ( poolDimensions.leftChamber.x2 +
                                                              poolDimensions.rightOpening.x1 ) / 2 );

    // add grid
    this.addChild( new TrapezoidPoolGrid( chamberPoolModel.underPressureModel, modelViewTransform, poolLeftX, poolTopY,
      poolRightX, poolBottomY, poolHeight, labelXPosition, 0 ) );
  }
}

fluidPressureAndFlow.register( 'ChamberPoolView', ChamberPoolView );
export default ChamberPoolView;