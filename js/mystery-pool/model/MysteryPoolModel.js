// Copyright 2002-2013, University of Colorado Boulder

/**
 * main Model container for mystery pool screen. Based on square pool.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var SquarePoolModel = require( 'UNDER_PRESSURE/square-pool/model/SquarePoolModel' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Color = require( 'SCENERY/util/Color' );

  function MysteryPoolModel( globalModel ) {
    var self = this;
    SquarePoolModel.call( this, globalModel );

    //custom gravity and density for mystery pool
    this.fluidDensity = [1700, 840, 1100];
    this.fluidDensityCustom = new Property( 0 );
    this.waterColor = [new Color( 113, 35, 136 ), new Color( 179, 115, 176 ), new Color( 60, 29, 71 )];

    this.gravity = [20, 14, 6.5];
    this.gravityCustom = new Property( 0 );

    var oldGravity, oldFluidDensity;
    this.globalModel.currentSceneProperty.link( function( scene, oldScene ) {
      if ( scene === 'Mystery' ) {
        oldGravity = self.globalModel.gravity;
        oldFluidDensity = self.globalModel.fluidDensity;
        self.updateChoiceValue();
      }
      else if ( oldScene === 'Mystery' ) {
        self.globalModel.gravity = oldGravity;
        self.globalModel.fluidDensity = oldFluidDensity;
      }
    } );

    this.globalModel.mysteryChoiceProperty.link( function( mysteryChoice ) {

      // Reset the value of the non-mystery quantity when the other quantity is selected.
      if ( mysteryChoice === 'fluidDensity' ) {
        self.globalModel.gravityProperty.reset();
      }
      else if ( mysteryChoice === 'gravity' ) {
        self.globalModel.fluidDensityProperty.reset();
      }

      // Update mystery quantity.
      if ( self.globalModel.currentScene === 'Mystery' ) {
        self.updateChoiceValue();
      }
    } );

    this.fluidDensityCustom.link( function() {
      if ( self.globalModel.currentScene === 'Mystery' ) {
        self.updateChoiceValue();
      }
    } );

    this.gravityCustom.link( function() {
      if ( self.globalModel.currentScene === 'Mystery' ) {
        self.updateChoiceValue();
      }
    } );
  }

  return inherit( SquarePoolModel, MysteryPoolModel, {
    updateChoiceValue: function() {
      var choice = this.globalModel.mysteryChoice;
      this.globalModel[choice] = this[choice][this[choice + 'Custom'].get()];
      if ( choice === 'fluidDensity' ) {
        this.globalModel.waterColorModel.setWaterColor( this.waterColor[this[choice + 'Custom'].get()] );
      }
      else {
        this.globalModel.fluidDensityProperty.notifyObserversUnsafe();
      }
    },
    reset: function() {
      this.fluidDensityCustom.reset();
      this.gravityCustom.reset();
      PropertySet.prototype.reset.call( this );
      PropertySet.prototype.reset.call( this.globalModel );
    }
  } );
} );