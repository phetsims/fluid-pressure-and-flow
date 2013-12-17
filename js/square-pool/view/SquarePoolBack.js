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

  function SquarePoolBack( model, mvt ) {
    Node.call( this );

    //grass
    this.addChild( new Rectangle( -1000, 0, 1000 + mvt.modelToViewX( model.poolDimensions.x1 ), 10, {
      fill: new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) ),
      y: mvt.modelToViewY( model.globalModel.skyGroundBoundY ) - 10
    } ) );

    this.addChild( new Rectangle( mvt.modelToViewX( model.poolDimensions.x2 ), 0, 2000, 10, {
      fill: new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) ),
      y: mvt.modelToViewY( model.globalModel.skyGroundBoundY ) - 10
    } ) );

    //cement border
    var shape = new Shape()
      .moveTo( mvt.modelToViewX( model.poolDimensions.x1 ) - 2, mvt.modelToViewY( model.poolDimensions.y1 ) )
      .lineTo( mvt.modelToViewX( model.poolDimensions.x1 ) - 2, mvt.modelToViewY( model.poolDimensions.y2 ) + 2 )
      .lineTo( mvt.modelToViewX( model.poolDimensions.x2 ) + 2, mvt.modelToViewY( model.poolDimensions.y2 ) + 2 )
      .lineTo( mvt.modelToViewX( model.poolDimensions.x2 ) + 2, mvt.modelToViewY( model.poolDimensions.y1 ) );

    this.addChild( new Path( shape, {
      stroke: new Pattern( cementImg ),
      lineWidth: 4,
      lineJoin: 'round'
    } ) );


    this.addChild( new UPFaucetNode( model.outputFaucet, 0, mvt ) );

    //white background for pool
    this.addChild( new Rectangle( mvt.modelToViewX( model.poolDimensions.x1 ), mvt.modelToViewY( model.poolDimensions.y1 ) - 1, mvt.modelToViewX( model.poolDimensions.x2 - model.poolDimensions.x1 ), mvt.modelToViewY( model.poolDimensions.y2 - model.poolDimensions.y1 ) + 1, {
      fill: "#f3f0e9"
    } ) );

    this.addChild( new UPFaucetNode( model.inputFaucet, 505, mvt ) );

  }

  return inherit( Node, SquarePoolBack );
} );