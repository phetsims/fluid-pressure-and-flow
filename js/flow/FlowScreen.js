// Copyright 2014-2015, University of Colorado Boulder

/**
 * The screen (model + view) for the Flow screen, which appears as the second screen in the "Fluid Pressure and Flow" sim.
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  // modules
  var FlowModel = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/FlowModel' );
  var FlowScreenView = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/FlowScreenView' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // images
  var flowScreenIcon = require( 'image!FLUID_PRESSURE_AND_FLOW/flow-mockup.png' );

  // strings
  var flowScreenTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/flowScreenTitle' );

  function FlowScreen() {

    var options = {
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
