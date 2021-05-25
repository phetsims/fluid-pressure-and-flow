// Copyright 2014-2021, University of Colorado Boulder

/**
 * Function that gets the standard air pressure as a function of height, see below.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import Constants from '../Constants.js';

/**
 * Calculates the standard air pressure by linearly extrapolating the known values for height = 0m & height = 150m
 * @param {number} height (in meters) at which the air pressure needs to be calculated
 * @returns {number} standard air pressure at the specified height from ground
 */
const getStandardAirPressure = height => Utils.linear( 0, 150, Constants.EARTH_AIR_PRESSURE,
  Constants.EARTH_AIR_PRESSURE_AT_500_FT, height );

fluidPressureAndFlow.register( 'getStandardAirPressure', getStandardAirPressure );

export default getStandardAirPressure;