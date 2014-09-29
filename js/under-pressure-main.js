// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main file for the Under Pressure simulation.
 */
define( function( require ) {
  'use strict';

  // Imports
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var UnderPressureModel = require( 'UNDER_PRESSURE/common/model/UnderPressureModel' );
  var UnderPressureView = require( 'UNDER_PRESSURE/common/view/UnderPressureView' );
  var UnderPressureScreen = require( 'UNDER_PRESSURE/UnderPressureScreen' );

  // Strings
  var simTitle = require( 'string!UNDER_PRESSURE/under-pressure.name' );

  var simOptions = {
    credits: {
      leadDesign: 'Sam Reid',
      softwareDevelopment: 'Sam Reid, John Blanco',
      team: 'Bryce Gruneich, Trish Loeblein, Ariel Paul, Kathy Perkins, Rachel Pepper, Noah Podolefsky',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team\nto convert this simulation to HTML5.'
    }
  };

  SimLauncher.launch( function() {
    // Create and start the sim
    //Create and start the sim
    new Sim( simTitle, [
      new UnderPressureScreen()
    ], simOptions ).start();
  } );
} );
