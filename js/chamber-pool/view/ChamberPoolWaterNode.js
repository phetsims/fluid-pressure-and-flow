// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for water in chamber pool
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  function ChamberPoolWaterNode( model, mvt ) {
    Node.call( this );

    var waterShape = new Shape(),
      waterPath = new Path();

    var maxHeight = mvt.modelToViewY( model.MAX_HEIGHT ),
      yMax = mvt.modelToViewY( model.globalModel.skyGroundBoundY + model.MAX_HEIGHT );

    //calculated view coordinates for water
    var leftOpeningX1 = mvt.modelToViewX( model.poolDimensions.leftOpening.x1 ),
      leftOpeningX2 = mvt.modelToViewX( model.poolDimensions.leftOpening.x2 ),
      leftChamberX1 = mvt.modelToViewX( model.poolDimensions.leftChamber.x1 ),
      leftChamberX2 = mvt.modelToViewX( model.poolDimensions.leftChamber.x2 ),
      rightChamberX1 = mvt.modelToViewX( model.poolDimensions.rightChamber.x1 ),
      rightChamberX2 = mvt.modelToViewX( model.poolDimensions.rightChamber.x2 ),
      rightOpeningX1 = mvt.modelToViewX( model.poolDimensions.rightOpening.x1 ),
      rightOpeningX2 = mvt.modelToViewX( model.poolDimensions.rightOpening.x2 ),
      leftOpeningY2 = mvt.modelToViewY( model.poolDimensions.leftOpening.y2 ),
      leftChamberY2 = mvt.modelToViewY( model.poolDimensions.leftChamber.y2 ),
      passageY1 = mvt.modelToViewY( model.poolDimensions.horizontalPassage.y1 ),
      passageY2 = mvt.modelToViewY( model.poolDimensions.horizontalPassage.y2 );

    model.globalModel.leftDisplacementProperty.link( function( displacement ) {

      //new left and right levels of water
      var leftY = mvt.modelToViewY( model.poolDimensions.leftOpening.y2 - model.LEFT_WATER_HEIGHT + displacement ),
        rightY = mvt.modelToViewY( model.poolDimensions.rightOpening.y2 - model.LEFT_WATER_HEIGHT - displacement / model.LENGTH_RATIO );

      waterShape = new Shape()
        .moveTo( leftOpeningX1, leftY )
        .lineTo( leftOpeningX1, leftOpeningY2 )
        .lineTo( leftChamberX1, leftOpeningY2 )
        .lineTo( leftChamberX1, leftChamberY2 )
        .lineTo( leftChamberX2, leftChamberY2 )
        .lineTo( leftChamberX2, passageY2 )
        .lineTo( rightChamberX1, passageY2 )
        .lineTo( rightChamberX1, leftChamberY2 )
        .lineTo( rightChamberX2, leftChamberY2 )
        .lineTo( rightChamberX2, leftOpeningY2 )
        .lineTo( rightOpeningX2, leftOpeningY2 )
        .lineTo( rightOpeningX2, rightY )
        .lineTo( rightOpeningX1, rightY )
        .lineTo( rightOpeningX1, leftOpeningY2 )
        .lineTo( rightChamberX1, leftOpeningY2 )
        .lineTo( rightChamberX1, passageY1 )
        .lineTo( leftChamberX2, passageY1 )
        .lineTo( leftChamberX2, leftOpeningY2 )
        .lineTo( leftOpeningX2, leftOpeningY2 )
        .lineTo( leftOpeningX2, leftY );
      waterPath.shape = waterShape;
    } );

    model.globalModel.waterColorModel.waterColorProperty.link( function() {
      waterPath.fill = new LinearGradient( 0, yMax, 0, yMax - maxHeight )
        .addColorStop( 0, model.globalModel.waterColorModel.bottomColor )
        .addColorStop( 1, model.globalModel.waterColorModel.topColor );
    } );

    this.addChild( waterPath );
  }

  return inherit( Node, ChamberPoolWaterNode );
} );