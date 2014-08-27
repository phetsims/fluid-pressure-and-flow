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
   * @param {Vector2} position of the particle
   * @param {Number} fractionUpPipe
   * @param {Pipe} container holding the particle
   * @param {Number} radius of the particle
   * @param {string} color of the particle
   * @constructor
   */
  function Particle( position, fractionUpPipe, container, radius, color ) {
    this.position = position;
    this.fractionUpPipe = fractionUpPipe;
    this.container = container;
    this.radius = radius;
    this.color = color;
  }

  return inherit( Object, Particle, {

    getX: function() {
      return this.position.x;
    },

    getY: function() {
      return this.container.fractionToLocation( this.getX(), this.fractionUpPipe );
    },

    setX: function( x ) {
      this.position.x = x;
    },

    getPosition: function() {
      return this.position;
    },

    getRadius: function() {
      return this.radius;
    }
  } );
} );