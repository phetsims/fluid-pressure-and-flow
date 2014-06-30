//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'Water Tower' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Vector2 = require( 'DOT/Vector2' );
  var Units = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/Units' );
  var Barometer = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/Barometer' );
  var VelocitySensor = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/VelocitySensor' );
  var WaterTower = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/WaterTower' );
  var WaterDrop = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/WaterDrop' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  // strings
  var densityUnitsEnglish = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsEnglish' );
  var densityUnitsMetric = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsMetric' );
  var valueWithUnitsPattern = require( 'string!FLUID_PRESSURE_AND_FLOW/valueWithUnitsPattern' );


  function WaterTowerModel() {
    this.GASOLINE_DENSITY = 700;
    this.HONEY_DENSITY = 1420;
    this.WATER_DENSITY = 1000;

    //Constants for air pressure in Pascals, Pascals is SI, see http://en.wikipedia.org/wiki/Atmospheric_pressure
    this.EARTH_AIR_PRESSURE = 101325;
    this.EARTH_AIR_PRESSURE_AT_500_FT = 99490;

    this.fluidDensityRange = new Range( this.GASOLINE_DENSITY, this.HONEY_DENSITY );

    PropertySet.call( this, {
        isAtmosphere: true,
        isRulerVisible: false,
        isMeasuringTapeVisible: false,
        isSpeedometerVisible: true,
        isHoseVisible: false,
        isPlay: true,
        faucetFlowRate: 0,
        isFaucetEnabled: true,
        measureUnits: 'metric', //metric, english or atmosphere
        fluidDensity: this.WATER_DENSITY,
        rulerPosition: new Vector2( 195, 245 ), // px
        waterFlow: 'water',
        waterSpeed: 'waterSpeed',
        isSluiceOpen: false,
        scale: 1 // scale coefficient
      }
    );

    this.getStandardAirPressure = new LinearFunction( 0, 150, this.EARTH_AIR_PRESSURE, this.EARTH_AIR_PRESSURE_AT_500_FT );

    this.units = new Units();

    this.waterTower = new WaterTower();
    this.faucetPosition = new Vector2( 1, 6.2 ); //model co-ordinates
    this.faucetDrops = new ObservableArray();

    this.barometers = [];
    for ( var i = 0; i < 4; i++ ) {
      this.barometers.push( new Barometer( new Vector2( 0, 0 ), 0 ) );
    }

    this.speedometers = [];
    for ( var j = 0; j < 4; j++ ) {
      this.speedometers.push( new VelocitySensor( new Vector2( 0, 0 ), new Vector2( 0, 0 ) ) );
    }
  }

  return inherit( PropertySet, WaterTowerModel, {

    // Resets all model elements
    reset: function() {
      PropertySet.prototype.reset.call( this );

      _.each( this.barometers, function( barometer ) {
        barometer.reset();
      } );

      _.each( this.speedometers, function( speedometer ) {
        speedometer.reset();
      } );
    },

    getAirPressure: function( height ) {
      return !this.isAtmosphere ? 0 : this.getStandardAirPressure( height );
    },

    getWaterPressure: function( height ) {
      return height * 9.8 * this.fluidDensity;
    },

    getPressureAtCoords: function( x, y ) {
      //TODO: Check whether in water or air and return the appropriate value
      return this.getAirPressure( 0 );
    },

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      // Handle model animation here.
      var dropsToRemove = [];
      var waterDrop = new WaterDrop( this.faucetPosition.copy(), new Vector2( 0, 0 ), 0.0001 );
      this.faucetDrops.push( waterDrop );

      for ( var i = 0, numberOfDrops = this.faucetDrops.length; i < numberOfDrops; i++ ) {
        this.faucetDrops.get( i ).step( dt );
        //check if the faucetDrops hit the waterlevel
        if ( this.faucetDrops.get( i ).position.y < this.faucetDrops.get( i ).radius + this.waterTower.waterLevel ) {
          dropsToRemove.push( this.faucetDrops.get( i ) );
        }
      }

      this.faucetDrops.removeAll( dropsToRemove );
    },

    getFluidDensityString: function() {
      if ( this.measureUnits === 'english' ) {
        return StringUtils.format( valueWithUnitsPattern, Math.round( Units.FLUID_DENSITY_ENGLISH_PER_METRIC * this.fluidDensity ), densityUnitsEnglish );
      }
      else {
        return StringUtils.format( valueWithUnitsPattern, Math.round( this.fluidDensity ), densityUnitsMetric );
      }
    }
  } );
} );