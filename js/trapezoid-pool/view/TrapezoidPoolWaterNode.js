// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for water in trapezoid pool
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  function TrapezoidPoolWaterNode( model, mvt ) {
    Node.call( this );

    var waterShape = new Shape(),
      waterPath = new Path();

    var maxHeight = mvt.modelToViewY( model.MAX_HEIGHT ),//max water height, px
      yMax = mvt.modelToViewY( model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height ),//bottom y coord of pool, px
      x1 = mvt.modelToViewX( model.verticles.x1bottom ), //bottom left corner of the pool
      x4 = mvt.modelToViewX( model.verticles.x4bottom ); //bottom right corner of the pool

    model.globalModel.waterColorModel.waterColorProperty.link( function() {
      waterPath.fill = new LinearGradient( 0, yMax, 0, yMax - maxHeight )
        .addColorStop( 0, model.globalModel.waterColorModel.bottomColor )
        .addColorStop( 1, model.globalModel.waterColorModel.topColor );
    } );

    model.volumeProperty.link( function( volume ) {
      var viewHeight = model.MAX_HEIGHT * model.volume / model.MAX_VOLUME; //height of water

      var topY = yMax - mvt.modelToViewY( viewHeight ), //y coord for top of the water
        h = Math.min( viewHeight, model.poolDimensions.bottomChamber.y2 - model.poolDimensions.bottomChamber.y1 ); //height in bottom passage

      waterShape = new Shape()
        .moveTo( mvt.modelToViewX( model.poolDimensions.leftChamber.leftBorderFunction( viewHeight ) ), topY )
        .lineTo( x1, yMax )
        .lineTo( x4, yMax )
        .lineTo( mvt.modelToViewX( model.poolDimensions.rightChamber.rightBorderFunction( viewHeight ) ), topY )
        .lineTo( mvt.modelToViewX( model.poolDimensions.rightChamber.leftBorderFunction( viewHeight ) ), topY )
        .lineTo( mvt.modelToViewX( model.poolDimensions.rightChamber.leftBorderFunction( h ) ), yMax - mvt.modelToViewY( h ) )
        .lineTo( mvt.modelToViewX( model.poolDimensions.leftChamber.rightBorderFunction( h ) ), yMax - mvt.modelToViewY( h ) )
        .lineTo( mvt.modelToViewX( model.poolDimensions.leftChamber.rightBorderFunction( viewHeight ) ), topY );
      waterPath.shape = waterShape;
    } );

    this.addChild( waterPath );

  }

  return inherit( Node, TrapezoidPoolWaterNode );
} );