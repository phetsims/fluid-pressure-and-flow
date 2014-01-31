// Copyright 2002-2013, University of Colorado Boulder

/**
 * specific background view for chamber pool
 * grass, cement container
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Pattern = require( 'SCENERY/util/Pattern' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  var grassImg = require( 'image!UNDER_PRESSURE/images/grass-texture.png' );
  var cementImg = require( 'image!UNDER_PRESSURE/images/cement-texture-dark.jpg' );

  function ChamberPoolBack( model, mvt ) {
    Node.call( this );

    //grass
    var grassPattern = new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) );
    var grassRectYOffset = 1;
    var grassRectHeight = 10;

    this.addChild( new Rectangle( -1000, grassRectYOffset, 1000 + mvt.modelToViewX( model.poolDimensions.leftOpening.x1 ), grassRectHeight, {
      fill: grassPattern,
      y: mvt.modelToViewY( model.globalModel.skyGroundBoundY ) - grassRectHeight
    } ) );

    this.addChild( new Rectangle( mvt.modelToViewX( model.poolDimensions.leftOpening.x2 ), grassRectYOffset, mvt.modelToViewX( model.poolDimensions.rightOpening.x1 - model.poolDimensions.leftOpening.x2 ), grassRectHeight, {
      fill: grassPattern,
      y: mvt.modelToViewY( model.globalModel.skyGroundBoundY ) - grassRectHeight
    } ) );

    this.addChild( new Rectangle( mvt.modelToViewX( model.poolDimensions.rightOpening.x2 ), grassRectYOffset, 1000, grassRectHeight, {
      fill: grassPattern,
      y: mvt.modelToViewY( model.globalModel.skyGroundBoundY ) - grassRectHeight
    } ) );

    //calculated view coordinates for water
    var leftOpeningX1 = mvt.modelToViewX( model.poolDimensions.leftOpening.x1 ),
      leftOpeningX2 = mvt.modelToViewX( model.poolDimensions.leftOpening.x2 ),
      leftChamberX1 = mvt.modelToViewX( model.poolDimensions.leftChamber.x1 ),
      leftChamberX2 = mvt.modelToViewX( model.poolDimensions.leftChamber.x2 ),
      rightChamberX1 = mvt.modelToViewX( model.poolDimensions.rightChamber.x1 ),
      rightChamberX2 = mvt.modelToViewX( model.poolDimensions.rightChamber.x2 ),
      rightOpeningX1 = mvt.modelToViewX( model.poolDimensions.rightOpening.x1 ),
      rightOpeningX2 = mvt.modelToViewX( model.poolDimensions.rightOpening.x2 ),
      leftOpeningY1 = mvt.modelToViewY( model.poolDimensions.leftOpening.y1 ),
      leftOpeningY2 = mvt.modelToViewY( model.poolDimensions.leftOpening.y2 ),
      leftChamberY2 = mvt.modelToViewY( model.poolDimensions.leftChamber.y2 ),
      passageY1 = mvt.modelToViewY( model.poolDimensions.horizontalPassage.y1 ),
      passageY2 = mvt.modelToViewY( model.poolDimensions.horizontalPassage.y2 );

    //cement border
    var shape = new Shape()
      .moveTo( leftOpeningX1 - 2, leftOpeningY1 ) //outer part
      .lineTo( leftOpeningX1 - 2, leftOpeningY2 - 2 )
      .lineTo( leftChamberX1 - 2, leftOpeningY2 - 2 )
      .lineTo( leftChamberX1 - 2, leftChamberY2 + 2 )
      .lineTo( leftChamberX2 + 2, leftChamberY2 + 2 )
      .lineTo( leftChamberX2 + 2, passageY2 + 2 )
      .lineTo( rightChamberX1 - 2, passageY2 + 2 )
      .lineTo( rightChamberX1 - 2, leftChamberY2 + 2 )
      .lineTo( rightChamberX2 + 2, leftChamberY2 + 2 )
      .lineTo( rightChamberX2 + 2, leftOpeningY2 + 2 )
      .lineTo( rightOpeningX2 + 2, leftOpeningY2 + 2 )
      .lineTo( rightOpeningX2 + 2, leftOpeningY1 )
      .moveTo( leftOpeningX2 + 2, leftOpeningY1 ) //inner part
      .lineTo( leftOpeningX2 + 2, leftOpeningY2 - 2 )
      .lineTo( leftChamberX2 + 2, leftOpeningY2 - 2 )
      .lineTo( leftChamberX2 + 2, passageY1 - 2 )
      .lineTo( rightChamberX1 - 2, passageY1 - 2 )
      .lineTo( rightChamberX1 - 2, leftOpeningY2 + 2 )
      .lineTo( rightOpeningX1 - 2, leftOpeningY2 + 2 )
      .lineTo( rightOpeningX1 - 2, leftOpeningY1 );

    this.addChild( new Path( shape, {
      stroke: new Pattern( cementImg ),
      lineWidth: 4,
      lineJoin: 'round'
    } ) );

    //white background for pool
    this.addChild( new Path( new Shape()
      .moveTo( leftOpeningX1, leftOpeningY1 - 1 )
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
      .lineTo( rightOpeningX2, leftOpeningY1 - 1 )
      .lineTo( rightOpeningX1, leftOpeningY1 - 1 )
      .lineTo( rightOpeningX1, leftOpeningY2 )
      .lineTo( rightChamberX1, leftOpeningY2 )
      .lineTo( rightChamberX1, passageY1 )
      .lineTo( leftChamberX2, passageY1 )
      .lineTo( leftChamberX2, leftOpeningY2 )
      .lineTo( leftOpeningX2, leftOpeningY2 )
      .lineTo( leftOpeningX2, leftOpeningY1 - 1 ), {
      fill: '#f3f0e9'
    } ) );
  }

  return inherit( Node, ChamberPoolBack );
} );