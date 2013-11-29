// Copyright 2002-2013, University of Colorado Boulder

/**
 * main ScreenView container.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function SquarePoolWaterNode( model ) {
    var self = this;
    Rectangle.call( this, 0, 0, 1, 1, { lineWidth: 1 } );

    self.fill = "blue";

    var viewWidth = (model.poolDimensions.x2 - model.poolDimensions.x1) * model.pxToMetersRatio;
    var maxHeight = (model.poolDimensions.y2 - model.poolDimensions.y1) * model.pxToMetersRatio;

    model.volumeProperty.link( function( volume ) {
      var viewHeight = maxHeight * model.volume / model.MAX_VOLUME;
      self.setRect( model.poolDimensions.x1 * model.pxToMetersRatio, model.poolDimensions.y2 * model.pxToMetersRatio - viewHeight, viewWidth, viewHeight );
    } );


  }

  return inherit( Rectangle, SquarePoolWaterNode );
} );