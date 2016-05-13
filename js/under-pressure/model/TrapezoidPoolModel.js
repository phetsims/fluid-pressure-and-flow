// Copyright 2013-2015, University of Colorado Boulder

/**
 * main Model for trapezoid pool screen.
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var PoolWithFaucetsModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/PoolWithFaucetsModel' );
  var FaucetModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/FaucetModel' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  // constants
  // empirically determined to match the visual appearance from design document
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
    this.maxHeight = Constants.MAX_POOL_HEIGHT; // @public - meters
    this.maxVolume = this.maxHeight; // @public - Liters

    // empirically determined to make sure input faucet is above ground , output faucet is below ground and output
    // faucet is attached to the pool
    var inputFaucetX = 3.19;
    var inputFaucetY = 0.44;
    var outputFaucetX = 7.5;
    var outputFaucetY = -3.45;
    this.inputFaucet = new FaucetModel( new Vector2( inputFaucetX, inputFaucetY ), 1, 0.42 ); // @public
    this.outputFaucet = new FaucetModel( new Vector2( outputFaucetX, outputFaucetY ), 1, 0.3 ); // @public

    this.underPressureModel = underPressureModel;

    // @public
    this.poolDimensions = {
      leftChamber: {
        centerTop: LEFT_CHAMBER_TOP_CENTER,
        widthTop: WIDTH_AT_TOP,
        widthBottom: WIDTH_AT_BOTTOM,
        y: 0,
        height: this.maxHeight,
        leftBorderFunction: new LinearFunction( 0, this.maxHeight,
          LEFT_CHAMBER_TOP_CENTER - WIDTH_AT_BOTTOM / 2, LEFT_CHAMBER_TOP_CENTER - WIDTH_AT_TOP / 2 ),
        rightBorderFunction: new LinearFunction( 0, this.maxHeight,
          LEFT_CHAMBER_TOP_CENTER + WIDTH_AT_BOTTOM / 2, LEFT_CHAMBER_TOP_CENTER + WIDTH_AT_TOP / 2 )
      },
      rightChamber: {
        centerTop: LEFT_CHAMBER_TOP_CENTER + SEPARATION,
        widthTop: WIDTH_AT_BOTTOM,
        widthBottom: WIDTH_AT_TOP,
        y: 0,
        height: this.maxHeight,
        leftBorderFunction: new LinearFunction( 0, this.maxHeight,
          LEFT_CHAMBER_TOP_CENTER + SEPARATION - WIDTH_AT_TOP / 2,
          LEFT_CHAMBER_TOP_CENTER + SEPARATION - WIDTH_AT_BOTTOM / 2 ),
        rightBorderFunction: new LinearFunction( 0, this.maxHeight,
          LEFT_CHAMBER_TOP_CENTER + SEPARATION + WIDTH_AT_TOP / 2,
          LEFT_CHAMBER_TOP_CENTER + SEPARATION + WIDTH_AT_BOTTOM / 2 )
      },
      bottomChamber: {
        x1: 4,
        y1: -this.maxHeight + 0.21,
        x2: 6,
        y2: -this.maxHeight
      }
    };

    // @public
    //key coordinates of complex figure
    this.verticles = {
      x1top: this.poolDimensions.leftChamber.centerTop - this.poolDimensions.leftChamber.widthTop / 2,
      x2top: this.poolDimensions.leftChamber.centerTop + this.poolDimensions.leftChamber.widthTop / 2,
      x3top: this.poolDimensions.rightChamber.centerTop - this.poolDimensions.rightChamber.widthTop / 2,
      x4top: this.poolDimensions.rightChamber.centerTop + this.poolDimensions.rightChamber.widthTop / 2,

      x1middle: this.poolDimensions.leftChamber.rightBorderFunction( Math.abs( this.poolDimensions.bottomChamber.y2 -
                                                                               this.poolDimensions.bottomChamber.y1 ) ),
      x2middle: this.poolDimensions.rightChamber.leftBorderFunction( Math.abs( this.poolDimensions.bottomChamber.y2 -
                                                                               this.poolDimensions.bottomChamber.y1 ) ),

      x1bottom: this.poolDimensions.leftChamber.centerTop - this.poolDimensions.leftChamber.widthBottom / 2,
      x2bottom: this.poolDimensions.leftChamber.centerTop + this.poolDimensions.leftChamber.widthBottom / 2,
      x3bottom: this.poolDimensions.rightChamber.centerTop - this.poolDimensions.rightChamber.widthBottom / 2,
      x4bottom: this.poolDimensions.rightChamber.centerTop + this.poolDimensions.rightChamber.widthBottom / 2,

      ymiddle: this.poolDimensions.bottomChamber.y1
    };

    PoolWithFaucetsModel.call( this, underPressureModel, this.inputFaucet, this.outputFaucet, this.maxVolume );
  }

  fluidPressureAndFlow.register( 'TrapezoidPoolModel', TrapezoidPoolModel );

  return inherit( PoolWithFaucetsModel, TrapezoidPoolModel, {

    /**
     * @public
     * Returns height of the water above the given position
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {number} height of the water above the y
     */
    getWaterHeightAboveY: function( x, y ) {
      return this.maxHeight * this.volume / this.maxVolume + this.poolDimensions.bottomChamber.y2 - y;
    },

    /**
     * @public
     * Returns true if the given point is inside the trapezoid pool, false otherwise.
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {boolean}
     */
    isPointInsidePool: function( x, y ) {
      var isInside = false;
      if ( x > this.poolDimensions.bottomChamber.x1 && x < this.poolDimensions.bottomChamber.x2 &&
           y < this.poolDimensions.bottomChamber.y1 && y > this.poolDimensions.bottomChamber.y2 ) {
        //inside bottom chamber
        isInside = true;
      }
      else {
        var yDiffWithPoolBottom = y - this.poolDimensions.bottomChamber.y2;
        if ( yDiffWithPoolBottom > 0 ) {
          var x1 = this.poolDimensions.leftChamber.leftBorderFunction( yDiffWithPoolBottom );
          var x2 = this.poolDimensions.leftChamber.rightBorderFunction( yDiffWithPoolBottom );
          var x3 = this.poolDimensions.rightChamber.leftBorderFunction( yDiffWithPoolBottom );
          var x4 = this.poolDimensions.rightChamber.rightBorderFunction( yDiffWithPoolBottom );

          //inside left or right chamber
          isInside = (x1 < x && x < x2) || (x3 < x && x < x4);
        }
      }
      return isInside;
    }
  } );
} );