// Copyright 2014-2019, University of Colorado Boulder

/**
 * Model for a generic sensor with position and value.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const Emitter = require( 'AXON/Emitter' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Property = require( 'AXON/Property' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  class Sensor {

    /**
     * @param {Vector2} position of the sensor
     * @param {Object} value as measured by the sensor
     */
    constructor( position, value ) {

      // @public
      this.positionProperty = new Vector2Property( position );

      // @public {Object}
      this.valueProperty = new Property( value );

      // @public
      this.updateEmitter = new Emitter();
    }

    reset() {
      this.positionProperty.reset();
      this.valueProperty.reset();
    }
  }

  return fluidPressureAndFlow.register( 'Sensor', Sensor );
} );
