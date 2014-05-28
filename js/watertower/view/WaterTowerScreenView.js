//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Water Tower' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @param {WaterTowerModel} model
   * @constructor
   */
  function WaterTowerScreenView( model ) {
    var thisView = this;
    ScreenView.call( thisView );
  }

  return inherit( ScreenView, WaterTowerScreenView );
} );