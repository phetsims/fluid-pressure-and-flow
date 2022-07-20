// Copyright 2013-2022, University of Colorado Boulder

/**
 * View for water in Chamber Pool
 *
 * @author Vasily Shakhov (Mlearner)
 */

import { Shape } from '../../../../kite/js/imports.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class ChamberPoolWaterNode extends Node {

  /**
   * @param {ChamberPoolModel} chamberPoolModel
   * @param {ModelViewTransform2} modelViewTransform for transforming between model and view co-ordinates
   */
  constructor( chamberPoolModel, modelViewTransform ) {
    super();

    const waterPath = new Path( null );
    const poolDimensions = chamberPoolModel.poolDimensions;

    //calculated view coordinates for water
    const leftOpeningX1 = modelViewTransform.modelToViewX( poolDimensions.leftOpening.x1 );
    const leftOpeningX2 = modelViewTransform.modelToViewX( poolDimensions.leftOpening.x2 );
    const leftChamberX1 = modelViewTransform.modelToViewX( poolDimensions.leftChamber.x1 );
    const leftChamberX2 = modelViewTransform.modelToViewX( poolDimensions.leftChamber.x2 );
    const rightChamberX1 = modelViewTransform.modelToViewX( poolDimensions.rightChamber.x1 );
    const rightChamberX2 = modelViewTransform.modelToViewX( poolDimensions.rightChamber.x2 );
    const rightOpeningX1 = modelViewTransform.modelToViewX( poolDimensions.rightOpening.x1 );
    const rightOpeningX2 = modelViewTransform.modelToViewX( poolDimensions.rightOpening.x2 );
    const leftOpeningY2 = modelViewTransform.modelToViewY( poolDimensions.leftOpening.y2 );
    const leftChamberY2 = modelViewTransform.modelToViewY( poolDimensions.leftChamber.y2 );
    const passageY1 = modelViewTransform.modelToViewY( poolDimensions.horizontalPassage.y1 );
    const passageY2 = modelViewTransform.modelToViewY( poolDimensions.horizontalPassage.y2 );

    chamberPoolModel.leftDisplacementProperty.link( displacement => {

      //new left and right levels of water
      const leftY = modelViewTransform.modelToViewY( poolDimensions.leftOpening.y2 + chamberPoolModel.leftWaterHeight -
                                                     displacement );
      const rightY = modelViewTransform.modelToViewY( poolDimensions.rightOpening.y2 + chamberPoolModel.leftWaterHeight +
                                                      displacement / chamberPoolModel.lengthRatio );

      waterPath.shape = new Shape()
        .moveTo( leftOpeningX1, leftY )
        .lineTo( leftOpeningX1, leftOpeningY2 )
        .lineTo( leftChamberX1, leftOpeningY2 )
        .lineTo( leftChamberX1, leftChamberY2 )
        .lineTo( leftChamberX2, leftChamberY2 )
        .lineTo( leftChamberX2, passageY2 )
        .lineTo( rightChamberX1, passageY2 )
        .lineTo( rightChamberX1, leftChamberY2 )
        .lineTo( rightChamberX2, leftChamberY2 )
        .lineTo( rightChamberX2, leftOpeningY2 )
        .lineTo( rightOpeningX2, leftOpeningY2 )
        .lineTo( rightOpeningX2, rightY )
        .lineTo( rightOpeningX1, rightY )
        .lineTo( rightOpeningX1, leftOpeningY2 )
        .lineTo( rightChamberX1, leftOpeningY2 )
        .lineTo( rightChamberX1, passageY1 )
        .lineTo( leftChamberX2, passageY1 )
        .lineTo( leftChamberX2, leftOpeningY2 )
        .lineTo( leftOpeningX2, leftOpeningY2 )
        .lineTo( leftOpeningX2, leftY );
    } );

    chamberPoolModel.underPressureModel.fluidColorModel.colorProperty.linkAttribute( waterPath, 'fill' );

    this.addChild( waterPath );
  }
}

fluidPressureAndFlow.register( 'ChamberPoolWaterNode', ChamberPoolWaterNode );
export default ChamberPoolWaterNode;