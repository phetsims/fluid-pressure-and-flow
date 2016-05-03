// Copyright 2014-2015, University of Colorado Boulder

/**
 * FaucetControlPanel
 * @author Siddhartha Chinthapally (Actual Concepts) on 7/5/2014.
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // strings
  var manualString = require( 'string!FLUID_PRESSURE_AND_FLOW/manual' );
  var matchLeakageString = require( 'string!FLUID_PRESSURE_AND_FLOW/matchLeakage' );

  /**
   * Default constructor
   * @param {Property.<string>} faucetModeProperty controls whether the faucet is operating in manual or match leakage mode
   * @param {Object} [options]
   * @constructor
   */
  function FaucetControlPanel( faucetModeProperty, options ) {
    var textOptions = { font: new PhetFont( 14 ) };
    var manualText = new Text( manualString, textOptions );
    var matchLeakageText = new Text( matchLeakageString, textOptions );

    VBox.call( this, {
      children: [
        new AquaRadioButton( faucetModeProperty, 'manual', manualText, { radius: 8 } ),
        new AquaRadioButton( faucetModeProperty, 'matchLeakage', matchLeakageText, { radius: 8 } )
      ],
      spacing: 5,
      align: 'left'
    } );

    this.mutate( options );
  }

  fluidPressureAndFlow.register( 'FaucetControlPanel', FaucetControlPanel );

  return inherit( VBox, FaucetControlPanel );
} );