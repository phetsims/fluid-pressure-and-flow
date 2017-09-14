// Copyright 2013-2015, University of Colorado Boulder

/**
 * Model for mystery pool screen, which is based on square pool.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SquarePoolModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/SquarePoolModel' );

  /**
   * @param {UnderPressureModel} underPressureModel of the sim.
   * @constructor
   */
  function MysteryPoolModel( underPressureModel ) {

    var self = this;
    SquarePoolModel.call( this, underPressureModel );

    this.customFluidDensityProperty = new Property( 0 ); // @public
    this.customGravityProperty = new Property( 0 ); // @public

    this.underPressureModel = underPressureModel;

    //custom gravity and density for mystery pool
    this.fluidDensityChoices = [ 1700, 840, 1100 ]; // @public
    this.gravityChoices = [ 20, 14, 6.5 ]; // @public

    this.fluidColor = [ new Color( 113, 35, 136 ), new Color( 179, 115, 176 ), new Color( 60, 29, 71 ) ]; // @public

    var oldGravity;
    var oldFluidDensity;
    this.underPressureModel.currentSceneProperty.link( function( scene, oldScene ) {
      if ( scene === 'mystery' ) {
        oldGravity = self.underPressureModel.gravityProperty.value;
        oldFluidDensity = self.underPressureModel.fluidDensityProperty.value;
        self.updateChoiceValue();
      }
      else if ( oldScene === 'mystery' ) {
        self.underPressureModel.gravityProperty.value = oldGravity;
        self.underPressureModel.fluidDensityProperty.value = oldFluidDensity;
      }
    } );

    this.underPressureModel.mysteryChoiceProperty.link( function( mysteryChoice ) {

      // Reset the value of the non-mystery quantity when the other quantity is selected.
      if ( mysteryChoice === 'fluidDensity' ) {
        self.underPressureModel.gravityProperty.reset();
      }
      else if ( mysteryChoice === 'gravity' ) {
        self.underPressureModel.fluidDensityProperty.reset();
      }
      // Update mystery quantity.
      if ( self.underPressureModel.currentSceneProperty.value === 'mystery' ) {
        self.updateChoiceValue();
      }
    } );

    Property.multilink( [ this.customGravityProperty, this.customFluidDensityProperty ], function() {
      if ( self.underPressureModel.currentSceneProperty.value === 'mystery' ) {
        self.updateChoiceValue();
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