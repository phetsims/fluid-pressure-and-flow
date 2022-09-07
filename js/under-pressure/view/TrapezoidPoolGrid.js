// Copyright 2013-2022, University of Colorado Boulder

/**
 * View for the grid in trapezoid and chamber pools which shows horizontal lines along the pool indicating the depth.
 * Callouts indicating depth are shown on the lines with an option (slantMultiplier) to show them horizontally displaced
 * compared with the ones on the above and below lines. Supports both english and metric units.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';
import GridLinesNode from './GridLinesNode.js';

const ftString = FluidPressureAndFlowStrings.ft;
const mString = FluidPressureAndFlowStrings.m;
const valueWithUnitsPatternString = FluidPressureAndFlowStrings.valueWithUnitsPattern;

class TrapezoidPoolGrid extends Node {
  /**
   * @param {UnderPressureModel} underPressureModel
   * @param {ModelViewTransform2 } modelViewTransform to convert between model and view co-ordinates
   * @param {number} poolLeftX is pool left x coordinate
   * @param {number} poolTopY is pool top y coordinate
   * @param {number} poolRightX is pool right x coordinate
   * @param {number} poolBottomY is pool bottom y coordinate
   * @param {number} poolHeight is height of the pool
   * @param {number} labelXPosition is label x position
   * @param {number} slantMultiplier is to make label line up in space between the pools
   */
  constructor( underPressureModel, modelViewTransform, poolLeftX, poolTopY, poolRightX, poolBottomY,
               poolHeight, labelXPosition, slantMultiplier ) {

    super();

    const fontOptions = { font: new PhetFont( 12 ), maxWidth: 20 };

    // add grid line
    this.addChild( new GridLinesNode( underPressureModel.measureUnitsProperty, modelViewTransform, poolLeftX, poolTopY,
      poolRightX, poolBottomY ) );

    // Add the labels for meters
    const depthLabelsMeters = new Node();
    for ( let depthMeters = 0; depthMeters <= poolHeight; depthMeters++ ) {
      const metersText = new Text( StringUtils.format( valueWithUnitsPatternString, depthMeters, mString ), fontOptions );
      const metersLabelRect = new Rectangle( 0, 0, metersText.width + 5, metersText.height + 5, 10, 10,
        { fill: '#67a257' } );
      metersText.center = metersLabelRect.center;
      metersLabelRect.addChild( metersText );
      metersLabelRect.centerX = labelXPosition + modelViewTransform.modelToViewX( depthMeters * slantMultiplier );
      metersLabelRect.centerY = modelViewTransform.modelToViewY( -depthMeters );
      depthLabelsMeters.addChild( metersLabelRect );
    }

    // Add the labels for feet, adjust for loop to limit number of labels.
    const depthLabelsFeet = new Node();
    for ( let depthFeet = 0; depthFeet <= poolHeight * 3.3 + 1; depthFeet += 5 ) {
      const feetText = new Text( StringUtils.format( valueWithUnitsPatternString, depthFeet, ftString ), fontOptions );
      const feetLabelRect = new Rectangle( 0, 0, feetText.width + 5, feetText.height + 5, 10, 10, { fill: '#67a257' } );
      feetText.center = feetLabelRect.center;
      feetLabelRect.addChild( feetText );
      feetLabelRect.centerX = labelXPosition +
                              modelViewTransform.modelToViewDeltaX( depthFeet / 3.3 * slantMultiplier );
      feetLabelRect.centerY = modelViewTransform.modelToViewY( -depthFeet / 3.3 );
      depthLabelsFeet.addChild( feetLabelRect );
    }

    this.addChild( depthLabelsMeters );
    this.addChild( depthLabelsFeet );

    underPressureModel.measureUnitsProperty.link( measureUnits => {
      depthLabelsFeet.visible = ( measureUnits === 'english' );
      depthLabelsMeters.visible = ( measureUnits !== 'english' );
    } );

    underPressureModel.isGridVisibleProperty.linkAttribute( this, 'visible' );
  }
}

fluidPressureAndFlow.register( 'TrapezoidPoolGrid', TrapezoidPoolGrid );
export default TrapezoidPoolGrid;