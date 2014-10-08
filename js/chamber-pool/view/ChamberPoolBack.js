// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the chamber pool background containing grass, cement etc
 * grass, cement container
 * @author Vasily Shakhov (Mlearner)
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

  // images
  var grassImg = require( 'image!UNDER_PRESSURE/images/grass-texture.png' );
  var cementImg = require( 'image!UNDER_PRESSURE/images/cement-texture-dark.jpg' );


  /**
   * @param {ChamberPoolModel} chamberPoolModel of the simulation
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   * @constructor
   */
  function ChamberPoolBack( chamberPoolModel, modelViewTransform ) {

    Node.call( this );

    //grass
    var grassPattern = new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) );
    var grassRectYOffset = 1;
    var grassRectHeight = 10;
    var grassExtension = 1000; // how far should grass extend on either side of safe screen bounds.

    this.addChild( new Rectangle( -grassExtension, grassRectYOffset,
        grassExtension +
        modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftOpening.x1 ),
      grassRectHeight, { fill: grassPattern,
        y: modelViewTransform.modelToViewY( chamberPoolModel.underPressureModel.skyGroundBoundY ) - grassRectHeight
      } ) );

    this.addChild( new Rectangle( modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftOpening.x2 ),
      grassRectYOffset,
      modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.rightOpening.x1 -
                                       chamberPoolModel.poolDimensions.leftOpening.x2 ),
      grassRectHeight,
      { fill: grassPattern,
        y: modelViewTransform.modelToViewY( chamberPoolModel.underPressureModel.skyGroundBoundY ) -
           grassRectHeight
      } ) );

    this.addChild( new Rectangle( modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.rightOpening.x2 ),
      grassRectYOffset, grassExtension, grassRectHeight, { fill: grassPattern,
        y: modelViewTransform.modelToViewY( chamberPoolModel.underPressureModel.skyGroundBoundY ) - grassRectHeight
      } ) );

    //calculated view coordinates for water
    var leftOpeningX1 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftOpening.x1 );
    var leftOpeningX2 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftOpening.x2 );
    var leftChamberX1 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftChamber.x1 );
    var leftChamberX2 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftChamber.x2 );
    var rightChamberX1 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.rightChamber.x1 );
    var rightChamberX2 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.rightChamber.x2 );
    var rightOpeningX1 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.rightOpening.x1 );
    var rightOpeningX2 = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.rightOpening.x2 );
    var leftOpeningY1 = modelViewTransform.modelToViewY( chamberPoolModel.poolDimensions.leftOpening.y1 );
    var leftOpeningY2 = modelViewTransform.modelToViewY( chamberPoolModel.poolDimensions.leftOpening.y2 );
    var leftChamberY2 = modelViewTransform.modelToViewY( chamberPoolModel.poolDimensions.leftChamber.y2 );
    var passageY1 = modelViewTransform.modelToViewY( chamberPoolModel.poolDimensions.horizontalPassage.y1 );
    var passageY2 = modelViewTransform.modelToViewY( chamberPoolModel.poolDimensions.horizontalPassage.y2 );

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

    this.addChild( new Path( shape, { stroke: new Pattern( cementImg ), lineWidth: 4, lineJoin: 'round' } ) );

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