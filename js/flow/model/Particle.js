// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Model for a simple spherical particle (Modified from watertower's WaterDrop). The red dots and black grid dots
 * in flow sim are modelled as Particles. Model contains properties for radius, color, position etc
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
    // position along the pipe's horizontal axis.
    this.xPosition = xPosition;
    // how far up the pipe, 0 = bottom, 1 = top
    this.fractionUpPipe = fractionUpPipe;
    // the pipe within which the particle travels
    this.container = container;

    this.radius = radius; // in meters
    this.color = color;
  }

  return inherit( Object, Particle, {
    // get particle x position
    getX: function() {
      return this.xPosition;
    },

    // get particle Y position
    getY: function() {
      return this.container.fractionToLocation( this.xPosition, this.fractionUpPipe );
    },

    // set particle x position
    setX: function( x ) {
      this.xPosition = x;
    }
  } );
} );