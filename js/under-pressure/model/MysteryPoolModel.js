// Copyright 2013-2022, University of Colorado Boulder

/**
 * Model for mystery pool screen, which is based on square pool.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import { Color } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import SquarePoolModel from './SquarePoolModel.js';

class MysteryPoolModel extends SquarePoolModel {

  /**
   * @param {UnderPressureModel} underPressureModel of the sim.
   */
  constructor( underPressureModel ) {

    super( underPressureModel );

    this.customFluidDensityProperty = new Property( 0 ); // @public
    this.customGravityProperty = new Property( 0 ); // @public

    this.underPressureModel = underPressureModel;

    //custom gravity and density for mystery pool
    this.fluidDensityChoices = [ 1700, 840, 1100 ]; // @public
    this.gravityChoices = [ 20, 14, 6.5 ]; // @public

    this.fluidColor = [ new Color( 113, 35, 136 ), new Color( 179, 115, 176 ), new Color( 60, 29, 71 ) ]; // @public

    let oldGravity;
    let oldFluidDensity;
    this.underPressureModel.currentSceneProperty.link( ( scene, oldScene ) => {
      if ( scene === 'mystery' ) {
        oldGravity = this.underPressureModel.gravityProperty.value;
        oldFluidDensity = this.underPressureModel.fluidDensityProperty.value;
        this.updateChoiceValue();
      }
      else if ( oldScene === 'mystery' ) {
        this.underPressureModel.gravityProperty.value = oldGravity;
        this.underPressureModel.fluidDensityProperty.value = oldFluidDensity;
      }
    } );

    this.underPressureModel.mysteryChoiceProperty.link( mysteryChoice => {

      // Reset the value of the non-mystery quantity when the other quantity is selected.
      if ( mysteryChoice === 'fluidDensity' ) {
        this.underPressureModel.gravityProperty.reset();
      }
      else if ( mysteryChoice === 'gravity' ) {
        this.underPressureModel.fluidDensityProperty.reset();
      }
      // Update mystery quantity.
      if ( this.underPressureModel.currentSceneProperty.value === 'mystery' ) {
        this.updateChoiceValue();
      }
    } );

    Multilink.multilink( [ this.customGravityProperty, this.customFluidDensityProperty ], () => {
      if ( this.underPressureModel.currentSceneProperty.value === 'mystery' ) {
        this.updateChoiceValue();
      }
    } );
  }

  // @public
  updateChoiceValue() {
    if ( this.underPressureModel.mysteryChoiceProperty.value === 'fluidDensity' ) {
      this.underPressureModel.fluidDensityProperty.value = this.fluidDensityChoices[ this.customFluidDensityProperty.value ];
      this.underPressureModel.fluidColorModel.colorProperty.value = this.fluidColor[ this.customFluidDensityProperty.value ];
    }
    else {
      this.underPressureModel.gravityProperty.value = this.gravityChoices[ this.customGravityProperty.value ];
      this.underPressureModel.fluidDensityProperty.notifyListenersStatic();
    }
  }

  // @public
  reset() {
    this.customFluidDensityProperty.reset();
    this.customGravityProperty.reset();
    SquarePoolModel.prototype.reset.call( this );
  }
}

fluidPressureAndFlow.register( 'MysteryPoolModel', MysteryPoolModel );
export default MysteryPoolModel;