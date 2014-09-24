// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for water in square pool.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  /**
   * @param {SquarePoolModel} squarePoolModel of the simulation
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   * @constructor
   */
  function SquarePoolWaterNode( squarePoolModel, modelViewTransform ) {

    var squarePoolWaterNode = this;
    Rectangle.call( this, 0, 0, 1, 1, { lineWidth: 1 } );

    //height of water in pixels
    var viewHeight;
    var viewWidth = modelViewTransform.modelToViewX( squarePoolModel.poolDimensions.x2 - squarePoolModel.poolDimensions.x1 );//width of pool, px
    var maxHeight = modelViewTransform.modelToViewY( squarePoolModel.MAX_HEIGHT );//max height of water in pixels
    var xMin = modelViewTransform.modelToViewX( squarePoolModel.poolDimensions.x1 );//left x point of pool in pixels
    var yMax = modelViewTransform.modelToViewY( squarePoolModel.poolDimensions.y2 );//bottom y point of pool in pixels

    // todo: can use linkAttribute once gradient is removed
    squarePoolModel.underPressureModel.waterColorModel.waterColorProperty.link( function() {
      squarePoolWaterNode.fill = new LinearGradient( 0, yMax, 0, yMax - maxHeight )
        .addColorStop( 0, squarePoolModel.underPressureModel.waterColorModel.bottomColor )
        .addColorStop( 1, squarePoolModel.underPressureModel.waterColorModel.topColor );
    } );

    squarePoolModel.volumeProperty.link( function() {
      viewHeight = maxHeight * squarePoolModel.volume / squarePoolModel.MAX_VOLUME;
      squarePoolWaterNode.setRect( xMin, yMax - viewHeight, viewWidth, viewHeight );
    } );
  }

  return inherit( Rectangle, SquarePoolWaterNode );
} );