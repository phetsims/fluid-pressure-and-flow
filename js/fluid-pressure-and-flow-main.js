// Copyright 2014-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import FlowScreen from './flow/FlowScreen.js';
import FluidPressureAndFlowStrings from './FluidPressureAndFlowStrings.js';
import UnderPressureScreen from './under-pressure/UnderPressureScreen.js';
import WaterTowerScreen from './watertower/WaterTowerScreen.js';

const fluidPressureAndFlowTitleStringProperty = FluidPressureAndFlowStrings[ 'fluid-pressure-and-flow' ].titleStringProperty;

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

simLauncher.launch( () => {
  const sim = new Sim( fluidPressureAndFlowTitleStringProperty, [
      new UnderPressureScreen(),
      new FlowScreen(),
      new WaterTowerScreen() ],
    simOptions );
  sim.start();
} );