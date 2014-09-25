// Copyright (c) 2002 - 2014. University of Colorado Boulder

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
  var HStrut = require( 'SUN/HStrut' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // strings
  var metricString = require( 'string!UNDER_PRESSURE/metric' );
  var englishString = require( 'string!UNDER_PRESSURE/english' );
  var unitsString = require( 'string!UNDER_PRESSURE/units' );
  var atmospheresString = require( 'string!UNDER_PRESSURE/atmospheres' );

  /**
   *
   * @param {Property<string>} measureUnitsProperty can take values 'english' or 'metric'
   * @param {Number} width -- fixed width that the panel is supposed to take
   * @param options
   * @constructor
   */
  function UnitsControlPanel( measureUnitsProperty, width, options ) {

    options = _.extend( {
      xMargin: 7,
      yMargin: 4,
      fill: '#f2fa6a ',
      stroke: 'gray',
      lineWidth: 1,
      resize: false,
      scale: 0.9
    }, options );


    var textOptions = {font: new PhetFont( 14 )};

    var titleText = new Text( unitsString, { font: new PhetFont( 12 ), fontWeight: 'bold' } );
    var metricRadio = new AquaRadioButton( measureUnitsProperty, 'metric', new Text( metricString, textOptions ), { radius: 8 } );
    var atmosphereRadio = new AquaRadioButton( measureUnitsProperty, 'atmosphere', new Text( atmospheresString, textOptions ), { radius: 8 } );
    var englishRadio = new AquaRadioButton( measureUnitsProperty, 'english', new Text( englishString, textOptions ), { radius: 8 } );

    //dummy text for height
    var dummyText = new Text( '', { font: new PhetFont( 3 ) } );

    // touch areas
    var touchExpansion = 5;
    var maxRadioButtonWidth = _.max( [ metricRadio, atmosphereRadio, englishRadio  ], function( item ) {
      return item.width;
    } ).width;

    //touch areas
    metricRadio.touchArea = new Bounds2( metricRadio.localBounds.minX - touchExpansion, metricRadio.localBounds.minY, metricRadio.localBounds.minX + maxRadioButtonWidth, metricRadio.localBounds.maxY );
    atmosphereRadio.touchArea = new Bounds2( atmosphereRadio.localBounds.minX - touchExpansion, atmosphereRadio.localBounds.minY, atmosphereRadio.localBounds.minX + maxRadioButtonWidth, atmosphereRadio.localBounds.maxY );
    englishRadio.touchArea = new Bounds2( englishRadio.localBounds.minX - touchExpansion, englishRadio.localBounds.minY, englishRadio.localBounds.minX + maxRadioButtonWidth, englishRadio.localBounds.maxY );

    // center the title by adding space before and after. Also ensures that the panel's width is 'width'
    var createTitle = function( item ) {
      var strutWidth = ( width - item.width ) / 2;
      return new HBox( { children: [ new HStrut( strutWidth ), item, new HStrut( strutWidth ) ] } );
    };


    var content = new VBox( {
      spacing: 5,
      children: [ createTitle( titleText ), metricRadio, atmosphereRadio, englishRadio, createTitle( dummyText ) ],
      align: 'left'
    } );

    Panel.call( this, content, options );

  }

  return inherit( Panel, UnitsControlPanel );
} );