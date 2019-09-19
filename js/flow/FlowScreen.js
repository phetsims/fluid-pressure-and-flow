// Copyright 2014-2019, University of Colorado Boulder

/**
 * The Flow screen, which appears as the second screen in the "Fluid Pressure and Flow" sim.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const FlowModel = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/FlowModel' );
  const FlowScreenView = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/FlowScreenView' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const flowScreenIcon = require( 'image!FLUID_PRESSURE_AND_FLOW/flow-mockup.png' );

  // strings
  const flowScreenTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/flowScreenTitle' );

  class FlowScreen extends Screen {

    constructor() {

      const options = {
        name: flowScreenTitleString,
        backgroundColorProperty: new Property( 'white' ),
        homeScreenIcon: new Image( flowScreenIcon )
      };

      super(
        () => new FlowModel(),
        model => new FlowScreenView( model ),
        options
      );
    }
  }

  return fluidPressureAndFlow.register( 'FlowScreen', FlowScreen );
} );
