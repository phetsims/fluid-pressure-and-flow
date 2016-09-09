// Copyright 2014-2015, University of Colorado Boulder

/**
 * The screen (model + view) for the Flow screen, which appears as the second screen in the "Fluid Pressure and Flow" sim.
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var FlowModel = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/FlowModel' );
  var FlowView = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/FlowView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );

  // images
  var flowScreenIcon = require( 'image!FLUID_PRESSURE_AND_FLOW/flow-mockup.png' );

  // strings
  var flowScreenTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/flowScreenTitle' );

  function FlowScreen() {

    var options = {
      name: flowScreenTitleString,
      backgroundColor: 'white',
      homeScreenIcon: new Image( flowScreenIcon )
    };

    Screen.call( this,
      function() { return new FlowModel(); },
      function( model ) { return new FlowView( model ); },
      options
    );
  }

  fluidPressureAndFlow.register( 'FlowScreen', FlowScreen );

  return inherit( Screen, FlowScreen );
} );