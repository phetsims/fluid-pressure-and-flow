// Copyright 2013-2015, University of Colorado Boulder

/**
 * Main file for the Under Pressure simulation.
 */
define( function( require ) {
  'use strict';

  // modules
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var UnderPressureScreen = require( 'UNDER_PRESSURE/UnderPressureScreen' );

  // strings
  var simTitle = require( 'string!UNDER_PRESSURE/under-pressure.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Sam Reid',
      softwareDevelopment: 'Sam Reid, John Blanco',
      team: 'Bryce Gruneich, Trish Loeblein, Ariel Paul, Kathy Perkins, Rachel Pepper, Noah Podolefsky',
      thanks: 'Thanks to Mobile Learner Labs and Actual Concepts for working with the PhET development team\nto convert this simulation to HTML5.'
    }
  };

  SimLauncher.launch( function() {

    // Create and start the sim
    new Sim( simTitle, [
      new UnderPressureScreen( simTitle )
    ], simOptions ).start();
  } );
} );
