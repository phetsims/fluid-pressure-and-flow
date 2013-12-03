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
  var ScreenView = require( 'JOIST/ScreenView' );
  var SquarePoolModel = require( 'square-pool/model/SquarePoolModel' );
  var SquarePoolView = require( 'square-pool/view/SquarePoolView' );
  var TrapezoidPoolModel = require( 'trapezoid-pool/model/TrapezoidPoolModel' );
  var TrapezoidPoolView = require( 'trapezoid-pool/view/TrapezoidPoolView' );
  var ChamberPoolModel = require( 'chamber-pool/model/ChamberPoolModel' );
  var ChamberPoolView = require( 'chamber-pool/view/ChamberPoolView' );

  var squarePoolIcon = require( "image!UNDER_PRESSURE/square-pool-icon.png" );
  var trapezoidPoolIcon = require( "image!UNDER_PRESSURE/trapezoid-pool-icon.png" );
  var chamberPoolIcon = require( "image!UNDER_PRESSURE/chamber-pool-icon.png" );

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
      new Screen( "", new Image( squarePoolIcon ),
        function() {return new SquarePoolModel( ScreenView.LAYOUT_BOUNDS.width, ScreenView.LAYOUT_BOUNDS.height );},
        function( model ) {return new SquarePoolView( model );},
        { backgroundColor: '#fff' }
      ),
       new Screen( "", new Image(trapezoidPoolIcon),
       function() {return new TrapezoidPoolModel( ScreenView.LAYOUT_BOUNDS.width, ScreenView.LAYOUT_BOUNDS.height );},
       function( model ) {return new TrapezoidPoolView( model );},
       { backgroundColor: '#fff' }
       ),
      new Screen( "", new Image(chamberPoolIcon),
        function() {return new ChamberPoolModel( ScreenView.LAYOUT_BOUNDS.width, ScreenView.LAYOUT_BOUNDS.height );},
        function( model ) {return new ChamberPoolView( model );},
        { backgroundColor: '#fff' })
    ], simOptions ).start();
  } );
} );
