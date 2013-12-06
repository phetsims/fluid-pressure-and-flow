// Copyright 2002-2013, University of Colorado Boulder

/**
 * specific view for square pool
 * grass, cement container and faucets
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Pattern = require( 'SCENERY/util/Pattern' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  var UPFaucetNode = require( 'common/view/UPFaucetNode' );

  var grassImg = require( 'image!UNDER_PRESSURE/images/grass-texture.png' );
  var cementImg = require( 'image!UNDER_PRESSURE/images/cement-texture-dark.jpg' );

  function ChamberPoolBack( model ) {
    Node.call( this );

    //grass
    this.addChild( new Rectangle( -1000, 0, 1000 + model.poolDimensions.leftOpening.x1 * model.pxToMetersRatio, 10, {
      fill: new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) ),
      y: model.skyGroundBoundY * model.pxToMetersRatio - 10
    } ) );

    this.addChild( new Rectangle( model.poolDimensions.leftOpening.x2 * model.pxToMetersRatio, 0, (model.poolDimensions.rightOpening.x1 - model.poolDimensions.leftOpening.x2) * model.pxToMetersRatio, 10, {
      fill: new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) ),
      y: model.skyGroundBoundY * model.pxToMetersRatio - 10
    } ) );

    this.addChild( new Rectangle( model.poolDimensions.rightOpening.x2 * model.pxToMetersRatio, 0, 1000, 10, {
      fill: new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) ),
      y: model.skyGroundBoundY * model.pxToMetersRatio - 10
    } ) );

    //cement border
    var shape = new Shape()
      .moveTo( model.poolDimensions.leftOpening.x1 * model.pxToMetersRatio - 2, model.poolDimensions.leftOpening.y1 * model.pxToMetersRatio ) //outer part
      .lineTo( model.poolDimensions.leftOpening.x1 * model.pxToMetersRatio - 2, model.poolDimensions.leftOpening.y2 * model.pxToMetersRatio -2)
      .lineTo( model.poolDimensions.leftChamber.x1 * model.pxToMetersRatio - 2, model.poolDimensions.leftOpening.y2 * model.pxToMetersRatio -2)
      .lineTo( model.poolDimensions.leftChamber.x1 * model.pxToMetersRatio - 2, model.poolDimensions.leftChamber.y2 * model.pxToMetersRatio +2)
      .lineTo( model.poolDimensions.leftChamber.x2 * model.pxToMetersRatio + 2, model.poolDimensions.leftChamber.y2 * model.pxToMetersRatio +2)
      .lineTo( model.poolDimensions.leftChamber.x2 * model.pxToMetersRatio + 2, model.poolDimensions.horizontalPassage.y2 * model.pxToMetersRatio +2)
      .lineTo( model.poolDimensions.rightChamber.x1 * model.pxToMetersRatio - 2, model.poolDimensions.horizontalPassage.y2 * model.pxToMetersRatio +2)
      .lineTo( model.poolDimensions.rightChamber.x1 * model.pxToMetersRatio - 2, model.poolDimensions.rightChamber.y2 * model.pxToMetersRatio +2)
      .lineTo( model.poolDimensions.rightChamber.x2 * model.pxToMetersRatio + 2, model.poolDimensions.rightChamber.y2 * model.pxToMetersRatio +2)
      .lineTo( model.poolDimensions.rightChamber.x2 * model.pxToMetersRatio + 2, model.poolDimensions.rightChamber.y1 * model.pxToMetersRatio +2)
      .lineTo( model.poolDimensions.rightOpening.x2 * model.pxToMetersRatio + 2, model.poolDimensions.rightChamber.y1 * model.pxToMetersRatio +2)
      .lineTo( model.poolDimensions.rightOpening.x2 * model.pxToMetersRatio + 2, model.poolDimensions.rightOpening.y1 * model.pxToMetersRatio)
      .moveTo( model.poolDimensions.leftOpening.x2* model.pxToMetersRatio + 2, model.poolDimensions.leftOpening.y1 * model.pxToMetersRatio ) //inner part
      .lineTo( model.poolDimensions.leftOpening.x2 * model.pxToMetersRatio + 2, model.poolDimensions.leftOpening.y2 * model.pxToMetersRatio -2)
      .lineTo( model.poolDimensions.leftChamber.x2 * model.pxToMetersRatio + 2, model.poolDimensions.leftOpening.y2 * model.pxToMetersRatio -2)
      .lineTo( model.poolDimensions.leftChamber.x2 * model.pxToMetersRatio + 2, model.poolDimensions.horizontalPassage.y1 * model.pxToMetersRatio -2)
      .lineTo( model.poolDimensions.rightChamber.x1 * model.pxToMetersRatio - 2, model.poolDimensions.horizontalPassage.y1 * model.pxToMetersRatio -2)
      .lineTo( model.poolDimensions.rightChamber.x1 * model.pxToMetersRatio - 2, model.poolDimensions.rightChamber.y1 * model.pxToMetersRatio +2)
      .lineTo( model.poolDimensions.rightOpening.x1 * model.pxToMetersRatio - 2, model.poolDimensions.rightChamber.y1 * model.pxToMetersRatio +2)
      .lineTo( model.poolDimensions.rightOpening.x1 * model.pxToMetersRatio - 2, model.poolDimensions.rightOpening.y1 * model.pxToMetersRatio);

    this.addChild( new Path( shape, {
      stroke: new Pattern( cementImg ),
      lineWidth: 4,
      lineJoin: 'round'
    } ) );

    //white background for pool

    //left opening
    this.addChild( new Rectangle( model.poolDimensions.leftOpening.x1 * model.pxToMetersRatio, (model.poolDimensions.leftOpening.y1) * model.pxToMetersRatio-1, (model.poolDimensions.leftOpening.x2 - model.poolDimensions.leftOpening.x1) * model.pxToMetersRatio, (model.poolDimensions.leftOpening.y2 - model.poolDimensions.leftOpening.y1) * model.pxToMetersRatio+1, {
      fill: "#f3f0e9"
    } ) );

    //right opening
    this.addChild( new Rectangle( model.poolDimensions.rightOpening.x1 * model.pxToMetersRatio, (model.poolDimensions.rightOpening.y1) * model.pxToMetersRatio-1, (model.poolDimensions.rightOpening.x2 - model.poolDimensions.rightOpening.x1) * model.pxToMetersRatio, (model.poolDimensions.rightOpening.y2 - model.poolDimensions.rightOpening.y1) * model.pxToMetersRatio+1, {
      fill: "#f3f0e9"
    } ) );




  }

  return inherit( Node, ChamberPoolBack );
} );