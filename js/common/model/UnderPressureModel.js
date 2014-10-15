// Copyright 2002-2013, University of Colorado Boulder

/**
 * Top model for all screens - all common properties and methods are placed here.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author siddhartha chinthapally (Actual Concepts )
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var FluidColorModel = require( 'UNDER_PRESSURE/common/model/FluidColorModel' );
  var Units = require( 'UNDER_PRESSURE/common/model/Units' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Vector2 = require( 'DOT/Vector2' );
  var Barometer = require( 'UNDER_PRESSURE/common/model/Barometer' );

  var SceneModels = {
    Square: require( 'UNDER_PRESSURE/square-pool/model/SquarePoolModel' ),
    Trapezoid: require( 'UNDER_PRESSURE/trapezoid-pool/model/TrapezoidPoolModel' ),
    Chamber: require( 'UNDER_PRESSURE/chamber-pool/model/ChamberPoolModel' ),
    Mystery: require( 'UNDER_PRESSURE/mystery-pool/model/MysteryPoolModel' )
  };

  /**
   * @param {number} width of sim
   * @param {number} height of sim
   */

  function UnderPressureModel( width, height ) {

    var underPressureModel = this;
    this.scenes = ['Square', 'Trapezoid', 'Chamber', 'Mystery'];

    this.MARS_GRAVITY = 3.71;
    this.JUPITER_GRAVITY = 24.9;
    this.GAZOLINE_DENSITY = 700;
    this.HONEY_DENSITY = 1420;
    this.WATER_DENSITY = 1000;
    this.MIN_PRESSURE = 0;
    this.MAX_PRESSURE = 350000;//kPa

    // dimensions of the model's space
    this.width = width;
    this.height = height;
    this.skyGroundBoundY = 3.5; // M

    //Constants for air pressure in Pascals, Pascals is SI, see http://en.wikipedia.org/wiki/Atmospheric_pressure
    this.EARTH_AIR_PRESSURE = 101325;
    this.EARTH_AIR_PRESSURE_AT_500_FT = 99490;

    this.gravityRange = new Range( this.MARS_GRAVITY, this.JUPITER_GRAVITY );
    this.fluidDensityRange = new Range( this.GAZOLINE_DENSITY, this.HONEY_DENSITY );

    PropertySet.call( this, {
        isAtmosphere: true,
        isRulerVisible: false,
        isGridVisible: false,
        measureUnits: 'metric', //metric, english or atmosphere
        gravity: 9.8,
        fluidDensity: underPressureModel.WATER_DENSITY,
        currentScene: underPressureModel.scenes[0],
        currentVolume: 0, //L, volume of liquid in currentScene
        rulerPosition: new Vector2( 195, 245 ), // px
        mysteryChoice: 'fluidDensity', //for mystery-pool, gravity of fluidDensity
        fluidDensityControlExpanded: true,//For the accordion box
        gravityControlExpanded: true //For the accordion box
      }
    );

    this.fluidColorModel = new FluidColorModel( this.fluidDensityProperty, this.fluidDensityRange );

    this.sceneModels = {};
    this.scenes.forEach( function( name ) {
      underPressureModel.sceneModels[name] = (new SceneModels[name]( underPressureModel ));
    } );

    this.getStandardAirPressure =
    new LinearFunction( 0, Units.feetToMeters( 500 ), this.EARTH_AIR_PRESSURE, this.EARTH_AIR_PRESSURE_AT_500_FT );

    this.barometers = [];

    for ( var i = 0; i < 4; i++ ) {
      this.barometers.push( new Barometer( new Vector2( 0, 0 ), 0 ) );
    }

    this.currentSceneProperty.link( function() {
      underPressureModel.currentVolume = underPressureModel.sceneModels[underPressureModel.currentScene].volume;
    } );
  }

  return inherit( PropertySet, UnderPressureModel, {

    /**
     * @param {number} dt seconds
     */
    step: function( dt ) {
      this.sceneModels[this.currentScene].step( dt );
    },

    reset: function() {
      var self = this;
      PropertySet.prototype.reset.call( this );

      for ( var model in self.sceneModels ) {
        if ( self.sceneModels.hasOwnProperty( model ) ) {
          self.sceneModels[model].reset();
        }
      }
      this.barometers.forEach( function( barometer ) {
        barometer.reset();
      } );
    },

    /**
     * Returns the air pressure (in Pa) at the given height.
     * @param {number} height in meters
     * @returns {number}
     */
    getAirPressure: function( height ) {
      if ( !this.isAtmosphere ) {
        return 0;
      }
      else {
        return this.getStandardAirPressure( this.skyGroundBoundY - height ) * this.gravity / 9.8;
      }
    },

    /**
     * Returns the pressure (in Pa) exerted by a fluid column of given height.
     * @param {number} height of the fluid column
     * @returns {number}
     */
    getWaterPressure: function( height ) {
      return height * this.gravity * this.fluidDensity;
    },

    /**
     * Returns the pressure (in Pa) at the given position.
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {number}
     */
    getPressureAtCoords: function( x, y ) {

      var pressure = 0;
      var currentModel = this.sceneModels[this.currentScene];
      if ( y < this.skyGroundBoundY ) {
        pressure = this.getAirPressure( y );
      }
      else if ( currentModel.isPointInsidePool( x, y ) ) {

        // get the water height over barometer
        var waterHeight = currentModel.getWaterHeightAboveY( x, y );
        if ( waterHeight <= 0 ) {
          pressure = this.getAirPressure( y );
        }
        else {
          pressure = this.getAirPressure( y - waterHeight ) + this.getWaterPressure( waterHeight );
        }

      }
      return pressure;
    },

    /**
     * @param {number} pressure in Pa
     * @param {string} units -- can be english/metric/atmospheres
     * @returns {string}
     */
    getPressureString: function( pressure, units ) {
      return Units.getPressureString( pressure, units, false );
    },

    getGravityString: function() {
      return Units.getGravityString( this.gravity, this.measureUnits );
    },

    getFluidDensityString: function() {
      return Units.getFluidDensityString( this.fluidDensity, this.measureUnits );
    }
  } );
} );