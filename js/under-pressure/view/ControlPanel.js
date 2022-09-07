// Copyright 2013-2022, University of Colorado Boulder

/**
 * Control panel that contains various tools like ruler, grid and atmosphere controls.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { HBox, HStrut, Text, VBox, VStrut } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';
import AtmosphereControlNode from './AtmosphereControlNode.js';

const gridString = FluidPressureAndFlowStrings.grid;
const rulerString = FluidPressureAndFlowStrings.ruler;

class ControlPanel extends Panel {

  /**
   * @param {UnderPressureModel} underPressureModel of the sim.
   * @param {Object} [options]
   */
  constructor( underPressureModel, options ) {

    options = merge( {
      yMargin: 7,
      xMargin: 5,
      fill: '#f2fa6a',
      stroke: 'gray',
      lineWidth: 1,
      resize: false,
      minWidth: 150,
      maxWidth: 150
    }, options );

    const maxControlWidth = ( options.maxWidth * 0.9 ) || 200; // the fallback value is fairly arbitrary
    const textOptions = { font: new PhetFont( 12 ), maxWidth: maxControlWidth };
    const rulerSet = [ new Text( rulerString, textOptions ), createRulerIcon() ];
    const gridArray = [ new Text( gridString, textOptions ) ];
    const atmosphereControlNode = new AtmosphereControlNode( underPressureModel.isAtmosphereProperty, {
      maxWidth: options.maxWidth
    } );

    const alignOptions = {
      boxWidth: 15,
      spacing: 5
    };

    // align ruler icon right
    const padWidth = options.maxWidth - rulerSet[ 0 ].width - rulerSet[ 1 ].width - alignOptions.boxWidth -
                     alignOptions.spacing * 2;
    const rulerArray = [ rulerSet[ 0 ], new HStrut( padWidth ), rulerSet[ 1 ] ];

    const rulerCheckbox = new Checkbox( underPressureModel.isRulerVisibleProperty, new HBox( { children: rulerArray } ), alignOptions );
    const gridCheckbox = new Checkbox( underPressureModel.isGridVisibleProperty, new HBox( { children: gridArray } ), alignOptions );

    // touch areas, empirically determined
    rulerCheckbox.touchArea = rulerCheckbox.bounds.dilatedY( 1 );
    gridCheckbox.touchArea = gridCheckbox.bounds.dilatedY( 3 );

    const checkboxChildren = [ rulerCheckbox, gridCheckbox ];

    const checkboxes = new VBox( { align: 'left', spacing: 5, children: checkboxChildren } );

    const content = new VBox( {
      spacing: 5,
      children: [ checkboxes, new VStrut( 2 ), atmosphereControlNode ],
      align: 'left'
    } );

    super( content, options );
  }
}

// Create an icon for the ruler checkbox
function createRulerIcon() {
  const rulerWidth = 30;
  const rulerHeight = 20;
  const insetsWidth = 7;

  return new RulerNode( rulerWidth, rulerHeight, rulerWidth / 2, [ '0', '1', '2' ], '', {
    insetsWidth: insetsWidth,
    minorTicksPerMajorTick: 4,
    majorTickFont: new PhetFont( 12 ),
    // In the mock, the right border of the ruler icon is not visible.
    // So, clipping it using a rectangle that is 1px lesser in width than the icon.
    clipArea: Shape.rect( 0, 0, rulerWidth + 2 * insetsWidth - 1, rulerHeight )
  } );
}

fluidPressureAndFlow.register( 'ControlPanel', ControlPanel );
export default ControlPanel;