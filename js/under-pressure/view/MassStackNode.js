// Copyright 2013-2022, University of Colorado Boulder

/**
 * View for mass stack on top of water. Masses don't stack on ground.
 *
 * @author Vasily Shakhov (Mlearner)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Node, Path, Rectangle } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class MassStackNode extends Node {

  /**
   * @param {ChamberPoolModel} chamberPoolModel
   * @param {ModelViewTransform2} modelViewTransform for transforming between model and view co-ordinates
   */
  constructor( chamberPoolModel, modelViewTransform ) {

    super( {
      x: modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftOpening.x1 )
    } );

    this.chamberPoolModel = chamberPoolModel;

    this.totalHeight = 0; //height of all masses

    const placementRectWidth = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftOpening.x2 -
                                                                chamberPoolModel.poolDimensions.leftOpening.x1 );

    const placementRect = new Rectangle( 0, 0, placementRectWidth, 0 );
    const placementRectBorder = new Path( new Shape(),
      { stroke: '#000', lineWidth: 2, lineDash: [ 10, 5 ], fill: '#ffdcf0' } );

    this.addChild( placementRect );
    this.addChild( placementRectBorder );

    chamberPoolModel.leftDisplacementProperty.link( displacement => {
      this.bottom = modelViewTransform.modelToViewY( chamberPoolModel.poolDimensions.leftOpening.y2 +
                                                     chamberPoolModel.leftWaterHeight - displacement );
    } );

    // If a mass is being dragged by the user, show the dotted line drop region where it can be placed in the chamber pool.
    chamberPoolModel.masses.forEach( massModel => {
      massModel.isDraggingProperty.link( isDragging => {
        if ( isDragging ) {
          const placementRectHeight = Math.abs( modelViewTransform.modelToViewDeltaY( massModel.height ) );
          const placementRectY1 = -placementRectHeight +
                                  modelViewTransform.modelToViewDeltaY( this.totalHeight );

          placementRectBorder.shape = new Shape().moveTo( 0, placementRectY1 )
            .lineTo( 0, placementRectY1 + placementRectHeight )
            .lineTo( placementRectWidth, placementRectY1 + placementRectHeight )
            .lineTo( placementRectWidth, placementRectY1 )
            .lineTo( 0, placementRectY1 );

          placementRectBorder.visible = true;
        }
        else {
          placementRectBorder.visible = false;
        }
      } );
    } );

    chamberPoolModel.stack.addItemAddedListener( () => {
      this.updateMassStack();
    } );
    chamberPoolModel.stack.addItemRemovedListener( () => {
      this.updateMassStack();
    } );
  }

  /**
   * @public
   */
  updateMassPositions() {
    let dy = 0;
    const chamberPoolModel = this.chamberPoolModel;
    chamberPoolModel.stack.forEach( massModel => {
      massModel.positionProperty.value = new Vector2( chamberPoolModel.poolDimensions.leftOpening.x1 + massModel.width / 2,
        chamberPoolModel.poolDimensions.leftOpening.y2 + chamberPoolModel.leftWaterHeight -
        chamberPoolModel.leftDisplacementProperty.value + dy + massModel.height / 2 );
      dy += massModel.height;
    } );
  }

  /**
   * @public
   */
  updateMassStack() {
    let totHeight = 0;

    this.chamberPoolModel.stack.forEach( massModel => {
      if ( massModel ) {
        totHeight += massModel.height;
      }
    } );
    this.totalHeight = totHeight;
    this.updateMassPositions();
  }
}

fluidPressureAndFlow.register( 'MassStackNode', MassStackNode );
export default MassStackNode;