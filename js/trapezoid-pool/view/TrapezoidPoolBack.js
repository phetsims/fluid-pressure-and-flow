// Copyright 2002-2013, University of Colorado Boulder

/**
 * specific view for trapezoid pool
 * grass, cement container and faucets
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

  var UPFaucetNode = require( 'UNDER_PRESSURE/common/view/UPFaucetNode' );

  var grassImg = require( 'image!UNDER_PRESSURE/images/grass-texture.png' );
  var cementImg = require( 'image!UNDER_PRESSURE/images/cement-texture-dark.jpg' );

  function TrapezoidPoolBack( model, mvt ) {
    Node.call( this );

    //grass
    var grassPattern = new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) );
    var grassRectYOffset = 1;
    var grassRectHeight = 10;

    this.addChild( new Rectangle( -1000, grassRectYOffset, 1000 + mvt.modelToViewX( model.verticles.x1top ), grassRectHeight, {
      fill: grassPattern,
      y: mvt.modelToViewY( model.globalModel.skyGroundBoundY ) - grassRectHeight
    } ) );

    this.addChild( new Rectangle( mvt.modelToViewX( model.verticles.x2top ), grassRectYOffset, mvt.modelToViewX( model.verticles.x3top - model.verticles.x2top ), grassRectHeight, {
      fill: grassPattern,
      y: mvt.modelToViewY( model.globalModel.skyGroundBoundY ) - grassRectHeight
    } ) );

    this.addChild( new Rectangle( mvt.modelToViewX( model.verticles.x4top ), grassRectYOffset, 1000, grassRectHeight, {
      fill: grassPattern,
      y: mvt.modelToViewY( model.globalModel.skyGroundBoundY ) - grassRectHeight
    } ) );

    //cement border
    var shape = new Shape()
      .moveTo( mvt.modelToViewX( model.verticles.x1top ) - 2, mvt.modelToViewY( model.poolDimensions.leftChamber.y ) )
      .lineTo( mvt.modelToViewX( model.verticles.x1bottom ) - 2, mvt.modelToViewY( model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height ) + 2 )
      .lineTo( mvt.modelToViewX( model.verticles.x4bottom ) + 2, mvt.modelToViewY( model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height ) + 2 )
      .lineTo( mvt.modelToViewX( model.verticles.x4top ) + 2, mvt.modelToViewY( model.poolDimensions.leftChamber.y ) )
      .moveTo( mvt.modelToViewX( model.verticles.x2top ) + 2, mvt.modelToViewY( model.poolDimensions.leftChamber.y ) )
      .lineTo( mvt.modelToViewX( model.verticles.x1middle ) + 2, mvt.modelToViewY( model.verticles.ymiddle ) - 1 )
      .lineTo( mvt.modelToViewX( model.verticles.x2middle ) - 2, mvt.modelToViewY( model.verticles.ymiddle ) - 1 )
      .lineTo( mvt.modelToViewX( model.verticles.x3top ) - 2, mvt.modelToViewY( model.poolDimensions.leftChamber.y ) );

    this.addChild( new Path( shape, {
      stroke: new Pattern( cementImg ),
      lineWidth: 4,
      lineJoin: 'round'
    } ) );

    this.addChild( new UPFaucetNode( model.outputFaucet, 0, mvt ) );

    //white background for pool

    //bottom chamber
    this.addChild( new Rectangle( mvt.modelToViewX( model.verticles.x1middle ) - 8, mvt.modelToViewY( model.poolDimensions.bottomChamber.y1 ) + 1, mvt.modelToViewX( model.verticles.x2middle - model.verticles.x1middle ) + 16, mvt.modelToViewY( model.poolDimensions.bottomChamber.y2 - model.poolDimensions.bottomChamber.y1 ) - 1, {
      fill: "#f3f0e9"
    } ) );

    //left chamber
    shape = new Shape()
      .moveTo( mvt.modelToViewX( model.verticles.x1top ), mvt.modelToViewY( model.poolDimensions.leftChamber.y ) - 1 )
      .lineTo( mvt.modelToViewX( model.verticles.x1bottom ), mvt.modelToViewY( model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height ) )
      .lineTo( mvt.modelToViewX( model.verticles.x2bottom ), mvt.modelToViewY( model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height ) )
      .lineTo( mvt.modelToViewX( model.verticles.x2top ), mvt.modelToViewY( model.poolDimensions.leftChamber.y ) - 1 );

    this.addChild( new Path( shape, {
      fill: "#f3f0e9"
    } ) );

    //right chamber
    shape = new Shape()
      .moveTo( mvt.modelToViewX( model.verticles.x3top ), mvt.modelToViewY( model.poolDimensions.leftChamber.y ) - 1 )
      .lineTo( mvt.modelToViewX( model.verticles.x3bottom ), mvt.modelToViewY( model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height ) )
      .lineTo( mvt.modelToViewX( model.verticles.x4bottom ), mvt.modelToViewY( model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height ) )
      .lineTo( mvt.modelToViewX( model.verticles.x4top ), mvt.modelToViewY( model.poolDimensions.leftChamber.y ) - 1 );

    this.addChild( new Path( shape, {
      fill: "#f3f0e9"
    } ) );

    this.addChild( new UPFaucetNode( model.inputFaucet, 3000, mvt ) );
  }

  return inherit( Node, TrapezoidPoolBack );
} );