// Copyright 2013-2017, University of Colorado Boulder

/**
 * View for water in square pool.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {SquarePoolModel} squarePoolModel of the simulation
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   * @constructor
   */
  function SquarePoolWaterNode( squarePoolModel, modelViewTransform ) {

    var self = this;
    Rectangle.call( this, 0, 0, 1, 1, { lineWidth: 1 } );

    //height of water in pixels
    var viewHeight;
    var poolDimensions = squarePoolModel.poolDimensions;

    var viewWidth = modelViewTransform.modelToViewDeltaX( poolDimensions.x2 - poolDimensions.x1 );//width of pool, px
    var maxHeight = Math.abs( modelViewTransform.modelToViewDeltaY( squarePoolModel.maxHeight ) );//max height of water in pixels
    var xMin = modelViewTransform.modelToViewX( poolDimensions.x1 );//left x point of pool in pixels
    var yMax = modelViewTransform.modelToViewY( poolDimensions.y2 );//bottom y point of pool in pixels

    squarePoolModel.underPressureModel.fluidColorModel.colorProperty.linkAttribute( self, 'fill' );

    squarePoolModel.volumeProperty.link( function() {
      viewHeight = maxHeight * squarePoolModel.volumeProperty.value / squarePoolModel.maxVolume;
      self.setRect( xMin, yMax - viewHeight, viewWidth, viewHeight );
    } );
  }

  fluidPressureAndFlow.register( 'SquarePoolWaterNode', SquarePoolWaterNode );

  return inherit( Rectangle, SquarePoolWaterNode );
} );