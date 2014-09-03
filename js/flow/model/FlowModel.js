// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * FlowModel
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/flow/Constants' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var VelocitySensor = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/VelocitySensor' );
  var Barometer = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/Barometer' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var FluidColorModel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/FluidColorModel' );
  var Units = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/Units' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Pipe = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/Pipe' );
  var Particle = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/Particle' );
  var EventTimer = require( 'PHET_CORE/EventTimer' );
  var FluxMeter = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/FluxMeter' );

  // strings
  var densityUnitsEnglish = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsEnglish' );
  var densityUnitsMetric = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsMetric' );
  var valueWithUnitsPattern = require( 'string!FLUID_PRESSURE_AND_FLOW/valueWithUnitsPattern' );
  var flowRateUnitsMetric = require( 'string!FLUID_PRESSURE_AND_FLOW/rateUnitsMetric' );
  var flowRateUnitsEnglish = require( 'string!FLUID_PRESSURE_AND_FLOW/rateUnitsEnglish' );

  /**
   * Constructor for the sim model.
   * Origin is at the left bound on the ground. And y grows in the direction of sky from ground.
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
        isDotsVisible: true,
        isPlay: true,//Whether the sim is paused or running
        measureUnits: 'metric', //metric, english
        fluidDensity: Constants.WATER_DENSITY,
        fluidFlowRate: 5000,
        rulerPosition: new Vector2( 300, 344 ), // px
        scale: 1, // scale coefficient
        speed: 'normal'//speed of the model, either 'normal' or 'slow'
      }
    );

    this.getStandardAirPressure = new LinearFunction( 0, 150, Constants.EARTH_AIR_PRESSURE, Constants.EARTH_AIR_PRESSURE_AT_500_FT );

    this.barometers = [];
    for ( var i = 0; i < 2; i++ ) {
      this.barometers.push( new Barometer( new Vector2( 0, 0 ), 101035 ) );
    }

    this.speedometers = [];
    for ( var j = 0; j < 2; j++ ) {
      this.speedometers.push( new VelocitySensor( new Vector2( 0, 0 ), new Vector2( 0, 0 ) ) );
    }

    this.fluidColorModel = new FluidColorModel( this );

    this.pipe = new Pipe();
    this.fluxMeter = new FluxMeter( this.pipe );

    this.flowParticles = new ObservableArray();
    this.gridParticles = new ObservableArray();


    this.particlesToRemove = [];
    this.gridParticlesToRemove = [];
    this.gridInjectorElapsedTimeInPressedMode = 0;

    // call stepInternal at a rate of 3 times per second
    this.timer = new EventTimer( new EventTimer.ConstantEventModel( 5 ), function( timeElapsed ) {
      flowModel.createParticles( timeElapsed );
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

    getAirPressure: function( height ) {
      return this.getStandardAirPressure( height );
    },

    getFluidPressure: function( x, y ) {
      if ( x <= this.pipe.getMinX() || x >= this.pipe.getMaxX() ) {
        return 0;
      }

      var crossSection = this.pipe.getCrossSection( x );

      if ( y > crossSection.yBottom - 0.1 && y < crossSection.yTop - 0.25 ) {
        var vSquared = this.pipe.getVelocity( x, y ).magnitudeSquared();
        return this.getAirPressure( 0 ) - y * 9.8 * this.fluidDensity - 0.5 * this.fluidDensity * vSquared;
      }
      return 0;
    },


    getPressureAtCoords: function( x, y ) {
      return (y > 0) ? this.getAirPressure( y ) : this.getFluidPressure( x, y );
    },

    // Called by the animation loop.
    step: function( dt ) {
      if ( this.isPlay ) {
        if ( this.speed === 'normal' ) {
          this.timer.step( dt );
          this.propagateParticles( dt );
          if(this.isGridInjectorPressed) {
            this.gridInjectorElapsedTimeInPressedMode += dt;
          }
        }
        else {
          this.timer.step( 0.33 * dt );
          this.propagateParticles( 0.33 * dt );
          if(this.isGridInjectorPressed) {
            this.gridInjectorElapsedTimeInPressedMode += 0.33 * dt;
          }
        }
        if(this.gridInjectorElapsedTimeInPressedMode > 5 ){
          this.isGridInjectorPressed = false;
          this.gridInjectorElapsedTimeInPressedMode = 0 ;
        }
      }
    },

    createParticles: function( dt ) {
      var newParticle;

      if ( this.isDotsVisible ) {
        var fraction = 0.1 + Math.random() * 0.8;
        newParticle = new Particle( new Vector2( this.pipe.getMinX() , 0 ), fraction, this.pipe, 0.1, 'red' );
        this.flowParticles.push( newParticle );
      }
    },

    propagateParticles: function( dt ) {
      var x2;
      var particle;

      this.particlesToRemove = [];
      this.gridParticlesToRemove = [];

      for ( var i = 0, k = this.flowParticles.length; i < k; i++ ) {

        particle = this.flowParticles.get( i );
        x2 = particle.getX() + particle.container.getTweakedVx( particle.getX(), particle.getY() ) * dt;

        // check if the particle hit the maxX
        if ( x2 >= this.pipe.getMaxX()  ) {
          this.particlesToRemove.push( particle );
        }
        else {
          particle.setX( x2 );
          particle.position.y = particle.getY();
        }
      }

      for ( var j = 0, numberOfParticles = this.gridParticles.length; j < numberOfParticles; j++ ) {

        particle = this.gridParticles.get( j );
        x2 = particle.getX() + particle.container.getTweakedVx( particle.getX(), particle.getY() ) * dt;

        // check if the particle hit the maxX
        if ( x2 >= this.pipe.getMaxX()) {
          this.gridParticlesToRemove.push( particle );
        }
        else {
          particle.setX( x2 );
          particle.position.y = particle.getY();
        }
      }

      if ( this.gridParticlesToRemove.length > 0 ) {
        this.gridParticles.removeAll( this.gridParticlesToRemove );
      }

      if ( this.particlesToRemove.length > 0 ) {
        this.flowParticles.removeAll( this.particlesToRemove );
      }
    },

    getFluidDensityString: function() {
      if ( this.measureUnits === 'english' ) {
        return StringUtils.format( valueWithUnitsPattern, (Units.FLUID_DENSITY_ENGLISH_PER_METRIC * this.fluidDensity).toFixed( 2 ), densityUnitsEnglish );
      }
      else {
        return StringUtils.format( valueWithUnitsPattern, Math.round( this.fluidDensity ), densityUnitsMetric );
      }
    },
    getFluidFlowRateString: function() {
      if ( this.measureUnits === 'english' ) {
        return StringUtils.format( valueWithUnitsPattern, (Units.FLUID_FlOW_RATE_ENGLISH_PER_METRIC * this.fluidFlowRate).toFixed( 2 ), flowRateUnitsEnglish );
      }
      else {
        return StringUtils.format( valueWithUnitsPattern, Math.round( this.fluidFlowRate ), flowRateUnitsMetric );
      }
    },

    getWaterDropVelocityAt: function( x, y ) {
      if ( x <= this.pipe.getMinX() || x >= this.pipe.getMaxX() ) {
        return Vector2.ZERO;
      }

      var crossSection = this.pipe.getCrossSection( x );
      if ( y > crossSection.yBottom - 0.1 && y < crossSection.yTop - 0.25 ) {
        return this.pipe.getTweakedVelocity( x, y );
      }
      return Vector2.ZERO;
    },

    injectGridParticles: function() {
      var x0 = this.pipe.getMinX();
      var x;
      var fraction;
      for ( var i = 0; i < 4; i++ ) {
        x = x0 + i * 0.3;
        for ( var j = 0; j < 9; j++ ) {
          fraction = 0.1 * (j + 1);
          this.gridParticles.push( new Particle( new Vector2( x, 0 ), fraction, this.pipe, 0.06, 'black' ) );
        }
      }
    }
  } );
} );

