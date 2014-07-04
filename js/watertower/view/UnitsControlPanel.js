//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Control Panel' node.
 *
 * @author Siddhartha Chinthapally (ActualConcepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Panel = require( 'SUN/Panel' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // strings
  var metricString = require( 'string!FLUID_PRESSURE_AND_FLOW/metric' );
  var englishString = require( 'string!FLUID_PRESSURE_AND_FLOW/english' );
  var unitsString = require( 'string!FLUID_PRESSURE_AND_FLOW/units' );

  function UnitsControlPanel( model, options ) {
    var textOptions = {font: new PhetFont( 14 )};
    var metrics = new VBox( {
      children: [
        new Text( unitsString, textOptions ),
        new AquaRadioButton( model.measureUnitsProperty, 'metric', new Text( metricString, textOptions ), {radius: 8} ),
        new AquaRadioButton( model.measureUnitsProperty, 'english', new Text( englishString, textOptions ), {radius: 8} )
      ],
      spacing: 5,
      align: 'left'
    } );

    Panel.call( this, metrics, { xMargin: 10, yMargin: 10, fill: '#f2fa6a ', stroke: 'gray', lineWidth: 1, resize: false, scale: 0.9 } );
    this.mutate( options );
  }

  return inherit( Panel, UnitsControlPanel );
} );