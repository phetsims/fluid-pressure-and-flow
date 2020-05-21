// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model for a generic sensor with position and value.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

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

  /**
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.valueProperty.reset();
  }
}

fluidPressureAndFlow.register( 'Sensor', Sensor );
export default Sensor;