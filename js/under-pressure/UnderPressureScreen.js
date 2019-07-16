// Copyright 2016-2017, University of Colorado Boulder

/**
 * The screen (model + view) for the Under Pressure screen, which appears as a standalone sim in the "Under Pressure" sim
 * as well as the 1st screen in the "Fluid Pressure and Flow" sim.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const UnderPressureModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/UnderPressureModel' );
  const UnderPressureView = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/UnderPressureView' );

  // images
  const underPressureScreenIcon = require( 'image!FLUID_PRESSURE_AND_FLOW/under-pressure.png' );

  // strings
  const underPressureScreenTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/underPressureScreenTitle' );

  function UnderPressureScreen() {

    const options = {
      name: underPressureScreenTitleString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new Image( underPressureScreenIcon )
    };

    Screen.call( this,
      function() { return new UnderPressureModel(); },
      function( model ) { return new UnderPressureView( model ); },
      options
    );
  }

  fluidPressureAndFlow.register( 'UnderPressureScreen', UnderPressureScreen );

  return inherit( Screen, UnderPressureScreen );
} );
