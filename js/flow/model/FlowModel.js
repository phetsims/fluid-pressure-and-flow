// Copyright 2014-2017, University of Colorado Boulder

/**
 * Model for the Flow tab in Fluid Pressure and Flow (FPAF) simulation. The model includes values for various view
 * settings like whether a ruler is visible, whether a grid injector is pressed and so on.
 * Origin is at the center on the ground. And y grows in the direction of sky from ground.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  // modules
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  var EventTimer = require( 'PHET_CORE/EventTimer' );
  var FluidColorModel = require( 'FLUID_PRESSURE_AND_FLOW/common/model/FluidColorModel' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var FluxMeter = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/FluxMeter' );
  var getStandardAirPressure = require( 'FLUID_PRESSURE_AND_FLOW/common/model/getStandardAirPressure' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Particle = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/Particle' );
  var Pipe = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/Pipe' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Sensor = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Sensor' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Units = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Units' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var VelocitySensor = require( 'FLUID_PRESSURE_AND_FLOW/common/model/VelocitySensor' );

  // strings
  var densityUnitsEnglishString = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsEnglish' );
  var densityUnitsMetricString = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsMetric' );
  var rateUnitsEnglishString = require( 'string!FLUID_PRESSURE_AND_FLOW/rateUnitsEnglish' );
  var rateUnitsMetricString = require( 'string!FLUID_PRESSURE_AND_FLOW/rateUnitsMetric' );
  var valueWithUnitsPatternString = require( 'string!FLUID_PRESSURE_AND_FLOW/valueWithUnitsPattern' );

  // constants
  var NUMBER_BAROMETERS = 2;
  var NUMBER_VELOCITY_SENSORS = 2;
  var SECONDS_THAT_GRID_INJECTOR_IS_IN_PRESSED_MODE = 4;

  /**
   * Constructor for the sim model.
   * Origin is at the center on the ground. And y grows in the direction of sky from ground.
   * @constructor
   */
  function FlowModel() {
    var self = this;

    // @public (read-only)
    this.fluidDensityRange = new RangeWithValue( Constants.GASOLINE_DENSITY, Constants.HONEY_DENSITY );
    this.flowRateRange = new RangeWithValue( Constants.MIN_FLOW_RATE, Constants.MAX_FLOW_RATE );


    // @public
    this.isRulerVisibleProperty = new Property( false );
    this.isFluxMeterVisibleProperty = new Property( false );
    this.isGridInjectorPressedProperty = new Property( false );

    // elapsed sim time (in sec) for which the injector has been pressed
    this.gridInjectorElapsedTimeInPressedModeProperty = new Property( 0 );
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
    this.rulerPositionProperty = new Property( new Vector2( 300, 344 ) );

    // {Property.<string>} - speed of the model, either 'normal' or 'slow'
    this.speedProperty = new Property( 'normal' );

    this.barometers = [];
    for ( var i = 0; i < NUMBER_BAROMETERS; i++ ) {
      this.barometers.push( new Sensor( new Vector2( 2.5, 1.8 ), 0 ) );
    }

    this.speedometers = [];
    for ( var j = 0; j < NUMBER_VELOCITY_SENSORS; j++ ) {
      this.speedometers.push( new VelocitySensor( new Vector2( 0, 0 ), new Vector2( 0, 0 ) ) );
    }

    this.fluidColorModel = new FluidColorModel( this.fluidDensityProperty, this.fluidDensityRange );

    this.pipe = new Pipe();
    this.fluxMeter = new FluxMeter( this.pipe );

    this.flowParticles = new ObservableArray();
    this.gridParticles = new ObservableArray();

    // call stepInternal at a rate of 10 times per second
    this.timer = new EventTimer( new EventTimer.UniformEventModel( 10, Math.random ), function() {
      self.createParticle();
    } );
    // end @public members

    this.gridInjectorElapsedTimeInPressedModeProperty.link( function( elapsedTime ) {

      //  The grid injector can only be fired every so often, in order to prevent too many black particles in the pipe
      if ( elapsedTime > SECONDS_THAT_GRID_INJECTOR_IS_IN_PRESSED_MODE ) {
        self.isGridInjectorPressedProperty.value = false;
        self.gridInjectorElapsedTimeInPressedModeProperty.value = 0;
      }
    } );
  }

  fluidPressureAndFlow.register( 'FlowModel', FlowModel );

  return inherit( Object, FlowModel, {

      // Resets all model elements
      reset: function() {
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

        _.each( this.barometers, function( barometer ) {
          barometer.reset();
        } );

        _.each( this.speedometers, function( speedometer ) {
          speedometer.reset();
        } );
        this.pipe.reset();
        this.flowParticles.clear();
        this.gridParticles.clear();
        this.fluxMeter.reset();
      },

      /**
       * @param {number} x position in meters
       * @param {number} y position in meters
       * @returns {number} fluid pressure (in Pa) at the specified position
       */
      getFluidPressure: function( x, y ) {
        if ( x <= this.pipe.getMinX() || x >= this.pipe.getMaxX() ) {
          return 0;
        }

        var crossSection = this.pipe.getCrossSection( x );

        if ( y > crossSection.yBottom + 0.05 && y < crossSection.yTop - 0.05 ) {
          var vSquared = this.pipe.getVelocity( x, y ).magnitudeSquared();
          return getStandardAirPressure( 0 ) - y * Constants.EARTH_GRAVITY * this.fluidDensityProperty.value -
                 0.5 * this.fluidDensityProperty.value * vSquared;
        }
        return 0;
      },

      /**
       * @param {number} x position in meters
       * @param {number} y position in meters
       * @returns {number} pressure (in Pa) at specified position
       */
      getPressureAtCoords: function( x, y ) {
        return (y > 0) ? getStandardAirPressure( y ) : this.getFluidPressure( x, y );
      },


      /**
       * @param {number} pressure in Pa
       * @param {string} units -- can be english/metric/atmospheres
       * @returns {string} with value and units
       */
      getPressureString: function( pressure, units ) {
        return Units.getPressureString( pressure, units );
      },

      /**
       * Called by the animation loop.
       * @param {number} dt -- time in seconds
       */
      step: function( dt ) {
        // prevent sudden dt bursts when the user comes back to the tab after a while
        dt = ( dt > 0.04 ) ? 0.04 : dt;

        if ( this.isPlayingProperty.value ) {
          var adjustedDT = this.speedProperty.value === 'normal' ? dt : dt * 0.33; // if not 'normal' then it is 'slow'
          this.timer.step( adjustedDT );
          this.propagateParticles( adjustedDT );
          if ( this.isGridInjectorPressedProperty.value ) {
            this.gridInjectorElapsedTimeInPressedModeProperty.value += adjustedDT;
          }
        }
      },

      // creates a red particle at the left most pipe location and a random y fraction between [0.15, 0.85) within the pipe
      createParticle: function() {
        if ( this.isDotsVisibleProperty.value ) {

          // create particles in the [0.15, 0.85) range so that they don't touch the pipe
          var fraction = 0.15 + Math.random() * 0.7;
          this.flowParticles.push( new Particle( this.pipe.getMinX(), fraction, this.pipe, 0.1, 'red' ) );
        }
      },


      /**
       * propagates the particles in the pipe as per their velocity. Removes any particles that cross the pipe right end.
       * @param {number} dt -- time in seconds
       */
      propagateParticles: function( dt ) {
        var x2;
        var particle;

        var particlesToRemove = [];
        var gridParticlesToRemove = [];

        for ( var i = 0, k = this.flowParticles.length; i < k; i++ ) {

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

        for ( var j = 0, numberOfParticles = this.gridParticles.length; j < numberOfParticles; j++ ) {

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
      },

      /**
       * Returns the formatted density string. For measurement in 'english' units the precision is 2 decimals.
       * For measurement in other units ('metric') the value is rounded off to the nearest integer.
       * @returns {string} with value and units
       */
      getFluidDensityString: function() {
        if ( this.measureUnitsProperty.value === 'english' ) {
          return StringUtils.format( valueWithUnitsPatternString,
            (Units.FLUID_DENSITY_ENGLISH_PER_METRIC * this.fluidDensityProperty.value).toFixed( 2 ), densityUnitsEnglishString );
        }
        else {
          return StringUtils.format( valueWithUnitsPatternString, Util.roundSymmetric( this.fluidDensityProperty.value ), densityUnitsMetricString );
        }
      },

      /**
       * Returns the formatted flow rate string. For measurement in 'english' units the precision is 2 decimals.
       * For measurement in other units ('metric') the value is rounded off to the nearest integer.
       * @returns {string} with value and units
       */
      getFluidFlowRateString: function() {
        if ( this.measureUnitsProperty.value === 'english' ) {
          return StringUtils.format( valueWithUnitsPatternString,
            (Units.FLUID_FlOW_RATE_ENGLISH_PER_METRIC * this.pipe.flowRateProperty.value).toFixed( 2 ), rateUnitsEnglishString );
        }
        else {
          return StringUtils.format( valueWithUnitsPatternString, Util.roundSymmetric( this.pipe.flowRateProperty.value ), rateUnitsMetricString );
        }
      },

      /**
       * Returns the velocity at the specified point in the pipe. Returns a zero vector if the point is outside the pipe.
       * @param {number} x position in meters
       * @param {number} y position in meters
       * @returns {number} velocity at the position x, y
       */
      getVelocityAt: function( x, y ) {
        if ( x <= this.pipe.getMinX() || x >= this.pipe.getMaxX() ) {
          return Vector2.ZERO;
        }

        var crossSection = this.pipe.getCrossSection( x );

        if ( y > crossSection.yBottom + 0.05 && y < crossSection.yTop - 0.05 ) {
          return this.pipe.getTweakedVelocity( x, y );
        }
        return Vector2.ZERO;
      },

      /**
       * Injects a grid of particles with 9 rows and 4 columns
       */
      injectGridParticles: function() {
        var x0 = this.pipe.getMinX() + 1E-6;
        var COLUMN_SPACING = 0.2; // initial distance (in meters) between two successive columns in the particle grid
        var NUM_COLUMNS = 4;
        var NUM_ROWS = 9;

        for ( var i = 0; i < NUM_COLUMNS; i++ ) {
          var x = x0 + i * COLUMN_SPACING;
          for ( var j = 0; j < NUM_ROWS; j++ ) {

            // ensure the particle's y fraction is between [0.1, 0.9], so they aren't too close to the edge of the pipe.
            var fraction = 0.1 * (j + 1);
            this.gridParticles.push( new Particle( x, fraction, this.pipe, 0.06, 'black' ) );
          }
        }
      }
    }
  );
} );