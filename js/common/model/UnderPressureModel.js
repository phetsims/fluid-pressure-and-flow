// Copyright 2002-2013, University of Colorado Boulder

/**
 * Top model for all screens - all common properties and methods are placed here.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var FluidColorModel = require( 'UNDER_PRESSURE/common/model/FluidColorModel' );
  var Units = require( 'UNDER_PRESSURE/common/model/Units' );
  var UnderPressureConstants = require( 'UNDER_PRESSURE/common/UnderPressureConstants' );
  var Vector2 = require( 'DOT/Vector2' );
  var Sensor = require( 'UNDER_PRESSURE/common/model/Sensor' );
  var SquarePoolModel = require( 'UNDER_PRESSURE/square-pool/model/SquarePoolModel' );
  var TrapezoidPoolModel = require( 'UNDER_PRESSURE/trapezoid-pool/model/TrapezoidPoolModel' );
  var ChamberPoolModel = require( 'UNDER_PRESSURE/chamber-pool/model/ChamberPoolModel' );
  var MysteryPoolModel = require( 'UNDER_PRESSURE/mystery-pool/model/MysteryPoolModel' );
  var getStandardAirPressure = require( 'UNDER_PRESSURE/common/model/getStandardAirPressure' );

  var SceneModels = {
    Square: SquarePoolModel,
    Trapezoid: TrapezoidPoolModel,
    Chamber: ChamberPoolModel,
    Mystery: MysteryPoolModel
  };

  /**
   * @param {number} width of sim
   * @param {number} height of sim
   */
  function UnderPressureModel( width, height ) {

    var underPressureModel = this;
    this.scenes = ['Square', 'Trapezoid', 'Chamber', 'Mystery'];

    // dimensions of the model's space
    this.width = width;
    this.height = height;
    this.skyGroundBoundY = 3.5; // m

    this.gravityRange = new Range( UnderPressureConstants.MARS_GRAVITY, UnderPressureConstants.JUPITER_GRAVITY );
    this.fluidDensityRange = new Range( UnderPressureConstants.GASOLINE_DENSITY, UnderPressureConstants.HONEY_DENSITY );

    PropertySet.call( this, {
        isAtmosphere: true,
        isRulerVisible: false,
        isGridVisible: false,
        measureUnits: 'metric', //metric, english or atmosphere
        gravity: UnderPressureConstants.EARTH_GRAVITY,
        fluidDensity: UnderPressureConstants.WATER_DENSITY,
        currentScene: underPressureModel.scenes[0],

        // This is just a "simulated" derived property that depends on currentScene and the volume in the current scene.
        // This property is passed to barometer so that it can react to changes in the volume.
        // This way Barometer doesn't need to know about the different scenes and can depend only on
        // UnderPressureModel's properties.
        currentVolume: 0, //L, volume of liquid in currentScene
        rulerPosition: new Vector2( 300, 100 ), // ruler initial position above the ground and center of square pool
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

    this.barometers = [];

    for ( var i = 0; i < 4; i++ ) {
      this.barometers.push( new Sensor( new Vector2( 0, 0 ), 0 ) );
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
        return getStandardAirPressure( this.skyGroundBoundY - height ) * this.gravity / 9.8;
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