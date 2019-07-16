// Copyright 2013-2017, University of Colorado Boulder

/**
 * specific view for trapezoid pool
 * grass, cement container and faucets
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Pattern = require( 'SCENERY/util/Pattern' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const UnderPressureFaucetNode = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/UnderPressureFaucetNode' );

  // images
  const cementImg = require( 'image!FLUID_PRESSURE_AND_FLOW/cement-texture-dark.jpg' );
  const grassImg = require( 'image!FLUID_PRESSURE_AND_FLOW/grass-texture.png' );

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
    var grassExtension = 2000;
    var backgroundGrassWidth = 5000;
    var poolDimensions = trapezoidPoolModel.poolDimensions;

    var grassRectangle = new Rectangle(
      -grassExtension,
      grassRectYOffset,
      backgroundGrassWidth,
      grassRectHeight,
      {
        fill: grassPattern,
        y: modelViewTransform.modelToViewY( 0 ) - grassRectHeight
      }
    );

    grassRectangle.clipArea = new Shape()
      .rect( -grassExtension,
      grassRectYOffset,
      grassExtension + modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1top ),
      grassRectHeight )
      .moveTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x2top ), grassRectYOffset )
      .rect(
      modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x2top ),
      grassRectYOffset,
      modelViewTransform.modelToViewDeltaX( trapezoidPoolModel.verticles.x3top - trapezoidPoolModel.verticles.x2top ),
      grassRectHeight )
      .moveTo(modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x4top ), grassRectYOffset )
      .rect(
      modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x4top ),
      grassRectYOffset,
      grassExtension,
      grassRectHeight );
    this.addChild(grassRectangle);

    // cement border
    var cementWidth = 2;
    var cementBorder = new Shape()
      .moveTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1top ) - cementWidth,
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y ) )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1bottom ) - cementWidth,
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y - poolDimensions.leftChamber.height ) +
      cementWidth )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x4bottom ) + cementWidth,
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y - poolDimensions.leftChamber.height ) +
      cementWidth )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x4top ) + cementWidth,
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y ) )
      .moveTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x2top ) + cementWidth,
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y ) )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1middle ) + cementWidth,
      modelViewTransform.modelToViewY( trapezoidPoolModel.verticles.ymiddle ) - 1 )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x2middle ) - cementWidth,
      modelViewTransform.modelToViewY( trapezoidPoolModel.verticles.ymiddle ) - 1 )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x3top ) - cementWidth,
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y ) );

    this.addChild( new Path( cementBorder, {
      stroke: new Pattern( cementImg ),
      lineWidth: 4,
      lineJoin: 'round'
    } ) );

    // add output faucet
    this.addChild( new UnderPressureFaucetNode( trapezoidPoolModel.outputFaucet, 200, modelViewTransform ) );

    // bottom chamber
    this.addChild( new Rectangle(
      modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1middle ) - 8,
      modelViewTransform.modelToViewY( poolDimensions.bottomChamber.y1 ) + 1,
      modelViewTransform.modelToViewDeltaX( trapezoidPoolModel.verticles.x2middle -
                                            trapezoidPoolModel.verticles.x1middle ) + 16,
      modelViewTransform.modelToViewDeltaY( poolDimensions.bottomChamber.y2 - poolDimensions.bottomChamber.y1 ) - 1,
      {
        fill: '#f3f0e9'
      }
    ) );

    // left chamber
    var leftChamber = new Shape()
      .moveTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1top ),
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y ) - 1 )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1bottom ),
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y - poolDimensions.leftChamber.height ) )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x2bottom ),
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y - poolDimensions.leftChamber.height ) )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x2top ),
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y ) - 1 );

    this.addChild( new Path( leftChamber, {
      fill: '#f3f0e9'
    } ) );

    // right chamber
    var rightChamber = new Shape()
      .moveTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x3top ),
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y ) - 1 )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x3bottom ),
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y - poolDimensions.leftChamber.height ) )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x4bottom ),
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y - poolDimensions.leftChamber.height ) )
      .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x4top ),
      modelViewTransform.modelToViewY( poolDimensions.leftChamber.y ) - 1 );

    this.addChild( new Path( rightChamber, {
      fill: '#f3f0e9'
    } ) );

    // add input faucet
    this.addChild( new UnderPressureFaucetNode( trapezoidPoolModel.inputFaucet, 3000, modelViewTransform ) );
  }

  fluidPressureAndFlow.register( 'TrapezoidPoolBack', TrapezoidPoolBack );

  return inherit( Node, TrapezoidPoolBack );
} );