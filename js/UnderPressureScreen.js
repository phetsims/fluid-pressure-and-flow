// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * The screen (model + view) for the Under Pressure screen, which appears as a standalone sim in the "Under Pressure" sim
 * as well as the 1st screen in the "Fluid Pressure and Flow" sim.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var UnderPressureModel = require( 'UNDER_PRESSURE/common/model/UnderPressureModel' );
  var UnderPressureView = require( 'UNDER_PRESSURE/common/view/UnderPressureView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Screen = require( 'JOIST/Screen' );

  // images
  var underPressureScreenIcon = require( 'image!UNDER_PRESSURE/square-pool-icon.png' );

  function UnderPressureScreen( simTitle ) {
    Screen.call( this, simTitle, new Image( underPressureScreenIcon ),
      function() {
        return new UnderPressureModel( ScreenView.DEFAULT_LAYOUT_BOUNDS.width,
          ScreenView.DEFAULT_LAYOUT_BOUNDS.height );
      },
      function( model ) { return new UnderPressureView( model ); },
      { backgroundColor: null }
    );
  }

  return inherit( Screen, UnderPressureScreen );
} );