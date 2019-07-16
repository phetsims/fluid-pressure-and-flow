// Copyright 2014-2017, University of Colorado Boulder

/**
 * The 'Water Tower' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const WaterTowerModel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/WaterTowerModel' );
  const WaterTowerScreenView = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerScreenView' );

  // strings
  const waterTowerScreenTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/waterTowerScreenTitle' );

  // images
  const waterTowerScreenIcon = require( 'image!FLUID_PRESSURE_AND_FLOW/water-tower-mockup.png' );

  class WaterTowerScreen extends Screen {

    constructor() {

      const options = {
        name: waterTowerScreenTitleString,
        backgroundColorProperty: new Property( 'white' ),
        homeScreenIcon: new Image( waterTowerScreenIcon )
      };

      super(
        () => { return new WaterTowerModel(); },
        model => { return new WaterTowerScreenView( model ); },
        options
      );
    }
  }

  return fluidPressureAndFlow.register( 'WaterTowerScreen', WaterTowerScreen );
} );
