// Copyright 2002-2013, University of Colorado Boulder

/**
 * Use these modified variants of numeric.js spline code because they are much faster!
 * Code copied from numeric.js and hence licensed under MIT
 *
 * @author Sam Reid
 */
define( function() {
  'use strict';

  //The most important function for this sim in numeric.js is just too slow because it uses tensor versions of all functions.
  //This version inlines everything.
  var _at = function( spline, x1, p ) {
    var x = spline.x;
    var yl = spline.yl;
    var yr = spline.yr;
    var kl = spline.kl;
    var kr = spline.kr;
    var a, b, t;
    a = (kl[p] * (x[p + 1] - x[p])) - (yr[p + 1] - yl[p]);
    b = kr[p + 1] * (x[p] - x[p + 1]) + yr[p + 1] - yl[p];
    t = (x1 - x[p]) / (x[p + 1] - x[p]);
    var s = t * (1 - t);
    return ((1 - t) * yl[p] + t * yr[p + 1] +
            a * s * (1 - t) ) +
           b * s * t;
  };

  var atNumber = function( spline, x0 ) {
    var x = spline.x;
    var n = x.length;
    var p, q, mid, floor = Math.floor;
    p = 0;
    q = n - 1;
    while ( q - p > 1 ) {
      mid = floor( (p + q) / 2 );
      if ( x[mid] <= x0 ) {
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
    var i, ret = new Array( n );
    for ( i = n - 1; i !== -1; --i ) {
      ret[i] = atNumber( spline, x0[i] );
    }
    return ret;
  };

  return {atNumber: atNumber, atArray: atArray};
} );