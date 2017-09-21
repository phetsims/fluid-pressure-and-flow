// Copyright 2013-2017, University of Colorado Boulder

/**
 * Top model for all screens - all common properties and methods are placed here.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChamberPoolModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/ChamberPoolModel' );
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var FluidColorModel = require( 'FLUID_PRESSURE_AND_FLOW/common/model/FluidColorModel' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var getStandardAirPressure = require( 'FLUID_PRESSURE_AND_FLOW/common/model/getStandardAirPressure' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryPoolModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/MysteryPoolModel' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Sensor = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Sensor' );
  var SquarePoolModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/SquarePoolModel' );
  var TrapezoidPoolModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/TrapezoidPoolModel' );
  var Units = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Units' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var NUM_BAROMETERS = 4;

  function UnderPressureModel() {

    var self = this;

    this.gravityRange = new RangeWithValue( Constants.MARS_GRAVITY, Constants.JUPITER_GRAVITY ); // @public
    this.fluidDensityRange = new RangeWithValue( Constants.GASOLINE_DENSITY, Constants.HONEY_DENSITY ); // @public

    // @public
    this.isAtmosphereProperty = new Property( true );
    this.isRulerVisibleProperty = new Property( false );
    this.isGridVisibleProperty = new Property( false ); // TODO: is this used?
    this.measureUnitsProperty = new Property( 'metric' ); //metric, english or atmosphere
    this.gravityProperty = new Property( Constants.EARTH_GRAVITY );
    this.fluidDensityProperty = new Property( Constants.WATER_DENSITY );
    this.currentSceneProperty = new Property( 'square' ); // name of the current screen. Can take values square/trapezoid/chamber/mystery.

    // currentVolume is just a "simulated" derived property that depends on currentScene and the volume in the current scene.
    // This property is passed to barometer so that it can react to changes in the volume.
    // This way Barometer doesn't need to know about the different scenes and can depend only on
    // UnderPressureModel's properties.
    this.currentVolumeProperty = new Property( 0 ); //L, volume of liquid in currentScene
    this.rulerPositionProperty = new Property( new Vector2( 300, 100 ) ); // ruler initial position above the ground and center of square pool // TODO: is this used?
    this.mysteryChoiceProperty = new Property( 'fluidDensity' ); //for mystery-pool, gravity of fluidDensity
    this.fluidDensityControlExpandedProperty = new Property( true );//For the accordion box
    this.gravityControlExpandedProperty = new Property( true );//For the accordion box

    this.sceneModels = {}; // @public
    this.sceneModels.square = new SquarePoolModel( self );
    this.sceneModels.trapezoid = new TrapezoidPoolModel( self );
    this.sceneModels.chamber = new ChamberPoolModel( self );
    this.sceneModels.mystery = new MysteryPoolModel( self );

    this.fluidColorModel = new FluidColorModel( this.fluidDensityProperty, this.fluidDensityRange ); // @public

    this.barometers = []; // @public

    for ( var i = 0; i < NUM_BAROMETERS; i++ ) {
      // initial position of barometer on screen adjacent to control panel above ground
      this.barometers.push( new Sensor( new Vector2( 7.75, 2.5 ), 0 ) );
    }

    // current scene's model
    this.currentSceneModelProperty = new DerivedProperty( [ this.currentSceneProperty ], function( currentScene ) {
      return self.sceneModels[ currentScene ];
    } );

    this.currentSceneModelProperty.link( function( currentSceneModel ) {
      self.currentVolumeProperty.value = currentSceneModel.volumeProperty.value;
    } );
  }

  fluidPressureAndFlow.register( 'UnderPressureModel', UnderPressureModel );

  return inherit( Object, UnderPressureModel, {

    /**
     * @public
     * @param {number} dt seconds
     */
    step: function( dt ) {
      this.fluidColorModel.step();
      this.currentSceneModelProperty.value.step( dt );
    },

    // @public
    reset: function() {
      this.isAtmosphereProperty.reset();
      this.isRulerVisibleProperty.reset();
      this.isGridVisibleProperty.reset();
      this.measureUnitsProperty.reset();
      this.gravityProperty.reset();
      this.fluidDensityProperty.reset();
      this.currentSceneProperty.reset();
      this.currentVolumeProperty.reset();
      this.rulerPositionProperty.reset();
      this.mysteryChoiceProperty.reset();
      this.fluidDensityControlExpandedProperty.reset();
      this.gravityControlExpandedProperty.reset();

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
      if ( !this.isAtmosphereProperty.value ) {
        return 0;
      }
      else {
        return getStandardAirPressure( height ) * this.gravityProperty.value / Constants.EARTH_GRAVITY;
      }
    },

    /**
     * @public
     * Returns the pressure (in Pa) exerted by a fluid column of given height.
     * @param {number} height of the fluid column
     * @returns {number}
     */
    getWaterPressure: function( height ) {
      return height * this.gravityProperty.value * this.fluidDensityProperty.value;
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
      var currentModel = this.currentSceneModelProperty.value;
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
      return Units.getGravityString( this.gravityProperty.value, this.measureUnitsProperty.value );
    },

    // @public
    getFluidDensityString: function() {
      return Units.getFluidDensityString( this.fluidDensityProperty.value, this.measureUnitsProperty.value );
    }
  } );
} );