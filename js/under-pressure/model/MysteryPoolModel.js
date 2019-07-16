// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model for mystery pool screen, which is based on square pool.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const SquarePoolModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/SquarePoolModel' );

  /**
   * @param {UnderPressureModel} underPressureModel of the sim.
   * @constructor
   */
  function MysteryPoolModel( underPressureModel ) {

    SquarePoolModel.call( this, underPressureModel );

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

    Property.multilink( [ this.customGravityProperty, this.customFluidDensityProperty ], () => {
      if ( this.underPressureModel.currentSceneProperty.value === 'mystery' ) {
        this.updateChoiceValue();
      }
    } );
  }

  fluidPressureAndFlow.register( 'MysteryPoolModel', MysteryPoolModel );

  return inherit( SquarePoolModel, MysteryPoolModel, {

    // @public
    updateChoiceValue: function() {
      if ( this.underPressureModel.mysteryChoiceProperty.value === 'fluidDensity' ) {
        this.underPressureModel.fluidDensityProperty.value = this.fluidDensityChoices[ this.customFluidDensityProperty.value ];
        this.underPressureModel.fluidColorModel.colorProperty.value = this.fluidColor[ this.customFluidDensityProperty.value ];
      }
      else {
        this.underPressureModel.gravityProperty.value = this.gravityChoices[ this.customGravityProperty.value ];
        this.underPressureModel.fluidDensityProperty.notifyListenersStatic();
      }

    },

    // @public
    reset: function() {
      this.customFluidDensityProperty.reset();
      this.customGravityProperty.reset();
      SquarePoolModel.prototype.reset.call( this );
    }
  } );
} );