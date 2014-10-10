// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * The screen (model + view) for the Flow screen, which appears as the second screen in the "Fluid Pressure and Flow" sim.
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  // modules
  var FlowModel = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/FlowModel' );
  var FlowView = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/FlowView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );

  // images
  var flowScreenIcon = require( 'image!FLUID_PRESSURE_AND_FLOW/flow-mockup.jpg' );

  // strings
  var flowTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/flowScreenTitle' );

  function FlowScreen() {
    Screen.call( this, flowTitleString, new Image( flowScreenIcon ),
      function() { return new FlowModel(); },
      function( model ) { return new FlowView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, FlowScreen );
} );