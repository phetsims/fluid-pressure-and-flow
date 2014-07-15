// Copyright 2002-2013, University of Colorado Boulder

/**
 * Units conversion utility. Modified from under-pressure
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var Util = require( 'DOT/Util' );

  // strings
  var psiString = require( 'string!FLUID_PRESSURE_AND_FLOW/psi' );
  var kPaString = require( 'string!FLUID_PRESSURE_AND_FLOW/kPa' );

  // constants
  var FEET_PER_METER = 3.2808399;
  var PSI_PER_PASCAL = 145.04E-6;

  return {

    FLUID_DENSITY_ENGLISH_PER_METRIC: 62.4 / 1000.0,

    feetToMeters: function( feet ) {
      return feet / FEET_PER_METER;
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

      english: function( pressure ) {
        if ( pressure === '' ) {
          return '-';
        }
        else {
          return  Util.toFixed( pressure * PSI_PER_PASCAL, 4 ) + ' ' + psiString;
        }
      }
    }
  };
} );
