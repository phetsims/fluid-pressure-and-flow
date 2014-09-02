//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Units Control Panel' node.
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

  // strings
  var metricString = require( 'string!FLUID_PRESSURE_AND_FLOW/metric' );
  var englishString = require( 'string!FLUID_PRESSURE_AND_FLOW/english' );
  var unitsString = require( 'string!FLUID_PRESSURE_AND_FLOW/units' );

  /**
   *
   * @param {Property<string>} measureUnitsProperty can take values 'english' or 'metric'
   * @param {Number} width -- fixed width that the panel is supposed to take
   * @param options
   * @constructor
   */
  function UnitsControlPanel( measureUnitsProperty, width, options ) {

    options = _.extend( {
      xMargin: 14,
      yMargin: 4,
      fill: '#f2fa6a ',
      stroke: 'gray',
      lineWidth: 1,
      resize: false,
      scale: 0.9
    }, options );

    var textOptions = {font: new PhetFont( 12 )};

    var titleText = new Text( unitsString, {font: new PhetFont( 12 )} );
    var metricRadio = new AquaRadioButton( measureUnitsProperty, 'metric', new Text( metricString, textOptions ), {radius: 8, x: 17, y: 35} );
    var englishRadio = new AquaRadioButton( measureUnitsProperty, 'english', new Text( englishString, textOptions ), {radius: 8, x: 17, y: 60} );

    //dummy text for height
    var dummyText = new Text( '', {font: new PhetFont( 3 )} );

    // center the title by adding space before and after. Also ensures that the panel's width is 'width'
    var createTitle = function( item ) {
      var strutWidth = (width - item.width) / 2;
      return new HBox( { children: [ new HStrut( strutWidth+12 ), item, new HStrut( strutWidth )] } );
    };



    var content = new VBox( {
      spacing: 11,
      children: [createTitle( titleText ), metricRadio, englishRadio,createTitle( dummyText )],
      align: 'left'
    } );
    Panel.call( this, content, options );

  }

  return inherit( Panel, UnitsControlPanel );
} );