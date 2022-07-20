// Copyright 2013-2022, University of Colorado Boulder

/**
 * View for water in trapezoid pool
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import { Shape } from '../../../../kite/js/imports.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class TrapezoidPoolWaterNode extends Node {
  /**
   * @param {TrapezoidPoolModel} trapezoidPoolModel
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   */
  constructor( trapezoidPoolModel, modelViewTransform ) {

    super();

    const waterPath = new Path( null );

    const yMax = Math.abs( modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y -
                                                            trapezoidPoolModel.poolDimensions.leftChamber.height ) );//bottom y coord of pool, px
    const x1 = modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1bottom ); //bottom left corner of the pool
    const x4 = modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x4bottom ); //bottom right corner of the pool

    trapezoidPoolModel.underPressureModel.fluidColorModel.colorProperty.linkAttribute( waterPath, 'fill' );

    trapezoidPoolModel.volumeProperty.link( () => {
      const viewHeight = trapezoidPoolModel.maxHeight * trapezoidPoolModel.volumeProperty.value / trapezoidPoolModel.maxVolume; //height of water
      const topY = yMax + modelViewTransform.modelToViewDeltaY( viewHeight ); //y coord for top of the water
      const h = Math.min( viewHeight, trapezoidPoolModel.poolDimensions.bottomChamber.y1 -
                                      trapezoidPoolModel.poolDimensions.bottomChamber.y2 ); //height in bottom passage

      waterPath.shape = new Shape()
        .moveTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.leftChamber.leftBorderFunction.evaluate( viewHeight ) ),
          topY )
        .lineTo( x1, yMax )
        .lineTo( x4, yMax )
        .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.rightChamber.rightBorderFunction.evaluate( viewHeight ) ),
          topY )
        .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.rightChamber.leftBorderFunction.evaluate( viewHeight ) ),
          topY )
        .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.rightChamber.leftBorderFunction.evaluate( h ) ),
          yMax + modelViewTransform.modelToViewDeltaY( h ) )
        .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.leftChamber.rightBorderFunction.evaluate( h ) ),
          yMax + modelViewTransform.modelToViewDeltaY( h ) )
        .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.leftChamber.rightBorderFunction.evaluate( viewHeight ) ),
          topY );

    } );

    this.addChild( waterPath );
  }
}

fluidPressureAndFlow.register( 'TrapezoidPoolWaterNode', TrapezoidPoolWaterNode );
export default TrapezoidPoolWaterNode;