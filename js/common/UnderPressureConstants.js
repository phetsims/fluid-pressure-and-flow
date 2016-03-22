// Copyright 2014-2015, University of Colorado Boulder

/**
 * Constants used in this Sim.  All units are SI (mks) unless otherwise specified.
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function() {
  'use strict';

  return {

    EARTH_GRAVITY: 9.8,
    MARS_GRAVITY: 3.71,
    JUPITER_GRAVITY: 24.9,

    // in Pascals
    MIN_PRESSURE: 50000,
    MAX_PRESSURE: 350000,

    // flow rate values in liter/sec
    MIN_FLOW_RATE: 1000,
    MAX_FLOW_RATE: 10000,

    // density values of fluids in kg/cubic meter
    GASOLINE_DENSITY: 700,
    HONEY_DENSITY: 1420,
    WATER_DENSITY: 1000,

    // constants for air pressure in Pascals, Pascals is SI, see http://en.wikipedia.org/wiki/Atmospheric_pressure
    EARTH_AIR_PRESSURE: 101325,
    EARTH_AIR_PRESSURE_AT_500_FT: 99490
  };
} );