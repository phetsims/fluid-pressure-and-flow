// Copyright 2014-2022, University of Colorado Boulder

/**
 * Control panel that contains various tools (measuring tape, ruler, hose).
 *
 * @author Siddhartha Chinthapally (ActualConcepts)
 */

import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import measuringTape_png from '../../../../scenery-phet/images/measuringTape_png.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { HBox, HStrut, Image, Path, Text, VBox } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import nozzle_png from '../../../images/nozzle_png.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';

const hoseString = FluidPressureAndFlowStrings.hose;
const measuringTapeString = FluidPressureAndFlowStrings.measuringTape;
const rulerString = FluidPressureAndFlowStrings.ruler;


class ToolsControlPanel extends Panel {

  /**
   * @param {WaterTowerModel} waterTowerModel of the simulation
   * @param {Object} [options]
   */
  constructor( waterTowerModel, options ) {

    options = merge( {
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
    const widestItemSpec = _.maxBy( [ ruler, measuringTape, hose ],
      item => item.label.width + item.icon.width );
    const maxWidth = widestItemSpec.label.width + widestItemSpec.icon.width;

    // pad inserts a spacing node (HStrut) so that the text, space and image together occupy a certain fixed width.
    function createItem( itemSpec ) {
      const strutWidth = maxWidth - itemSpec.label.width - itemSpec.icon.width + 5;
      return new HBox( { children: [ itemSpec.label, new HStrut( strutWidth ), itemSpec.icon ] } );
    }

    const checkboxOptions = {
      boxWidth: 18,
      spacing: 5
    };

    // pad all the rows so the text nodes are left aligned and the icons is right aligned
    const checkboxChildren = [
      new Checkbox( waterTowerModel.isRulerVisibleProperty, createItem( ruler ), checkboxOptions ),
      new Checkbox( waterTowerModel.isMeasuringTapeVisibleProperty, createItem( measuringTape ), checkboxOptions ),
      new Checkbox( waterTowerModel.isHoseVisibleProperty, createItem( hose ), checkboxOptions )
    ];
    const checkboxes = new VBox( { align: 'left', spacing: 10, children: checkboxChildren } );

    super( checkboxes, options );
  }
}

// Create an icon for the ruler checkbox
function createRulerIcon() {
  return new RulerNode( 30, 20, 15, [ '0', '1', '2' ], '', {
    insetsWidth: 7,
    minorTicksPerMajorTick: 4,
    majorTickFont: new PhetFont( 12 ),
    clipArea: Shape.rect( -1, -1, 44, 22 )
  } );
}

// Create an icon for the hose
function createHoseIcon() {
  const icon = new Path( new Shape().moveTo( 0, 0 ).arc( -16, 8, 8, -Math.PI / 2, Math.PI / 2, true ).lineTo( 10, 16 ).lineTo( 10, 0 ).lineTo( 0, 0 ), {
    stroke: 'grey',
    lineWidth: 1,
    fill: '#00FF00'
  } );
  icon.addChild( new Image( nozzle_png, {
    cursor: 'pointer',
    rotation: Math.PI / 2,
    scale: 0.8,
    left: icon.right,
    bottom: icon.bottom + 3
  } ) );
  return icon;
}

// Create an icon for the measuring tape
function createMeasuringTapeIcon() {
  const icon = new Image( measuringTape_png, { cursor: 'pointer', scale: 0.6 } );
  const size = 5;
  icon.addChild( new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ), {
    stroke: '#E05F20',
    lineWidth: 2,
    left: icon.right + 12,
    top: icon.bottom + 12
  } ) );
  return icon;
}

fluidPressureAndFlow.register( 'ToolsControlPanel', ToolsControlPanel );
export default ToolsControlPanel;