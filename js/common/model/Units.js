// Copyright 2002-2013, University of Colorado Boulder

/**
 * model for units conversion
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  var atmString = require( 'string!UNDER_PRESSURE/atm' );
  var psiString = require( 'string!UNDER_PRESSURE/psi' );
  var kPaString = require( 'string!UNDER_PRESSURE/kPa' );

  var valueWithUnitsPattern = require( 'string!UNDER_PRESSURE/valueWithUnitsPattern' );

  var ftPerSPerS = require( 'string!UNDER_PRESSURE/ftPerSPerS' );
  var mPerSPerS = require( 'string!UNDER_PRESSURE/mPerSPerS' );
  var densityUnitsEnglish = require( 'string!UNDER_PRESSURE/densityUnitsEnglish' );
  var densityUnitsMetric = require( 'string!UNDER_PRESSURE/densityUnitsMetric' );


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
          return (pressure / 1000).toFixed( 3 ) + ' ' + kPaString;
        }
      },
      atmosphere: function( pressure ) {
        if ( pressure === '' ) {
          return '-';
        }
        else {
          return (pressure * self.ATMOSPHERE_PER_PASCAL).toFixed( 4 ) + ' ' + atmString;
        }
      },
      english: function( pressure ) {
        if ( pressure === '' ) {
          return '-';
        }
        else {
          return (pressure * self.PSI_PER_PASCAL).toFixed( 4 ) + ' ' + psiString;
        }
      }
    };

    this.getGravityString = function() {
      if ( model.measureUnits === 'english' ) {
        return StringUtils.format( valueWithUnitsPattern, (self.GRAVITY_ENGLISH_PER_METRIC * model.gravity).toFixed( 1 ), ftPerSPerS );
      }
      else {
        return StringUtils.format( valueWithUnitsPattern, model.gravity, mPerSPerS );
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