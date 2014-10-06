// Copyright 2002-2013, University of Colorado Boulder

/**
 * main Model for trapezoid pool screen.
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';
// modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var PoolWithFaucetsModel = require( 'UNDER_PRESSURE/common/model/PoolWithFaucetsModel' );
  var FaucetModel = require( 'UNDER_PRESSURE/common/model/FaucetModel' );
  var LinearFunction = require( 'DOT/LinearFunction' );


  /**
   * @param {UnderPressureModel} underPressureModel of the simulation
   * @constructor
   */
  function TrapezoidPoolModel( underPressureModel ) {

    var trapezoidPoolModel = this;

    //constants
    this.MAX_HEIGHT = 3; // meters
    this.MAX_VOLUME = trapezoidPoolModel.MAX_HEIGHT; // Liters
    var WIDTHATTOP = 0.785; //meters,
    var WIDTHATBOTTOM = 3.57; //meters,
    var LEFTCHAMBERTOPCENTER = 3; //meters,
    var SEPARATION = 3.5;//Between centers

    this.inputFaucet = new FaucetModel( new Vector2( 3, underPressureModel.skyGroundBoundY - 0.44 ), 1, 0.42 );
    this.outputFaucet = new FaucetModel( new Vector2( 7.7, underPressureModel.skyGroundBoundY + 3.45 ), 1, 0.3 );

    this.underPressureModel = underPressureModel;

    this.poolDimensions = {
      leftChamber: {
        centerTop: LEFTCHAMBERTOPCENTER,
        widthTop: WIDTHATTOP,
        widthBottom: WIDTHATBOTTOM,
        y: trapezoidPoolModel.underPressureModel.skyGroundBoundY,
        height: trapezoidPoolModel.MAX_HEIGHT,
        leftBorderFunction: new LinearFunction( 0, trapezoidPoolModel.MAX_HEIGHT, LEFTCHAMBERTOPCENTER - WIDTHATBOTTOM / 2, LEFTCHAMBERTOPCENTER - WIDTHATTOP / 2 ),
        rightBorderFunction: new LinearFunction( 0, trapezoidPoolModel.MAX_HEIGHT, LEFTCHAMBERTOPCENTER + WIDTHATBOTTOM / 2, LEFTCHAMBERTOPCENTER + WIDTHATTOP / 2 )
      },
      rightChamber: {
        centerTop: LEFTCHAMBERTOPCENTER + SEPARATION,
        widthTop: WIDTHATBOTTOM,
        widthBottom: WIDTHATTOP,
        y: trapezoidPoolModel.underPressureModel.skyGroundBoundY,
        height: trapezoidPoolModel.MAX_HEIGHT,
        leftBorderFunction: new LinearFunction( 0, trapezoidPoolModel.MAX_HEIGHT, LEFTCHAMBERTOPCENTER + SEPARATION - WIDTHATTOP / 2, LEFTCHAMBERTOPCENTER + SEPARATION - WIDTHATBOTTOM / 2 ),
        rightBorderFunction: new LinearFunction( 0, trapezoidPoolModel.MAX_HEIGHT, LEFTCHAMBERTOPCENTER + SEPARATION + WIDTHATTOP / 2, LEFTCHAMBERTOPCENTER + SEPARATION + WIDTHATBOTTOM / 2 )
      },
      bottomChamber: {
        x1: LEFTCHAMBERTOPCENTER + WIDTHATBOTTOM / 2,
        y1: trapezoidPoolModel.underPressureModel.skyGroundBoundY + trapezoidPoolModel.MAX_HEIGHT - 0.21,
        x2: LEFTCHAMBERTOPCENTER + SEPARATION - WIDTHATTOP / 2,
        y2: trapezoidPoolModel.underPressureModel.skyGroundBoundY + trapezoidPoolModel.MAX_HEIGHT
      }
    };

    //key coordinates of complex figure
    this.verticles = {
      x1top: trapezoidPoolModel.poolDimensions.leftChamber.centerTop - trapezoidPoolModel.poolDimensions.leftChamber.widthTop / 2,
      x2top: trapezoidPoolModel.poolDimensions.leftChamber.centerTop + trapezoidPoolModel.poolDimensions.leftChamber.widthTop / 2,
      x3top: trapezoidPoolModel.poolDimensions.rightChamber.centerTop - trapezoidPoolModel.poolDimensions.rightChamber.widthTop / 2,
      x4top: trapezoidPoolModel.poolDimensions.rightChamber.centerTop + trapezoidPoolModel.poolDimensions.rightChamber.widthTop / 2,

      x1middle: trapezoidPoolModel.poolDimensions.leftChamber.rightBorderFunction( trapezoidPoolModel.poolDimensions.bottomChamber.y2 - trapezoidPoolModel.poolDimensions.bottomChamber.y1 ),
      x2middle: trapezoidPoolModel.poolDimensions.rightChamber.leftBorderFunction( trapezoidPoolModel.poolDimensions.bottomChamber.y2 - trapezoidPoolModel.poolDimensions.bottomChamber.y1 ),

      x1bottom: trapezoidPoolModel.poolDimensions.leftChamber.centerTop - trapezoidPoolModel.poolDimensions.leftChamber.widthBottom / 2,
      x2bottom: trapezoidPoolModel.poolDimensions.leftChamber.centerTop + trapezoidPoolModel.poolDimensions.leftChamber.widthBottom / 2,
      x3bottom: trapezoidPoolModel.poolDimensions.rightChamber.centerTop - trapezoidPoolModel.poolDimensions.rightChamber.widthBottom / 2,
      x4bottom: trapezoidPoolModel.poolDimensions.rightChamber.centerTop + trapezoidPoolModel.poolDimensions.rightChamber.widthBottom / 2,

      ymiddle: trapezoidPoolModel.poolDimensions.bottomChamber.y1
    };

    PoolWithFaucetsModel.call( this, underPressureModel );
  }

  return inherit( PoolWithFaucetsModel, TrapezoidPoolModel, {

    /**
     * Returns height of the water above the given position
     * @param {Number} x position in meters
     * @param {Number} y position in meters
     * @returns {Number} height of the water above the y
     */
    getWaterHeightAboveY: function( x, y ) {
      return y - (this.poolDimensions.bottomChamber.y2 - this.MAX_HEIGHT * this.volume / this.MAX_VOLUME);
    },

    /**
     * Returns true if the given point is inside the trapezoid pool, false otherwise.
     * @param {Number} x position in meters
     * @param {Number} y position in meters
     * @returns {boolean}
     */
    isPointInsidePool: function( x, y ) {
      var isInside = false;
      if ( x > this.poolDimensions.bottomChamber.x1 && x < this.poolDimensions.bottomChamber.x2 && y > this.poolDimensions.bottomChamber.y1 && y < this.poolDimensions.bottomChamber.y2 ) {
        //inside bottom chamber
        isInside = true;
      }
      else {
        var y_above_pool = this.poolDimensions.bottomChamber.y2 - y;
        if ( y_above_pool > 0 ) {
          var x1 = this.poolDimensions.leftChamber.leftBorderFunction( y_above_pool ),
            x2 = this.poolDimensions.leftChamber.rightBorderFunction( y_above_pool ),
            x3 = this.poolDimensions.rightChamber.leftBorderFunction( y_above_pool ),
            x4 = this.poolDimensions.rightChamber.rightBorderFunction( y_above_pool );
          if ( x1 < x && x < x2 ) {
            //inside left chamber
            isInside = true;
          }
          else if ( x3 < x && x < x4 ) {
            //inside right chamber
            isInside = true;
          }
        }
      }
      return isInside;
    }
  } );
} );