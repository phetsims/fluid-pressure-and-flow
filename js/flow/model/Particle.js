// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Particle model. Modified from watertower's WaterDrop
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @param {Number} xPosition of the particle in meters
   * @param {Number} fractionUpPipe represents the fractional position w.r.t to the cross section height. Takes a value between (0,1).
   * @param {Pipe} container holding the particle
   * @param {Number} radius of the particle
   * @param {string} color of the particle
   * @constructor
   */
  function Particle( xPosition, fractionUpPipe, container, radius, color ) {
    this.xPosition = xPosition;
    this.fractionUpPipe = fractionUpPipe;
    this.container = container;
    this.radius = radius;
    this.color = color;
  }

  return inherit( Object, Particle, {

    getX: function() {
      return this.xPosition;
    },

    getY: function() {
      return this.container.fractionToLocation( this.xPosition, this.fractionUpPipe );
    },

    setX: function( x ) {
      this.xPosition = x;
    },

    getRadius: function() {
      return this.radius;
    }
  } );
} );