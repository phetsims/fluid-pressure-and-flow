// Copyright 2014-2017, University of Colorado Boulder

/**
 * Function that gets the standard air pressure as a function of height, see below.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Util = require( 'DOT/Util' );

  /**
   * Calculates the standard air pressure by linearly extrapolating the known values for height = 0m & height = 150m
   * @param {number} height (in meters) at which the air pressure needs to be calculated
   * @returns {number} standard air pressure at the specified height from ground
   */
  const getStandardAirPressure = function( height ) {
    //Note: 150 meters is 500 feet
    return Util.linear( 0, 150, Constants.EARTH_AIR_PRESSURE,
      Constants.EARTH_AIR_PRESSURE_AT_500_FT, height );
  };

  fluidPressureAndFlow.register( 'getStandardAirPressure', getStandardAirPressure );

  return getStandardAirPressure;
} );