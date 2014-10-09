//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Units Control Panel' node for selecting between metric and english modes.
 *
 * @author Siddhartha Chinthapally (ActualConcepts)
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
  var HStrut = require( 'SUN/HStrut' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // strings
  var metricString = require( 'string!FLUID_PRESSURE_AND_FLOW/metric' );
  var englishString = require( 'string!FLUID_PRESSURE_AND_FLOW/english' );
  var unitsString = require( 'string!FLUID_PRESSURE_AND_FLOW/units' );

  /**
   * Constructor for the UnitsControlPanel.
   * @param {Property<string>} measureUnitsProperty can take values 'english' or 'metric'
   * @param {Number} width -- fixed width that the panel is supposed to take
   * @param {Object} options for various panel display properties.
   * @constructor
   */
  function UnitsControlPanel( measureUnitsProperty, width, options ) {

    options = _.extend( {
      xMargin: 14,
      yMargin: 4,
      fill: '#f2fa6a ',
      fontSize: 12,
      stroke: 'gray',
      lineWidth: 1,
      resize: false,
      scale: 0.9
    }, options );

    var textOptions = { font: new PhetFont( options.fontSize ) };

    var titleText = new Text( unitsString, { font: new PhetFont( options.fontSize ) } );
    var metricRadio = new AquaRadioButton( measureUnitsProperty, 'metric', new Text( metricString, textOptions ),
      { radius: 8 } );
    var englishRadio = new AquaRadioButton( measureUnitsProperty, 'english', new Text( englishString, textOptions ),
      { radius: 8 } );

    //dummy text for height
    var dummyText = new Text( '', {font: new PhetFont( 3 )} );
    var maxOptionWidth = (metricRadio.width > englishRadio.width) ? metricRadio.width : englishRadio.width;

    // touch areas
    var touchExpansion = 5;
    metricRadio.touchArea = new Bounds2( metricRadio.localBounds.minX - touchExpansion,
        metricRadio.localBounds.minY - touchExpansion, metricRadio.localBounds.minX + maxOptionWidth + touchExpansion,
        metricRadio.localBounds.maxY + touchExpansion );
    englishRadio.touchArea = new Bounds2( englishRadio.localBounds.minX - touchExpansion,
        englishRadio.localBounds.minY - touchExpansion, englishRadio.localBounds.minX + maxOptionWidth + touchExpansion,
        englishRadio.localBounds.maxY + touchExpansion );

    // center the title by adding space before and after. Also ensures that the panel's width is 'width'
    var createTitle = function( item ) {
      var strutWidth = (width - item.width) / 2;
      return new HBox( { children: [ new HStrut( strutWidth ), item, new HStrut( strutWidth )] } );
    };


    var content = new VBox( {
      spacing: 11,
      children: [createTitle( titleText ), metricRadio, englishRadio, createTitle( dummyText )],
      align: 'left'
    } );

    Panel.call( this, content, options );
  }

  return inherit( Panel, UnitsControlPanel );
} );