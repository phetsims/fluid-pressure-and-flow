// Copyright 2013-2022, University of Colorado Boulder

/**
 * Utility methods for units conversion.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Utils from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';

const atmString = FluidPressureAndFlowStrings.atm;
const densityUnitsEnglishString = FluidPressureAndFlowStrings.densityUnitsEnglish;
const densityUnitsMetricString = FluidPressureAndFlowStrings.densityUnitsMetric;
const ftPerSPerSString = FluidPressureAndFlowStrings.ftPerSPerS;
const kPaString = FluidPressureAndFlowStrings.kPa;
const mPerSPerSString = FluidPressureAndFlowStrings.mPerSPerS;
const psiString = FluidPressureAndFlowStrings.psi;
const valueWithUnitsPatternString = FluidPressureAndFlowStrings.valueWithUnitsPattern;

// constants
const ATMOSPHERE_PER_PASCAL = 9.8692E-6;
const PSI_PER_PASCAL = 145.04E-6;
const FEET_PER_METER = 3.2808399;
const GRAVITY_ENGLISH_PER_METRIC = 32.16 / 9.80665; //http://evaosd.fartoomuch.info/library/units.htm
const FLUID_DENSITY_ENGLISH_PER_METRIC = 62.4 / 1000.0;

const Units = {

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
  getPressureString( pressure, measureUnits, abbreviated ) {
    if ( measureUnits === 'metric' ) {
      return StringUtils.format( valueWithUnitsPatternString, Utils.toFixed( pressure / 1000, abbreviated ? 1 : 3 ), kPaString );
    }
    else if ( measureUnits === 'atmosphere' ) {
      return StringUtils.format( valueWithUnitsPatternString,
        Utils.toFixed( pressure * ATMOSPHERE_PER_PASCAL, abbreviated ? 2 : 4 ), atmString );
    }
    else if ( measureUnits === 'english' ) {
      return StringUtils.format( valueWithUnitsPatternString,
        Utils.toFixed( pressure * PSI_PER_PASCAL, abbreviated ? 2 : 4 ), psiString );
    }
    else {
      throw new Error( `illegal measurement units: ${measureUnits}` );
    }
  },

  /**
   * Returns the gravity string with units after converting to the specified scale
   * @param {number} gravity in metric units
   * @param {string} measureUnits (english/metric/atmosphere)
   * @returns {string}
   */
  getGravityString( gravity, measureUnits ) {

    if ( measureUnits === 'english' ) {
      return StringUtils.format( valueWithUnitsPatternString, Utils.toFixed( GRAVITY_ENGLISH_PER_METRIC * gravity, 1 ),
        ftPerSPerSString );
    }
    else {
      return StringUtils.format( valueWithUnitsPatternString, Utils.toFixed( gravity, 1 ), mPerSPerSString );
    }
  },

  /**
   * Returns the fluidDensity string with units after converting to the specified scale
   * @param {number} fluidDensity in metric units
   * @param {string} measureUnits (english/metric/atmosphere)
   * @returns {string}
   */
  getFluidDensityString( fluidDensity, measureUnits ) {
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

    return StringUtils.format( valueWithUnitsPatternString, Utils.toFixed( value, value >= 100 ? 0 : 1 ), units );
  },

  // converts feet to meters
  feetToMeters( feet ) {
    return feet / FEET_PER_METER;
  }
};

fluidPressureAndFlow.register( 'Units', Units );
export default Units;