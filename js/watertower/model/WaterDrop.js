// Copyright 2014-2015, University of Colorado Boulder

/**
 * Water drop model
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/23/2014.
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Util = require( 'DOT/Util' );
  var inherit = require( 'PHET_CORE/inherit' );

  // constants
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );

  /**
   * @param {Vector2} position of the water drop
   * @param {Vector2} velocity of the water drop
   * @param {number} volume of the water drop in m3
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

    this.addDerivedProperty( 'radius', [ 'volume' ], function( volume ) {
      return Util.cubeRoot( (3 * volume) / (4 * Math.PI) );
    } );
  }

  fluidPressureAndFlow.register( 'WaterDrop', WaterDrop );

  return inherit( PropertySet, WaterDrop, {
    step: function( dt ) {

      //Math is done component-wise to avoid too many allocations, see https://github.com/phetsims/fluid-pressure-and-flow/issues/46
      // v_f = v_i + a * dt
      var accelerationY = -Constants.EARTH_GRAVITY;

      var initialVelocityX = this.velocity.x;
      var initialVelocityY = this.velocity.y;

      this.velocity.setY( this.velocity.y + accelerationY * dt );
      this.velocityProperty._notifyListeners();

      // d = (v_f + v_i) * dt/2; assuming constant acceleration
      var displacementX = (this.velocity.x + initialVelocityX) * dt / 2;
      var displacementY = (this.velocity.y + initialVelocityY) * dt / 2;

      this.position.setXY( this.position.x + displacementX, this.position.y + displacementY );
      this.positionProperty._notifyListeners();
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