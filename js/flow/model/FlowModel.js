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
        isGridParticleVisible: false,
        isDotsVisible: true,
        isFrictionEnabled: false,
        isPlay: true,//Whether the sim is paused or running
        measureUnits: 'metric', //metric, english
        fluidDensity: Constants.WATER_DENSITY,
        fluidFlowRate: 5000,
        fluxMeterPosition: new Vector2( 300, 220 ),
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

    this.flowParticles = new ObservableArray();
    this.gridParticles = new ObservableArray();

    this.particlesToRemove = [];
    this.gridParticlesToRemove = [];
    this.accumulatedDt = 0;
    this.newParticles = [];
    this.newGridParticles = [];

    // call stepInternal at a rate of 3 times per second
    this.timer = new EventTimer( new EventTimer.ConstantEventModel( 3 ), function( timeElapsed ) {
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
    },

    getAirPressure: function( height ) {
      return this.getStandardAirPressure( height );
    },

    getFluidPressure: function( height ) {
      return height * 9.8 * this.fluidDensity;
    },


    getPressureAtCoords: function( x, y ) {
      //
      if ( y < 0 ) {
        return 0;
      }
      return this.getAirPressure( y );
    },

    // Called by the animation loop.
    step: function( dt ) {
      if ( this.isPlay ) {
        if ( this.speed === 'normal' ) {
          this.timer.step( dt );
          this.propagateParticles( dt);
        }
        else {
          this.timer.step( 0.33 * dt );
          this.propagateParticles( 0.33 * dt);
        }
      }
    },

    createParticles: function(dt) {

      var newParticle;


      this.newParticles = [];

//      while ( this.accumulatedDt > 0.2 ) {
      //       this.accumulatedDt -= 0.2;
      if ( this.isDotsVisible ) {
        /*var min = 0.1;
         var max = 1 - min;
         var range = max - min;*/
        var min = -35;
        var max = -23;
        var range = Math.abs( max - min );
        var y = Math.random() * range + min;

        //TODO: get minX for the pipe
        newParticle = new Particle( new Vector2( 0.4, y ), (y - min) / range, this.pipe, 0.04, 'red', false );
        this.flowParticles.push( newParticle );
        this.newParticles.push( newParticle );
        newParticle.step( dt );
      }


    },

    propagateParticles: function( dt ) {

      var x2;

      var particle;

      for ( var i = 0, k = this.flowParticles.length; i < k; i++ ) {

        if ( this.newParticles.indexOf( this.flowParticles.get( i ) ) === -1 ) {
          this.flowParticles.get( i ).step( dt );
        }

        particle = this.flowParticles.get( i );
        //Todo: get the velocity from the pipe and update the position
        x2 = particle.getX() + particle.container.getTweakedVx( particle.getX(), particle.getY() ) * dt;


        // check if the particle hit the maxX
        //TODO: get maxX for the pipe
        if ( x2 >= this.pipe.getMaxX() ) {
          this.particlesToRemove.push( particle );
        }
        else {
          particle.setX( x2 );
        }
      }

      for ( var j = 0, numberOfParticles = this.gridParticles.length; j < numberOfParticles; j++ ) {
        if ( this.newGridParticles.indexOf( this.gridParticles.get( j ) ) === -1 ) {
          this.gridParticles.get( j ).step( dt );
        }
        particle = this.gridParticles.get( j );
        //Todo: get the velocity from the pipe and update the position
        x2 = particle.getX() + particle.container.getTweakedVx( particle.getX(), particle.getY() ) * dt;

        // check if the particle hit the maxX
        //TODO: get maxX for the pipe
        if ( x2 >= this.pipe.getMaxX() ) {
          this.gridParticlesToRemove.push( particle );
        }
        else {
          particle.setX( x2 );
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
      //TODO: velocity can be measured at any position in the pipe. Not only on the particles
      /*var particles = this.flowParticles;

       for ( var i = 0, j = particles.length; i < j; i++ ) {
       if ( particles.get( i ).contains( new Vector2( x, y ) ) ) {
       return particles.get( i ).velocity;
       }
       }*/
      return this.pipe.getTweakedVelocity(x,y);
    },

    injectGridParticles: function() {
      //Todo: getMinX from pipe
      var x0 = /*pipe.getMinX()*/0.4 + 1E-6;
      var width = 0.75 / 2;

      //Todo: Use fraction like in the java version
      var yMin = -34;
      var yMax = -22;

      var delta = 0.1;
      var newGridParticle;
      for ( var x = x0; x <= x0 + width; x += delta ) {
        for ( var y = yMin + delta; y <= yMax - delta; y += delta * 14 ) {
          newGridParticle = new Particle( new Vector2( x, y ), 0.5, this.pipe, 0.02, 'black', true );
          this.gridParticles.push( newGridParticle );
          this.newGridParticles.push( newGridParticle );
        }
      }
    }
  } );
} );
