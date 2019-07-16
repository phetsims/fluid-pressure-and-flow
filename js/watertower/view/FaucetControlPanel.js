// Copyright 2014-2019, University of Colorado Boulder

/**
 * FaucetControlPanel
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 7/5/2014.
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const manualString = require( 'string!FLUID_PRESSURE_AND_FLOW/manual' );
  const matchLeakageString = require( 'string!FLUID_PRESSURE_AND_FLOW/matchLeakage' );

  class FaucetControlPanel extends VBox {

    /**
     * @param {Property.<string>} faucetModeProperty controls whether the faucet is operating in manual or match leakage mode
     * @param {Object} [options]
     */
    constructor( faucetModeProperty, options ) {
      const textOptions = { font: new PhetFont( 14 ) };
      const manualText = new Text( manualString, textOptions );
      const matchLeakageText = new Text( matchLeakageString, textOptions );

      super( {
        children: [
          new AquaRadioButton( faucetModeProperty, 'manual', manualText, { radius: 8 } ),
          new AquaRadioButton( faucetModeProperty, 'matchLeakage', matchLeakageText, { radius: 8 } )
        ],
        spacing: 5,
        align: 'left'
      } );

      this.mutate( options );
    }
  }

  return fluidPressureAndFlow.register( 'FaucetControlPanel', FaucetControlPanel );
} );