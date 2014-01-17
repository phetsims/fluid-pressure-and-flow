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

  function SquarePoolWaterNode( model, mvt ) {
    var self = this;
    Rectangle.call( this, 0, 0, 1, 1, { lineWidth: 1 } );

    //height of water, px
    var viewHeight;

    var viewWidth = mvt.modelToViewX( model.poolDimensions.x2 - model.poolDimensions.x1 ),//width of pool, px
      maxHeight = mvt.modelToViewY( model.MAX_HEIGHT ),//max height of water, px
      xMin = mvt.modelToViewX( model.poolDimensions.x1 ),//left x point of pool, px
      yMax = mvt.modelToViewY( model.poolDimensions.y2 );//bottom y point of pool, px

    model.globalModel.waterColorModel.waterColorProperty.link( function() {
      self.fill = new LinearGradient( 0, yMax, 0, yMax - maxHeight )
        .addColorStop( 0, model.globalModel.waterColorModel.bottomColor )
        .addColorStop( 1, model.globalModel.waterColorModel.topColor );
    } );

    model.volumeProperty.link( function(  ) {
      viewHeight = maxHeight * model.volume / model.MAX_VOLUME;
      self.setRect( xMin, yMax - viewHeight, viewWidth, viewHeight );
    } );


  }

  return inherit( Rectangle, SquarePoolWaterNode );
} );