// Copyright 2002-2013, University of Colorado Boulder

/**
 * specific view for trapezoid pool
 * grass, cement container and faucets
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Pattern = require( 'SCENERY/util/Pattern' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var UnderPressureFaucetNode = require( 'UNDER_PRESSURE/common/view/UnderPressureFaucetNode' );

  // images
  var grassImg = require( 'image!UNDER_PRESSURE/images/grass-texture.png' );
  var cementImg = require( 'image!UNDER_PRESSURE/images/cement-texture-dark.jpg' );

  /**
   * @param {TrapezoidPoolModel} trapezoidPoolModel
   * @param {ModelViewTransform2 } modelViewTransform to convert between model and view co-ordinates
   * @constructor
   */
  function TrapezoidPoolBack( trapezoidPoolModel, modelViewTransform ) {

    Node.call( this );

    // grass
    var grassPattern = new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) );
    var grassRectYOffset = 1;
    var grassRectHeight = 10;

    this.addChild( new Rectangle( -1000, grassRectYOffset,
        1000 + modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1top ),
      grassRectHeight, {
        fill: grassPattern,
        y: modelViewTransform.modelToViewY( trapezoidPoolModel.underPressureModel.skyGroundBoundY ) - grassRectHeight
      } ) );

    this.addChild( new Rectangle( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x2top ),
      grassRectYOffset,
      modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x3top -
                                       trapezoidPoolModel.verticles.x2top ),
      grassRectHeight, {
        fill: grassPattern,
        y: modelViewTransform.modelToViewY( trapezoidPoolModel.underPressureModel.skyGroundBoundY ) - grassRectHeight
      } ) );

    this.addChild( new Rectangle( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x4top ),
      grassRectYOffset, 1000, grassRectHeight, {
        fill: grassPattern,
        y: modelViewTransform.modelToViewY( trapezoidPoolModel.underPressureModel.skyGroundBoundY ) - grassRectHeight
      } ) );

    // cement border
    var cementBorder = new Shape()
      .moveTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1top ) - 2,
      modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y ) )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1bottom ) - 2,
        modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y +
                                         trapezoidPoolModel.poolDimensions.leftChamber.height ) + 2 )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x4bottom ) + 2,
        modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y +
                                         trapezoidPoolModel.poolDimensions.leftChamber.height ) + 2 )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x4top ) + 2,
      modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y ) )
      .moveTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x2top ) + 2,
      modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y ) )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1middle ) + 2,
        modelViewTransform.modelToViewY( trapezoidPoolModel.verticles.ymiddle ) - 1 )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x2middle ) - 2,
        modelViewTransform.modelToViewY( trapezoidPoolModel.verticles.ymiddle ) - 1 )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x3top ) - 2,
      modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y ) );

    this.addChild( new Path( cementBorder, {
      stroke: new Pattern( cementImg ),
      lineWidth: 4,
      lineJoin: 'round'
    } ) );

    // add output faucet
    this.addChild( new UnderPressureFaucetNode( trapezoidPoolModel.outputFaucet, 200, modelViewTransform ) );

    // bottom chamber
    this.addChild( new Rectangle( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1middle ) - 8,
        modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.bottomChamber.y1 ) +
        1, modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x2middle -
                                            trapezoidPoolModel.verticles.x1middle ) + 16,
        modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.bottomChamber.y2 -
                                         trapezoidPoolModel.poolDimensions.bottomChamber.y1 ) -
        1, {
        fill: '#f3f0e9'
      } ) );

    // left chamber
    var leftChamber = new Shape()
      .moveTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1top ),
        modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y ) - 1 )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1bottom ),
      modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y +
                                       trapezoidPoolModel.poolDimensions.leftChamber.height ) )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x2bottom ),
      modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y +
                                       trapezoidPoolModel.poolDimensions.leftChamber.height ) )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x2top ),
        modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y ) - 1 );

    this.addChild( new Path( leftChamber, {
      fill: '#f3f0e9'
    } ) );

    // right chamber
    var rightChamber = new Shape()
      .moveTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x3top ),
        modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y ) - 1 )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x3bottom ),
      modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y +
                                       trapezoidPoolModel.poolDimensions.leftChamber.height ) )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x4bottom ),
      modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y +
                                       trapezoidPoolModel.poolDimensions.leftChamber.height ) )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x4top ),
        modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y ) - 1 );

    this.addChild( new Path( rightChamber, {
      fill: '#f3f0e9'
    } ) );

    // add input faucet
    this.addChild( new UnderPressureFaucetNode( trapezoidPoolModel.inputFaucet, 3000, modelViewTransform ) );
  }

  return inherit( Node, TrapezoidPoolBack );
} );