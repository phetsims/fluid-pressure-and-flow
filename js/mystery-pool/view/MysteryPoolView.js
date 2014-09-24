// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for mystery pool which is based on square pool.
 * Mystery pool has one of gravity/fluidDensity controls with a question mark and a random gravity/fluidDensity is used
 * for the hidden control. The objective is to figure out the hidden value.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SquarePoolView = require( 'UNDER_PRESSURE/square-pool/view/SquarePoolView' );
  var MysteryPoolControls = require( 'UNDER_PRESSURE/mystery-pool/view/MysteryPoolControls' );

  /**
   * @param {MysteryPoolModel} mysteryPoolModel of the simulation
   * @param {ModelViewTransform2 } modelViewTransform to convert between model and view co-ordinates
   * @constructor
   */
  function MysteryPoolView( mysteryPoolModel, modelViewTransform ) {

    SquarePoolView.call( this, mysteryPoolModel, modelViewTransform );
    this.mysteryPoolControls = new MysteryPoolControls( mysteryPoolModel );
    this.addChild( this.mysteryPoolControls );

  }

  return inherit( SquarePoolView, MysteryPoolView );
} );