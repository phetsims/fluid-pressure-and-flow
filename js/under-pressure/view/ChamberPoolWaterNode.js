// Copyright 2013-2015, University of Colorado Boulder

/**
 * View for water in Chamber Pool
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  /**
   * @param {ChamberPoolModel} chamberPoolModel
   * @param {ModelViewTransform2} modelViewTransform for transforming between model and view co-ordinates
   * @constructor
   */
  function ChamberPoolWaterNode( chamberPoolModel, modelViewTransform ) {
    Node.call( this );

    var waterPath = new Path();
    var poolDimensions = chamberPoolModel.poolDimensions;

    //calculated view coordinates for water
    var leftOpeningX1 = modelViewTransform.modelToViewX( poolDimensions.leftOpening.x1 );
    var leftOpeningX2 = modelViewTransform.modelToViewX( poolDimensions.leftOpening.x2 );
    var leftChamberX1 = modelViewTransform.modelToViewX( poolDimensions.leftChamber.x1 );
    var leftChamberX2 = modelViewTransform.modelToViewX( poolDimensions.leftChamber.x2 );
    var rightChamberX1 = modelViewTransform.modelToViewX( poolDimensions.rightChamber.x1 );
    var rightChamberX2 = modelViewTransform.modelToViewX( poolDimensions.rightChamber.x2 );
    var rightOpeningX1 = modelViewTransform.modelToViewX( poolDimensions.rightOpening.x1 );
    var rightOpeningX2 = modelViewTransform.modelToViewX( poolDimensions.rightOpening.x2 );
    var leftOpeningY2 = modelViewTransform.modelToViewY( poolDimensions.leftOpening.y2 );
    var leftChamberY2 = modelViewTransform.modelToViewY( poolDimensions.leftChamber.y2 );
    var passageY1 = modelViewTransform.modelToViewY( poolDimensions.horizontalPassage.y1 );
    var passageY2 = modelViewTransform.modelToViewY( poolDimensions.horizontalPassage.y2 );

    chamberPoolModel.leftDisplacementProperty.link( function( displacement ) {

      //new left and right levels of water
      var leftY = modelViewTransform.modelToViewY( poolDimensions.leftOpening.y2 + chamberPoolModel.leftWaterHeight -
                                                   displacement );
      var rightY = modelViewTransform.modelToViewY( poolDimensions.rightOpening.y2 + chamberPoolModel.leftWaterHeight +
                                                    displacement / chamberPoolModel.lengthRatio );

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

  fluidPressureAndFlow.register( 'ChamberPoolWaterNode', ChamberPoolWaterNode );

  return inherit( Node, ChamberPoolWaterNode );
} );