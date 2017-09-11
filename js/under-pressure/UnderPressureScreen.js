// Copyright 2014-2015, University of Colorado Boulder

/**
 * The screen (model + view) for the Under Pressure screen, which appears as a standalone sim in the "Under Pressure" sim
 * as well as the 1st screen in the "Fluid Pressure and Flow" sim.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var UnderPressureModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/UnderPressureModel' );
  var UnderPressureView = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/UnderPressureView' );

  // images
  var underPressureScreenIcon = require( 'image!FLUID_PRESSURE_AND_FLOW/under-pressure.png' );

  // strings
  var underPressureScreenTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/underPressureScreenTitle' );

  function UnderPressureScreen() {

    var options = {
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
