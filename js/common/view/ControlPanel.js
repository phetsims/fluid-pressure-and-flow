// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the control panel, view settings and controls.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Panel = require( 'SUN/Panel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var NodeWithBorderAndTitle = require( 'UNDER_PRESSURE/common/view/NodeWithBorderAndTitle' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );

  var gridString = require( 'string!UNDER_PRESSURE/grid' );
  var rulerString = require( 'string!UNDER_PRESSURE/ruler' );
  var onString = require( 'string!UNDER_PRESSURE/on' );
  var offString = require( 'string!UNDER_PRESSURE/off' );

  var metricString = require( 'string!UNDER_PRESSURE/metric' );
  var atmospheresString = require( 'string!UNDER_PRESSURE/atmospheres' );
  var atmosphereString = require( 'string!UNDER_PRESSURE/atmosphere' );
  var englishString = require( 'string!UNDER_PRESSURE/english' );
  var unitsString = require( 'string!UNDER_PRESSURE/units' );

  function ControlPanel( model, x, y ) {
    var textOptions = {font: new PhetFont( 14 )};

    var rulerSet = [new Text( rulerString, textOptions ), this.createRulerIcon()];
    var grid = [new Text( gridString, textOptions )];

    var atmosphere = new NodeWithBorderAndTitle( new HBox( {
      children: [
        new AquaRadioButton( model.isAtmosphereProperty, true, new Text( onString, textOptions ), {radius: 8} ),
        new AquaRadioButton( model.isAtmosphereProperty, false, new Text( offString, textOptions ), {radius: 8} )
      ],
      spacing: 10,
      align: 'left'
    } ), atmosphereString );

    var metrics = new NodeWithBorderAndTitle( new VBox( {
      children: [
        new AquaRadioButton( model.measureUnitsProperty, 'metric', new Text( metricString, textOptions ), {radius: 8} ),
        new AquaRadioButton( model.measureUnitsProperty, 'atmosphere', new Text( atmospheresString, textOptions ), {radius: 8} ),
        new AquaRadioButton( model.measureUnitsProperty, 'english', new Text( englishString, textOptions ), {radius: 8} )
      ],
      spacing: 5,
      align: 'left'
    } ), unitsString );

    var options = {
      boxWidth: 18,
      spacing: 5
    };

    var maxWidth = _.max( [atmosphere, metrics],function( item ) { return item.width; } ).width;

    //align ruler icon right
    var padWidth = maxWidth - rulerSet[0].width - rulerSet[1].width - options.boxWidth - options.spacing * 2;
    var ruler = [rulerSet[0], new Rectangle( 0, 0, padWidth, 20 ), rulerSet[1]];

    //resize boxes to fit max
    atmosphere.updateWidth( maxWidth );
    metrics.updateWidth( maxWidth );

    var checkBoxChildren = [
      new CheckBox( new HBox( {children: ( ruler )} ), model.isRulerVisibleProperty, options ),
      new CheckBox( new HBox( {children: ( grid )} ), model.isGridVisibleProperty, options )
    ];
    var checkBoxes = new VBox( {align: 'left', spacing: 5, children: checkBoxChildren} );

    var content = new VBox( {
      spacing: 5,
      children: [checkBoxes, atmosphere, metrics],
      align: 'left'
    } );

    this.resizeWidth = function( maxWidth ) {
      atmosphere.updateWidth( maxWidth );
      metrics.updateWidth( maxWidth );
    };

    Panel.call( this, content, { xMargin: 10, yMargin: 10, fill: '#f2fa6a ', stroke: 'gray', lineWidth: 1, resize: false, x: x, y: y, scale: 0.8 } );
  }

  return inherit( Node, ControlPanel, {
    //Create an icon for the ruler check box
    createRulerIcon: function() {
      return new RulerNode( 30, 20, 15, ['0', '1', '2'], '', {
        insetsWidth: 7,
        minorTicksPerMajorTick: 4,
        majorTickFont: new PhetFont( 12 ),
        clipArea: Shape.rect( -1, -1, 44, 22 )
      } );
    }
  } );
} );