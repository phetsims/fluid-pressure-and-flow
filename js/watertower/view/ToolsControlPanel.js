// Copyright 2002-2014, University of Colorado Boulder

/**
 * Control panel that contains various tools (measuring tape, ruler, hose).
 *
 * @author Siddhartha Chinthapally (ActualConcepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Shape = require( 'KITE/Shape' );
  var HStrut = require( 'SUN/HStrut' );
  var Panel = require( 'SUN/Panel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Image = require( 'SCENERY/nodes/Image' );

  // strings
  var measuringTapeString = require( 'string!FLUID_PRESSURE_AND_FLOW/measuringTape' );
  var rulerString = require( 'string!FLUID_PRESSURE_AND_FLOW/ruler' );
  var hoseString = require( 'string!FLUID_PRESSURE_AND_FLOW/hose' );

  // images
  //image
  var nozzleImg = require( 'image!FLUID_PRESSURE_AND_FLOW/nozzle.png' );
  var measuringTapeImg = require( 'image!FLUID_PRESSURE_AND_FLOW/measuringTape.png' );


  /**
   *
   * @param {WaterTowerModel} waterTowerModel of the simulation
   * @param {Object} [options]
   * @constructor
   */
  function ToolsControlPanel( waterTowerModel, options ) {

    options = _.extend( {
      xMargin: 10,
      yMargin: 10,
      fill: '#f2fa6a ',
      stroke: 'gray',
      lineWidth: 1,
      resize: false,
      scale: 0.9
    }, options );

    var textOptions = { font: new PhetFont( 14 ) };

    // itemSpec describes the pieces that make up an item in the control panel, conforms to the contract: { label: {Node}, icon: {Node} }
    var ruler = { label: new Text( rulerString, textOptions ), icon: createRulerIcon() };
    var measuringTape = { label: new Text( measuringTapeString, textOptions ), icon: createMeasuringTapeIcon() };
    var hose = { label: new Text( hoseString, textOptions ), icon: createHoseIcon() };

    // compute the maximum item width
    var widestItemSpec = _.max( [ ruler, measuringTape, hose ], function( item ) { return item.label.width + item.icon.width; } );
    var maxWidth = widestItemSpec.label.width + widestItemSpec.icon.width;

    // pad inserts a spacing node (HStrut) so that the text, space and image together occupy a certain fixed width.
    var createItem = function( itemSpec ) {
      var strutWidth = maxWidth - itemSpec.label.width - itemSpec.icon.width + 5;
      return new HBox( { children: [ itemSpec.label, new HStrut( strutWidth ), itemSpec.icon ] } );
    };

    var checkBoxOptions = {
      boxWidth: 18,
      spacing: 5
    };

    // pad all the rows so the text nodes are left aligned and the icons is right aligned
    var checkBoxChildren = [
      new CheckBox( createItem( ruler ), waterTowerModel.isRulerVisibleProperty, checkBoxOptions ),
      new CheckBox( createItem( measuringTape ), waterTowerModel.isMeasuringTapeVisibleProperty, checkBoxOptions ),
      new CheckBox( createItem( hose ), waterTowerModel.isHoseVisibleProperty, checkBoxOptions )
    ];
    var checkBoxes = new VBox( { align: 'left', spacing: 10, children: checkBoxChildren } );

    Panel.call( this, checkBoxes, options );
  }

  //Create an icon for the ruler check box
  var createRulerIcon = function() {
    return new RulerNode( 30, 20, 15, [ '0', '1', '2' ], '', {
      insetsWidth: 7,
      minorTicksPerMajorTick: 4,
      majorTickFont: new PhetFont( 12 ),
      clipArea: Shape.rect( -1, -1, 44, 22 )
    } );
  };

  //create an icon for the hose
  var createHoseIcon = function() {
    var icon = new Path( new Shape().moveTo( 0, 0 ).arc( -16, 8, 8, -Math.PI / 2, Math.PI / 2, true ).lineTo( 10, 16 ).lineTo( 10, 0 ).lineTo( 0, 0 ), {
      stroke: 'grey',
      lineWidth: 1,
      fill: '#00FF00'
    } );
    icon.addChild( new Image( nozzleImg, { cursor: 'pointer', rotation: Math.PI / 2, scale: 0.8, left: icon.right, bottom: icon.bottom + 3 } ) );
    return icon;
  };

  //create an icon for the measuring tape
  var createMeasuringTapeIcon = function() {
    var icon = new Image( measuringTapeImg, { cursor: 'pointer', scale: 0.6 } );
    var size = 5;
    icon.addChild( new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ), {
      stroke: '#E05F20',
      lineWidth: 2,
      left: icon.right + 12,
      top:  icon.bottom + 12
    } ) );
    return icon;
  };

  return inherit( Panel, ToolsControlPanel );
} );