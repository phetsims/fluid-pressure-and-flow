// Copyright 2002-2013, University of Colorado Boulder

/**
 * main Model container.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var PoolWithFaucetsModel = require( 'common/model/PoolWithFaucetsModel' );
  var FaucetModel = require( 'common/model/FaucetModel' );
  var LinearFunction = require( 'DOT/LinearFunction' );


  function TrapezoidPoolModel( width, height ) {
    var model = this;

    //constants, from java model
    this.HEIGHT = 3; // Meters
    this.MAX_VOLUME = model.HEIGHT; // Liters
    var WIDTHATTOP = 0.785;
    var WIDTHATBOTTOM = 3.57;
    var LEFTCHAMBERTOPCENTER = 3;
    var SEPARATION = 3.5;//Between centers

    this.inputFaucet = new FaucetModel( new Vector2( 3, 2.7 ), 1 );
    this.outputFaucet = new FaucetModel( new Vector2( 7.75, 6.60 ), 1 );

    PoolWithFaucetsModel.call( this, width, height );

    this.poolDimensions = {
      leftChamber: {
        centerTop: LEFTCHAMBERTOPCENTER,
        widthTop: WIDTHATTOP,
        widthBottom: WIDTHATBOTTOM,
        y: model.skyGroundBoundY,
        height: model.HEIGHT,
        leftBorderFunction: new LinearFunction( 0, model.HEIGHT, LEFTCHAMBERTOPCENTER - WIDTHATBOTTOM / 2, LEFTCHAMBERTOPCENTER - WIDTHATTOP / 2 ),
        rightBorderFunction: new LinearFunction( 0, model.HEIGHT, LEFTCHAMBERTOPCENTER + WIDTHATBOTTOM / 2, LEFTCHAMBERTOPCENTER + WIDTHATTOP / 2 )
      },
      rightChamber: {
        centerTop: LEFTCHAMBERTOPCENTER + SEPARATION,
        widthTop: WIDTHATBOTTOM,
        widthBottom: WIDTHATTOP,
        y: model.skyGroundBoundY,
        height: model.HEIGHT,
        leftBorderFunction: new LinearFunction( 0, model.HEIGHT, LEFTCHAMBERTOPCENTER + SEPARATION - WIDTHATTOP / 2, LEFTCHAMBERTOPCENTER + SEPARATION - WIDTHATBOTTOM / 2 ),
        rightBorderFunction: new LinearFunction( 0, model.HEIGHT, LEFTCHAMBERTOPCENTER + SEPARATION + WIDTHATTOP / 2, LEFTCHAMBERTOPCENTER + SEPARATION + WIDTHATBOTTOM / 2 )
      },
      bottomChamber: {
        x1: LEFTCHAMBERTOPCENTER + WIDTHATBOTTOM / 2,
        y1: model.skyGroundBoundY + model.HEIGHT - 0.21,
        x2: LEFTCHAMBERTOPCENTER + SEPARATION - WIDTHATTOP / 2,
        y2: model.skyGroundBoundY + model.HEIGHT
      }
    };


    //key coordinates of complex figure
    this.verticles = {
      x1top: model.poolDimensions.leftChamber.centerTop - model.poolDimensions.leftChamber.widthTop / 2,
      x2top: model.poolDimensions.leftChamber.centerTop + model.poolDimensions.leftChamber.widthTop / 2,
      x3top: model.poolDimensions.rightChamber.centerTop - model.poolDimensions.rightChamber.widthTop / 2,
      x4top: model.poolDimensions.rightChamber.centerTop + model.poolDimensions.rightChamber.widthTop / 2,

      x1middle: model.poolDimensions.leftChamber.rightBorderFunction( model.poolDimensions.bottomChamber.y2 - model.poolDimensions.bottomChamber.y1 ),
      x2middle: model.poolDimensions.rightChamber.leftBorderFunction( model.poolDimensions.bottomChamber.y2 - model.poolDimensions.bottomChamber.y1 ),
      ymiddle: model.poolDimensions.bottomChamber.y1,

      x1bottom: model.poolDimensions.leftChamber.centerTop - model.poolDimensions.leftChamber.widthBottom / 2,
      x2bottom: model.poolDimensions.leftChamber.centerTop + model.poolDimensions.leftChamber.widthBottom / 2,
      x3bottom: model.poolDimensions.rightChamber.centerTop - model.poolDimensions.rightChamber.widthBottom / 2,
      x4bottom: model.poolDimensions.rightChamber.centerTop + model.poolDimensions.rightChamber.widthBottom / 2
    }

  }

  return inherit( PoolWithFaucetsModel, TrapezoidPoolModel );
} );