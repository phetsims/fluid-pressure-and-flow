// Copyright 2013-2015, University of Colorado Boulder

/**
 * Control panel that contains various tools like ruler, grid and atmosphere controls.
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Shape = require( 'KITE/Shape' );
  var Panel = require( 'SUN/Panel' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var AtmosphereControlNode = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/AtmosphereControlNode' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // strings
  var gridString = require( 'string!FLUID_PRESSURE_AND_FLOW/grid' );
  var rulerString = require( 'string!FLUID_PRESSURE_AND_FLOW/ruler' );

  /**
   * @param {UnderPressureModel} underPressureModel of the sim.
   * @param {Object} [options]
   * @constructor
   */
  function ControlPanel( underPressureModel, options ) {

    options = _.extend( {
      xMargin: 7,
      yMargin: 7,
      fill: '#f2fa6a',
      stroke: 'gray',
      lineWidth: 1,
      resize: false,
      minWidth: 120,
      maxWidth:120
    }, options );

    var textOptions = { font: new PhetFont( 12 ), maxWidth: 80 };
    var rulerSet = [ new Text( rulerString, textOptions ), this.createRulerIcon() ];
    var gridArray = [ new Text( gridString, textOptions ) ];
    var atmosphereControlNode = new AtmosphereControlNode( underPressureModel.isAtmosphereProperty );

    var alignOptions = {
      boxWidth: 12,
      spacing: 5
    };


    //align ruler icon right
    var padWidth = options.maxWidth - rulerSet[ 0 ].width - rulerSet[ 1 ].width - alignOptions.boxWidth -
                   alignOptions.spacing * 2;
    var rulerArray = [ rulerSet[ 0 ], new HStrut( padWidth ), rulerSet[ 1 ] ];

    var rulerCheckBox = new CheckBox( new HBox( { children: rulerArray } ), underPressureModel.isRulerVisibleProperty,
      alignOptions );
    var gridCheckBox = new CheckBox( new HBox( { children: gridArray } ), underPressureModel.isGridVisibleProperty,
      alignOptions );

    var maxCheckBoxWidth = _.max( [ rulerCheckBox, gridCheckBox ], function( item ) {
        return item.width;
      } ).width + 5;

    //touch Areas
    rulerCheckBox.touchArea = new Bounds2( rulerCheckBox.localBounds.minX - 5, rulerCheckBox.localBounds.minY,
      rulerCheckBox.localBounds.minX + maxCheckBoxWidth, rulerCheckBox.localBounds.maxY );
    gridCheckBox.touchArea = new Bounds2( gridCheckBox.localBounds.minX - 5, gridCheckBox.localBounds.minY,
      gridCheckBox.localBounds.minX + maxCheckBoxWidth, gridCheckBox.localBounds.maxY );

    var checkBoxChildren = [ rulerCheckBox, gridCheckBox ];

    var checkBoxes = new VBox( { align: 'left', spacing: 5, children: checkBoxChildren } );

    var content = new VBox( {
      spacing: 5,
      children: [ checkBoxes, atmosphereControlNode ],
      align: 'left'
    } );

    Panel.call( this, content, options );
  }

  fluidPressureAndFlow.register( 'ControlPanel', ControlPanel );

  return inherit( Panel, ControlPanel, {

    //Create an icon for the ruler check box
    createRulerIcon: function() {
      var rulerWidth = 30;
      var rulerHeight = 20;
      var insetsWidth = 7;

      return new RulerNode( rulerWidth, rulerHeight, rulerWidth / 2, [ '0', '1', '2' ], '', {
        insetsWidth: insetsWidth,
        minorTicksPerMajorTick: 4,
        majorTickFont: new PhetFont( 12 ),
        // In the mock, the right border of the ruler icon is not visible.
        // So, clipping it using a rectangle that is 1px lesser in width than the icon.
        clipArea: Shape.rect( 0, 0, rulerWidth + 2 * insetsWidth - 1, rulerHeight )
      } );
    }
  } );
} );