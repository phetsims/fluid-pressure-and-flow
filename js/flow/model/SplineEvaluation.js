// Copyright 2014-2021, University of Colorado Boulder

/**
 * Use these modified variants of numeric.js spline code because they are much faster!
 * Code copied from numeric.js and hence licensed under MIT
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

//The most important function for this sim in numeric.js is just too slow because it uses tensor versions of all functions.
//This version inlines everything.
function _at( spline, x1, p ) {
  const x = spline.x;
  const yl = spline.yl;
  const yr = spline.yr;
  const kl = spline.kl;
  const kr = spline.kr;
  const a = ( kl[ p ] * ( x[ p + 1 ] - x[ p ] ) ) - ( yr[ p + 1 ] - yl[ p ] );
  const b = kr[ p + 1 ] * ( x[ p ] - x[ p + 1 ] ) + yr[ p + 1 ] - yl[ p ];
  const t = ( x1 - x[ p ] ) / ( x[ p + 1 ] - x[ p ] );
  const s = t * ( 1 - t );
  return ( ( 1 - t ) * yl[ p ] + t * yr[ p + 1 ] +
         a * s * ( 1 - t ) ) +
         b * s * t;
}

function atNumber( spline, x0 ) {
  const x = spline.x;
  const n = x.length;
  const floor = Math.floor; //TODO why?
  let p = 0;
  let q = n - 1;
  let mid;
  while ( q - p > 1 ) {
    mid = floor( ( p + q ) / 2 );
    if ( x[ mid ] <= x0 ) {
      p = mid;
    }
    else {
      q = mid;
    }
  }
  return _at( spline, x0, p );
}

function atArray( spline, x0 ) {
  const n = x0.length;
  const ret = new Array( n );
  for ( let i = n - 1; i !== -1; --i ) {
    ret[ i ] = atNumber( spline, x0[ i ] );
  }
  return ret;
}

const SplineEvaluation = { atNumber: atNumber, atArray: atArray };

fluidPressureAndFlow.register( 'SplineEvaluation', SplineEvaluation );
export default SplineEvaluation;