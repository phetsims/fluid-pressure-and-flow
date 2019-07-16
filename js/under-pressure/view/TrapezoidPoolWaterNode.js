// Copyright 2013-2017, University of Colorado Boulder

/**
 * View for water in trapezoid pool
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

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
          .moveTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.leftChamber.leftBorderFunction( viewHeight ) ),
            topY )
          .lineTo( x1, yMax )
          .lineTo( x4, yMax )
          .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.rightChamber.rightBorderFunction( viewHeight ) ),
            topY )
          .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.rightChamber.leftBorderFunction( viewHeight ) ),
            topY )
          .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.rightChamber.leftBorderFunction( h ) ),
            yMax + modelViewTransform.modelToViewDeltaY( h ) )
          .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.leftChamber.rightBorderFunction( h ) ),
            yMax + modelViewTransform.modelToViewDeltaY( h ) )
          .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.leftChamber.rightBorderFunction( viewHeight ) ),
            topY );

      } );

      this.addChild( waterPath );
    }
  }

  return fluidPressureAndFlow.register( 'TrapezoidPoolWaterNode', TrapezoidPoolWaterNode );
} );