// Copyright 2014-2017, University of Colorado Boulder

/**
 * The 'Water Tower' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const WaterTowerModel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/WaterTowerModel' );
  const WaterTowerView = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerView' );

  // strings
  const waterTowerScreenTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/waterTowerScreenTitle' );

  // images
  const waterTowerScreenIcon = require( 'image!FLUID_PRESSURE_AND_FLOW/water-tower-mockup.png' );

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
