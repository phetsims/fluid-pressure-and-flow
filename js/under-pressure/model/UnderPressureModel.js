// Copyright 2013-2015, University of Colorado Boulder

/**
 * Top model for all screens - all common properties and methods are placed here.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var FluidColorModel = require( 'FLUID_PRESSURE_AND_FLOW/common/model/FluidColorModel' );
  var Units = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Units' );
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  var Vector2 = require( 'DOT/Vector2' );
  var Sensor = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Sensor' );
  var SquarePoolModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/SquarePoolModel' );
  var TrapezoidPoolModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/TrapezoidPoolModel' );
  var ChamberPoolModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/ChamberPoolModel' );
  var MysteryPoolModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/MysteryPoolModel' );
  var getStandardAirPressure = require( 'FLUID_PRESSURE_AND_FLOW/common/model/getStandardAirPressure' );

  // constants
  var NUM_BAROMETERS = 4;

  function UnderPressureModel() {

    var underPressureModel = this;

    this.gravityRange = new Range( Constants.MARS_GRAVITY, Constants.JUPITER_GRAVITY ); // @public
    this.fluidDensityRange = new Range( Constants.GASOLINE_DENSITY, Constants.HONEY_DENSITY ); // @public

    PropertySet.call( this, {
        // @public
        isAtmosphere: true,
        isRulerVisible: false,
        isGridVisible: false,
        measureUnits: 'metric', //metric, english or atmosphere
        gravity: Constants.EARTH_GRAVITY,
        fluidDensity: Constants.WATER_DENSITY,
        currentScene: 'square', // name of the current screen. Can take values square/trapezoid/chamber/mystery.

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

    this.sceneModels = {}; // @public
    this.sceneModels.square = new SquarePoolModel( underPressureModel );
    this.sceneModels.trapezoid = new TrapezoidPoolModel( underPressureModel );
    this.sceneModels.chamber = new ChamberPoolModel( underPressureModel );
    this.sceneModels.mystery = new MysteryPoolModel( underPressureModel );

    this.fluidColorModel = new FluidColorModel( this.fluidDensityProperty, this.fluidDensityRange ); // @public

    this.barometers = []; // @public

    for ( var i = 0; i < NUM_BAROMETERS; i++ ) {
      this.barometers.push( new Sensor( new Vector2( 7.75, 2.5 ), 0 ) );
    }

    // current scene's model
    this.addDerivedProperty( 'currentSceneModel', [ 'currentScene' ], function( currentScene ) {
      return underPressureModel.sceneModels[ currentScene ];
    } );

    this.currentSceneModelProperty.link( function( currentSceneModel ) {
      underPressureModel.currentVolume = currentSceneModel.volume;
    } );

  }

  fluidPressureAndFlow.register( 'UnderPressureModel', UnderPressureModel );

  return inherit( PropertySet, UnderPressureModel, {

    /**
     * @public
     * @param {number} dt seconds
     */
    step: function( dt ) {
      this.currentSceneModel.step( dt );
    },

    // @public
    reset: function() {
      PropertySet.prototype.reset.call( this );

      this.sceneModels.square.reset();
      this.sceneModels.trapezoid.reset();
      this.sceneModels.chamber.reset();
      this.sceneModels.mystery.reset();

      this.barometers.forEach( function( barometer ) {
        barometer.reset();
      } );
    },

    /**
     * @public
     * Returns the air pressure (in Pa) at the given height.
     * @param {number} height in meters
     * @returns {number}
     */
    getAirPressure: function( height ) {
      if ( !this.isAtmosphere ) {
        return 0;
      }
      else {
        return getStandardAirPressure( height ) * this.gravity / Constants.EARTH_GRAVITY;
      }
    },

    /**
     * @public
     * Returns the pressure (in Pa) exerted by a fluid column of given height.
     * @param {number} height of the fluid column
     * @returns {number}
     */
    getWaterPressure: function( height ) {
      return height * this.gravity * this.fluidDensity;
    },

    /**
     * @public
     * Returns the pressure (in Pa) at the given position.
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {number}
     */
    getPressureAtCoords: function( x, y ) {
      var pressure = null;
      var currentModel = this.currentSceneModel;
      if ( y > 0 ) {
        pressure = this.getAirPressure( y );
      }
      else if ( currentModel.isPointInsidePool( x, y ) ) {

        // get the water height over barometer
        var waterHeight = currentModel.getWaterHeightAboveY( x, y );
        if ( waterHeight <= 0 ) {
          pressure = this.getAirPressure( y );
        }
        else {
          pressure = this.getAirPressure( waterHeight + y ) + this.getWaterPressure( waterHeight );
        }

      }
      return pressure;
    },

    /**
     * @public
     * @param {number} pressure in Pa
     * @param {string} units -- can be english/metric/atmospheres
     * @returns {string}
     */
    getPressureString: function( pressure, units ) {
      return Units.getPressureString( pressure, units, false );
    },

    // @public
    getGravityString: function() {
      return Units.getGravityString( this.gravity, this.measureUnits );
    },

    // @public
    getFluidDensityString: function() {
      return Units.getFluidDensityString( this.fluidDensity, this.measureUnits );
    }
  } );
} );