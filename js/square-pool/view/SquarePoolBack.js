// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for square pool which contains grass, cement and faucets
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
  var UPFaucetNode = require( 'UNDER_PRESSURE/common/view/UPFaucetNode' );

  // images
  var grassImg = require( 'image!UNDER_PRESSURE/images/grass-texture.png' );
  var cementImg = require( 'image!UNDER_PRESSURE/images/cement-texture-dark.jpg' );

  /**
   * @param {SquarePoolModel} squarePoolModel of the simulation
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   * @constructor
   */
  function SquarePoolBack( squarePoolModel, modelViewTransform ) {

    Node.call( this );

    //grass
    var grassPattern = new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) );
    var grassRectYOffset = 1;
    var grassRectHeight = 10;
    // grass on the left of the pool
    this.addChild( new Rectangle( -1000, grassRectYOffset, 1000 + modelViewTransform.modelToViewX( squarePoolModel.poolDimensions.x1 ), grassRectHeight, {
      fill: grassPattern, y: modelViewTransform.modelToViewY( squarePoolModel.underPressureModel.skyGroundBoundY ) - grassRectHeight
    } ) );
    // grass on the right of the pool
    this.addChild( new Rectangle( modelViewTransform.modelToViewX( squarePoolModel.poolDimensions.x2 ), grassRectYOffset, 2000, grassRectHeight, {
      fill: grassPattern, y: modelViewTransform.modelToViewY( squarePoolModel.underPressureModel.skyGroundBoundY ) - grassRectHeight
    } ) );

    //cement border
    var cementBorder = new Shape()
      .moveTo( modelViewTransform.modelToViewX( squarePoolModel.poolDimensions.x1 ) - 2, modelViewTransform.modelToViewY( squarePoolModel.poolDimensions.y1 ) )
      .lineTo( modelViewTransform.modelToViewX( squarePoolModel.poolDimensions.x1 ) - 2, modelViewTransform.modelToViewY( squarePoolModel.poolDimensions.y2 ) + 2 )
      .lineTo( modelViewTransform.modelToViewX( squarePoolModel.poolDimensions.x2 ) + 2, modelViewTransform.modelToViewY( squarePoolModel.poolDimensions.y2 ) + 2 )
      .lineTo( modelViewTransform.modelToViewX( squarePoolModel.poolDimensions.x2 ) + 2, modelViewTransform.modelToViewY( squarePoolModel.poolDimensions.y1 ) );

    this.addChild( new Path( cementBorder, {  stroke: new Pattern( cementImg ), lineWidth: 4, lineJoin: 'round' } ) );

    // add output faucet
    this.addChild( new UPFaucetNode( squarePoolModel.outputFaucet, 150, modelViewTransform ) );

    //white background for pool
    this.addChild( new Rectangle( modelViewTransform.modelToViewX( squarePoolModel.poolDimensions.x1 ),
        modelViewTransform.modelToViewY( squarePoolModel.poolDimensions.y1 ) - 1,
      modelViewTransform.modelToViewX( squarePoolModel.poolDimensions.x2 - squarePoolModel.poolDimensions.x1 ),
        modelViewTransform.modelToViewY( squarePoolModel.poolDimensions.y2 - squarePoolModel.poolDimensions.y1 ) + 1, { fill: '#f3f0e9' } ) );

    // add input faucet node
    this.addChild( new UPFaucetNode( squarePoolModel.inputFaucet, 3000, modelViewTransform ) );
  }

  return inherit( Node, SquarePoolBack );
} );