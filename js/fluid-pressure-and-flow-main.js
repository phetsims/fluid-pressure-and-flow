// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var WaterTowerScreen = require( 'FLUID_PRESSURE_AND_FLOW/watertower/WaterTowerScreen' );
  var FlowScreen = require( 'FLUID_PRESSURE_AND_FLOW/flow/FlowScreen' );
  var UnderPressureScreen = require( 'UNDER_PRESSURE/UnderPressureScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var fluidPressureAndFlowTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluid-pressure-and-flow.title' );
  var underPressureScreenTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/underPressureScreenTitle' );

  var simOptions = {
    credits: {
      leadDesign: 'Sam Reid',
      softwareDevelopment: 'Sam Reid, John Blanco',
      team: 'Bryce Gruneich, Trish Loeblein, Ariel Paul, Kathy Perkins, Rachel Pepper, Noah Podolefsky',
      thanks: 'Thanks to Mobile Learner Labs and Actual Concepts for working with the PhET development team\nto convert this simulation to HTML5.',
      qualityAssurance: 'Steele Dalton, Oliver Nix, Oliver Orejola, Arnab Purkayastha,\n Amy Rouinfar, Bryan Yoelin'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( fluidPressureAndFlowTitleString, [
        new UnderPressureScreen( underPressureScreenTitleString ),
        new FlowScreen(),
        new WaterTowerScreen() ],
      simOptions );
    sim.start();
  } );
} );