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

// constants
  var WIDTH_AT_TOP = 0.7; //meters,
  var WIDTH_AT_BOTTOM = 3.15; //meters,
  var LEFT_CHAMBER_TOP_CENTER = 3.2; //meters,
  var SEPARATION = 3.22;//Between centers

  /**
   * @param {UnderPressureModel} underPressureModel of the simulation
   * @constructor
   */
  function TrapezoidPoolModel( underPressureModel ) {

    //constants
    this.maxHeight = 3; // meters
    this.maxVolume = this.maxHeight; // Liters

    this.inputFaucet = new FaucetModel( new Vector2( 3.19, underPressureModel.skyGroundBoundY - 0.44 ), 1, 0.42 );
    this.outputFaucet = new FaucetModel( new Vector2( 7.5, underPressureModel.skyGroundBoundY + 3.45 ), 1, 0.3 );

    this.underPressureModel = underPressureModel;

    this.poolDimensions = {
      leftChamber: {
        centerTop: LEFT_CHAMBER_TOP_CENTER,
        widthTop: WIDTH_AT_TOP,
        widthBottom: WIDTH_AT_BOTTOM,
        y: this.underPressureModel.skyGroundBoundY,
        height: this.maxHeight,
        leftBorderFunction: new LinearFunction( 0, this.maxHeight, LEFT_CHAMBER_TOP_CENTER - WIDTH_AT_BOTTOM / 2,
            LEFT_CHAMBER_TOP_CENTER - WIDTH_AT_TOP / 2 ),
        rightBorderFunction: new LinearFunction( 0, this.maxHeight, LEFT_CHAMBER_TOP_CENTER + WIDTH_AT_BOTTOM / 2,
            LEFT_CHAMBER_TOP_CENTER + WIDTH_AT_TOP / 2 )
      },
      rightChamber: {
        centerTop: LEFT_CHAMBER_TOP_CENTER + SEPARATION,
        widthTop: WIDTH_AT_BOTTOM,
        widthBottom: WIDTH_AT_TOP,
        y: this.underPressureModel.skyGroundBoundY,
        height: this.maxHeight,
        leftBorderFunction: new LinearFunction( 0, this.maxHeight,
            LEFT_CHAMBER_TOP_CENTER + SEPARATION - WIDTH_AT_TOP / 2,
            LEFT_CHAMBER_TOP_CENTER + SEPARATION - WIDTH_AT_BOTTOM / 2 ),
        rightBorderFunction: new LinearFunction( 0, this.maxHeight,
            LEFT_CHAMBER_TOP_CENTER + SEPARATION + WIDTH_AT_TOP / 2,
            LEFT_CHAMBER_TOP_CENTER + SEPARATION + WIDTH_AT_BOTTOM / 2 )
      },
      bottomChamber: {
        x1: LEFT_CHAMBER_TOP_CENTER + WIDTH_AT_BOTTOM / 2,
        y1: this.underPressureModel.skyGroundBoundY + this.maxHeight - 0.21,
        x2: LEFT_CHAMBER_TOP_CENTER + SEPARATION - WIDTH_AT_TOP / 2,
        y2: this.underPressureModel.skyGroundBoundY + this.maxHeight
      }
    };
    //key coordinates of complex figure
    this.verticles = {
      x1top: this.poolDimensions.leftChamber.centerTop - this.poolDimensions.leftChamber.widthTop / 2,
      x2top: this.poolDimensions.leftChamber.centerTop + this.poolDimensions.leftChamber.widthTop / 2,
      x3top: this.poolDimensions.rightChamber.centerTop - this.poolDimensions.rightChamber.widthTop / 2,
      x4top: this.poolDimensions.rightChamber.centerTop + this.poolDimensions.rightChamber.widthTop / 2,

      x1middle: this.poolDimensions.leftChamber.rightBorderFunction( this.poolDimensions.bottomChamber.y2 -
                                                                     this.poolDimensions.bottomChamber.y1 ),
      x2middle: this.poolDimensions.rightChamber.leftBorderFunction( this.poolDimensions.bottomChamber.y2 -
                                                                     this.poolDimensions.bottomChamber.y1 ),

      x1bottom: this.poolDimensions.leftChamber.centerTop - this.poolDimensions.leftChamber.widthBottom / 2,
      x2bottom: this.poolDimensions.leftChamber.centerTop + this.poolDimensions.leftChamber.widthBottom / 2,
      x3bottom: this.poolDimensions.rightChamber.centerTop - this.poolDimensions.rightChamber.widthBottom / 2,
      x4bottom: this.poolDimensions.rightChamber.centerTop + this.poolDimensions.rightChamber.widthBottom / 2,

      ymiddle: this.poolDimensions.bottomChamber.y1
    };

    PoolWithFaucetsModel.call( this, underPressureModel, this.inputFaucet, this.outputFaucet, this.maxVolume );
  }

  return inherit( PoolWithFaucetsModel, TrapezoidPoolModel, {

    /**
     * Returns height of the water above the given position
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {number} height of the water above the y
     */
    getWaterHeightAboveY: function( x, y ) {
      return y - (this.poolDimensions.bottomChamber.y2 - this.maxHeight * this.volume / this.maxVolume);
    },

    /**
     * Returns true if the given point is inside the trapezoid pool, false otherwise.
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {boolean}
     */
    isPointInsidePool: function( x, y ) {
      var isInside = false;
      if ( x > this.poolDimensions.bottomChamber.x1 && x < this.poolDimensions.bottomChamber.x2 &&
           y > this.poolDimensions.bottomChamber.y1 && y < this.poolDimensions.bottomChamber.y2 ) {
        //inside bottom chamber
        isInside = true;
      }
      else {
        var yDiffWithPoolBottom = this.poolDimensions.bottomChamber.y2 - y;
        if ( yDiffWithPoolBottom > 0 ) {
          var x1 = this.poolDimensions.leftChamber.leftBorderFunction( yDiffWithPoolBottom ),
            x2 = this.poolDimensions.leftChamber.rightBorderFunction( yDiffWithPoolBottom ),
            x3 = this.poolDimensions.rightChamber.leftBorderFunction( yDiffWithPoolBottom ),
            x4 = this.poolDimensions.rightChamber.rightBorderFunction( yDiffWithPoolBottom );

          //inside left or right chamber
          isInside = (x1 < x && x < x2) || (x3 < x && x < x4);
        }
      }
      return isInside;
    }
  } );
} );