// Copyright 2014-2017, University of Colorado Boulder

/**
 * Control panel for selecting unit systems. The available options are english, metric and atmospheres.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const atmospheresString = require( 'string!FLUID_PRESSURE_AND_FLOW/atmospheres' );
  const englishString = require( 'string!FLUID_PRESSURE_AND_FLOW/english' );
  const metricString = require( 'string!FLUID_PRESSURE_AND_FLOW/metric' );
  const unitsString = require( 'string!FLUID_PRESSURE_AND_FLOW/units' );

  // constants
  const RADIO_BUTTON_TOUCH_DILATION_Y = 2; // empirically determined

  class UnitsControlPanel extends Panel {

    /**
     * @param {Property<string>} measureUnitsProperty can take values 'english', 'metric' or 'atmospheres'
     * @param {Object} [options]
     */
    constructor( measureUnitsProperty, options ) {

      options = _.extend( {
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

  return fluidPressureAndFlow.register( 'UnitsControlPanel', UnitsControlPanel );
} );