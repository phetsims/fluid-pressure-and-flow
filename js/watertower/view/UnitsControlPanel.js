//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Control Panel' node.
 *
 * @author Siddhartha Chinthapally (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Panel = require( 'SUN/Panel' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var metricString = require( 'string!FLUID_PRESSURE_AND_FLOW/metric' );
  var englishString = require( 'string!FLUID_PRESSURE_AND_FLOW/english' );
  var unitsString = require( 'string!FLUID_PRESSURE_AND_FLOW/units' );

  function UnitsControlPanel( model, x, y ) {
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

    this.resizeWidth = function( maxWidth ) {
      metrics.updateWidth( maxWidth );
    };

    Panel.call( this, metrics, { xMargin: 10, yMargin: 10, fill: '#f2fa6a ', stroke: 'gray', lineWidth: 1, resize: false, x: x, y: y, scale: 0.9 } );
  }

  return inherit( Node, UnitsControlPanel );
} );