// Copyright 2013-2022, University of Colorado Boulder

/**
 * View for the grid in Square Pool which shows horizontal lines along the pool indicating the depth.
 * Supports both english and metric units.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import Units from '../../common/model/Units.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';
import GridLinesNode from './GridLinesNode.js';

const readoutFeetString = FluidPressureAndFlowStrings.readoutFeet;
const readoutMetersString = FluidPressureAndFlowStrings.readoutMeters;

class SquarePoolGrid extends Node {

  /**
   * @param {SquarePoolModel} squarePoolModel
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   */
  constructor( squarePoolModel, modelViewTransform ) {

    super();

    const fontOptions = { font: new PhetFont( 12 ), fontWeight: 'bold', maxWidth: 60 };
    const poolDimensions = squarePoolModel.poolDimensions;
    // add grid lines
    this.addChild( new GridLinesNode( squarePoolModel.underPressureModel.measureUnitsProperty, modelViewTransform,
      poolDimensions.x1, poolDimensions.y1, poolDimensions.x2, poolDimensions.y2 - 0.3 ) );

    // meter labels
    const metersLabels = new Node();
    for ( let i = 0; i < 4; i++ ) {
      metersLabels.addChild( new Text( StringUtils.format( readoutMetersString, i ), merge( {
        right: modelViewTransform.modelToViewX( poolDimensions.x1 ) - 8,
        centerY: modelViewTransform.modelToViewY( -i )
      }, fontOptions ) ) );
    }

    // feet labels
    const feetLabels = new Node();
    for ( let i = 0; i < 11; i++ ) {
      feetLabels.addChild( new Text( StringUtils.format( readoutFeetString, i ), merge( {
        right: modelViewTransform.modelToViewX( poolDimensions.x1 ) - 8,
        centerY: modelViewTransform.modelToViewY( -Units.feetToMeters( i ) )
      }, fontOptions ) ) );
    }

    this.addChild( metersLabels );
    this.addChild( feetLabels );

    squarePoolModel.underPressureModel.measureUnitsProperty.link( measureUnits => {
      feetLabels.visible = ( measureUnits === 'english' );
      metersLabels.visible = ( measureUnits !== 'english' );
    } );

    squarePoolModel.underPressureModel.isGridVisibleProperty.linkAttribute( this, 'visible' );
  }
}

fluidPressureAndFlow.register( 'SquarePoolGrid', SquarePoolGrid );
export default SquarePoolGrid;