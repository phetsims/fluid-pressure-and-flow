// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for water in square pool
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Color = require( "SCENERY/util/Color" );

  function TrapezoidPoolWaterNode( model ) {
    var self = this;
    Node.call( this );

    var leftShape = new Shape();
    var rightShape = new Shape();
    var bottomShape = new Shape();
    bottomShape = new Shape();

    var leftPath = new Path( leftShape );
    var rightPath = new Path( rightShape );
    var bottomPath = new Path( bottomShape );

    var viewHeight;
    var maxHeight = model.MAX_HEIGHT * model.pxToMetersRatio;

    var yMax = (model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height);

    model.globalModel.waterColorModel.waterColorProperty.link( function( color ) {
      viewHeight = maxHeight * model.volume / model.MAX_VOLUME;
      var newGradient = new LinearGradient( 0, yMax, 0, yMax - maxHeight )
        .addColorStop( 0, model.globalModel.waterColorModel.bottomColor )
        .addColorStop( 1, model.globalModel.waterColorModel.topColor );

      //self.fill = newGradient; TODO ask why not working
      leftPath.fill = newGradient;
      rightPath.fill = newGradient;
      bottomPath.fill = newGradient;
    } );

    model.volumeProperty.link( function( volume ) {
      viewHeight = model.MAX_HEIGHT * model.volume / model.MAX_VOLUME;

      //bottomChamber
      var h = Math.min( viewHeight, model.poolDimensions.bottomChamber.y2 - model.poolDimensions.bottomChamber.y1 );
      bottomShape = new Shape()
        .moveTo( model.verticles.x1middle * model.pxToMetersRatio - 6, (yMax - h) * model.pxToMetersRatio )
        .lineTo( model.verticles.x1middle * model.pxToMetersRatio - 6, yMax * model.pxToMetersRatio )
        .lineTo( model.verticles.x2middle * model.pxToMetersRatio + 6, yMax * model.pxToMetersRatio )
        .lineTo( model.verticles.x2middle * model.pxToMetersRatio + 6, (yMax - h) * model.pxToMetersRatio );
      bottomPath.shape = bottomShape;

      var topY = model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height - viewHeight;

      //leftChamber
      leftShape = new Shape()
        .moveTo( model.poolDimensions.leftChamber.leftBorderFunction( viewHeight ) * model.pxToMetersRatio, topY * model.pxToMetersRatio )
        .lineTo( model.verticles.x1bottom * model.pxToMetersRatio, yMax * model.pxToMetersRatio )
        .lineTo( model.verticles.x2bottom * model.pxToMetersRatio, yMax * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.leftChamber.rightBorderFunction( viewHeight ) * model.pxToMetersRatio, topY * model.pxToMetersRatio );
      leftPath.shape = leftShape;

      //leftChamber
      rightShape = new Shape()
        .moveTo( model.poolDimensions.rightChamber.leftBorderFunction( viewHeight ) * model.pxToMetersRatio, topY * model.pxToMetersRatio )
        .lineTo( model.verticles.x3bottom * model.pxToMetersRatio, yMax * model.pxToMetersRatio )
        .lineTo( model.verticles.x4bottom * model.pxToMetersRatio, yMax * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.rightChamber.rightBorderFunction( viewHeight ) * model.pxToMetersRatio, topY * model.pxToMetersRatio );
      rightPath.shape = rightShape;
    } );

    this.addChild( leftPath );
    this.addChild( rightPath );
    this.addChild( bottomPath );

  }

  return inherit( Node, TrapezoidPoolWaterNode );
} );