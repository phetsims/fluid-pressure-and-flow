// Copyright 2014-2022, University of Colorado Boulder

/**
 * View for the atmosphere control options embedded within the control panel.
 * Contains on/off radio boxes and a border around the options with a title at the top left embedded within the border.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';

const atmosphereString = FluidPressureAndFlowStrings.atmosphere;
const offString = FluidPressureAndFlowStrings.off;
const onString = FluidPressureAndFlowStrings.on;

class AtmosphereControlNode extends Node {

  /**
   * @param {Property.<Boolean>} isAtmosphereProperty - to select atmosphere on/off
   * @param {Object} [options]
   */
  constructor( isAtmosphereProperty, options ) {

    // default options
    options = merge( {
      fill: '#f2fa6a',
      stroke: 'black',
      lineWidth: 1, // width of the background border
      xMargin: 5,
      yMargin: 6,
      cornerRadius: 5 // radius of the rounded corners on the background
    }, options );

    super();

    this.options = options;

    const radioButtonTextOptions = {
      font: new PhetFont( 12 ),
      maxWidth: ( options.maxWidth * 0.4 || Number.POSITIVE_INFINITY )
    };

    const atmosphereTrue = new AquaRadioButton( isAtmosphereProperty, true, new Text( onString, radioButtonTextOptions ), {
      radius: 6
    } );

    const atmosphereFalse = new AquaRadioButton( isAtmosphereProperty, false, new Text( offString, radioButtonTextOptions ), {
      radius: 6
    } );

    // touch areas, empirically determined
    atmosphereTrue.touchArea = atmosphereTrue.localBounds.dilatedXY( 4, 4 );
    atmosphereFalse.touchArea = atmosphereFalse.localBounds.dilatedXY( 4, 4 );

    this.contentNode = new HBox( {
      children: [ atmosphereTrue, atmosphereFalse ],
      spacing: 10
    } );

    const titleNode = new Text( atmosphereString, {
      font: new PhetFont( 14 ),
      fontWeight: 'bold',
      maxWidth: ( options.maxWidth * 0.9 || Number.POSITIVE_INFINITY )
    } );

    this.contentNode.top = titleNode.bottom + 5;
    this.addChild( titleNode );
    this.addChild( this.contentNode );

    this.mutate( this.options );
  }
}

fluidPressureAndFlow.register( 'AtmosphereControlNode', AtmosphereControlNode );
export default AtmosphereControlNode;