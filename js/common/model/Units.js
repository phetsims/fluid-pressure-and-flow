// Copyright 2002-2013, University of Colorado Boulder

/**
 * main Model container for mass object.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  var atmString = require( "string!UNDER_PRESSURE/atm" );
  var psiString = require( "string!UNDER_PRESSURE/psi" );
  var kPaString = require( "string!UNDER_PRESSURE/kPa" );

  function Units( model ) {
    var self = this;

    this.ATMOSPHERE_PER_PASCAL = 9.8692E-6;
    this.PSI_PER_PASCAL = 145.04E-6;

    this.FEET_PER_METER = 3.2808399;

    this.getPressureString = {
      metric: function( pressure ) {
        if ( pressure === "" ) {
          return "-"
        }
        else {
          return (pressure / 1000).toFixed( 3 ) + " " + kPaString;
        }
      },
      atmosphere: function( pressure ) {
        if ( pressure === "" ) {
          return "-"
        }
        else {
          return (pressure * self.ATMOSPHERE_PER_PASCAL).toFixed( 4 ) + " " + atmString;
        }
      },
      english: function( pressure ) {
        if ( pressure === "" ) {
          return "-"
        }
        else {
          return (pressure * self.PSI_PER_PASCAL).toFixed( 4 ) + " " + psiString;
        }
      }
    };


    this.feetToMeters = function( feets ) {
      return feets / this.FEET_PER_METER;
    };
  }

  return Units;
} )
;