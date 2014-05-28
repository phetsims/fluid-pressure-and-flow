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
  var Image = require( 'SCENERY/nodes/Image' );

  // images
  var mockupImage = require( 'image!FLUID_PRESSURE_AND_FLOW/water-tower-mockup.png' );

  /**
   * @param {WaterTowerModel} model
   * @constructor
   */
  function WaterTowerScreenView( model ) {
    var thisView = this;
    ScreenView.call( thisView );

    // Add a mock-up from the Java version.
    //
    // Please note that this is to help line up elements in the play area, and some user interface components from the Sun repo will
    // be much bigger to make the sims usable on tablets.
    //
    // Also note, the sky and ground should extend to the sides of the browser window.  Please use OutsideBackgroundNode for this.
    this.addChild( new Image( mockupImage, {
      centerX: ScreenView.DEFAULT_LAYOUT_BOUNDS.centerX,
      centerY: ScreenView.DEFAULT_LAYOUT_BOUNDS.centerY,
      scale: ScreenView.DEFAULT_LAYOUT_BOUNDS.height / mockupImage.height,

      //Decrease the opacity so you can compare this to new elements that are being added
      opacity: 0.5
    } ) );
  }

  return inherit( ScreenView, WaterTowerScreenView );
} );