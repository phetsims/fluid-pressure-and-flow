// Copyright 2014-2023, University of Colorado Boulder

/**
 * Model for the Flow tab in Fluid Pressure and Flow (FPAF) simulation. The model includes values for various view
 * settings like whether a ruler is visible, whether a grid injector is pressed and so on.
 * Origin is at the center on the ground. And y grows in the direction of sky from ground.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import createObservableArray from '../../../../axon/js/createObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import EventTimer from '../../../../phet-core/js/EventTimer.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Constants from '../../common/Constants.js';
import FluidColorModel from '../../common/model/FluidColorModel.js';
import getStandardAirPressure from '../../common/model/getStandardAirPressure.js';
import Sensor from '../../common/model/Sensor.js';
import Units from '../../common/model/Units.js';
import VelocitySensor from '../../common/model/VelocitySensor.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';
import FluxMeter from './FluxMeter.js';
import Particle from './Particle.js';
import Pipe from './Pipe.js';

const densityUnitsEnglishString = FluidPressureAndFlowStrings.densityUnitsEnglish;
const densityUnitsMetricString = FluidPressureAndFlowStrings.densityUnitsMetric;
const rateUnitsEnglishString = FluidPressureAndFlowStrings.rateUnitsEnglish;
const rateUnitsMetricString = FluidPressureAndFlowStrings.rateUnitsMetric;
const valueWithUnitsPatternString = FluidPressureAndFlowStrings.valueWithUnitsPattern;

// constants
const NUMBER_BAROMETERS = 2;
const NUMBER_VELOCITY_SENSORS = 2;
const SECONDS_THAT_GRID_INJECTOR_IS_IN_PRESSED_MODE = 4;

class FlowModel {

  constructor() {

    // @public (read-only)
    this.fluidDensityRange = new Range( Constants.GASOLINE_DENSITY, Constants.HONEY_DENSITY );
    this.flowRateRange = new Range( Constants.MIN_FLOW_RATE, Constants.MAX_FLOW_RATE );


    // @public
    this.isRulerVisibleProperty = new Property( false );
    this.isFluxMeterVisibleProperty = new Property( false );
    this.isGridInjectorPressedProperty = new Property( false, { reentrant: true } );

    // elapsed sim time (in sec) for which the injector has been pressed
    this.gridInjectorElapsedTimeInPressedModeProperty = new Property( 0, {
      reentrant: true
    } );
    this.isDotsVisibleProperty = new Property( true );
    this.isPlayingProperty = new Property( true ); // Whether the sim is paused or running

    // {Property.<string>} - can be either "metric" "atmospheres or "english"
    this.measureUnitsProperty = new Property( 'metric' );
    this.fluidDensityProperty = new Property( Constants.WATER_DENSITY ); // {Property.<number>}

    // Used to default the density accordion box to be closed
    this.fluidDensityControlExpandedProperty = new Property( false );

    // Used to default the flow rate accordion boxes to be closed
    this.flowRateControlExpandedProperty = new Property( false );

    // in px, here set the default position of the ruler on display
    this.rulerPositionProperty = new Vector2Property( new Vector2( 300, 344 ) );

    // {Property.<string>} - speed of the model, either 'normal' or 'slow'
    this.speedProperty = new Property( 'normal' );

    this.barometers = [];
    for ( let i = 0; i < NUMBER_BAROMETERS; i++ ) {
      this.barometers.push( new Sensor( new Vector2( 2.5, 1.8 ), 0 ) );
    }

    this.speedometers = [];
    for ( let j = 0; j < NUMBER_VELOCITY_SENSORS; j++ ) {
      this.speedometers.push( new VelocitySensor( new Vector2( 0, 0 ), new Vector2( 0, 0 ) ) );
    }

    this.fluidColorModel = new FluidColorModel( this.fluidDensityProperty, this.fluidDensityRange );

    this.pipe = new Pipe();
    this.fluxMeter = new FluxMeter( this.pipe );

    this.flowParticles = createObservableArray();
    this.gridParticles = createObservableArray();

    // call stepInternal at a rate of 10 times per second
    this.timer = new EventTimer( new EventTimer.UniformEventModel( 10, dotRandom.nextDouble.bind( dotRandom ) ),
      () => { this.createParticle(); }
    );

    this.gridInjectorElapsedTimeInPressedModeProperty.link( elapsedTime => {

      //  The grid injector can only be fired every so often, in order to prevent too many black particles in the pipe
      if ( elapsedTime > SECONDS_THAT_GRID_INJECTOR_IS_IN_PRESSED_MODE ) {
        this.isGridInjectorPressedProperty.value = false;
        this.gridInjectorElapsedTimeInPressedModeProperty.value = 0;
      }
    } );
  }

  /**
   * Resets all model elements
   * @public
   */
  reset() {
    this.isRulerVisibleProperty.reset();
    this.isFluxMeterVisibleProperty.reset();
    this.isGridInjectorPressedProperty.reset();
    this.gridInjectorElapsedTimeInPressedModeProperty.reset();
    this.isDotsVisibleProperty.reset();
    this.isPlayingProperty.reset();
    this.measureUnitsProperty.reset();
    this.fluidDensityProperty.reset();
    this.fluidDensityControlExpandedProperty.reset();
    this.flowRateControlExpandedProperty.reset();
    this.rulerPositionProperty.reset();
    this.speedProperty.reset();

    _.each( this.barometers, barometer => {
      barometer.reset();
    } );

    _.each( this.speedometers, speedometer => {
      speedometer.reset();
    } );

    this.pipe.reset();
    this.flowParticles.clear();
    this.gridParticles.clear();
    this.fluxMeter.reset();
  }

  /**
   * @param {number} x - position in meters
   * @param {number} y - position in meters
   * @returns {number} fluid pressure (in Pa) at the specified position
   * @protected
   */
  getFluidPressure( x, y ) {
    if ( x <= this.pipe.getMinX() || x >= this.pipe.getMaxX() ) {
      return 0;
    }

    const crossSection = this.pipe.getCrossSection( x );

    if ( y > crossSection.yBottom + 0.05 && y < crossSection.yTop - 0.05 ) {
      const vSquared = this.pipe.getVelocity( x, y ).magnitudeSquared;
      return getStandardAirPressure( 0 ) - y * Constants.EARTH_GRAVITY * this.fluidDensityProperty.value -
             0.5 * this.fluidDensityProperty.value * vSquared;
    }
    return 0;
  }

  /**
   * @param {number} x - position in meters
   * @param {number} y - position in meters
   * @returns {number} pressure (in Pa) at specified position
   * @public
   */
  getPressureAtCoords( x, y ) {
    return ( y > 0 ) ? getStandardAirPressure( y ) : this.getFluidPressure( x, y );
  }

  /**
   * @param {number} pressure in Pa
   * @param {string} units -- can be english/metric/atmospheres
   * @returns {string} with value and units
   * @public
   */
  getPressureString( pressure, units ) {
    return Units.getPressureString( pressure, units );
  }

  /**
   * Called by the animation loop.
   * @param {number} dt -- time in seconds
   * @public
   */
  step( dt ) {

    // prevent sudden dt bursts when the user comes back to the tab after a while
    dt = ( dt > 0.04 ) ? 0.04 : dt;

    if ( this.isPlayingProperty.value ) {
      const adjustedDT = this.speedProperty.value === 'normal' ? dt : dt * 0.33; // if not 'normal' then it is 'slow'
      this.timer.step( adjustedDT );
      this.propagateParticles( adjustedDT );
      if ( this.isGridInjectorPressedProperty.value ) {
        this.gridInjectorElapsedTimeInPressedModeProperty.value += adjustedDT;
      }
    }
  }

  /**
   * creates a red particle at the left most pipe position and a random y fraction between [0.15, 0.85) within the pipe
   * @private
   */
  createParticle() {
    if ( this.isDotsVisibleProperty.value ) {

      // create particles in the [0.15, 0.85) range so that they don't touch the pipe
      const fraction = 0.15 + dotRandom.nextDouble() * 0.7;
      this.flowParticles.push( new Particle( this.pipe.getMinX(), fraction, this.pipe, 0.1, 'red' ) );
    }
  }

  /**
   * propagates the particles in the pipe as per their velocity. Removes any particles that cross the pipe right end.
   * @param {number} dt -- time in seconds
   * @public
   */
  propagateParticles( dt ) {
    let x2;
    let particle;

    const particlesToRemove = [];
    const gridParticlesToRemove = [];

    for ( let i = 0, k = this.flowParticles.length; i < k; i++ ) {

      particle = this.flowParticles.get( i );
      x2 = particle.getX() + particle.container.getTweakedVx( particle.getX(), particle.getY() ) * dt;

      // check if the particle hit the maxX
      if ( x2 >= this.pipe.getMaxX() ) {
        particlesToRemove.push( particle );
      }
      else {
        particle.setX( x2 );
      }
    }

    for ( let j = 0, numberOfParticles = this.gridParticles.length; j < numberOfParticles; j++ ) {

      particle = this.gridParticles.get( j );
      x2 = particle.getX() + particle.container.getTweakedVx( particle.getX(), particle.getY() ) * dt;

      // check if the particle hit the maxX
      if ( x2 >= this.pipe.getMaxX() ) {
        gridParticlesToRemove.push( particle );
      }
      else {
        particle.setX( x2 );
      }
    }

    if ( gridParticlesToRemove.length > 0 ) {
      this.gridParticles.removeAll( gridParticlesToRemove );
    }

    if ( particlesToRemove.length > 0 ) {
      this.flowParticles.removeAll( particlesToRemove );
    }
  }

  /**
   * Returns the formatted density string. For measurement in 'english' units the precision is 2 decimals.
   * For measurement in other units ('metric') the value is rounded off to the nearest integer.
   * @returns {string} with value and units
   * @public
   */
  getFluidDensityString() {
    if ( this.measureUnitsProperty.value === 'english' ) {
      return StringUtils.format( valueWithUnitsPatternString,
        Utils.toFixed( Units.FLUID_DENSITY_ENGLISH_PER_METRIC * this.fluidDensityProperty.value, 2 ), densityUnitsEnglishString );
    }
    else {
      return StringUtils.format( valueWithUnitsPatternString, Utils.roundSymmetric( this.fluidDensityProperty.value ), densityUnitsMetricString );
    }
  }

  /**
   * Returns the formatted flow rate string. For measurement in 'english' units the precision is 2 decimals.
   * For measurement in other units ('metric') the value is rounded off to the nearest integer.
   * @returns {string} with value and units
   * @public
   */
  getFluidFlowRateString() {
    if ( this.measureUnitsProperty.value === 'english' ) {
      return StringUtils.format( valueWithUnitsPatternString,
        Utils.toFixed( Units.FLUID_FlOW_RATE_ENGLISH_PER_METRIC * this.pipe.flowRateProperty.value, 2 ), rateUnitsEnglishString );
    }
    else {
      return StringUtils.format( valueWithUnitsPatternString, Utils.roundSymmetric( this.pipe.flowRateProperty.value ), rateUnitsMetricString );
    }
  }

  /**
   * Returns the velocity at the specified point in the pipe. Returns a zero vector if the point is outside the pipe.
   * @param {number} x - position in meters
   * @param {number} y - position in meters
   * @returns {Vector2} velocity at the position x, y
   * @public
   */
  getVelocityAt( x, y ) {
    if ( x <= this.pipe.getMinX() || x >= this.pipe.getMaxX() ) {
      return Vector2.ZERO;
    }

    const crossSection = this.pipe.getCrossSection( x );

    if ( y > crossSection.yBottom + 0.05 && y < crossSection.yTop - 0.05 ) {
      return this.pipe.getTweakedVelocity( x, y );
    }
    return Vector2.ZERO;
  }

  /**
   * Injects a grid of particles with 9 rows and 4 columns
   * @public
   */
  injectGridParticles() {
    const x0 = this.pipe.getMinX() + 1E-6;
    const COLUMN_SPACING = 0.2; // initial distance (in meters) between two successive columns in the particle grid
    const NUM_COLUMNS = 4;
    const NUM_ROWS = 9;

    for ( let i = 0; i < NUM_COLUMNS; i++ ) {
      const x = x0 + i * COLUMN_SPACING;
      for ( let j = 0; j < NUM_ROWS; j++ ) {

        // ensure the particle's y fraction is between [0.1, 0.9], so they aren't too close to the edge of the pipe.
        const fraction = 0.1 * ( j + 1 );
        this.gridParticles.push( new Particle( x, fraction, this.pipe, 0.06, 'black' ) );
      }
    }
  }
}

fluidPressureAndFlow.register( 'FlowModel', FlowModel );
export default FlowModel;
