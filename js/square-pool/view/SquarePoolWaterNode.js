// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for water in square pool
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Color = require( "SCENERY/util/Color" );

  function SquarePoolWaterNode( model ) {
    var self = this;
    Rectangle.call( this, 0, 0, 1, 1, { lineWidth: 1 } );

    var viewHeight;

    var viewWidth = (model.poolDimensions.x2 - model.poolDimensions.x1) * model.pxToMetersRatio;
    var maxHeight = model.MAX_HEIGHT * model.pxToMetersRatio;

    var xMin = model.poolDimensions.x1 * model.pxToMetersRatio,
      yMax = model.poolDimensions.y2 * model.pxToMetersRatio;

    model.globalModel.waterColorModel.waterColorProperty.link( function( color ) {
      viewHeight = maxHeight * model.volume / model.MAX_VOLUME;
      self.fill = new LinearGradient( 0, yMax, 0, yMax - maxHeight )
        .addColorStop( 0, model.globalModel.waterColorModel.bottomColor )
        .addColorStop( 1, model.globalModel.waterColorModel.topColor );
    } );

    model.volumeProperty.link( function( volume ) {
      viewHeight = maxHeight * model.volume / model.MAX_VOLUME;
      self.setRect( xMin, yMax - viewHeight, viewWidth, viewHeight );
    } );


  }

  return inherit( Rectangle, SquarePoolWaterNode );
} );