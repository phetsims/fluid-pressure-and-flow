// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view  for mystery pool. Based on square pool view.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  "use strict";
  var inherit = require( "PHET_CORE/inherit" );
  var SquarePoolView = require( "UNDER_PRESSURE/square-pool/view/SquarePoolView" );
  var MysteryPoolControls = require( "UNDER_PRESSURE/mystery-pool/view/MysteryPoolControls" );

  function MysteryPoolView( model, mvt ) {
    SquarePoolView.call( this, model, mvt );

    var mysteryPoolControls = new MysteryPoolControls( model );
    this.addChild( mysteryPoolControls );

    this.resizeChoicePanel = function( width ) {
      mysteryPoolControls.resizeWidth( width );
    };

  }

  return inherit( SquarePoolView, MysteryPoolView );
} );