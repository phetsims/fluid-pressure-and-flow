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
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );

  // strings
  var metricString = require( 'string!FLUID_PRESSURE_AND_FLOW/metric' );
  var englishString = require( 'string!FLUID_PRESSURE_AND_FLOW/english' );
  var unitsString = require( 'string!FLUID_PRESSURE_AND_FLOW/units' );

  function UnitsControlPanel( model, options ) {
    Node.call( this, {cursor: 'pointer'} );

    var textOptions = {font: new PhetFont( 14 )};

    var unitsPanel = new Rectangle( 0, 0, 175, 80, 10, 10, {fill: '#f2fa6a', stroke: 'gray', lineWidth: 1} );
    var titleText = new Text( unitsString, {font: new PhetFont( 14 ), top: unitsPanel.top + 10, centerX: unitsPanel.centerX} );
    var metricRadio = new AquaRadioButton( model.measureUnitsProperty, 'metric', new Text( metricString, textOptions ), {radius: 8, x: 20, y: unitsPanel.top + 35} );
    var englishRadio = new AquaRadioButton( model.measureUnitsProperty, 'english', new Text( englishString, textOptions ), {radius: 8, x: 20, y: unitsPanel.top + 60} );
    unitsPanel.addChild( titleText );
    unitsPanel.addChild( metricRadio );
    unitsPanel.addChild( englishRadio );
    this.addChild( unitsPanel );
    this.mutate( options );
  }

  return inherit( Node, UnitsControlPanel );
} );