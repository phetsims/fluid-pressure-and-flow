// Copyright 2002-2013, University of Colorado Boulder

/**
 * main ScreenView container for square pool.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  "use strict";
  var inherit = require( "PHET_CORE/inherit" );
  var SquarePoolView = require( "UNDER_PRESSURE/square-pool/view/SquarePoolView" );
  var ComboBox = require( 'SUN/ComboBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );


  function MysteryPoolView( model ) {
    var self = this;
    SquarePoolView.call( this, model );


    // items
    var items = [
      ComboBox.createItem( new Text( "Planet A", { font: new PhetFont( 14 )} ), "gravity" ),
      ComboBox.createItem( new Text( "Fluid A", { font: new PhetFont( 14 )} ), "fluidDensity" )
    ];

    this.addChild( new ComboBox( items, model.globalModel.mysteryChoiceProperty, self, {
      itemHighlightFill: 'rgb(218,255,255)',
      y: 230,
      x: 485
    } ) );

  }

  return inherit( SquarePoolView, MysteryPoolView );
} );