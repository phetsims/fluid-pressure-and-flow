// Copyright 2014-2022, University of Colorado Boulder

/**
 * Control panel that contains various tools (ruler, flux meter).
 *
 * @author Siddhartha Chinthapally (ActualConcepts)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { Circle, HBox, HStrut, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';

const dotsString = FluidPressureAndFlowStrings.dots;
const fluxMeterString = FluidPressureAndFlowStrings.fluxMeter;
const frictionString = FluidPressureAndFlowStrings.friction;
const rulerString = FluidPressureAndFlowStrings.ruler;

class FlowToolsControlPanel extends Panel {

  /**
   * @param {FlowModel} flowModel of the simulation
   * @param {Object} [options] for various panel display properties
   */
  constructor( flowModel, options ) {

    options = merge( {
      xMargin: 10,
      yMargin: 7,
      fill: '#f2fa6a ',
      stroke: 'gray',
      lineWidth: 1
    }, options );

    const textOptions = { font: new PhetFont( 10 ) };

    // itemSpec describes the pieces that make up an item in the control panel,
    // conforms to the contract: { label: {Node}, icon: {Node} (optional) }
    const rulerSpec = { label: new Text( rulerString, textOptions ), icon: createRulerIcon() };
    const frictionSpec = { label: new Text( frictionString, textOptions ) };
    const fluxMeterSpec = { label: new Text( fluxMeterString, textOptions ) };
    const dotsSpec = { label: new Text( dotsString, textOptions ), icon: createDotsIcon() };

    // compute the maximum item width
    const widestItemSpec = _.maxBy( [ rulerSpec, frictionSpec, fluxMeterSpec, dotsSpec ], item => {
      return item.label.width + ( ( item.icon ) ? item.icon.width : 0 );
    } );
    const maxWidth = widestItemSpec.label.width + ( ( widestItemSpec.icon ) ? widestItemSpec.icon.width : 0 );

    // pad inserts a spacing node (HStrut) so that the text, space and image together occupy a certain fixed width.
    function createItem( itemSpec ) {
      if ( itemSpec.icon ) {
        const strutWidth = maxWidth - itemSpec.label.width - itemSpec.icon.width + 17;
        return new HBox( { children: [ itemSpec.label, new HStrut( strutWidth ), itemSpec.icon ] } );
      }
      else {
        return new HBox( { children: [ itemSpec.label ] } );
      }
    }

    const checkboxOptions = {
      boxWidth: 15,
      spacing: 2
    };

    const rulerCheckbox = new Checkbox( flowModel.isRulerVisibleProperty, createItem( rulerSpec ), checkboxOptions );
    const frictionCheckbox = new Checkbox( flowModel.pipe.frictionProperty, createItem( frictionSpec ), checkboxOptions );
    const fluxMeterCheckbox = new Checkbox( flowModel.isFluxMeterVisibleProperty, createItem( fluxMeterSpec ), checkboxOptions );
    const dotsCheckbox = new Checkbox( flowModel.isDotsVisibleProperty, createItem( dotsSpec ), checkboxOptions );

    const maxCheckboxWidth = _.maxBy( [ rulerCheckbox, frictionCheckbox, fluxMeterCheckbox, dotsCheckbox ],
      item => item.width
    ).width + 5;

    //touch Areas
    rulerCheckbox.touchArea = new Bounds2( rulerCheckbox.localBounds.minX - 5, rulerCheckbox.localBounds.minY,
      rulerCheckbox.localBounds.minX + maxCheckboxWidth, rulerCheckbox.localBounds.maxY );
    frictionCheckbox.touchArea = new Bounds2( frictionCheckbox.localBounds.minX - 5, frictionCheckbox.localBounds.minY,
      frictionCheckbox.localBounds.minX + maxCheckboxWidth, frictionCheckbox.localBounds.maxY );
    fluxMeterCheckbox.touchArea = new Bounds2( fluxMeterCheckbox.localBounds.minX - 5,
      fluxMeterCheckbox.localBounds.minY,
      fluxMeterCheckbox.localBounds.minX + maxCheckboxWidth, fluxMeterCheckbox.localBounds.maxY );
    dotsCheckbox.touchArea = new Bounds2( dotsCheckbox.localBounds.minX - 5, dotsCheckbox.localBounds.minY,
      dotsCheckbox.localBounds.minX + maxCheckboxWidth, dotsCheckbox.localBounds.maxY );

    // pad all the rows so the text nodes are left aligned and the icons is right aligned

    const checkboxes = new VBox( {
      align: 'left', spacing: 4,
      children: [ rulerCheckbox, frictionCheckbox, fluxMeterCheckbox, dotsCheckbox ]
    } );

    super( checkboxes, options );
  }
}

// Create an icon for the ruler checkbox
function createRulerIcon() {
  return new RulerNode( 13, 10, 12, [ '0', '1' ], '', {
    insetsWidth: 5,
    minorTicksPerMajorTick: 4,
    majorTickFont: new PhetFont( 5 ),
    clipArea: Shape.rect( -1, -1, 44, 22 ),
    backgroundLineWidth: 0.5
  } );
}

// Create an icon for the dots checkbox
function createDotsIcon() {
  const dot1 = new Circle( 3, { fill: 'red' } );
  const dot2 = new Circle( 3, { fill: 'red', left: dot1.right + 4 } );
  return new Node( { children: [ dot1, dot2 ] } );
}

fluidPressureAndFlow.register( 'FlowToolsControlPanel', FlowToolsControlPanel );
export default FlowToolsControlPanel;