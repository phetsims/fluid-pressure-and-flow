// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for water in Chamber Pool
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  /**
   * @param {ChamberPoolModel} chamberPoolModel
   * @param {ModelViewTransform2} modelViewTransform for transforming between model and view co-ordinates
   * @constructor
   */
  function ChamberPoolWaterNode( chamberPoolModel, modelViewTransform ) {
    Node.call( this );

    var waterPath = new Path();

    //calculated view coordinates for water
    var leftOpeningX1 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftOpening.x1 );
    var leftOpeningX2 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftOpening.x2 );
    var leftChamberX1 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftChamber.x1 );
    var leftChamberX2 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftChamber.x2 );
    var rightChamberX1 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.rightChamber.x1 );
    var rightChamberX2 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.rightChamber.x2 );
    var rightOpeningX1 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.rightOpening.x1 );
    var rightOpeningX2 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.rightOpening.x2 );
    var leftOpeningY2 = modelViewTransform.modelToViewY( chamberPoolModel.poolDimensions.leftOpening.y2 );
    var leftChamberY2 = modelViewTransform.modelToViewY( chamberPoolModel.poolDimensions.leftChamber.y2 );
    var passageY1 = modelViewTransform.modelToViewY( chamberPoolModel.poolDimensions.horizontalPassage.y1 );
    var passageY2 = modelViewTransform.modelToViewY( chamberPoolModel.poolDimensions.horizontalPassage.y2 );

    chamberPoolModel.underPressureModel.leftDisplacementProperty.link( function( displacement ) {

      //new left and right levels of water
      var leftY = modelViewTransform.modelToViewY( chamberPoolModel.poolDimensions.leftOpening.y2 - chamberPoolModel.LEFT_WATER_HEIGHT + displacement );
      var rightY = modelViewTransform.modelToViewY( chamberPoolModel.poolDimensions.rightOpening.y2 - chamberPoolModel.LEFT_WATER_HEIGHT - displacement / chamberPoolModel.LENGTH_RATIO );

      waterPath.shape = new Shape()
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
    } );

    chamberPoolModel.underPressureModel.fluidColorModel.colorProperty.linkAttribute( waterPath, 'fill' );

    this.addChild( waterPath );
  }

  return inherit( Node, ChamberPoolWaterNode );
} );