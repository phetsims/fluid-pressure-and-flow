// Copyright 2014-2022, University of Colorado Boulder

/**
 * View for the sluice state (open/close) switcher
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Path, Rectangle } from '../../../../scenery/js/imports.js';
import ABSwitch from '../../../../sun/js/ABSwitch.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import WaterTowerLegsNode from './WaterTowerLegsNode.js';

// constants
const optionWidth = 48;
const optionHeight = 36;

class SluiceControlPanel extends ABSwitch {

  /**
   * @param {Property.<boolean>} isSluiceOpenProperty -- property to control the sluice gate
   * @param {Object} [options]
   */
  constructor( isSluiceOpenProperty, options ) {

    // these things are used to create WaterTowerLegsNode
    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( Vector2.ZERO, Vector2.ZERO, 1 ); // identity with y-axis inverted
    const tankDim = optionWidth * 0.33;
    const tankPositionProperty = new Vector2Property( new Vector2( 0, 0.7 * tankDim ) );

    // close option
    const closeOptionNode = new Rectangle( 0, 0, optionWidth, optionHeight, 5, 5, {
      stroke: 'black',
      lineWidth: 1,
      fill: 'white'
    } );

    const closeWaterTowerLegs = new WaterTowerLegsNode( tankDim, tankPositionProperty, modelViewTransform, {
      legWidth: 1,
      crossbeamWidth: 1,
      bottom: closeOptionNode.bottom,
      left: closeOptionNode.centerX - tankDim / 2
    } );

    const closeWaterTank = new Rectangle( 0, 0, tankDim, tankDim, {
      stroke: 'gray',
      lineWidth: 1,
      fill: '#33D6FF',
      bottom: closeWaterTowerLegs.top,
      left: closeWaterTowerLegs.left
    } );

    closeOptionNode.addChild( closeWaterTank );
    closeOptionNode.addChild( closeWaterTowerLegs );

    // open option
    const openOptionNode = new Rectangle( 0, 0, optionWidth, optionHeight, 5, 5, {
      stroke: 'black',
      lineWidth: 1,
      fill: 'white'
    } );

    const openWaterTowerLegs = new WaterTowerLegsNode( tankDim, tankPositionProperty, modelViewTransform, {
      legWidth: 1,
      crossbeamWidth: 1,
      bottom: openOptionNode.bottom,
      left: openOptionNode.centerX - tankDim / 2
    } );

    const openWaterTank = new Rectangle( 0, 0, tankDim, tankDim, {
      stroke: 'gray',
      lineWidth: 1,
      fill: '#33D6FF',
      bottom: openWaterTowerLegs.top,
      left: openWaterTowerLegs.left
    } );

    const waterFlow = new Path( new Shape().moveTo( 0, 0 ).quadraticCurveTo( 10, 0, 13, 15 ), {
      left: openWaterTank.right - 3,
      lineWidth: 4,
      top: openWaterTank.bottom - 6,
      stroke: '#33D6FF'
    } );
    openOptionNode.addChild( openWaterTank );
    openOptionNode.addChild( openWaterTowerLegs );
    openOptionNode.addChild( waterFlow );

    super( isSluiceOpenProperty, false, closeOptionNode, true, openOptionNode, options );
  }
}

fluidPressureAndFlow.register( 'SluiceControlPanel', SluiceControlPanel );
export default SluiceControlPanel;