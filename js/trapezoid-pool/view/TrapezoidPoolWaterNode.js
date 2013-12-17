// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for water in trapezoid pool
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Color = require( "SCENERY/util/Color" );

  function TrapezoidPoolWaterNode( model ) {
    Node.call( this );

    var waterShape = new Shape(),
      waterPath = new Path();

    var maxHeight = model.MAX_HEIGHT * model.pxToMetersRatio;

    var yMax = (model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height);

    model.globalModel.waterColorModel.waterColorProperty.link( function() {
      waterPath.fill = new LinearGradient( 0, yMax, 0, yMax - maxHeight )
        .addColorStop( 0, model.globalModel.waterColorModel.bottomColor )
        .addColorStop( 1, model.globalModel.waterColorModel.topColor );
    } );

    model.volumeProperty.link( function( volume ) {
      var viewHeight = model.MAX_HEIGHT * model.volume / model.MAX_VOLUME; //height of water

      var topY = yMax - viewHeight; //y coord for top of the water
      var h = Math.min( viewHeight, model.poolDimensions.bottomChamber.y2 - model.poolDimensions.bottomChamber.y1 ); //height in bottom passage

      waterShape = new Shape()
        .moveTo( model.poolDimensions.leftChamber.leftBorderFunction( viewHeight ) * model.pxToMetersRatio, topY * model.pxToMetersRatio )
        .lineTo( model.verticles.x1bottom * model.pxToMetersRatio, yMax * model.pxToMetersRatio )
        .lineTo( model.verticles.x4bottom * model.pxToMetersRatio, yMax * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.rightChamber.rightBorderFunction( viewHeight ) * model.pxToMetersRatio, topY * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.rightChamber.leftBorderFunction( viewHeight ) * model.pxToMetersRatio, topY * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.rightChamber.leftBorderFunction( h ) * model.pxToMetersRatio, (yMax - h) * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.leftChamber.rightBorderFunction( h ) * model.pxToMetersRatio, (yMax - h) * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.leftChamber.rightBorderFunction( viewHeight ) * model.pxToMetersRatio, topY * model.pxToMetersRatio );
      waterPath.shape = waterShape;
    } );

    this.addChild( waterPath );

  }

  return inherit( Node, TrapezoidPoolWaterNode );
} );