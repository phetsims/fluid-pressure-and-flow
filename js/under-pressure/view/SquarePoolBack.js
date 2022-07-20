// Copyright 2013-2022, University of Colorado Boulder

/**
 * View for square pool which contains grass, cement and faucets
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Node, Path, Pattern, Rectangle } from '../../../../scenery/js/imports.js';
import cementTextureDark_jpg from '../../../images/cementTextureDark_jpg.js';
import grassTexture_png from '../../../images/grassTexture_png.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import UnderPressureFaucetNode from './UnderPressureFaucetNode.js';

class SquarePoolBack extends Node {

  /**
   * @param {SquarePoolModel} squarePoolModel
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   */
  constructor( squarePoolModel, modelViewTransform ) {

    super();

    //grass
    const grassPattern = new Pattern( grassTexture_png ).setTransformMatrix( Matrix3.scale( 0.25 ) );
    const grassRectYOffset = 1;
    const grassRectHeight = 10;
    const grassExtension = 2000;
    const backgroundGrassWidth = 5000;
    const poolDimensions = squarePoolModel.poolDimensions;

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
        grassExtension + modelViewTransform.modelToViewX( squarePoolModel.poolDimensions.x1 ),
        grassRectHeight )
      .moveTo( modelViewTransform.modelToViewX( poolDimensions.x2 ), grassRectYOffset )
      .rect(
        modelViewTransform.modelToViewX( poolDimensions.x2 ),
        grassRectYOffset,
        grassExtension,
        grassRectHeight );
    this.addChild( grassRectangle );

    //cement border
    const cementWidth = 2;
    const cementBorder = new Shape()
      .moveTo( modelViewTransform.modelToViewX( poolDimensions.x1 ) - cementWidth,
        modelViewTransform.modelToViewY( poolDimensions.y1 ) )
      .lineTo( modelViewTransform.modelToViewX( poolDimensions.x1 ) - cementWidth,
        modelViewTransform.modelToViewY( poolDimensions.y2 ) + cementWidth )
      .lineTo( modelViewTransform.modelToViewX( poolDimensions.x2 ) + cementWidth,
        modelViewTransform.modelToViewY( poolDimensions.y2 ) + cementWidth )
      .lineTo( modelViewTransform.modelToViewX( poolDimensions.x2 ) + cementWidth,
        modelViewTransform.modelToViewY( poolDimensions.y1 ) );

    this.addChild( new Path( cementBorder, { stroke: new Pattern( cementTextureDark_jpg ), lineWidth: 4, lineJoin: 'round' } ) );

    // add output faucet
    this.addChild( new UnderPressureFaucetNode( squarePoolModel.outputFaucet, 150, modelViewTransform ) );

    //white background for pool
    this.addChild( new Rectangle(
      modelViewTransform.modelToViewX( poolDimensions.x1 ),
      modelViewTransform.modelToViewY( poolDimensions.y1 ),
      modelViewTransform.modelToViewDeltaX( poolDimensions.x2 - poolDimensions.x1 ),
      modelViewTransform.modelToViewDeltaY( poolDimensions.y2 - poolDimensions.y1 ),
      {
        fill: '#f3f0e9'
      }
    ) );

    // add input faucet node
    this.addChild( new UnderPressureFaucetNode( squarePoolModel.inputFaucet, 3000, modelViewTransform ) );
  }
}

fluidPressureAndFlow.register( 'SquarePoolBack', SquarePoolBack );
export default SquarePoolBack;