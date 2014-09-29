//  Copyright 2002-2014, University of Colorado Boulder

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

  var simOptions = {
    credits: {
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new UnderPressureScreen(), new FlowScreen(), new WaterTowerScreen()  ], simOptions );
    sim.start();
  } );
} );