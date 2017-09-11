// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Water Tower' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var WaterTowerModel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/WaterTowerModel' );
  var WaterTowerView = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerView' );

  // strings
  var waterTowerScreenTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/waterTowerScreenTitle' );

  // images
  var waterTowerScreenIcon = require( 'image!FLUID_PRESSURE_AND_FLOW/water-tower-mockup.png' );

  function WaterTowerScreen() {

    var options = {
      name: waterTowerScreenTitleString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new Image( waterTowerScreenIcon )
    };

    Screen.call( this,
      function() { return new WaterTowerModel(); },
      function( model ) { return new WaterTowerView( model ); },
      options
    );
  }

  fluidPressureAndFlow.register( 'WaterTowerScreen', WaterTowerScreen );

  return inherit( Screen, WaterTowerScreen );
} );
