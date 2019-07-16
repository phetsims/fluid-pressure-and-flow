// Copyright 2014-2017, University of Colorado Boulder

/**
 * The screen (model + view) for the Flow screen, which appears as the second screen in the "Fluid Pressure and Flow" sim.
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( require => {
  'use strict';

  // modules
  const FlowModel = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/FlowModel' );
  const FlowScreenView = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/FlowScreenView' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const flowScreenIcon = require( 'image!FLUID_PRESSURE_AND_FLOW/flow-mockup.png' );

  // strings
  const flowScreenTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/flowScreenTitle' );

  function FlowScreen() {

    const options = {
      name: flowScreenTitleString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new Image( flowScreenIcon )
    };

    Screen.call( this,
      function() { return new FlowModel(); },
      function( model ) { return new FlowScreenView( model ); },
      options
    );
  }

  fluidPressureAndFlow.register( 'FlowScreen', FlowScreen );

  return inherit( Screen, FlowScreen );
} );
