// Copyright 2014-2017, University of Colorado Boulder

/**
 * Water drop model
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/23/2014.
 */
define( require => {
  'use strict';

  // modules
  const Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Util = require( 'DOT/Util' );

  /**
   * @param {Vector2} position of the water drop
   * @param {Vector2} velocity of the water drop
   * @param {number} volume of the water drop in m3
   * @constructor
   */
  function WaterDrop( position, velocity, volume ) {

    this.positionProperty = new Property( position );
    this.velocityProperty = new Property( velocity );
    this.volumeProperty = new Property( volume );

    // node holds a reference to the waterdrop node. This is used to remove the view element when the water drop is no longer necessary.
    // This is a shortcut to prevent having removal listeners for individual drops.
    this.node = null;

    this.radiusProperty = new DerivedProperty( [ this.volumeProperty ], function( volume ) {
      return Util.cubeRoot( (3 * volume) / (4 * Math.PI) );
    } );
  }

  fluidPressureAndFlow.register( 'WaterDrop', WaterDrop );

  return inherit( Object, WaterDrop, {
    step: function( dt ) {

      //Math is done component-wise to avoid too many allocations, see https://github.com/phetsims/fluid-pressure-and-flow/issues/46
      // v_f = v_i + a * dt
      const accelerationY = -Constants.EARTH_GRAVITY;

      const initialVelocityX = this.velocityProperty.value.x;
      const initialVelocityY = this.velocityProperty.value.y;

      this.velocityProperty.value.setY( this.velocityProperty.value.y + accelerationY * dt );
      this.velocityProperty._notifyListeners();

      // d = (v_f + v_i) * dt/2; assuming constant acceleration
      const displacementX = (this.velocityProperty.value.x + initialVelocityX) * dt / 2;
      const displacementY = (this.velocityProperty.value.y + initialVelocityY) * dt / 2;

      this.positionProperty.value.setXY( this.positionProperty.value.x + displacementX, this.positionProperty.value.y + displacementY );
      this.positionProperty._notifyListeners();
    },

    /**
     * Checks if the given point is within this water point.
     * @param {Vector2} point
     */
    contains: function( point ) {
      return point.distanceXY( this.positionProperty.value.x, this.positionProperty.value.y ) < this.radius;
    }
  } );
} );