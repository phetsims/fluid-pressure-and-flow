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
  var inherit = require( 'PHET_CORE/inherit' );
  var SquarePoolModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/SquarePoolModel' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Color = require( 'SCENERY/util/Color' );


  /**
   * @param {UnderPressureModel} underPressureModel of the sim.
   * @constructor
   */
  function MysteryPoolModel( underPressureModel ) {

    var mysteryPoolModel = this;
    SquarePoolModel.call( this, underPressureModel );

    this.customFluidDensityProperty = new Property( 0 );
    this.customGravityProperty = new Property( 0 );

    this.underPressureModel = underPressureModel;

    //custom gravity and density for mystery pool
    this.fluidDensityChoices = [ 1700, 840, 1100 ];
    this.gravityChoices = [ 20, 14, 6.5 ];

    this.fluidColor = [ new Color( 113, 35, 136 ), new Color( 179, 115, 176 ), new Color( 60, 29, 71 ) ];

    var oldGravity;
    var oldFluidDensity;
    this.underPressureModel.currentSceneProperty.link( function( scene, oldScene ) {
      if ( scene === 'mystery' ) {
        oldGravity = mysteryPoolModel.underPressureModel.gravity;
        oldFluidDensity = mysteryPoolModel.underPressureModel.fluidDensity;
        mysteryPoolModel.updateChoiceValue();
      }
      else if ( oldScene === 'mystery' ) {
        mysteryPoolModel.underPressureModel.gravity = oldGravity;
        mysteryPoolModel.underPressureModel.fluidDensity = oldFluidDensity;
      }
    } );

    this.underPressureModel.mysteryChoiceProperty.link( function( mysteryChoice ) {

      // Reset the value of the non-mystery quantity when the other quantity is selected.
      if ( mysteryChoice === 'fluidDensity' ) {
        mysteryPoolModel.underPressureModel.gravityProperty.reset();
      }
      else if ( mysteryChoice === 'gravity' ) {
        mysteryPoolModel.underPressureModel.fluidDensityProperty.reset();
      }
      // Update mystery quantity.
      if ( mysteryPoolModel.underPressureModel.currentScene === 'mystery' ) {
        mysteryPoolModel.updateChoiceValue();
      }
    } );

    Property.multilink( [ this.customGravityProperty, this.customFluidDensityProperty ], function() {
      if ( mysteryPoolModel.underPressureModel.currentScene === 'mystery' ) {
        mysteryPoolModel.updateChoiceValue();
      }
    } );
  }

  return inherit( SquarePoolModel, MysteryPoolModel, {

    updateChoiceValue: function() {

      if ( this.underPressureModel.mysteryChoice === 'fluidDensity' ) {
        this.underPressureModel.fluidDensity = this.fluidDensityChoices[ this.customFluidDensityProperty.value ];
        this.underPressureModel.fluidColorModel.color = this.fluidColor[ this.customFluidDensityProperty.value ];
      }
      else {
        this.underPressureModel.gravity = this.gravityChoices[ this.customGravityProperty.value ];
        this.underPressureModel.fluidDensityProperty.notifyObserversStatic();
      }

    },

    reset: function() {
      this.customFluidDensityProperty.reset();
      this.customGravityProperty.reset();
      PropertySet.prototype.reset.call( this );
      PropertySet.prototype.reset.call( this.underPressureModel );
    }
  } );
} );