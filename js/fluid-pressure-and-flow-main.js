// Copyright 2002-2014, University of Colorado Boulder

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
  var simTitle = require( 'string!FLUID_PRESSURE_AND_FLOW/fluid-pressure-and-flow.name' );
  var underPressureTitle = require( 'string!FLUID_PRESSURE_AND_FLOW/under-pressure.name' );

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
    var sim = new Sim( simTitle, [
        new UnderPressureScreen( underPressureTitle ),
        new FlowScreen(),
        new WaterTowerScreen() ],
      simOptions );
    sim.start();
  } );
} );