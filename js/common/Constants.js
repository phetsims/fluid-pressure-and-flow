// Copyright 2014-2020, University of Colorado Boulder

/**
 * Constants used in this Sim. All units are SI (mks) unless otherwise specified.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import fluidPressureAndFlow from '../fluidPressureAndFlow.js';

const Constants = {

  SCREEN_VIEW_OPTIONS: { layoutBounds: new Bounds2( 0, 0, 768, 504 ) },

  EARTH_GRAVITY: 9.8, // m/s^2
  MARS_GRAVITY: 3.71, // m/s^2
  JUPITER_GRAVITY: 24.79, // m/s^2
  MIN_PRESSURE: 50000, // Pascals
  MAX_PRESSURE: 250000, // Pascals Check is it is 350000

  MIN_FLOW_RATE: 1000, // Liter per second (L/s)
  MAX_FLOW_RATE: 10000, // Liter per second (L/s)

  MAX_POOL_HEIGHT: 3,

  // density values of fluids in kg/cubic mt
  GASOLINE_DENSITY: 700,
  HONEY_DENSITY: 1420,
  WATER_DENSITY: 1000,

  // constants for air pressure in Pascals, Pascals is SI, see http://en.wikipedia.org/wiki/Atmospheric_pressure
  EARTH_AIR_PRESSURE: 101325,
  EARTH_AIR_PRESSURE_AT_500_FT: 99490
};

fluidPressureAndFlow.register( 'Constants', Constants );

export default Constants;