// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * PipeCrossSection
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

    /* translateTop: function( dx, dy ) {
     this.top.set( this.top.x + dx, this.getTop().y + dy );
     },

     translateBottom: function( dx, dy ) {
     this.bottom.set( this.bottom.x + dx, this.getBottom().y + dy );
     },*/

    getX: function() {
      return this.x;
    },

    getHeight: function() {
      return this.yTop - this.yBottom;
    },

    /* reset: function() {
     this.top.reset();
     this.bottom.reset();
     },*/

    getCenterY: function() {
      return ( this.yTop + this.yBottom ) / 2;
    }
    //Translate both top and bottom parts of the pipe
    /*translate: function( dx, dy ) {
     this.translateTop( dx, dy );
     this.translateBottom( dx, dy );
     }*/
  } );
} );


