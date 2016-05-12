// Copyright 2014-2015, University of Colorado Boulder

/**
 * Change fluid color when fluid density changes. For a given density the fluid color is got by linearly interpolating
 * the RGB values between min (gas) and max (honey).
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );

  // Color constants, from the Java version
  var GAS_COLOR = new Color( 149, 142, 139 );
  var WATER_COLOR = new Color( 20, 244, 255 );
  var HONEY_COLOR = new Color( 255, 191, 0 );

  /**
   * @param {Property.<number>} fluidDensityProperty
   * @param {Range} fluidDensityRange
   * @constructor
   */
  function FluidColorModel( fluidDensityProperty, fluidDensityRange ) {
    var fluidColorModel = this;
    this.fluidDensityProperty = fluidDensityProperty;

    this.getRedLow = new LinearFunction( fluidDensityRange.min, Constants.WATER_DENSITY, GAS_COLOR.red,
      WATER_COLOR.red ); // @private
    this.getGreenLow = new LinearFunction( fluidDensityRange.min, Constants.WATER_DENSITY, GAS_COLOR.green,
      WATER_COLOR.green ); // @private
    this.getBlueLow = new LinearFunction( fluidDensityRange.min, Constants.WATER_DENSITY, GAS_COLOR.blue,
      WATER_COLOR.blue ); // @private

    this.getRedHigh = new LinearFunction( Constants.WATER_DENSITY, fluidDensityRange.max, WATER_COLOR.red,
      HONEY_COLOR.red ); // @private
    this.getGreenHigh = new LinearFunction( Constants.WATER_DENSITY, fluidDensityRange.max,
      WATER_COLOR.green, HONEY_COLOR.green ); // @private
    this.getBlueHigh = new LinearFunction( Constants.WATER_DENSITY, fluidDensityRange.max, WATER_COLOR.blue,
      HONEY_COLOR.blue ); // @private

    PropertySet.call( this, {
      color: WATER_COLOR // @public (read-only)
    } );

    // For low density values, vary between gasoline and water.
    // For high density values vary between water and honey.
    this.densityChanged = false;
    fluidDensityProperty.link( function( density ) {
      fluidColorModel.densityChanged = true;
    } );
  }

  fluidPressureAndFlow.register( 'FluidColorModel', FluidColorModel );

  return inherit( PropertySet, FluidColorModel, {
    step: function(){
      if ( this.densityChanged ) {
        var density = this.fluidDensityProperty.get();
        if ( density < Constants.WATER_DENSITY ) {
          this.color = new Color( this.getRedLow( density ), this.getGreenLow( density ), this.getBlueLow( density ) );
        }
        else {
          this.color = new Color( this.getRedHigh( density ), this.getGreenHigh( density ), this.getBlueHigh( density ) );
        }
        this.densityChanged = false;
      }
    }
  } );
} );
