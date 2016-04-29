// Copyright 2014-2015, University of Colorado Boulder

/**
 * Control panel for selecting unit systems. The available options are english, metric and atmospheres.
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var metricString = require( 'string!FLUID_PRESSURE_AND_FLOW/metric' );
  var englishString = require( 'string!FLUID_PRESSURE_AND_FLOW/english' );
  var unitsString = require( 'string!FLUID_PRESSURE_AND_FLOW/units' );
  var atmospheresString = require( 'string!FLUID_PRESSURE_AND_FLOW/atmospheres' );

  // constants
  var RADIO_BUTTON_TOUCH_DILATION_Y = 2; // empirically determined

  /**
   *
   * @param {Property<string>} measureUnitsProperty can take values 'english', 'metric' or 'atmospheres'
   * @param {number} width -- fixed width that the panel is supposed to take
   * @param {Object} [options]
   * @constructor
   */
  function UnitsControlPanel( measureUnitsProperty, options ) {

    options = _.extend( {
      fill: '#f2fa6a',
      stroke: 'gray',
      lineWidth: 1,
      resize: false,
      align: 'left'
    }, options );

    var titleText = new Text( unitsString, { font: new PhetFont( 12 ), fontWeight: 'bold', maxWidth: 80 } );

    var AQUA_RADIO_BUTTON_OPTIONS = { radius: 6, font: new PhetFont( 12 ), maxWidth: 100 };
    var createButtonTextNode = function( text ) { return new Text( text, { font: new PhetFont( 12 ), maxWidth: 80 } ); };

    // Create the radio buttons
    var metricRadio = new AquaRadioButton( measureUnitsProperty, 'metric', createButtonTextNode( metricString ),
      AQUA_RADIO_BUTTON_OPTIONS );
    var atmosphereRadio = new AquaRadioButton( measureUnitsProperty, 'atmosphere',
      createButtonTextNode( atmospheresString ), AQUA_RADIO_BUTTON_OPTIONS );
    var englishRadio = new AquaRadioButton( measureUnitsProperty, 'english', createButtonTextNode( englishString ),
      AQUA_RADIO_BUTTON_OPTIONS );

    //touch areas
    metricRadio.touchArea = metricRadio.bounds.dilatedY( RADIO_BUTTON_TOUCH_DILATION_Y );
    atmosphereRadio.touchArea = atmosphereRadio.bounds.dilatedY( RADIO_BUTTON_TOUCH_DILATION_Y );
    englishRadio.touchArea = englishRadio.bounds.dilatedY( RADIO_BUTTON_TOUCH_DILATION_Y );

    var content = new VBox( {
      spacing: 5,
      children: [ titleText, metricRadio, atmosphereRadio, englishRadio ],
      align: 'left'
    } );

    Panel.call( this, content, options );
  }

  fluidPressureAndFlow.register( 'UnitsControlPanel', UnitsControlPanel );

  return inherit( Panel, UnitsControlPanel );
} );