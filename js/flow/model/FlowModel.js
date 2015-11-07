// Copyright 2014-2015, University of Colorado Boulder

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
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var VelocitySensor = require( 'FLUID_PRESSURE_AND_FLOW/common/model/VelocitySensor' );
  var Sensor = require( 'UNDER_PRESSURE/common/model/Sensor' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var FluidColorModel = require( 'UNDER_PRESSURE/common/model/FluidColorModel' );
  var Units = require( 'UNDER_PRESSURE/common/model/Units' );
  var Pipe = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/Pipe' );
  var Particle = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/Particle' );
  var EventTimer = require( 'PHET_CORE/EventTimer' );
  var FluxMeter = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/FluxMeter' );
  var getStandardAirPressure = require( 'UNDER_PRESSURE/common/model/getStandardAirPressure' );

  // strings
  var densityUnitsEnglish = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsEnglish' );
  var densityUnitsMetric = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsMetric' );
  var valueWithUnitsPattern = require( 'string!FLUID_PRESSURE_AND_FLOW/valueWithUnitsPattern' );
  var flowRateUnitsMetric = require( 'string!FLUID_PRESSURE_AND_FLOW/rateUnitsMetric' );
  var flowRateUnitsEnglish = require( 'string!FLUID_PRESSURE_AND_FLOW/rateUnitsEnglish' );

  // constants
  var NUMBER_BAROMETERS = 2;
  var NUMBER_VELOCITY_SENSORS = 2;

  /**
   * Constructor for the sim model.
   * Origin is at the center on the ground. And y grows in the direction of sky from ground.
   * @constructor
   */
  function FlowModel() {
    var flowModel = this;

    this.fluidDensityRange = new Range( Constants.GASOLINE_DENSITY, Constants.HONEY_DENSITY );
    this.flowRateRange = new Range( Constants.MIN_FLOW_RATE, Constants.MAX_FLOW_RATE );

    PropertySet.call( this, {
        isRulerVisible: false,
        isFluxMeterVisible: false,
        isGridInjectorPressed: false,
        gridInjectorElapsedTimeInPressedMode: 0, // elapsed sim time (in sec) for which the injector remained pressed
        isDotsVisible: true,
        isPlaying: true,// Whether the sim is paused or running
        measureUnits: 'metric', //metric, english
        fluidDensity: Constants.WATER_DENSITY,
        fluidDensityControlExpanded: false,
        flowRateControlExpanded: false,
        rulerPosition: new Vector2( 300, 344 ), // px
        speed: 'normal' //speed of the model, either 'normal' or 'slow'
      }
    );

    this.barometers = [];
    for ( var i = 0; i < NUMBER_BAROMETERS; i++ ) {
      this.barometers.push( new Sensor( new Vector2( 0, 0 ), 0 ) );
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

    this.gridInjectorElapsedTimeInPressedModeProperty.link( function() {

      //The grid injector can only be fired every so often, in order to prevent too many black particles in the pipe
      if ( flowModel.gridInjectorElapsedTimeInPressedMode > 5 ) {
        flowModel.isGridInjectorPressed = false;
        flowModel.gridInjectorElapsedTimeInPressedMode = 0;
      }
    } );

    // call stepInternal at a rate of 10 times per second
    this.timer = new EventTimer( new EventTimer.UniformEventModel( 10, Math.random ), function() {
      flowModel.createParticle();
    } );
  }

  return inherit( PropertySet, FlowModel, {

      // Resets all model elements
      reset: function() {
        PropertySet.prototype.reset.call( this );

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
          return getStandardAirPressure( 0 ) - y * Constants.EARTH_GRAVITY * this.fluidDensity -
                 0.5 * this.fluidDensity * vSquared;
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
       * @param {String} units -- can be english/metric/atmospheres
       * @returns {String} with value and units
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

        if ( this.isPlaying ) {
          var adjustedDT = this.speed === 'normal' ? dt : dt * 0.33;
          this.timer.step( adjustedDT );
          this.propagateParticles( adjustedDT );
          if ( this.isGridInjectorPressed ) {
            this.gridInjectorElapsedTimeInPressedMode += adjustedDT;
          }
        }
      },

      // creates a red particle at the left most pipe location and a random y fraction between [0.15, 0.85) within the pipe
      createParticle: function() {
        if ( this.isDotsVisible ) {

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
        if ( this.measureUnits === 'english' ) {
          return StringUtils.format( valueWithUnitsPattern,
            (Units.FLUID_DENSITY_ENGLISH_PER_METRIC * this.fluidDensity).toFixed( 2 ), densityUnitsEnglish );
        }
        else {
          return StringUtils.format( valueWithUnitsPattern, Math.round( this.fluidDensity ), densityUnitsMetric );
        }
      },

      /**
       * Returns the formatted flow rate string. For measurement in 'english' units the precision is 2 decimals.
       * For measurement in other units ('metric') the value is rounded off to the nearest integer.
       * @returns {string} with value and units
       */
      getFluidFlowRateString: function() {
        if ( this.measureUnits === 'english' ) {
          return StringUtils.format( valueWithUnitsPattern,
            (Units.FLUID_FlOW_RATE_ENGLISH_PER_METRIC * this.pipe.flowRate).toFixed( 2 ), flowRateUnitsEnglish );
        }
        else {
          return StringUtils.format( valueWithUnitsPattern, Math.round( this.pipe.flowRate ), flowRateUnitsMetric );
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