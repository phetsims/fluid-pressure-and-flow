// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model for square pool screen.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Constants from '../../common/Constants.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FaucetModel from './FaucetModel.js';
import PoolWithFaucetsModel from './PoolWithFaucetsModel.js';

class SquarePoolModel extends PoolWithFaucetsModel {

  /**
   * @param {UnderPressureModel} underPressureModel
   */
  constructor( underPressureModel ) {

    const maxHeight = Constants.MAX_POOL_HEIGHT; // @public - Meters

    //TODO this assignment makes no sense
    const maxVolume = maxHeight; // @public - Liters

    // empirically determined to make sure input faucet is above ground , output faucet is below ground and output
    // faucet is attached to the pool
    const inputFaucetX = 2.7;
    const inputFaucetY = 0.44;
    const outputFaucetX = 6.6;
    const outputFaucetY = -3.45;
    const inputFaucet = new FaucetModel( new Vector2( inputFaucetX, inputFaucetY ), 1, 0.42 ); // @public
    const outputFaucet = new FaucetModel( new Vector2( outputFaucetX, outputFaucetY ), 1, 0.3 ); // @public

    super( underPressureModel, inputFaucet, outputFaucet, maxVolume );

    this.maxHeight = maxHeight;
    this.maxVolume = maxVolume;
    this.inputFaucet = inputFaucet;
    this.outputFaucet = outputFaucet;
    this.underPressureModel = underPressureModel;

    // empirically determined to match the visual appearance from design document
    const poolLeftX = 2.3;
    const poolRightX = 6;

    // @public
    this.poolDimensions = {
      x1: poolLeftX,
      y1: 0, // pool top y
      x2: poolRightX,
      y2: -this.maxHeight  // pool bottom y
    };
  }

  /**
   * @public
   * Returns height of the water above the given position
   * @param {number} x - position in meters
   * @param {number} y - position in meters
   * @returns {number} height of the water above the y
   */
  getWaterHeightAboveY( x, y ) {
    return this.poolDimensions.y2 + this.maxHeight * this.volumeProperty.value / this.maxVolume - y;
  }

  /**
   * @public
   * Returns true if the given point is inside the square pool, false otherwise.
   * @param {number} x - position in meters
   * @param {number} y - position in meters
   * @returns {boolean}
   */
  isPointInsidePool( x, y ) {
    return x > this.poolDimensions.x1 && x < this.poolDimensions.x2 &&
           y > this.poolDimensions.y2 && y < this.poolDimensions.y1;
  }
}

fluidPressureAndFlow.register( 'SquarePoolModel', SquarePoolModel );
export default SquarePoolModel;