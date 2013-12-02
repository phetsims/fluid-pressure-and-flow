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

  function TrapezoidPoolWaterNode( model ) {
    var self = this;
    Node.call( this);

    var leftShape = new Shape();
    var rightShape = new Shape();
    var bottomShape = new Shape();
    bottomShape = new Shape();

    var leftPath = new Path(leftShape, {fill:"blue"});
    var rightPath = new Path(rightShape, {fill:"blue"});
    var bottomPath = new Path(bottomShape, {fill:"blue"});

    model.volumeProperty.link( function( volume ) {
      var viewHeight = model.HEIGHT * model.volume/model.MAX_VOLUME;

      //bottomChamber
      var h = Math.min(viewHeight,model.poolDimensions.bottomChamber.y2-model.poolDimensions.bottomChamber.y1);
      bottomShape = new Shape()
        .moveTo( model.verticles.x1middle * model.pxToMetersRatio - 6, (model.poolDimensions.bottomChamber.y2-h) * model.pxToMetersRatio )
        .lineTo( model.verticles.x1middle * model.pxToMetersRatio - 6, model.poolDimensions.bottomChamber.y2 * model.pxToMetersRatio  )
        .lineTo( model.verticles.x2middle * model.pxToMetersRatio + 6, model.poolDimensions.bottomChamber.y2 * model.pxToMetersRatio  )
        .lineTo( model.verticles.x2middle * model.pxToMetersRatio + 6, (model.poolDimensions.bottomChamber.y2-h) * model.pxToMetersRatio  );
      bottomPath.shape = bottomShape;

      var topY = model.poolDimensions.leftChamber.y+model.poolDimensions.leftChamber.height-viewHeight;

      //leftChamber
      leftShape = new Shape()
        .moveTo( model.poolDimensions.leftChamber.leftBorderFunction(viewHeight) * model.pxToMetersRatio, topY * model.pxToMetersRatio )
        .lineTo( model.verticles.x1bottom * model.pxToMetersRatio, (model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height) * model.pxToMetersRatio  )
        .lineTo( model.verticles.x2bottom * model.pxToMetersRatio, (model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height) * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.leftChamber.rightBorderFunction(viewHeight) * model.pxToMetersRatio, topY * model.pxToMetersRatio );
      leftPath.shape = leftShape;

      //leftChamber
      rightShape = new Shape()
        .moveTo( model.poolDimensions.rightChamber.leftBorderFunction(viewHeight) * model.pxToMetersRatio, topY * model.pxToMetersRatio )
        .lineTo( model.verticles.x3bottom * model.pxToMetersRatio, (model.poolDimensions.rightChamber.y + model.poolDimensions.rightChamber.height) * model.pxToMetersRatio  )
        .lineTo( model.verticles.x4bottom * model.pxToMetersRatio, (model.poolDimensions.rightChamber.y + model.poolDimensions.rightChamber.height) * model.pxToMetersRatio )
        .lineTo( model.poolDimensions.rightChamber.rightBorderFunction(viewHeight) * model.pxToMetersRatio, topY * model.pxToMetersRatio );
      rightPath.shape = rightShape;
    } );

    this.addChild( leftPath );
    this.addChild( rightPath );
    this.addChild( bottomPath );

  }

  return inherit( Node, TrapezoidPoolWaterNode );
} );