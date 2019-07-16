// Copyright 2014-2018, University of Colorado Boulder

/**
 * Control panel that contains various tools (measuring tape, ruler, hose).
 *
 * @author Siddhartha Chinthapally (ActualConcepts)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Panel = require( 'SUN/Panel' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RulerNode = require( 'SCENERY_PHET/RulerNode' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const hoseString = require( 'string!FLUID_PRESSURE_AND_FLOW/hose' );
  const measuringTapeString = require( 'string!FLUID_PRESSURE_AND_FLOW/measuringTape' );
  const rulerString = require( 'string!FLUID_PRESSURE_AND_FLOW/ruler' );

  // images
  const measuringTapeImg = require( 'image!SCENERY_PHET/measuringTape.png' );
  const nozzleImg = require( 'image!FLUID_PRESSURE_AND_FLOW/nozzle.png' );

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

    const textOptions = { font: new PhetFont( 14 ) };

    // itemSpec describes the pieces that make up an item in the control panel, conforms to the contract: { label: {Node}, icon: {Node} }
    const ruler = { label: new Text( rulerString, textOptions ), icon: createRulerIcon() };
    const measuringTape = { label: new Text( measuringTapeString, textOptions ), icon: createMeasuringTapeIcon() };
    const hose = { label: new Text( hoseString, textOptions ), icon: createHoseIcon() };

    // compute the maximum item width
    const widestItemSpec = _.maxBy( [ ruler, measuringTape, hose ], function( item ) { return item.label.width + item.icon.width; } );
    const maxWidth = widestItemSpec.label.width + widestItemSpec.icon.width;

    // pad inserts a spacing node (HStrut) so that the text, space and image together occupy a certain fixed width.
    const createItem = function( itemSpec ) {
      const strutWidth = maxWidth - itemSpec.label.width - itemSpec.icon.width + 5;
      return new HBox( { children: [ itemSpec.label, new HStrut( strutWidth ), itemSpec.icon ] } );
    };

    const checkboxOptions = {
      boxWidth: 18,
      spacing: 5
    };

    // pad all the rows so the text nodes are left aligned and the icons is right aligned
    const checkboxChildren = [
      new Checkbox( createItem( ruler ), waterTowerModel.isRulerVisibleProperty, checkboxOptions ),
      new Checkbox( createItem( measuringTape ), waterTowerModel.isMeasuringTapeVisibleProperty, checkboxOptions ),
      new Checkbox( createItem( hose ), waterTowerModel.isHoseVisibleProperty, checkboxOptions )
    ];
    const checkboxes = new VBox( { align: 'left', spacing: 10, children: checkboxChildren } );

    Panel.call( this, checkboxes, options );
  }

  //Create an icon for the ruler checkbox
  const createRulerIcon = function() {
    return new RulerNode( 30, 20, 15, [ '0', '1', '2' ], '', {
      insetsWidth: 7,
      minorTicksPerMajorTick: 4,
      majorTickFont: new PhetFont( 12 ),
      clipArea: Shape.rect( -1, -1, 44, 22 )
    } );
  };

  //create an icon for the hose
  const createHoseIcon = function() {
    const icon = new Path( new Shape().moveTo( 0, 0 ).arc( -16, 8, 8, -Math.PI / 2, Math.PI / 2, true ).lineTo( 10, 16 ).lineTo( 10, 0 ).lineTo( 0, 0 ), {
      stroke: 'grey',
      lineWidth: 1,
      fill: '#00FF00'
    } );
    icon.addChild( new Image( nozzleImg, {
      cursor: 'pointer',
      rotation: Math.PI / 2,
      scale: 0.8,
      left: icon.right,
      bottom: icon.bottom + 3
    } ) );
    return icon;
  };

  //create an icon for the measuring tape
  const createMeasuringTapeIcon = function() {
    const icon = new Image( measuringTapeImg, { cursor: 'pointer', scale: 0.6 } );
    const size = 5;
    icon.addChild( new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ), {
      stroke: '#E05F20',
      lineWidth: 2,
      left: icon.right + 12,
      top: icon.bottom + 12
    } ) );
    return icon;
  };

  fluidPressureAndFlow.register( 'ToolsControlPanel', ToolsControlPanel );

  return inherit( Panel, ToolsControlPanel );
} );