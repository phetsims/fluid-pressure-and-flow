// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import FlowScreen from './flow/FlowScreen.js';
import fluidPressureAndFlowStrings from './fluid-pressure-and-flow-strings.js';
import UnderPressureScreen from './under-pressure/UnderPressureScreen.js';
import WaterTowerScreen from './watertower/WaterTowerScreen.js';

const fluidPressureAndFlowTitleString = fluidPressureAndFlowStrings[ 'fluid-pressure-and-flow' ].title;

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

SimLauncher.launch( () => {
  const sim = new Sim( fluidPressureAndFlowTitleString, [
      new UnderPressureScreen(),
      new FlowScreen(),
      new WaterTowerScreen() ],
    simOptions );
  sim.start();
} );