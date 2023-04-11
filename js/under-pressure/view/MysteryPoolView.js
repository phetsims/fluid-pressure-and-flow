// Copyright 2013-2023, University of Colorado Boulder

/**
 * View for mystery pool which is based on square pool.
 * Mystery pool has one of gravity/fluidDensity controls with a question mark and a random gravity/fluidDensity is used
 * for the hidden control. The objective is to figure out the hidden value.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import Panel from '../../../../sun/js/Panel.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';
import SquarePoolView from './SquarePoolView.js';

const fluidAString = FluidPressureAndFlowStrings.fluidA;
const fluidBString = FluidPressureAndFlowStrings.fluidB;
const fluidCString = FluidPressureAndFlowStrings.fluidC;
const mysteryFluidString = FluidPressureAndFlowStrings.mysteryFluid;
const mysteryPlanetString = FluidPressureAndFlowStrings.mysteryPlanet;
const planetAString = FluidPressureAndFlowStrings.planetA;
const planetBString = FluidPressureAndFlowStrings.planetB;
const planetCString = FluidPressureAndFlowStrings.planetC;

// constants
const RADIO_BUTTON_TOUCH_DILATION_Y = 2; // empirically determined

class MysteryPoolView extends SquarePoolView {

  /**
   * @param mysteryPoolModel
   * @param modelViewTransform
   * @param bounds
   * @param bottom
   * @param left
   * @param fluidDensityTop
   * @param fluidDensityLeft
   * @param width
   */
  constructor( mysteryPoolModel, modelViewTransform, bounds, bottom, left, fluidDensityTop, fluidDensityLeft, width ) {

    super( mysteryPoolModel, modelViewTransform );

    const radioButtonTextOptions = {
      font: new PhetFont( 12 ),
      maxWidth: width * 0.8
    };

    const comboBoxTextOptions = {
      font: new PhetFont( 12 ),
      maxWidth: width * 0.5
    };

    const mysteryFluidRadio = new AquaRadioButton( mysteryPoolModel.underPressureModel.mysteryChoiceProperty,
      'fluidDensity', new Text( mysteryFluidString, radioButtonTextOptions ), { radius: 6 } );
    const mysteryPlanetRadio = new AquaRadioButton( mysteryPoolModel.underPressureModel.mysteryChoiceProperty, 'gravity',
      new Text( mysteryPlanetString, radioButtonTextOptions ), { radius: 6 } );

    //touch areas
    mysteryFluidRadio.touchArea = mysteryFluidRadio.bounds.dilatedY( RADIO_BUTTON_TOUCH_DILATION_Y );
    mysteryPlanetRadio.touchArea = mysteryPlanetRadio.bounds.dilatedY( RADIO_BUTTON_TOUCH_DILATION_Y );

    const content = new VBox( {
      children: [ mysteryFluidRadio, mysteryPlanetRadio ],
      spacing: 5,
      align: 'left',
      resize: false
    } );

    const choicePanel = new Panel( content, {
      xMargin: 7,
      yMargin: 6,
      stroke: 'gray',
      lineWidth: 1,
      fill: '#f2fa6a',
      resize: false,
      align: 'left',
      cornerRadius: 7,
      minWidth: width,
      maxWidth: width
    } );
    choicePanel.top = bottom + 5;
    choicePanel.left = left;
    this.addChild( choicePanel );

    // items
    this.fluidDensityComboBox = new ComboBox( mysteryPoolModel.customFluidDensityProperty, [
      { value: 0, createNode: () => new Text( fluidAString, comboBoxTextOptions ) },
      { value: 1, createNode: () => new Text( fluidBString, comboBoxTextOptions ) },
      { value: 2, createNode: () => new Text( fluidCString, comboBoxTextOptions ) }
    ], this, {
      highlightFill: 'rgb(218,255,255)',
      visible: false
    } );

    this.fluidDensityComboBox.touchArea = this.fluidDensityComboBox.localBounds.dilatedXY( 0, 0 );
    this.fluidDensityComboBox.top = fluidDensityTop;
    this.fluidDensityComboBox.right = fluidDensityLeft - 10;
    this.addChild( this.fluidDensityComboBox );

    this.gravityComboBox = new ComboBox( mysteryPoolModel.customGravityProperty, [
      { value: 0, createNode: () => new Text( planetAString, comboBoxTextOptions ) },
      { value: 1, createNode: () => new Text( planetBString, comboBoxTextOptions ) },
      { value: 2, createNode: () => new Text( planetCString, comboBoxTextOptions ) }
    ], this, {
      cornerRadius: 8,
      highlightFill: 'rgb(218,255,255)',
      visible: false
    } );

    this.gravityComboBox.touchArea = this.gravityComboBox.localBounds.dilatedXY( 0, 0 );
    this.gravityComboBox.right = this.fluidDensityComboBox.right;
    this.gravityComboBox.top = this.fluidDensityComboBox.top;
    this.addChild( this.gravityComboBox );

    //TODO replace 2 DerivedProperties with 1 mysteryChoiceProperty listener
    new DerivedProperty( [ mysteryPoolModel.underPressureModel.mysteryChoiceProperty ],
      mysteryChoice => {
        return mysteryChoice === 'fluidDensity';
      } ).linkAttribute( this.fluidDensityComboBox, 'visible' );
    new DerivedProperty( [ mysteryPoolModel.underPressureModel.mysteryChoiceProperty ],
      mysteryChoice => {
        return mysteryChoice === 'gravity';
      } ).linkAttribute( this.gravityComboBox, 'visible' );
  }
}

fluidPressureAndFlow.register( 'MysteryPoolView', MysteryPoolView );
export default MysteryPoolView;