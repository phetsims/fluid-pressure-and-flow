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
  var Bounds2 = require( 'DOT/Bounds2' );
  var UnderPressureModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/UnderPressureModel' );
  var UnderPressureView = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/UnderPressureView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );

  // images
  var underPressureScreenIcon = require( 'image!FLUID_PRESSURE_AND_FLOW/square-pool-icon.png' );

  // strings
  var underPressureScreenTitleString = require( 'string!FLUID_PRESSURE_AND_FLOW/underPressureScreenTitle' );

  function UnderPressureScreen() {
    Screen.call( this, underPressureScreenTitleString, new Image( underPressureScreenIcon ),
      function() { return new UnderPressureModel(); },
      function( model ) { return new UnderPressureView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, UnderPressureScreen );
} );