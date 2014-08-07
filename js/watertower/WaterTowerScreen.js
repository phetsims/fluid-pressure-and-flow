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
  var WaterTowerView = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var waterTowerTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/waterTowerScreenTitle' );

  // images
  var waterTowerScreenIcon = require( 'image!FLUID_PRESSURE_AND_FLOW/water-tower-mockup.png' );

  function WaterTowerScreen() {
    Screen.call( this, waterTowerTitleString, new Image( waterTowerScreenIcon ),
      function() { return new WaterTowerModel(); },
      function( model ) { return new WaterTowerView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, WaterTowerScreen );
} );