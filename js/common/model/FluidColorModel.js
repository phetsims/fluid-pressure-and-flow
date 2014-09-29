// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Change fluid color when fluid density changes. For a given density the fluid color is got by linearly interpolating the
 * the RGB values between min (gas) and max (honey).
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Constants = require( 'UNDER_PRESSURE/common/Constants' );

  /**
   * @param {Property<Number>} fluidDensityProperty
   * @param {Range} fluidDensityRange
   * @constructor
   */
  function FluidColorModel( fluidDensityProperty, fluidDensityRange ) {
    var fluidColorModel = this;

    //from java version
    var GAS_COLOR = new Color( 149, 142, 139 );
    var WATER_COLOR = new Color( 20, 244, 255 );
    var HONEY_COLOR = new Color( 255, 191, 0 );

    var getRedLow = new LinearFunction( fluidDensityRange.min, Constants.WATER_DENSITY, GAS_COLOR.red, WATER_COLOR.red );
    var getGreenLow = new LinearFunction( fluidDensityRange.min, Constants.WATER_DENSITY, GAS_COLOR.green, WATER_COLOR.green );
    var getBlueLow = new LinearFunction( fluidDensityRange.min, Constants.WATER_DENSITY, GAS_COLOR.blue, WATER_COLOR.blue );

    var getRedHigh = new LinearFunction( Constants.WATER_DENSITY, fluidDensityRange.max, WATER_COLOR.red, HONEY_COLOR.red );
    var getGreenHigh = new LinearFunction( Constants.WATER_DENSITY, fluidDensityRange.max, WATER_COLOR.green, HONEY_COLOR.green );
    var getBlueHigh = new LinearFunction( Constants.WATER_DENSITY, fluidDensityRange.max, WATER_COLOR.blue, HONEY_COLOR.blue );

    PropertySet.call( this, {
      color: WATER_COLOR
    } );


    fluidDensityProperty.link( function( density ) {
      if ( density < Constants.WATER_DENSITY ) {
        fluidColorModel.color = new Color( getRedLow( density ), getGreenLow( density ), getBlueLow( density ) );
      }
      else {
        fluidColorModel.color = new Color( getRedHigh( density ), getGreenHigh( density ), getBlueHigh( density ) );
      }
    } );
  }

  return inherit( PropertySet, FluidColorModel );
} );
