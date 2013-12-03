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
    var yMax = (model.skyGroundBoundY+model.MAX_HEIGHT)* model.pxToMetersRatio;

    model.waterColorModel.waterColorProperty.link( function( color ) {
      var newGradient = new LinearGradient( 0, yMax, 0, yMax - maxHeight )
        .addColorStop( 0, model.waterColorModel.bottomColor )
        .addColorStop( 1, model.waterColorModel.topColor );

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


    //this.addChild( leftOpening );
    //this.addChild( rightOpening );
    this.addChild( leftChamber );
    this.addChild( rightChamber );
    this.addChild( horizontalPassage );
  }

  return inherit( Node, ChamberPoolWaterNode );
} );