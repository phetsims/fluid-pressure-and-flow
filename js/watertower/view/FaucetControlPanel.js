// Copyright 2014-2022, University of Colorado Boulder

/**
 * FaucetControlPanel
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 7/5/2014.
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';

const manualString = FluidPressureAndFlowStrings.manual;
const matchLeakageString = FluidPressureAndFlowStrings.matchLeakage;

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

fluidPressureAndFlow.register( 'FaucetControlPanel', FaucetControlPanel );
export default FaucetControlPanel;