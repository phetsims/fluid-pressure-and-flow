// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main file for the Under Pressure simulation.
 */
define( function( require ) {
  'use strict';

  // Imports
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // Strings
  var simTitle = require( 'string!UNDER_PRESSURE/under-pressure.name' );

  var simOptions = {
    credits: {
      leadDesign: 'Sam Reid',
      softwareDevelopment: 'Sam Reid, John Blanco',
      designTeam: 'Noah Podolefsky, Ariel Paul, Trish Loeblein, Kathy Perkins, Rachel Pepper',
      interviews: 'Ariel Paul'
    }
  };

  SimLauncher.launch( function() {

    // Create and start the sim
    new Sim( simTitle, [
    ], simOptions ).start();
  } );
} );
