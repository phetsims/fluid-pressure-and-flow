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

    var squarePoolModel = this;

    //constants
    this.MAX_HEIGHT = 3; // Meters
    this.MAX_VOLUME = this.MAX_HEIGHT; // Liters

    this.inputFaucet = new FaucetModel( new Vector2( 2.5, underPressureModel.skyGroundBoundY - 0.44 ), 1, 0.42 );
    this.outputFaucet = new FaucetModel( new Vector2( 6.7, underPressureModel.skyGroundBoundY + 3.45 ), 1, 0.3 );

    this.underPressureModel = underPressureModel;

    PoolWithFaucetsModel.call( this, this.underPressureModel );

    this.poolDimensions = {
      x1: 2.07,
      y1: squarePoolModel.underPressureModel.skyGroundBoundY,
      x2: 6.07,
      y2: squarePoolModel.underPressureModel.skyGroundBoundY + 3
    };
  }

  return inherit( PoolWithFaucetsModel, SquarePoolModel, {

    getWaterHeightAboveY: function( x, y ) {
      return y - (this.poolDimensions.y2 - this.MAX_HEIGHT * this.volume / this.MAX_VOLUME);// water height above barometer
    },

    isPointInsidePool: function( x, y ) {
      return x > this.poolDimensions.x1 && x < this.poolDimensions.x2 && y < this.poolDimensions.y2;
    }
  } );
} );