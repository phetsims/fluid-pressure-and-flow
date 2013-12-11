// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for water in square pool
 *
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
    var self = this;
    Node.call( this );

    var leftOpening = new Rectangle();
    var rightOpening = new Rectangle();
    var leftChamber = new Rectangle();
    var rightChamber = new Rectangle();
    var horizontalPassage = new Rectangle();

    var viewHeight;
    var maxHeight = model.MAX_HEIGHT * model.pxToMetersRatio;
    var yMax = (model.globalModel.skyGroundBoundY + model.MAX_HEIGHT) * model.pxToMetersRatio;

    model.globalModel.waterColorModel.waterColorProperty.link( function( color ) {
      var newGradient = new LinearGradient( 0, yMax, 0, yMax - maxHeight )
        .addColorStop( 0, model.globalModel.waterColorModel.bottomColor )
        .addColorStop( 1, model.globalModel.waterColorModel.topColor );

      //self.fill = newGradient; TODO ask why not working
      leftOpening.fill = newGradient;
      rightOpening.fill = newGradient;
      leftChamber.fill = newGradient;
      rightChamber.fill = newGradient;
      horizontalPassage.fill = newGradient;
    } );

    //static water
    leftChamber.setRect( model.poolDimensions.leftChamber.x1 * model.pxToMetersRatio, model.poolDimensions.leftChamber.y1 * model.pxToMetersRatio, (model.poolDimensions.leftChamber.x2 - model.poolDimensions.leftChamber.x1) * model.pxToMetersRatio, (model.poolDimensions.leftChamber.y2 - model.poolDimensions.leftChamber.y1) * model.pxToMetersRatio );

    rightChamber.setRect( model.poolDimensions.rightChamber.x1 * model.pxToMetersRatio, model.poolDimensions.rightChamber.y1 * model.pxToMetersRatio, (model.poolDimensions.rightChamber.x2 - model.poolDimensions.rightChamber.x1) * model.pxToMetersRatio, (model.poolDimensions.rightChamber.y2 - model.poolDimensions.rightChamber.y1) * model.pxToMetersRatio );

    horizontalPassage.setRect( model.poolDimensions.horizontalPassage.x1 * model.pxToMetersRatio, model.poolDimensions.horizontalPassage.y1 * model.pxToMetersRatio, (model.poolDimensions.horizontalPassage.x2 - model.poolDimensions.horizontalPassage.x1) * model.pxToMetersRatio, (model.poolDimensions.horizontalPassage.y2 - model.poolDimensions.horizontalPassage.y1) * model.pxToMetersRatio );


    //left and right openings
    var leftX = model.poolDimensions.leftOpening.x1 * model.pxToMetersRatio,
      leftWidth = (model.poolDimensions.leftOpening.x2 - model.poolDimensions.leftOpening.x1) * model.pxToMetersRatio,
      leftY = (model.poolDimensions.leftOpening.y2 - model.LEFT_WATER_HEIGHT) * model.pxToMetersRatio,
      leftHeight = model.LEFT_WATER_HEIGHT * model.pxToMetersRatio;

    var rightX = model.poolDimensions.rightOpening.x1 * model.pxToMetersRatio,
      rightWidth = (model.poolDimensions.rightOpening.x2 - model.poolDimensions.rightOpening.x1) * model.pxToMetersRatio,
      rightY = (model.poolDimensions.rightOpening.y2 - model.LEFT_WATER_HEIGHT) * model.pxToMetersRatio,
      rightHeight = model.LEFT_WATER_HEIGHT * model.pxToMetersRatio;

    model.globalModel.leftDisplacementProperty.link( function( displacement ) {
      leftOpening.setRect( leftX, leftY + displacement * model.pxToMetersRatio, leftWidth, leftHeight - displacement * model.pxToMetersRatio );
      rightOpening.setRect( rightX, rightY - model.pxToMetersRatio * displacement/model.LENGTH_RATIO, rightWidth, rightHeight + model.pxToMetersRatio * displacement/model.LENGTH_RATIO  );
    } );


    this.addChild( leftOpening );
    this.addChild( rightOpening );
    this.addChild( leftChamber );
    this.addChild( rightChamber );
    this.addChild( horizontalPassage );
  }

  return inherit( Node, ChamberPoolWaterNode );
} );