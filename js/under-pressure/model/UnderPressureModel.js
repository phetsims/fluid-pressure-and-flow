// Copyright 2013-2020, University of Colorado Boulder

/**
 * Top model for all screens - all common properties and methods are placed here.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Constants from '../../common/Constants.js';
import FluidColorModel from '../../common/model/FluidColorModel.js';
import getStandardAirPressure from '../../common/model/getStandardAirPressure.js';
import Sensor from '../../common/model/Sensor.js';
import Units from '../../common/model/Units.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import ChamberPoolModel from './ChamberPoolModel.js';
import MysteryPoolModel from './MysteryPoolModel.js';
import SquarePoolModel from './SquarePoolModel.js';
import TrapezoidPoolModel from './TrapezoidPoolModel.js';

// constants
const NUM_BAROMETERS = 4;

class UnderPressureModel {

  constructor() {

    this.gravityRange = new Range( Constants.MARS_GRAVITY, Constants.JUPITER_GRAVITY ); // @public
    this.fluidDensityRange = new Range( Constants.GASOLINE_DENSITY, Constants.HONEY_DENSITY ); // @public

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
    this.rulerPositionProperty = new Vector2Property( new Vector2( 300, 100 ) ); // ruler initial position above the ground and center of square pool // TODO: is this used?
    this.mysteryChoiceProperty = new Property( 'fluidDensity' ); //for mystery-pool, gravity of fluidDensity
    this.fluidDensityControlExpandedProperty = new Property( true );//For the accordion box
    this.gravityControlExpandedProperty = new Property( true );//For the accordion box

    this.sceneModels = {}; // @public
    this.sceneModels.square = new SquarePoolModel( this );
    this.sceneModels.trapezoid = new TrapezoidPoolModel( this );
    this.sceneModels.chamber = new ChamberPoolModel( this );
    this.sceneModels.mystery = new MysteryPoolModel( this );

    this.fluidColorModel = new FluidColorModel( this.fluidDensityProperty, this.fluidDensityRange ); // @public

    this.barometers = []; // @public

    for ( let i = 0; i < NUM_BAROMETERS; i++ ) {
      // initial position of barometer on screen adjacent to control panel above ground
      this.barometers.push( new Sensor( new Vector2( 7.75, 2.5 ), 0 ) );
    }

    // current scene's model
    this.currentSceneModelProperty = new DerivedProperty( [ this.currentSceneProperty ], currentScene => {
      return this.sceneModels[ currentScene ];
    } );

    this.currentSceneModelProperty.link( currentSceneModel => {
      this.currentVolumeProperty.value = currentSceneModel.volumeProperty.value;
    } );
  }

  /**
   * @public
   * @param {number} dt seconds
   */
  step( dt ) {
    this.fluidColorModel.step();
    this.currentSceneModelProperty.value.step( dt );
  }

  // @public
  reset() {
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

    this.barometers.forEach( barometer => {
      barometer.reset();
    } );
  }

  /**
   * @public
   * Returns the air pressure (in Pa) at the given height.
   * @param {number} height in meters
   * @returns {number}
   */
  getAirPressure( height ) {
    if ( !this.isAtmosphereProperty.value ) {
      return 0;
    }
    else {
      return getStandardAirPressure( height ) * this.gravityProperty.value / Constants.EARTH_GRAVITY;
    }
  }

  /**
   * @public
   * Returns the pressure (in Pa) exerted by a fluid column of given height.
   * @param {number} height - of the fluid column
   * @returns {number}
   */
  getWaterPressure( height ) {
    return height * this.gravityProperty.value * this.fluidDensityProperty.value;
  }

  /**
   * @public
   * Returns the pressure (in Pa) at the given position.
   * @param {number} x - position in meters
   * @param {number} y - position in meters
   * @returns {number}
   */
  getPressureAtCoords( x, y ) {
    let pressure = null;
    const currentModel = this.currentSceneModelProperty.value;
    if ( y > 0 ) {
      pressure = this.getAirPressure( y );
    }
    else if ( currentModel.isPointInsidePool( x, y ) ) {

      // get the water height over barometer
      const waterHeight = currentModel.getWaterHeightAboveY( x, y );
      if ( waterHeight <= 0 ) {
        pressure = this.getAirPressure( y );
      }
      else {
        pressure = this.getAirPressure( waterHeight + y ) + this.getWaterPressure( waterHeight );
      }

    }
    return pressure;
  }

  /**
   * @public
   * @param {number} pressure in Pa
   * @param {string} units -- can be english/metric/atmospheres
   * @returns {string}
   */
  getPressureString( pressure, units ) {
    return Units.getPressureString( pressure, units, false );
  }

  // @public
  getGravityString() {
    return Units.getGravityString( this.gravityProperty.value, this.measureUnitsProperty.value );
  }

  // @public
  getFluidDensityString() {
    return Units.getFluidDensityString( this.fluidDensityProperty.value, this.measureUnitsProperty.value );
  }
}

fluidPressureAndFlow.register( 'UnderPressureModel', UnderPressureModel );
export default UnderPressureModel;