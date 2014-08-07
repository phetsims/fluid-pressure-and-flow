// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Particle model. Modified from watertower's WaterDrop
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var Util = require( 'DOT/Util' );
  var inherit = require( 'PHET_CORE/inherit' );

  // constants
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/flow/Constants' );

  /**
   * @param {Vector2} position of the particle
   * @param {Vector2} velocity of the particle
   * @param {Number} volume of the particle in m3
   * @constructor
   */
  function Particle( position, velocity, volume ) {

    PropertySet.call( this, {
      position: position,
      velocity: velocity,
      volume: volume
    } );

    // node holds a reference to the particle node. This is used to remove the view element when the particle is no longer necessary.
    // This is a shortcut to prevent having removal listeners for individual particles.
    this.node = null;

    this.addDerivedProperty( 'radius', ['volume'], function( volume ) {
      return Util.cubeRoot( (3 * volume) / (4 * Math.PI) );
    } );
  }

  return inherit( PropertySet, Particle, {
    step: function( dt ) {

      //Math is done component-wise to avoid too many allocations, see https://github.com/phetsims/fluid-pressure-and-flow/issues/46
      // v_f = v_i + a * dt
      var accelerationY = -Constants.EARTH_GRAVITY;

      var initialVelocityX = this.velocity.x;
      var initialVelocityY = this.velocity.y;

      this.velocity.setY( this.velocity.y + accelerationY * dt );
      this.velocityProperty._notifyObservers();

      // d = (v_f + v_i) * dt/2; assuming constant acceleration
      var displacementX = (this.velocity.x + initialVelocityX) * dt / 2;
      var displacementY = (this.velocity.y + initialVelocityY) * dt / 2;

      this.position.setXY( this.position.x + displacementX, this.position.y + displacementY );
      this.positionProperty._notifyObservers();
    },

    /**
     * Checks if the given point is within this particle.
     * @param {Vector2} point
     */
    contains: function( point ) {
      return point.distanceXY( this.position.x, this.position.y ) < this.radius;
    }
  } );
} );