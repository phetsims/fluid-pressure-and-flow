// Copyright 2013-2021, University of Colorado Boulder

/**
 * main Model for trapezoid pool screen.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Constants from '../../common/Constants.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FaucetModel from './FaucetModel.js';
import PoolWithFaucetsModel from './PoolWithFaucetsModel.js';

// constants
// empirically determined to match the visual appearance from design document
const WIDTH_AT_TOP = 0.7; //meters,
const WIDTH_AT_BOTTOM = 3.15; //meters,
const LEFT_CHAMBER_TOP_CENTER = 3.2; //meters,
const SEPARATION = 3.22;//Between centers

class TrapezoidPoolModel extends PoolWithFaucetsModel {

  /**
   * @param {UnderPressureModel} underPressureModel
   */
  constructor( underPressureModel ) {

    //constants
    const maxHeight = Constants.MAX_POOL_HEIGHT; // @public - meters

    //TODO this assignment makes no sense
    const maxVolume = maxHeight; // @public - Liters

    // empirically determined to make sure input faucet is above ground , output faucet is below ground and output
    // faucet is attached to the pool
    const inputFaucetX = 3.19;
    const inputFaucetY = 0.44;
    const outputFaucetX = 7.5;
    const outputFaucetY = -3.45;
    const inputFaucet = new FaucetModel( new Vector2( inputFaucetX, inputFaucetY ), 1, 0.42 ); // @public
    const outputFaucet = new FaucetModel( new Vector2( outputFaucetX, outputFaucetY ), 1, 0.3 ); // @public

    super( underPressureModel, inputFaucet, outputFaucet, maxVolume );

    this.maxHeight = maxHeight;
    this.maxVolume = maxVolume;
    this.underPressureModel = underPressureModel;
    this.inputFaucet = inputFaucet;
    this.outputFaucet = outputFaucet;

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

      x1middle: this.poolDimensions.leftChamber.rightBorderFunction.evaluate( Math.abs( this.poolDimensions.bottomChamber.y2 -
                                                                               this.poolDimensions.bottomChamber.y1 ) ),
      x2middle: this.poolDimensions.rightChamber.leftBorderFunction.evaluate( Math.abs( this.poolDimensions.bottomChamber.y2 -
                                                                               this.poolDimensions.bottomChamber.y1 ) ),

      x1bottom: this.poolDimensions.leftChamber.centerTop - this.poolDimensions.leftChamber.widthBottom / 2,
      x2bottom: this.poolDimensions.leftChamber.centerTop + this.poolDimensions.leftChamber.widthBottom / 2,
      x3bottom: this.poolDimensions.rightChamber.centerTop - this.poolDimensions.rightChamber.widthBottom / 2,
      x4bottom: this.poolDimensions.rightChamber.centerTop + this.poolDimensions.rightChamber.widthBottom / 2,

      ymiddle: this.poolDimensions.bottomChamber.y1
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
    return this.maxHeight * this.volumeProperty.value / this.maxVolume + this.poolDimensions.bottomChamber.y2 - y;
  }

  /**
   * @public
   * Returns true if the given point is inside the trapezoid pool, false otherwise.
   * @param {number} x - position in meters
   * @param {number} y - position in meters
   * @returns {boolean}
   */
  isPointInsidePool( x, y ) {
    let isInside = false;
    if ( x > this.poolDimensions.bottomChamber.x1 && x < this.poolDimensions.bottomChamber.x2 &&
         y < this.poolDimensions.bottomChamber.y1 && y > this.poolDimensions.bottomChamber.y2 ) {
      //inside bottom chamber
      isInside = true;
    }
    else {
      const yDiffWithPoolBottom = y - this.poolDimensions.bottomChamber.y2;
      if ( yDiffWithPoolBottom > 0 ) {
        const x1 = this.poolDimensions.leftChamber.leftBorderFunction.evaluate( yDiffWithPoolBottom );
        const x2 = this.poolDimensions.leftChamber.rightBorderFunction.evaluate( yDiffWithPoolBottom );
        const x3 = this.poolDimensions.rightChamber.leftBorderFunction.evaluate( yDiffWithPoolBottom );
        const x4 = this.poolDimensions.rightChamber.rightBorderFunction.evaluate( yDiffWithPoolBottom );

        //inside left or right chamber
        isInside = ( x1 < x && x < x2 ) || ( x3 < x && x < x4 );
      }
    }
    return isInside;
  }
}

fluidPressureAndFlow.register( 'TrapezoidPoolModel', TrapezoidPoolModel );
export default TrapezoidPoolModel;