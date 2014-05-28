//  Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Water Tower' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var WaterTowerModel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/WaterTowerModel' );
  var WaterTowerScreenView = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var waterTowerTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/waterTowerScreenTitle' );

  function WaterTowerScreen() {
    Screen.call( this, waterTowerTitleString, null /* no icon, single-screen sim */,
      function() { return new WaterTowerModel(); },
      function( model ) { return new WaterTowerScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, WaterTowerScreen );
} );