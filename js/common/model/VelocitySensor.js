// Copyright 2014-2019, University of Colorado Boulder

/**
 * VelocitySensor that has a position and measures velocity
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Sensor = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Sensor' );

  class VelocitySensor extends Sensor {

    /**
     * @param {Vector2} position of the sensor
     * @param {Vector2} value Velocity as measured by the sensor
     */
    constructor( position, value ) {

      super( position, value );

      // @public
      this.isArrowVisibleProperty = new DerivedProperty( [ this.valueProperty ], function( value ) {
        return value.magnitude > 0;
      } );
    }
  }

  return fluidPressureAndFlow.register( 'VelocitySensor', VelocitySensor );
} );