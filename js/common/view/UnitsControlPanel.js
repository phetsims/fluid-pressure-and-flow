// Copyright 2014-2022, University of Colorado Boulder

/**
 * Control panel for selecting unit systems. The available options are english, metric and atmospheres.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import Panel from '../../../../sun/js/Panel.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';

const atmospheresString = FluidPressureAndFlowStrings.atmospheres;
const englishString = FluidPressureAndFlowStrings.english;
const metricString = FluidPressureAndFlowStrings.metric;
const unitsString = FluidPressureAndFlowStrings.units;

// constants
const RADIO_BUTTON_TOUCH_DILATION_Y = 2; // empirically determined

class UnitsControlPanel extends Panel {

  /**
   * @param {Property.<string>} measureUnitsProperty can take values 'english', 'metric' or 'atmospheres'
   * @param {Object} [options]
   */
  constructor( measureUnitsProperty, options ) {

    options = merge( {
      fill: '#f2fa6a',
      stroke: 'gray',
      lineWidth: 1,
      resize: false,
      align: 'left'
    }, options );

    const maxControlWidth = ( options.maxWidth * 0.9 ) || 200; // the fallback value is fairly arbitrary

    const titleText = new Text( unitsString, {
      font: new PhetFont( 12 ),
      fontWeight: 'bold',
      maxWidth: maxControlWidth
    } );

    const AQUA_RADIO_BUTTON_OPTIONS = { radius: 6, font: new PhetFont( 12 ) };
    const createButtonTextNode = text => {
      return new Text( text, { font: new PhetFont( 12 ), maxWidth: maxControlWidth * 0.8 } );
    };

    // Create the radio buttons
    const metricRadio = new AquaRadioButton( measureUnitsProperty, 'metric', createButtonTextNode( metricString ),
      AQUA_RADIO_BUTTON_OPTIONS );
    const atmosphereRadio = new AquaRadioButton( measureUnitsProperty, 'atmosphere',
      createButtonTextNode( atmospheresString ), AQUA_RADIO_BUTTON_OPTIONS );
    const englishRadio = new AquaRadioButton( measureUnitsProperty, 'english', createButtonTextNode( englishString ),
      AQUA_RADIO_BUTTON_OPTIONS );

    //touch areas
    metricRadio.touchArea = metricRadio.bounds.dilatedY( RADIO_BUTTON_TOUCH_DILATION_Y );
    atmosphereRadio.touchArea = atmosphereRadio.bounds.dilatedY( RADIO_BUTTON_TOUCH_DILATION_Y );
    englishRadio.touchArea = englishRadio.bounds.dilatedY( RADIO_BUTTON_TOUCH_DILATION_Y );

    const content = new VBox( {
      spacing: 5,
      children: [ titleText, metricRadio, atmosphereRadio, englishRadio ],
      align: 'left'
    } );

    super( content, options );
  }
}

fluidPressureAndFlow.register( 'UnitsControlPanel', UnitsControlPanel );
export default UnitsControlPanel;