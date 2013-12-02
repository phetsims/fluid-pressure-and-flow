// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the control panel, with view settings and controls.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Panel = require( 'SUN/Panel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Property = require( 'AXON/Property' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  var gridString = require( 'string!UNDER_PRESSURE/grid' );
  var rulerString = require( 'string!UNDER_PRESSURE/ruler' );
  var onString = require( 'string!UNDER_PRESSURE/on' );
  var offString = require( 'string!UNDER_PRESSURE/off' );

  var metricString = require( 'string!UNDER_PRESSURE/metric' );
  var atmosphereString = require( 'string!UNDER_PRESSURE/atmospheres' );
  var englishString = require( 'string!UNDER_PRESSURE/english' );

  function ControlPanel( model, x, y ) {
    var textOptions = {font: new PhetFont( 14 )};

    var ruler = [new Text( rulerString, textOptions ), new Text( rulerString, textOptions )]; //, this.createSpeedometerIcon()
    var grid = [new Text( gridString, textOptions )];

    var atmosphere = new HBox( {
      children: [
        new AquaRadioButton( model.isAtmosphereProperty, true, new Text( onString, textOptions ), {radius: 8} ),
        new AquaRadioButton( model.isAtmosphereProperty, false, new Text( offString, textOptions ), {radius: 8} )
      ],
      spacing: 10,
      align:"left"
    } );

    var metrics = new VBox({
      children: [
        new AquaRadioButton( model.measureUnitsProperty, "metric", new Text( metricString, textOptions ), {radius: 8} ),
        new AquaRadioButton( model.measureUnitsProperty, "atmosphere", new Text( atmosphereString, textOptions ), {radius: 8} ),
        new AquaRadioButton( model.measureUnitsProperty, "english", new Text( englishString, textOptions ), {radius: 8} )
      ],
      spacing: 10,
      align:"left"
    });

    //In the absence of any sun (or other) layout packages, just manually space them out so they will have the icons aligned
    var pad = function( itemSet ) {
      var padWidth = maxTextWidth - itemSet[0].width;
      return [itemSet[0], new Rectangle( 0, 0, padWidth + 20, 20 ), itemSet[1]];
    };


    var options = {boxScale: 0.5};

    var checkBoxChildren = [
      new CheckBox( new HBox( {children: ( ruler )} ), model.isRulerVisibleProperty, options ),
      new CheckBox( new HBox( {children: ( grid )} ), model.isGridVisibleProperty, options ),
    ];

    var checkBoxes = new VBox( {align: 'left', spacing: 10, children: checkBoxChildren} );

    var content = new VBox( {
      spacing: 10,
      children: [checkBoxes, atmosphere, metrics],
      align:"left"
    } );


    Panel.call( this, content, { xMargin: 10, yMargin: 10, fill: '#f2fa6a ', stroke: 'gray', lineWidth: 1, resize: false, x: x, y: y } );
  }

  return inherit( Node, ControlPanel, {

    //Create an icon for the speedometer check box
    createSpeedometerIcon: function() {
      //var node = new SpeedometerNode( new Property( 0 ), speedString, 10, {} );
      //node.scale( 20 / node.width );
      //return node;
    }
  } );
} );