// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for water in chamber pool
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

  function ChamberPoolWaterNode( model ) {
    Node.call( this );

    var waterShape = new Shape();
    var waterPath = new Path();

    var maxHeight = model.MAX_HEIGHT * model.pxToMetersRatio;
    var yMax = (model.globalModel.skyGroundBoundY + model.MAX_HEIGHT) * model.pxToMetersRatio;

    model.globalModel.waterColorModel.waterColorProperty.link( function( color ) {
      waterPath.fill = new LinearGradient( 0, yMax, 0, yMax - maxHeight )
        .addColorStop( 0, model.globalModel.waterColorModel.bottomColor )
        .addColorStop( 1, model.globalModel.waterColorModel.topColor );
    } );

    model.globalModel.leftDisplacementProperty.link( function( displacement ) {

      //new left and right levels of water
      var leftY = (model.poolDimensions.leftOpening.y2 - model.LEFT_WATER_HEIGHT + displacement) * model.pxToMetersRatio,
        rightY = (model.poolDimensions.rightOpening.y2 - model.LEFT_WATER_HEIGHT - displacement / model.LENGTH_RATIO) * model.pxToMetersRatio;


      waterShape = new Shape()
        .moveTo( model.poolDimensions.leftOpening.x1 * model.pxToMetersRatio, leftY )
        .lineTo( model.poolDimensions.leftOpening.x1 * model.pxToMetersRatio, model.poolDimensions.leftOpening.y2 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.leftChamber.x1 * model.pxToMetersRatio, model.poolDimensions.leftOpening.y2 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.leftChamber.x1 * model.pxToMetersRatio, model.poolDimensions.leftChamber.y2 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.leftChamber.x2 * model.pxToMetersRatio, model.poolDimensions.leftChamber.y2 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.leftChamber.x2 * model.pxToMetersRatio, model.poolDimensions.horizontalPassage.y2 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.rightChamber.x1 * model.pxToMetersRatio, model.poolDimensions.horizontalPassage.y2 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.rightChamber.x1 * model.pxToMetersRatio, model.poolDimensions.rightChamber.y2 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.rightChamber.x2 * model.pxToMetersRatio, model.poolDimensions.rightChamber.y2 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.rightChamber.x2 * model.pxToMetersRatio, model.poolDimensions.rightChamber.y1 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.rightOpening.x2 * model.pxToMetersRatio, model.poolDimensions.rightChamber.y1 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.rightOpening.x2 * model.pxToMetersRatio, rightY )
        .lineTo( model.poolDimensions.rightOpening.x1 * model.pxToMetersRatio, rightY )
        .lineTo( model.poolDimensions.rightOpening.x1 * model.pxToMetersRatio, model.poolDimensions.rightChamber.y1 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.rightChamber.x1 * model.pxToMetersRatio, model.poolDimensions.rightChamber.y1 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.rightChamber.x1 * model.pxToMetersRatio, model.poolDimensions.horizontalPassage.y1 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.leftChamber.x2 * model.pxToMetersRatio, model.poolDimensions.horizontalPassage.y1 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.leftChamber.x2 * model.pxToMetersRatio, model.poolDimensions.leftOpening.y2 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.leftOpening.x2 * model.pxToMetersRatio, model.poolDimensions.leftOpening.y2 * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.leftOpening.x2 * model.pxToMetersRatio, leftY );
      waterPath.shape = waterShape;
    } );


    this.addChild( waterPath );
  }

  return inherit( Node, ChamberPoolWaterNode );
} );