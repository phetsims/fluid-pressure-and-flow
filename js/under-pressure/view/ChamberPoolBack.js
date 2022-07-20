// Copyright 2013-2022, University of Colorado Boulder

/**
 * View for the chamber pool background containing grass, cement etc grass, cement container
 *
 * @author Vasily Shakhov (Mlearner)
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Node, Path, Pattern, Rectangle } from '../../../../scenery/js/imports.js';
import cementTextureDark_jpg from '../../../images/cementTextureDark_jpg.js';
import grassTexture_png from '../../../images/grassTexture_png.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class ChamberPoolBack extends Node {

  /**
   * @param {ChamberPoolModel} chamberPoolModel
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   */
  constructor( chamberPoolModel, modelViewTransform ) {

    super();

    //grass
    const grassPattern = new Pattern( grassTexture_png ).setTransformMatrix( Matrix3.scale( 0.25 ) );
    const grassRectYOffset = 1;
    const grassRectHeight = 10;
    const grassExtension = 2000;
    const backgroundGrassWidth = 5000;

    const poolDimensions = chamberPoolModel.poolDimensions;

    const grassRectangle = new Rectangle(
      -grassExtension,
      grassRectYOffset,
      backgroundGrassWidth,
      grassRectHeight,
      {
        fill: grassPattern,
        y: modelViewTransform.modelToViewY( 0 ) - grassRectHeight
      }
    );

    grassRectangle.clipArea = new Shape()
      .rect(
        -grassExtension,
        grassRectYOffset,
        grassExtension + modelViewTransform.modelToViewX( poolDimensions.leftOpening.x1 ),
        grassRectHeight )
      .moveTo( modelViewTransform.modelToViewX( poolDimensions.leftOpening.x2 ), grassRectYOffset )
      .rect(
        modelViewTransform.modelToViewX( poolDimensions.leftOpening.x2 ),
        grassRectYOffset,
        modelViewTransform.modelToViewDeltaX( poolDimensions.rightOpening.x1 - poolDimensions.leftOpening.x2 ),
        grassRectHeight )
      .moveTo( modelViewTransform.modelToViewX( poolDimensions.rightOpening.x2 ), grassRectYOffset )
      .rect(
        modelViewTransform.modelToViewX( poolDimensions.rightOpening.x2 ),
        grassRectYOffset,
        grassExtension,
        grassRectHeight );
    this.addChild( grassRectangle );

    //calculated view coordinates for water
    const leftOpeningX1 = modelViewTransform.modelToViewX( poolDimensions.leftOpening.x1 );
    const leftOpeningX2 = modelViewTransform.modelToViewX( poolDimensions.leftOpening.x2 );
    const leftChamberX1 = modelViewTransform.modelToViewX( poolDimensions.leftChamber.x1 );
    const leftChamberX2 = modelViewTransform.modelToViewX( poolDimensions.leftChamber.x2 );
    const rightChamberX1 = modelViewTransform.modelToViewX( poolDimensions.rightChamber.x1 );
    const rightChamberX2 = modelViewTransform.modelToViewX( poolDimensions.rightChamber.x2 );
    const rightOpeningX1 = modelViewTransform.modelToViewX( poolDimensions.rightOpening.x1 );
    const rightOpeningX2 = modelViewTransform.modelToViewX( poolDimensions.rightOpening.x2 );
    const leftOpeningY1 = modelViewTransform.modelToViewY( poolDimensions.leftOpening.y1 );
    const leftOpeningY2 = modelViewTransform.modelToViewY( poolDimensions.leftOpening.y2 );
    const leftChamberY2 = modelViewTransform.modelToViewY( poolDimensions.leftChamber.y2 );
    const passageY1 = modelViewTransform.modelToViewY( poolDimensions.horizontalPassage.y1 );
    const passageY2 = modelViewTransform.modelToViewY( poolDimensions.horizontalPassage.y2 );

    //cement border
    const cementWidth = 2;
    const shape = new Shape()
      .moveTo( leftOpeningX1 - cementWidth, leftOpeningY1 ) //outer part
      .lineTo( leftOpeningX1 - cementWidth, leftOpeningY2 - cementWidth )
      .lineTo( leftChamberX1 - cementWidth, leftOpeningY2 - cementWidth )
      .lineTo( leftChamberX1 - cementWidth, leftChamberY2 + cementWidth )
      .lineTo( leftChamberX2 + cementWidth, leftChamberY2 + cementWidth )
      .lineTo( leftChamberX2 + cementWidth, passageY2 + cementWidth )
      .lineTo( rightChamberX1 - cementWidth, passageY2 + cementWidth )
      .lineTo( rightChamberX1 - cementWidth, leftChamberY2 + cementWidth )
      .lineTo( rightChamberX2 + cementWidth, leftChamberY2 + cementWidth )
      .lineTo( rightChamberX2 + cementWidth, leftOpeningY2 + cementWidth )
      .lineTo( rightOpeningX2 + cementWidth, leftOpeningY2 + cementWidth )
      .lineTo( rightOpeningX2 + cementWidth, leftOpeningY1 )
      .moveTo( leftOpeningX2 + cementWidth, leftOpeningY1 ) //inner part
      .lineTo( leftOpeningX2 + cementWidth, leftOpeningY2 - cementWidth )
      .lineTo( leftChamberX2 + cementWidth, leftOpeningY2 - cementWidth )
      .lineTo( leftChamberX2 + cementWidth, passageY1 - cementWidth )
      .lineTo( rightChamberX1 - cementWidth, passageY1 - cementWidth )
      .lineTo( rightChamberX1 - cementWidth, leftOpeningY2 + cementWidth )
      .lineTo( rightOpeningX1 - cementWidth, leftOpeningY2 + cementWidth )
      .lineTo( rightOpeningX1 - cementWidth, leftOpeningY1 );

    this.addChild( new Path( shape, { stroke: new Pattern( cementTextureDark_jpg ), lineWidth: 4, lineJoin: 'round' } ) );

    //white background for pool
    this.addChild( new Path( new Shape()
      .moveTo( leftOpeningX1, leftOpeningY1 - 1 )
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
      .lineTo( rightOpeningX2, leftOpeningY1 - 1 )
      .lineTo( rightOpeningX1, leftOpeningY1 - 1 )
      .lineTo( rightOpeningX1, leftOpeningY2 )
      .lineTo( rightChamberX1, leftOpeningY2 )
      .lineTo( rightChamberX1, passageY1 )
      .lineTo( leftChamberX2, passageY1 )
      .lineTo( leftChamberX2, leftOpeningY2 )
      .lineTo( leftOpeningX2, leftOpeningY2 )
      .lineTo( leftOpeningX2, leftOpeningY1 - 1 ), {
      fill: '#f3f0e9'
    } ) );
  }
}

fluidPressureAndFlow.register( 'ChamberPoolBack', ChamberPoolBack );
export default ChamberPoolBack;