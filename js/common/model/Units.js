// Copyright 2013-2017, University of Colorado Boulder

/**
 * Utility class for units conversion.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Util = require( 'DOT/Util' );

  // strings
  const atmString = require( 'string!FLUID_PRESSURE_AND_FLOW/atm' );
  const densityUnitsEnglishString = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsEnglish' );
  const densityUnitsMetricString = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsMetric' );
  const ftPerSPerSString = require( 'string!FLUID_PRESSURE_AND_FLOW/ftPerSPerS' );
  const kPaString = require( 'string!FLUID_PRESSURE_AND_FLOW/kPa' );
  const mPerSPerSString = require( 'string!FLUID_PRESSURE_AND_FLOW/mPerSPerS' );
  const psiString = require( 'string!FLUID_PRESSURE_AND_FLOW/psi' );
  const valueWithUnitsPatternString = require( 'string!FLUID_PRESSURE_AND_FLOW/valueWithUnitsPattern' );

  // constants
  const ATMOSPHERE_PER_PASCAL = 9.8692E-6;
  const PSI_PER_PASCAL = 145.04E-6;
  const FEET_PER_METER = 3.2808399;
  const GRAVITY_ENGLISH_PER_METRIC = 32.16 / 9.80665; //http://evaosd.fartoomuch.info/library/units.htm
  const FLUID_DENSITY_ENGLISH_PER_METRIC = 62.4 / 1000.0;

  const Units =  {

    FLUID_DENSITY_ENGLISH_PER_METRIC: FLUID_DENSITY_ENGLISH_PER_METRIC,
    FLUID_FlOW_RATE_ENGLISH_PER_METRIC: 35.3 / 1000,
    SQUARE_FEET_PER_SQUARE_METER: 10.7639,
    FEET_CUBE_PER_LITER: 0.0353146,
    FEET_PER_CENTIMETER: 0.0328,

    /**
     * Returns the pressure string with units after converting to the specified scale. Supports abbreviated values as well.
     * @param {number} pressure in Pascals
     * @param {string} measureUnits (english/metric/atmosphere)
     * @param {boolean} abbreviated value. Abbreviate to 1 decimal place for metric and 2 decimal places for others.
     * @returns {string}
     */
    getPressureString: function( pressure, measureUnits, abbreviated ) {
      if ( measureUnits === 'metric' ) {
        return StringUtils.format( valueWithUnitsPatternString, Util.toFixed( pressure / 1000, abbreviated ? 1 : 3 ), kPaString );
      }
      else if ( measureUnits === 'atmosphere' ) {
        return StringUtils.format( valueWithUnitsPatternString,
          Util.toFixed( pressure * ATMOSPHERE_PER_PASCAL, abbreviated ? 2 : 4 ), atmString );
      }
      else if ( measureUnits === 'english' ) {
        return StringUtils.format( valueWithUnitsPatternString,
          Util.toFixed( pressure * PSI_PER_PASCAL, abbreviated ? 2 : 4 ), psiString );
      }
    },

    /**
     * Returns the gravity string with units after converting to the specified scale
     * @param {number} gravity in metric units
     * @param {string} measureUnits (english/metric/atmosphere)
     * @returns {string}
     */
    getGravityString: function( gravity, measureUnits ) {

      if ( measureUnits === 'english' ) {
        return StringUtils.format( valueWithUnitsPatternString, Util.toFixed( GRAVITY_ENGLISH_PER_METRIC * gravity, 1 ),
          ftPerSPerSString );
      }
      else {
        return StringUtils.format( valueWithUnitsPatternString, Util.toFixed( gravity, 1 ), mPerSPerSString );
      }
    },

    /**
     * Returns the fluidDensity string with units after converting to the specified scale
     * @param {number} fluidDensity in metric units
     * @param {string} measureUnits (english/metric/atmosphere)
     * @returns {string}
     */
    getFluidDensityString: function( fluidDensity, measureUnits ) {
      let value;
      let units;
      if ( measureUnits === 'english' ) {
        value = FLUID_DENSITY_ENGLISH_PER_METRIC * fluidDensity;
        units = densityUnitsEnglishString;
      }
      else {
        value = fluidDensity;
        units = densityUnitsMetricString;
      }

      return StringUtils.format( valueWithUnitsPatternString, Util.toFixed( value, value >= 100 ? 0 : 1 ), units );
    },

    // converts feet to meters
    feetToMeters: function( feet ) {
      return feet / FEET_PER_METER;
    }
  };

  fluidPressureAndFlow.register( 'Units', Units );

  return Units;
} );