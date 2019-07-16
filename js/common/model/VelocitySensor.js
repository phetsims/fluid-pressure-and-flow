// Copyright 2014-2019, University of Colorado Boulder

/**
 * VelocitySensor that has a position and measures velocity
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/24/2014.
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Sensor = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Sensor' );

  /**
   * @param {Vector2} position of the sensor
   * @param {Vector2} value Velocity as measured by the sensor
   * @constructor
   */
  function VelocitySensor( position, value ) {
    Sensor.call( this, position, value );

    // @public
    this.isArrowVisibleProperty = new DerivedProperty( [ this.valueProperty ], function( value ) {
      return value.magnitude > 0;
    } );
  }

  fluidPressureAndFlow.register( 'VelocitySensor', VelocitySensor );

  return inherit( Sensor, VelocitySensor );
} );