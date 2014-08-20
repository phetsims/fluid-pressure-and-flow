// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * PipeCrossSection
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define(function (require) {
  'use strict';

  var inherit = require('PHET_CORE/inherit');
  var PropertySet = require('AXON/PropertySet');
  var Vector2 = require('DOT/Vector2');

  /**
   * Represents a vertical cross section/slice of the pipe.
   * @param {Number} x represents the x value of the cross section
   * @param {Number} yBottom represents the bottom most point of the cross section
   * @param {Number} yTop represents the top most point of the cross section
   * @constructor
   */
  function PipeCrossSection(x, yBottom, yTop) {

    PropertySet.call(this, {
      top: new Vector2(x, yTop),
      bottom: new Vector2(x, yBottom)
    });
  }

  return inherit(PropertySet, PipeCrossSection, {
    getTop: function () {
      return this.top;
    },
    getBottom: function () {
      return this.bottom;
    },

    translateTop: function (dx, dy) {
      this.top.set(this.top.x + dx, this.getTop().y + dy);
    },

    translateBottom: function (dx, dy) {
      this.bottom.set(this.bottom.x + dx, this.getBottom().y + dy);
    },

    getX: function () {
      return this.top.x;
    },

    getHeight: function () {
      return this.getTop().y - this.getBottom().y;
    },
    reset: function () {
      this.top.reset();
      this.bottom.reset();
    },

    getCenterY: function () {
      return ( this.top.y + this.bottom.y ) / 2;
    },
    //Translate both top and bottom parts of the pipe
    translate: function (dx, dy) {
      this.translateTop(dx, dy);
      this.translateBottom(dx, dy);
    }
  });
});


