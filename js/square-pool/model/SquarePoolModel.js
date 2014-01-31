// Copyright 2002-2013, University of Colorado Boulder

/**
 * main model for square pool screen.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var PoolWithFaucetsModel = require( 'UNDER_PRESSURE/common/model/PoolWithFaucetsModel' );
  var FaucetModel = require( 'UNDER_PRESSURE/common/model/FaucetModel' );

  function SquarePoolModel( globalModel ) {
    var self = this;

    //constants, from java model
    this.MAX_HEIGHT = 3; // Meters
    this.MAX_VOLUME = this.MAX_HEIGHT; // Liters

    this.inputFaucet = new FaucetModel( new Vector2( 2.5, globalModel.skyGroundBoundY - 0.44 ), 1, 0.42 );
    this.outputFaucet = new FaucetModel( new Vector2( 6.7, globalModel.skyGroundBoundY + 3.45 ), 1, 0.3 );

    this.globalModel = globalModel;

    PoolWithFaucetsModel.call( this, this.globalModel );

    this.poolDimensions = {
      x1: 2.07,
      y1: self.globalModel.skyGroundBoundY,
      x2: 6.07,
      y2: self.globalModel.skyGroundBoundY + 3
    };
  }

  return inherit( PoolWithFaucetsModel, SquarePoolModel, {
    getPressureAtCoords: function( x, y ) {
      var pressure = '';

      if ( y < this.globalModel.skyGroundBoundY ) {
        pressure = this.globalModel.getAirPressure( y );
      }
      else if ( x > this.poolDimensions.x1 && x < this.poolDimensions.x2 && y < this.poolDimensions.y2 ) {
        //inside pool
        var waterHeight = y - (this.poolDimensions.y2 - this.MAX_HEIGHT * this.volume / this.MAX_VOLUME);// water height above barometer
        if ( waterHeight <= 0 ) {
          pressure = this.globalModel.getAirPressure( y );
        }
        else {
          pressure = this.globalModel.getAirPressure( y - waterHeight ) + this.globalModel.getWaterPressure( waterHeight );
        }
      }

      return pressure;
    }
  } );
} );