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
  var PipeControlPoint = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/PipeControlPoint' );
//  var Particle = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/Particle' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var FluidColorModel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/FluidColorModel' );
  var Units = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/Units' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Pipe = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/Pipe' );

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

    this.fluidDensityRange = new Range( Constants.GASOLINE_DENSITY, Constants.HONEY_DENSITY );
    this.flowRateRange = new Range( Constants.MIN_FLOW_RATE, Constants.MAX_FLOW_RATE );

    PropertySet.call( this, {
        isRulerVisible: false,
        isFluxMeterVisible: false,
        isDotsVisible: true,
        isFrictionEnabled: false,
        isPlay: true,//Whether the sim is paused or running
        measureUnits: 'metric', //metric, english
        fluidDensity: Constants.WATER_DENSITY,
        fluidFlowRate: 5000,
        fluxMeterPosition: new Vector2( 300, 110 ),
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

    // control points of pipe Flow line.
    this.pipeControlPoints = [new PipeControlPoint( -0.25, 9 ), new PipeControlPoint( 0.05, 9 ), new PipeControlPoint( 0.8, 9 ), new PipeControlPoint( 1.6, 9 ), new PipeControlPoint( 2.4, 9 ), new PipeControlPoint( 3.2, 9 ), new PipeControlPoint( 4, 9 ), new PipeControlPoint( 5.2, 9 ), new PipeControlPoint( 5.6, 1 ), new PipeControlPoint( 5.2, -10 ), new PipeControlPoint( 4, -10 ), new PipeControlPoint( 3.2, -10 ), new PipeControlPoint( 2.4, -10 ), new PipeControlPoint( 1.6, -10 ), new PipeControlPoint( 0.8, -10 ), new PipeControlPoint( 0.05, 1 ) ];
    this.pipeFlowLine = new Pipe( this.pipeControlPoints );

    this.flowParticles = new ObservableArray();
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
      this.pipeFlowLine.reset();
      this.flowParticles.clear();

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
    },

    stepInternal: function( dt ) {

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
      var particles = this.flowParticles;

      for ( var i = 0, j = particles.length; i < j; i++ ) {
        if ( particles.get( i ).contains( new Vector2( x, y ) ) ) {
          return particles.get( i ).velocity;
        }
      }
      return Vector2.ZERO;
    }
  } );
} );
