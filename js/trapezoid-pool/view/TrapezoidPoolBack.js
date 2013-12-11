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

  var UPFaucetNode = require( 'UNDER_PRESSURE/common/view/UPFaucetNode' );

  var grassImg = require( 'image!UNDER_PRESSURE/images/grass-texture.png' );
  var cementImg = require( 'image!UNDER_PRESSURE/images/cement-texture-dark.jpg' );

  function TrapezoidPoolBack( model ) {
    Node.call( this );

    //grass
    this.addChild( new Rectangle( -1000, 0, 1000 + model.verticles.x1top * model.pxToMetersRatio, 10, {
      fill: new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) ),
      y: model.globalModel.skyGroundBoundY * model.pxToMetersRatio - 10
    } ) );

    this.addChild( new Rectangle( model.verticles.x2top * model.pxToMetersRatio, 0, (model.verticles.x3top - model.verticles.x2top) * model.pxToMetersRatio, 10, {
      fill: new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) ),
      y: model.globalModel.skyGroundBoundY * model.pxToMetersRatio - 10
    } ) );

    this.addChild( new Rectangle( model.verticles.x4top * model.pxToMetersRatio, 0, 1000, 10, {
      fill: new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) ),
      y: model.globalModel.skyGroundBoundY * model.pxToMetersRatio - 10
    } ) );

    //cement border
    var shape = new Shape()
      .moveTo( model.verticles.x1top * model.pxToMetersRatio - 2, model.poolDimensions.leftChamber.y * model.pxToMetersRatio )
      .lineTo( model.verticles.x1bottom * model.pxToMetersRatio - 2, (model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height) * model.pxToMetersRatio + 2 )
      .lineTo( model.verticles.x4bottom * model.pxToMetersRatio + 2, (model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height) * model.pxToMetersRatio + 2 )
      .lineTo( model.verticles.x4top * model.pxToMetersRatio + 2, model.poolDimensions.leftChamber.y * model.pxToMetersRatio )
      .moveTo( model.verticles.x2top * model.pxToMetersRatio + 2, model.poolDimensions.leftChamber.y * model.pxToMetersRatio )
      .lineTo( model.verticles.x1middle * model.pxToMetersRatio - 2, model.verticles.ymiddle * model.pxToMetersRatio )
      .lineTo( model.verticles.x2middle * model.pxToMetersRatio - 2, model.verticles.ymiddle * model.pxToMetersRatio )
      .lineTo( model.verticles.x3top * model.pxToMetersRatio - 2, model.poolDimensions.leftChamber.y * model.pxToMetersRatio );

    this.addChild( new Path( shape, {
      stroke: new Pattern( cementImg ),
      lineWidth: 4,
      lineJoin: 'round'
    } ) );

    this.addChild( new UPFaucetNode( model.globalModel, model.outputFaucet, 0 ) );

    //white background for pool

    //bottom chamber
    this.addChild( new Rectangle( model.verticles.x1middle * model.pxToMetersRatio - 6, (model.poolDimensions.bottomChamber.y1) * model.pxToMetersRatio + 1, (model.verticles.x2middle - model.verticles.x1middle) * model.pxToMetersRatio + 12, (model.poolDimensions.bottomChamber.y2 - model.poolDimensions.bottomChamber.y1) * model.pxToMetersRatio-1, {
      fill: "#f3f0e9"
    } ) );

    //left chamber
    shape = new Shape()
      .moveTo( model.verticles.x1top * model.pxToMetersRatio, model.poolDimensions.leftChamber.y * model.pxToMetersRatio-1 )
      .lineTo( model.verticles.x1bottom * model.pxToMetersRatio, (model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height) * model.pxToMetersRatio  )
      .lineTo( model.verticles.x2bottom * model.pxToMetersRatio, (model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height) * model.pxToMetersRatio )
      .lineTo( model.verticles.x2top * model.pxToMetersRatio, model.poolDimensions.leftChamber.y * model.pxToMetersRatio-1 );

    this.addChild( new Path( shape, {
      fill: "#f3f0e9"
    } ) );

    //right chamber
    shape = new Shape()
      .moveTo( model.verticles.x3top * model.pxToMetersRatio, model.poolDimensions.leftChamber.y * model.pxToMetersRatio-1 )
      .lineTo( model.verticles.x3bottom * model.pxToMetersRatio, (model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height) * model.pxToMetersRatio  )
      .lineTo( model.verticles.x4bottom * model.pxToMetersRatio, (model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height) * model.pxToMetersRatio )
      .lineTo( model.verticles.x4top * model.pxToMetersRatio, model.poolDimensions.leftChamber.y * model.pxToMetersRatio-1 );

    this.addChild( new Path( shape, {
      fill: "#f3f0e9"
    } ) );

    this.addChild( new UPFaucetNode( model.globalModel, model.inputFaucet, 505) );


  }

  return inherit( Node, TrapezoidPoolBack );
} );