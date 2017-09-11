// Copyright 2013-2015, University of Colorado Boulder

/**
 *  Model for square pool screen.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  var FaucetModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/FaucetModel' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PoolWithFaucetsModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/PoolWithFaucetsModel' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {UnderPressureModel} underPressureModel of the simulation
   * @constructor
   */
  function SquarePoolModel( underPressureModel ) {
    this.maxHeight = Constants.MAX_POOL_HEIGHT; // @public - Meters
    this.maxVolume = this.maxHeight; // @public - Liters

    // empirically determined to make sure input faucet is above ground , output faucet is below ground and output
    // faucet is attached to the pool
    var inputFaucetX = 2.7;
    var inputFaucetY = 0.44;
    var outputFaucetX = 6.6;
    var outputFaucetY = -3.45;
    this.inputFaucet = new FaucetModel( new Vector2( inputFaucetX, inputFaucetY ), 1, 0.42 ); // @public
    this.outputFaucet = new FaucetModel( new Vector2( outputFaucetX, outputFaucetY ), 1, 0.3 ); // @public

    this.underPressureModel = underPressureModel;

    PoolWithFaucetsModel.call( this, this.underPressureModel, this.inputFaucet, this.outputFaucet, this.maxVolume );

    // empirically determined to match the visual appearance from design document
    var poolLeftX = 2.3;
    var poolRightX = 6;

    // @public
    this.poolDimensions = {
      x1: poolLeftX,
      y1: 0, // pool top y
      x2: poolRightX,
      y2: -this.maxHeight  // pool bottom y
    };
  }

  fluidPressureAndFlow.register( 'SquarePoolModel', SquarePoolModel );

  return inherit( PoolWithFaucetsModel, SquarePoolModel, {

    /**
     * @public
     * Returns height of the water above the given position
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {number} height of the water above the y
     */
    getWaterHeightAboveY: function( x, y ) {
      return this.poolDimensions.y2 + this.maxHeight * this.volume / this.maxVolume - y;
    },

    /**
     * @public
     * Returns true if the given point is inside the square pool, false otherwise.
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {boolean}
     */
    isPointInsidePool: function( x, y ) {
      return x > this.poolDimensions.x1 && x < this.poolDimensions.x2 &&
             y > this.poolDimensions.y2 && y < this.poolDimensions.y1;
    }
  } );
} );