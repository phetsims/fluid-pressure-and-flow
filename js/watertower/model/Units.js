// Copyright 2002-2013, University of Colorado Boulder

/**
 * model for units conversion
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  //modules
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );

  //strings
  var atmString = require( 'string!FLUID_PRESSURE_AND_FLOW/atm' );
  var psiString = require( 'string!FLUID_PRESSURE_AND_FLOW/psi' );
  var kPaString = require( 'string!FLUID_PRESSURE_AND_FLOW/kPa' );
  var valueWithUnitsPattern = require( 'string!FLUID_PRESSURE_AND_FLOW/valueWithUnitsPattern' );
  var ftPerSPerS = require( 'string!FLUID_PRESSURE_AND_FLOW/ftPerSPerS' );
  var mPerSPerS = require( 'string!FLUID_PRESSURE_AND_FLOW/mPerSPerS' );
  var densityUnitsEnglish = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsEnglish' );
  var densityUnitsMetric = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsMetric' );

  function Units( model ) {
    var self = this;

    this.ATMOSPHERE_PER_PASCAL = 9.8692E-6;
    this.PSI_PER_PASCAL = 145.04E-6;
    this.FEET_PER_METER = 3.2808399;
    this.GRAVITY_ENGLISH_PER_METRIC = 32.16 / 9.80665; //http://evaosd.fartoomuch.info/library/units.htm
    this.FLUIDDENSITY_ENGLISH_PER_METRIC = 62.4 / 1000.0;

    this.getPressureString = {
      metric: function( pressure ) {
        if ( pressure === '' ) {
          return '-';
        }
        else {
          return Util.toFixed( pressure / 1000, 3 ) + ' ' + kPaString;
        }
      },
      atmosphere: function( pressure ) {
        if ( pressure === '' ) {
          return '-';
        }
        else {
          return Util.toFixed( pressure * self.ATMOSPHERE_PER_PASCAL, 4 ) + ' ' + atmString;
        }
      },
      english: function( pressure ) {
        if ( pressure === '' ) {
          return '-';
        }
        else {
          return  Util.toFixed( pressure * self.PSI_PER_PASCAL, 4 ) + ' ' + psiString;
        }
      }
    };

    this.getGravityString = function() {
      if ( model.measureUnits === 'english' ) {
        return StringUtils.format( valueWithUnitsPattern, Util.toFixed( self.GRAVITY_ENGLISH_PER_METRIC * model.gravity, 1 ), ftPerSPerS );
      }
      else {
        return StringUtils.format( valueWithUnitsPattern, Util.toFixed( model.gravity, 1 ), mPerSPerS );
      }
    };

    this.getFluidDensityString = function() {
      if ( model.measureUnits === 'english' ) {
        return StringUtils.format( valueWithUnitsPattern, Math.round( self.FLUIDDENSITY_ENGLISH_PER_METRIC * model.fluidDensity ), densityUnitsEnglish );
      }
      else {
        return StringUtils.format( valueWithUnitsPattern, Math.round( model.fluidDensity ), densityUnitsMetric );
      }
    };

    this.feetToMeters = function( feet ) {
      return feet / this.FEET_PER_METER;
    };
  }

  return Units;
} )
;