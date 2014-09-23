// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Model for a vertical cross section of pipe including the horizontal position, the bottom and top position.
 * All units in meters.
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Represents a vertical cross section/slice of the pipe.
   * @param {Number} x represents the x value of the cross section
   * @param {Number} yBottom represents the bottom most point of the cross section
   * @param {Number} yTop represents the top most point of the cross section
   * @constructor
   */
  function PipeCrossSection( x, yBottom, yTop ) {
    this.x = x;
    this.yBottom = yBottom;
    this.yTop = yTop;
  }

  return inherit( Object, PipeCrossSection, {

    getX: function() {
      return this.x;
    },

    getHeight: function() {
      return this.yTop - this.yBottom;
    },

    getCenterY: function() {
      return ( this.yTop + this.yBottom ) / 2;
    }
  } );
} );


