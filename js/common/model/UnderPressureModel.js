// Copyright 2002-2013, University of Colorado Boulder

/**
 * Top model for all screens - all common properties and methods are placed here.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var WaterColorModel = require( 'UNDER_PRESSURE/common/model/WaterColorModel' );
  var Units = require( 'UNDER_PRESSURE/common/model/Units' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Vector2 = require( 'DOT/Vector2' );

  var SceneModels = {
    SquarePoolModel: require( 'UNDER_PRESSURE/square-pool/model/SquarePoolModel' ),
    TrapezoidPoolModel: require( 'UNDER_PRESSURE/trapezoid-pool/model/TrapezoidPoolModel' ),
    ChamberPoolModel: require( 'UNDER_PRESSURE/chamber-pool/model/ChamberPoolModel' ),
    MysteryPoolModel: require( 'UNDER_PRESSURE/mystery-pool/model/MysteryPoolModel' )
  };

  /**
   * @param {Number} width of sim
   * @param {Number} height of sim
   */

  function UnderPressureModel( width, height ) {
    var self = this;

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
        fluidDensity: self.WATER_DENSITY,
        leftDisplacement: 0, //displacement from default height, for chamber-pool
        currentScene: self.scenes[0],
        currentVolume: 0, //L, volume of liquid in currentScene
        rulerPosition: new Vector2( 195, 245 ), // px
        mysteryChoice: 'fluidDensity', //for mystery-pool, gravity of fluidDensity
        fluidDensityControlExpanded: true,//For the accordion box
        gravityControlExpanded: true //For the accordion box
      }
    );

    this.waterColorModel = new WaterColorModel( this );

    this.sceneModels = {};
    this.scenes.forEach( function( name ) {
      self.sceneModels[name] = (new SceneModels[name + 'PoolModel']( self ));
    } );

    this.getStandardAirPressure = new LinearFunction( 0, Units.feetToMeters( 500 ), this.EARTH_AIR_PRESSURE, this.EARTH_AIR_PRESSURE_AT_500_FT );

    this.barometers = [];

    for ( var i = 0; i < 4; i++ ) {
      this.barometers.push( {
        value: new Property( 0 ),
        position: new Property( new Vector2( 570, 50 ) )
      } );
    }

    this.currentSceneProperty.link( function() {
      self.currentVolume = self.sceneModels[self.currentScene].volume;
    } );
  }

  return inherit( PropertySet, UnderPressureModel, {

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
        barometer.position.reset();
      } );
    },

    getAirPressure: function( height ) {
      if ( !this.isAtmosphere ) {
        return 0;
      }
      else {
        return this.getStandardAirPressure( this.skyGroundBoundY - height ) * this.gravity / 9.8;
      }
    },

    getWaterPressure: function( height ) {
      return height * this.gravity * this.fluidDensity;
    },

    getPressureAtCoords: function( x, y ) {
      return this.sceneModels[this.currentScene].getPressureAtCoords( x, y );
    },

    getGravityString: function() {
      return Units.getGravityString( this.gravity, this.measureUnits );
    },

    getFluidDensityString: function() {
      return Units.getGravityString( this.fluidDensity, this.measureUnits );
    }
  } );
} );