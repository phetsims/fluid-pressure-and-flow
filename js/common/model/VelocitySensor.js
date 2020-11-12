// Copyright 2014-2020, University of Colorado Boulder

/**
 * VelocitySensor that has a position and measures velocity
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import Sensor from './Sensor.js';

class VelocitySensor extends Sensor {

  /**
   * @param {Vector2} position of the sensor
   * @param {Vector2} value Velocity as measured by the sensor
   */
  constructor( position, value ) {

    super( position, value );

    // @public
    this.isArrowVisibleProperty = new DerivedProperty( [ this.valueProperty ], value => value.magnitude > 0 );
  }
}

fluidPressureAndFlow.register( 'VelocitySensor', VelocitySensor );
export default VelocitySensor;