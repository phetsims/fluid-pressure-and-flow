// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * FaucetControlPanel
 * @author Siddhartha Chinthapally (Actual Concepts) on 7/5/2014.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Panel = require( 'SUN/Panel' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  // strings
  var manualString = require( 'string!FLUID_PRESSURE_AND_FLOW/manual' );
  var matchLeakageString = require( 'string!FLUID_PRESSURE_AND_FLOW/matchLeakage' );

  /**
   * Default constructor
   * @param {Property<String>} faucetModeProperty controls whether the faucet is operating in manual or match leakage mode
   * @param options
   * @constructor
   */
  function FaucetControlPanel( faucetModeProperty, options ) {
    var textOptions = {font: new PhetFont( 12 )};

    var faucetModeNode = new VBox( {
      children: [
        new AquaRadioButton( faucetModeProperty, 'manual', new Text( manualString, textOptions ), {radius: 8} ),
        new AquaRadioButton( faucetModeProperty, 'matchLeakage', new Text( matchLeakageString, textOptions ), {radius: 8} )
      ],
      spacing: 5,
      align: 'left'
    } );

    Panel.call( this, faucetModeNode, {
      fill: new LinearGradient( 0, 0, 0, 50 ).addColorStop( 0, '#9FDDF6' ).addColorStop( 1.0, '#0EB2E9' ),
      stroke: '#93BECD',
      linewidth: 1,
      cornerRadius: 5
    } );
    this.mutate( options );
  }

  return inherit( Panel, FaucetControlPanel );
} );