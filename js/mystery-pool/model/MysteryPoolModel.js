// Copyright 2002-2013, University of Colorado Boulder

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
  var SquarePoolModel = require( 'UNDER_PRESSURE/square-pool/model/SquarePoolModel' );
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
    PropertySet.call( this, {
      fluidDensityCustom: 0,
      gravityCustom: 0
    } );

    //custom gravity and density for mystery pool
    this.fluidDensity = [ 1700, 840, 1100 ];
    this.waterColor = [ new Color( 113, 35, 136 ), new Color( 179, 115, 176 ), new Color( 60, 29, 71 ) ];
    this.underPressureModel = underPressureModel;
    this.gravity = [ 20, 14, 6.5 ];

    var oldGravity;
    var oldFluidDensity;
    this.underPressureModel.currentSceneProperty.link( function( scene, oldScene ) {
      if ( scene === 'Mystery' ) {
        oldGravity = mysteryPoolModel.underPressureModel.gravity;
        oldFluidDensity = mysteryPoolModel.underPressureModel.fluidDensity;
        mysteryPoolModel.updateChoiceValue();
      }
      else if ( oldScene === 'Mystery' ) {
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
      if ( mysteryPoolModel.underPressureModel.currentScene === 'Mystery' ) {
        mysteryPoolModel.updateChoiceValue();
      }
    } );

    Property.multilink( [ this.gravityCustomProperty, this.fluidDensityCustomProperty ], function() {
      if ( mysteryPoolModel.underPressureModel.currentScene === 'Mystery' ) {
        mysteryPoolModel.updateChoiceValue();
      }
    } );
  }

  return inherit( SquarePoolModel, MysteryPoolModel, {

    updateChoiceValue: function() {
      var choice = this.underPressureModel.mysteryChoice;
      this.underPressureModel[ choice ] = this[ choice ][ this[ choice + 'CustomProperty' ].value ];
      if ( choice === 'fluidDensity' ) {
        this.underPressureModel.waterColorModel.setWaterColor( this.waterColor[ this.fluidDensityCustomProperty.value ] );
      }
      else {
        this.underPressureModel.fluidDensityProperty.notifyObserversStatic();
      }
    }
  } );
} );