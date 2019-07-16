// Copyright 2013-2019, University of Colorado Boulder

/**
 * View for water in square pool.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class SquarePoolWaterNode extends Rectangle {

    /**
     * @param {SquarePoolModel} squarePoolModel of the simulation
     * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
     */
    constructor( squarePoolModel, modelViewTransform ) {

      super( 0, 0, 1, 1, { lineWidth: 1 } );

      const poolDimensions = squarePoolModel.poolDimensions;

      const viewWidth = modelViewTransform.modelToViewDeltaX( poolDimensions.x2 - poolDimensions.x1 );//width of pool, px
      const maxHeight = Math.abs( modelViewTransform.modelToViewDeltaY( squarePoolModel.maxHeight ) );//max height of water in pixels
      const xMin = modelViewTransform.modelToViewX( poolDimensions.x1 );//left x point of pool in pixels
      const yMax = modelViewTransform.modelToViewY( poolDimensions.y2 );//bottom y point of pool in pixels

      squarePoolModel.underPressureModel.fluidColorModel.colorProperty.linkAttribute( this, 'fill' );

      squarePoolModel.volumeProperty.link( () => {

        // height of water in pixels
        const viewHeight = maxHeight * squarePoolModel.volumeProperty.value / squarePoolModel.maxVolume;
        this.setRect( xMin, yMax - viewHeight, viewWidth, viewHeight );
      } );
    }
  }

  return fluidPressureAndFlow.register( 'SquarePoolWaterNode', SquarePoolWaterNode );
} );