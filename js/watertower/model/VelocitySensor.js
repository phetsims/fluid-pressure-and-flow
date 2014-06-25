// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * VelocitySensor
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/24/2014.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Sensor = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/Sensor' );

  /**
   * @param {Vector2} position of the sensor
   * @param {Vector2} value Velocity as measured by the sensor
   * @constructor
   */
  function VelocitySensor( position, value ) {
    Sensor.call( this, position, value );
  }

  return inherit( Sensor, VelocitySensor );
} );