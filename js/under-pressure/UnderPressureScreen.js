// Copyright 2016-2019, University of Colorado Boulder

/**
 * The screen (model + view) for the Under Pressure screen, which appears as a standalone sim in the "Under Pressure" sim
 * as well as the 1st screen in the "Fluid Pressure and Flow" sim.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const UnderPressureModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/UnderPressureModel' );
  const UnderPressureScreenView = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/UnderPressureScreenView' );

  // images
  const underPressureScreenIcon = require( 'image!FLUID_PRESSURE_AND_FLOW/under-pressure.png' );

  // strings
  const underPressureScreenTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/underPressureScreenTitle' );

  class UnderPressureScreen extends Screen {

    constructor() {

      const options = {
        name: underPressureScreenTitleString,
        backgroundColorProperty: new Property( 'white' ),
        homeScreenIcon: new Image( underPressureScreenIcon )
      };

      super(
        () => { return new UnderPressureModel(); },
        model => { return new UnderPressureScreenView( model ); },
        options
      );
    }
  }

  return fluidPressureAndFlow.register( 'UnderPressureScreen', UnderPressureScreen );
} );
