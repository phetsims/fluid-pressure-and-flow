// Copyright 2014-2019, University of Colorado Boulder

/**
 * Model for a vertical cross section of pipe including the horizontal position, the bottom and top position.
 * All units are in meters.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );

  class PipeCrossSection {

    /**
     * @param {number} x - represents the x value of the cross section
     * @param {number} yBottom - represents the bottom most point of the cross section
     * @param {number} yTop - represents the top most point of the cross section
     */
    constructor( x, yBottom, yTop ) {
      this.x = x;
      this.yBottom = yBottom;
      this.yTop = yTop;
    }

    getX() {
      return this.x;
    }

    getHeight() {
      return this.yTop - this.yBottom;
    }

    getCenterY() {
      return ( this.yTop + this.yBottom ) / 2;
    }
  }

  return fluidPressureAndFlow.register( 'PipeCrossSection', PipeCrossSection );
} );


