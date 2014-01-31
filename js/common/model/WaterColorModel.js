// Copyright 2002-2013, University of Colorado Boulder

/**
 * change water color when fluid density changes
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // imports
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  function WaterColourModel( model ) {
    var self = this;

    //from java version
    var GAS_COLOR = new Color( 128, 128, 128 ),
      WATER_COLOR = new Color( 100, 214, 247 ),
      HONEY_COLOR = new Color( 255, 191, 0 );

    var TOP_OPACITY = 120 / 255,
      BOTTOM_OPACITY = 200 / 255;

    var getRedLow = new LinearFunction( model.fluidDensityRange.min, model.WATER_DENSITY, GAS_COLOR.red, WATER_COLOR.red ),
      getGreenLow = new LinearFunction( model.fluidDensityRange.min, model.WATER_DENSITY, GAS_COLOR.green, WATER_COLOR.green ),
      getBlueLow = new LinearFunction( model.fluidDensityRange.min, model.WATER_DENSITY, GAS_COLOR.blue, WATER_COLOR.blue );

    var getRedHigh = new LinearFunction( model.WATER_DENSITY, model.fluidDensityRange.max, WATER_COLOR.red, HONEY_COLOR.red ),
      getGreenHigh = new LinearFunction( model.WATER_DENSITY, model.fluidDensityRange.max, WATER_COLOR.green, HONEY_COLOR.green ),
      getBlueHigh = new LinearFunction( model.WATER_DENSITY, model.fluidDensityRange.max, WATER_COLOR.blue, HONEY_COLOR.blue );

    PropertySet.call( this, {
      waterColor: WATER_COLOR
    } );

    this.setWaterColor = function( newWaterColor ) {
      self.bottomColor = new Color( newWaterColor.red - 20, newWaterColor.green - 20, newWaterColor.blue - 20, BOTTOM_OPACITY );
      self.topColor = new Color( newWaterColor.red + 20, newWaterColor.green + 20, newWaterColor.blue + 20, TOP_OPACITY );
      self.waterColor = newWaterColor;
    };

    var newWaterColor;
    model.fluidDensityProperty.link( function( density ) {
      if ( density < model.WATER_DENSITY ) {
        newWaterColor = new Color( getRedLow( density ), getGreenLow( density ), getBlueLow( density ) );
      }
      else {
        newWaterColor = new Color( getRedHigh( density ), getGreenHigh( density ), getBlueHigh( density ) );
      }
      self.setWaterColor( newWaterColor );
    } );
  }

  return inherit( PropertySet, WaterColourModel, {
    reset: function() {
      this.waterColor.reset();
    }
  } );
} );
