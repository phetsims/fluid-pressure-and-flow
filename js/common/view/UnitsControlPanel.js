// Copyright 2014-2015, University of Colorado Boulder

/**
 * Control panel for selecting unit systems. The available options are english, metric and atmospheres.
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // strings
  var metricString = require( 'string!FLUID_PRESSURE_AND_FLOW/metric' );
  var englishString = require( 'string!FLUID_PRESSURE_AND_FLOW/english' );
  var unitsString = require( 'string!FLUID_PRESSURE_AND_FLOW/units' );
  var atmospheresString = require( 'string!FLUID_PRESSURE_AND_FLOW/atmospheres' );

  /**
   *
   * @param {Property<string>} measureUnitsProperty can take values 'english', 'metric' or 'atmospheres'
   * @param {number} width -- fixed width that the panel is supposed to take
   * @param {Object} [options]
   * @constructor
   */
  function UnitsControlPanel( measureUnitsProperty, width, options ) {

    options = _.extend( {
      xMargin: 7,
      yMargin: 6,
      fill: '#f2fa6a',
      stroke: 'gray',
      lineWidth: 1,
      resize: false
    }, options );

    var titleText = new Text( unitsString, { font: new PhetFont( 12 ), fontWeight: 'bold', maxWidth: 80 } );

    var AQUA_RADIO_BUTTON_OPTIONS = { radius: 6, font: new PhetFont( 12 ), maxWidth: 100 };
    var createButtonTextNode = function( text ) { return new Text( text, { font: new PhetFont( 12 ) } ); };

    // Create the radio buttons
    var metricRadio = new AquaRadioButton( measureUnitsProperty, 'metric', createButtonTextNode( metricString ),
      AQUA_RADIO_BUTTON_OPTIONS );
    var atmosphereRadio = new AquaRadioButton( measureUnitsProperty, 'atmosphere',
      createButtonTextNode( atmospheresString ), AQUA_RADIO_BUTTON_OPTIONS );
    var englishRadio = new AquaRadioButton( measureUnitsProperty, 'english', createButtonTextNode( englishString ),
      AQUA_RADIO_BUTTON_OPTIONS );

    //dummy text for height
    var dummyText = new Text( '', { font: new PhetFont( 3 ) } );

    // touch areas
    var touchAreaDilation = 5;
    var maxRadioButtonWidth = _.max( [ metricRadio, atmosphereRadio, englishRadio ], function( item ) {
      return item.width;
    } ).width;

    //touch areas
    metricRadio.touchArea = new Bounds2(
      ( metricRadio.localBounds.minX - touchAreaDilation ),
      metricRadio.localBounds.minY,
      ( metricRadio.localBounds.minX + maxRadioButtonWidth ),
      metricRadio.localBounds.maxY
    );

    atmosphereRadio.touchArea = new Bounds2(
      ( atmosphereRadio.localBounds.minX - touchAreaDilation ),
      atmosphereRadio.localBounds.minY,
      ( atmosphereRadio.localBounds.minX + maxRadioButtonWidth ),
      atmosphereRadio.localBounds.maxY
    );

    englishRadio.touchArea = new Bounds2(
      ( englishRadio.localBounds.minX - touchAreaDilation ),
      englishRadio.localBounds.minY,
      ( englishRadio.localBounds.minX + maxRadioButtonWidth ),
      englishRadio.localBounds.maxY );

    // center the title by adding space before and after. Also ensures that the panel's width is 'width'
    var createTitle = function( item ) {
      var strutWidth = ( width - item.width ) / 2 - options.xMargin;
      return new HBox( { children: [ new HStrut( strutWidth ), item, new HStrut( strutWidth ) ] } );
    };

    var content = new VBox( {
      spacing: 4,
      children: [ createTitle( titleText ), metricRadio, atmosphereRadio, englishRadio, createTitle( dummyText ) ],
      align: 'left'
    } );

    Panel.call( this, content, options );
  }

  return inherit( Panel, UnitsControlPanel );
} );