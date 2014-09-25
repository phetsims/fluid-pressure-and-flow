// Copyright 2002-2013, University of Colorado Boulder

/**
 * Control panel that contains various tools like ruler, grid and atmosphere controls.
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

// modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Panel = require( 'SUN/Panel' );
  var HStrut = require( 'SUN/HStrut' );
  var CheckBox = require( 'SUN/CheckBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var NodeWithBorderAndTitle = require( 'UNDER_PRESSURE/common/view/NodeWithBorderAndTitle' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // strings
  var gridString = require( 'string!UNDER_PRESSURE/grid' );
  var rulerString = require( 'string!UNDER_PRESSURE/ruler' );
  var onString = require( 'string!UNDER_PRESSURE/on' );
  var offString = require( 'string!UNDER_PRESSURE/off' );
  var atmosphereString = require( 'string!UNDER_PRESSURE/atmosphere' );

  /**
   * @param {UnderPressureModel} underPressureModel of the sim.
   * @param {Object} options
   * @constructor
   */
  function ControlPanel( underPressureModel, options ) {

    options = _.extend( {
      xMargin: 10,
      yMargin: 10,
      fill: '#f2fa6a ',
      stroke: 'gray',
      lineWidth: 1,
      resize: false,
      scale: 0.8
    }, options );


    var textOptions = {font: new PhetFont( 14 )};

    var rulerSet = [new Text( rulerString, textOptions ), this.createRulerIcon()];
    var grid = [new Text( gridString, textOptions )];

    var atmosphereTrue = new AquaRadioButton( underPressureModel.isAtmosphereProperty, true, new Text( onString, textOptions ), {radius: 8} );
    var atmosphereFalse = new AquaRadioButton( underPressureModel.isAtmosphereProperty, false, new Text( offString, textOptions ), {radius: 8} );

    //touch areas
    atmosphereTrue.touchArea = atmosphereTrue.localBounds.dilatedXY( 0, 0 );
    atmosphereFalse.touchArea = atmosphereFalse.localBounds.dilatedXY( 0, 0 );

    var atmosphere = new NodeWithBorderAndTitle( new HBox( {
      children: [ atmosphereTrue, atmosphereFalse ],
      spacing: 10,
      align: 'left'
    } ), atmosphereString );

    var alignOptions = {
      boxWidth: 18,
      spacing: 5
    };

    var expandedWidth = atmosphere.width + 40;

    //align ruler icon right
    var padWidth = expandedWidth - rulerSet[0].width - rulerSet[1].width - alignOptions.boxWidth - alignOptions.spacing * 2;
    var ruler = [rulerSet[0], new HStrut( padWidth ), rulerSet[1]];

    //resize boxes to fit max
    atmosphere.updateWidth( expandedWidth );

    var rulerCheckBox = new CheckBox( new HBox( {children: ( ruler )} ), underPressureModel.isRulerVisibleProperty, alignOptions );
    var gridCheckBox = new CheckBox( new HBox( {children: ( grid )} ), underPressureModel.isGridVisibleProperty, alignOptions );

    var maxCheckBoxWidth = _.max( [ rulerCheckBox, gridCheckBox ], function( item ) {
      return item.width;
    } ).width + 5;

    //touch Areas
    rulerCheckBox.touchArea = new Bounds2( rulerCheckBox.localBounds.minX - 5, rulerCheckBox.localBounds.minY, rulerCheckBox.localBounds.minX + maxCheckBoxWidth, rulerCheckBox.localBounds.maxY );
    gridCheckBox.touchArea = new Bounds2( gridCheckBox.localBounds.minX - 5, gridCheckBox.localBounds.minY, gridCheckBox.localBounds.minX + maxCheckBoxWidth, gridCheckBox.localBounds.maxY );

    var checkBoxChildren = [ rulerCheckBox , gridCheckBox ];

    var checkBoxes = new VBox( {align: 'left', spacing: 5, children: checkBoxChildren} );

    var content = new VBox( {
      spacing: 5,
      children: [checkBoxes, atmosphere],
      align: 'left'
    } );

    Panel.call( this, content, options );
  }

  return inherit( Panel, ControlPanel, {

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