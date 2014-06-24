// Copyright 2002-2013, University of Colorado Boulder

/**
 * model for units conversion
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  //modules
  var Util = require( 'DOT/Util' );
  var inherit = require( 'PHET_CORE/inherit' );

  //strings
  var atmString = require( 'string!FLUID_PRESSURE_AND_FLOW/atm' );
  var psiString = require( 'string!FLUID_PRESSURE_AND_FLOW/psi' );
  var kPaString = require( 'string!FLUID_PRESSURE_AND_FLOW/kPa' );

  function Units() {
  }

  return inherit( Object, Units, {}, {

    feetToMeters: function( feet ) {
      return feet / Units.FEET_PER_METER;
    },
    getPressureString: {
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
          return Util.toFixed( pressure * Units.ATMOSPHERE_PER_PASCAL, 4 ) + ' ' + atmString;
        }
      },
      english: function( pressure ) {
        if ( pressure === '' ) {
          return '-';
        }
        else {
          return  Util.toFixed( pressure * Units.PSI_PER_PASCAL, 4 ) + ' ' + psiString;
        }
      }
    },
    FEET_PER_METER: 3.2808399,
    FLUID_DENSITY_ENGLISH_PER_METRIC: 62.4 / 1000.0,
    ATMOSPHERE_PER_PASCAL: 9.8692E-6,
    PSI_PER_PASCAL: 145.04E-6,
    GRAVITY_ENGLISH_PER_METRIC: 32.16 / 9.80665 //http://evaosd.fartoomuch.info/library/units.htm
  } );
} );
