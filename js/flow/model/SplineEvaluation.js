// Copyright 2014-2015, University of Colorado Boulder

/**
 * Use these modified variants of numeric.js spline code because they are much faster!
 * Code copied from numeric.js and hence licensed under MIT
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );

  //The most important function for this sim in numeric.js is just too slow because it uses tensor versions of all functions.
  //This version inlines everything.
  var _at = function( spline, x1, p ) {
    var x = spline.x;
    var yl = spline.yl;
    var yr = spline.yr;
    var kl = spline.kl;
    var kr = spline.kr;
    var a;
    var b;
    var t;
    a = (kl[ p ] * (x[ p + 1 ] - x[ p ])) - (yr[ p + 1 ] - yl[ p ]);
    b = kr[ p + 1 ] * (x[ p ] - x[ p + 1 ]) + yr[ p + 1 ] - yl[ p ];
    t = (x1 - x[ p ]) / (x[ p + 1 ] - x[ p ]);
    var s = t * (1 - t);
    return ((1 - t) * yl[ p ] + t * yr[ p + 1 ] +
           a * s * (1 - t) ) +
           b * s * t;
  };

  var atNumber = function( spline, x0 ) {
    var x = spline.x;
    var n = x.length;
    var p;
    var q;
    var mid;
    var floor = Math.floor;
    p = 0;
    q = n - 1;
    while ( q - p > 1 ) {
      mid = floor( (p + q) / 2 );
      if ( x[ mid ] <= x0 ) {
        p = mid;
      }
      else {
        q = mid;
      }
    }
    return _at( spline, x0, p );
  };

  var atArray = function( spline, x0 ) {
    var n = x0.length;
    var i;
    var ret = new Array( n );
    for ( i = n - 1; i !== -1; --i ) {
      ret[ i ] = atNumber( spline, x0[ i ] );
    }
    return ret;
  };

  var SplineEvaluation = { atNumber: atNumber, atArray: atArray };

  fluidPressureAndFlow.register( 'SplineEvaluation', SplineEvaluation );

  return SplineEvaluation;
} );