// Copyright 2002-2013, University of Colorado Boulder

/**
 *  Model for square pool screen.
 *
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

  /**
   * @param {UnderPressureModel} underPressureModel of the simulation
   * @constructor
   */
  function SquarePoolModel( underPressureModel ) {

    //constants
    this.maxHeight = 3; // Meters
    this.maxVolume = this.maxHeight; // Liters

    var inputFaucetX = 2.7;
    var inputFaucetY = underPressureModel.skyGroundBoundY - 0.44;
    var outputFaucetX = 6.6;
    var outputFaucetY = underPressureModel.skyGroundBoundY + 3.45;
    this.inputFaucet = new FaucetModel( new Vector2( inputFaucetX, inputFaucetY ), 1, 0.42 );
    this.outputFaucet = new FaucetModel( new Vector2( outputFaucetX, outputFaucetY ), 1, 0.3 );

    this.underPressureModel = underPressureModel;

    PoolWithFaucetsModel.call( this, this.underPressureModel, this.inputFaucet, this.outputFaucet, this.maxVolume );
    var poolLeftX = 2.3;
    var poolRightX = 6;
    this.poolDimensions = {
      x1: poolLeftX,
      y1: underPressureModel.skyGroundBoundY, // pool top y
      x2: poolRightX,
      y2: underPressureModel.skyGroundBoundY + this.maxHeight  // pool bottom y
    };
  }

  return inherit( PoolWithFaucetsModel, SquarePoolModel, {

    /**
     * Returns height of the water above the given position
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {number} height of the water above the y
     */
    getWaterHeightAboveY: function( x, y ) {
      return y - (this.poolDimensions.y2 - this.maxHeight * this.volume / this.maxVolume);
    },

    /**
     * Returns true if the given point is inside the square pool, false otherwise.
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {boolean}
     */
    isPointInsidePool: function( x, y ) {
      return x > this.poolDimensions.x1 && x < this.poolDimensions.x2 && y < this.poolDimensions.y2;
    }
  } );
} );