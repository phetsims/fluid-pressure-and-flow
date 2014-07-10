// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Constants used in this Sim
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/23/2014.
 */
define( function() {
  'use strict';

  return {
    EARTH_GRAVITY: 9.8,
    MIN_PRESSURE: 80000,
    MAX_PRESSURE: 130000,

    // density values of fluids in kg/cubic mt
    GASOLINE_DENSITY: 700,
    HONEY_DENSITY: 1420,
    WATER_DENSITY: 1000,

    // constants for air pressure in Pascals, Pascals is SI, see http://en.wikipedia.org/wiki/Atmospheric_pressure
    EARTH_AIR_PRESSURE: 101325,
    EARTH_AIR_PRESSURE_AT_500_FT: 99490
  };
} );