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
  var UnderPressureModel = require( 'UNDER_PRESSURE/common/model/UnderPressureModel' );
  var UnderPressureView = require( 'UNDER_PRESSURE/common/view/UnderPressureView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );

  // images
  var underPressureScreenIcon = require( 'image!UNDER_PRESSURE/square-pool-icon.png' );
  var underPressureNavigationBarIcon = require( 'image!UNDER_PRESSURE/under-pressure-navbar-icon.png' );

  // constants
  var LAYOUT_BOUNDS = new Bounds2( 0, 0, 768, 504 );

  function UnderPressureScreen( simTitle ) {
    Screen.call( this, simTitle, new Image( underPressureScreenIcon ),
      function() {
        return new UnderPressureModel( LAYOUT_BOUNDS.width, LAYOUT_BOUNDS.height );
      },
      function( model ) { return new UnderPressureView( model ); },

      // Workaround for triggering a black navigation bar
      {
        backgroundColor: 'white',
        navigationBarIcon: new Image( underPressureNavigationBarIcon )
      }
    );
  }

  return inherit( Screen, UnderPressureScreen );
} );