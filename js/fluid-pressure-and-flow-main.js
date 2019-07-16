// Copyright 2014-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const FlowScreen = require( 'FLUID_PRESSURE_AND_FLOW/flow/FlowScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const UnderPressureScreen = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/UnderPressureScreen' );
  const WaterTowerScreen = require( 'FLUID_PRESSURE_AND_FLOW/watertower/WaterTowerScreen' );

  // strings
  const fluidPressureAndFlowTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluid-pressure-and-flow.title' );

  const simOptions = {
    credits: {
      leadDesign: 'Sam Reid',
      softwareDevelopment: 'Sam Reid, John Blanco',
      team: 'Bryce Gruneich, Trish Loeblein, Ariel Paul, Kathy Perkins, Rachel Pepper, Noah Podolefsky',
      thanks: 'Thanks to Mobile Learner Labs and Actual Concepts for working with the PhET development team to convert ' +
              'this simulation to HTML5.',
      qualityAssurance: 'Steele Dalton, Oliver Nix, Oliver Orejola, Arnab Purkayastha, Amy Rouinfar, Bryan Yoelin'
    }
  };

  SimLauncher.launch( function() {
    const sim = new Sim( fluidPressureAndFlowTitleString, [
        new UnderPressureScreen(),
        new FlowScreen(),
        new WaterTowerScreen() ],
      simOptions );
    sim.start();
  } );
} );