// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Water drop model
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/23/2014.
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  var inherit = require( 'PHET_CORE/inherit' );

  // constants
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/watertower/Constants' );

  /**
   * @param {Vector2} position of the water drop
   * @param {Vector2} velocity of the water drop
   * @param {Number} volume of the water drop in m3
   * @constructor
   */
  function WaterDrop( position, velocity, volume ) {

    PropertySet.call( this, {
      position: position,
      velocity: velocity,
      volume: volume
    } );

    // node holds a reference to the waterdrop node. This is used to remove the view element when the water drop is no longer necessary.
    // This is a shortcut to prevent having removal listeners for individual drops.
    this.node = null;

    this.addDerivedProperty( 'radius', ['volume'], function( volume ) {
      return Util.cubeRoot( (3 * volume) / (4 * Math.PI) );
    } );
  }

  return inherit( PropertySet, WaterDrop, {
    step: function( dt ) {

      // v_f = v_i + a * dt
      var acceleration = new Vector2( 0, -Constants.EARTH_GRAVITY );
      var v_i = this.velocity;
      this.velocity = this.velocity.plus( acceleration.times( dt ) );

      // d = (v_f + v_i) * dt/2; assuming constant acceleration
      var displacement = this.velocity.plus( v_i ).times( dt / 2 );
      this.position = this.position.plus( displacement );
    },

    /**
     * Checks if the given point is within this water point.
     * @param {Vector2} point
     */
    contains: function( point ) {
      return point.distanceXY( this.position.x, this.position.y ) < this.radius;
    }
  } );
} );