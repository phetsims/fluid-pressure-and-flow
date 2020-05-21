// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model for the flux meter tool in the flow tab of FPAF sim. Measures the flux at a given cross section
 * using the cross section area and flow rate. All units are in metric.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class FluxMeter {

  /**
   * @param {Pipe} pipe for which the flux needs to be measured at a particular cross section.
   */
  constructor( pipe ) {

    // pipe that the flux meter attaches to and measures
    this.pipe = pipe;

    // @public {Property.<number>} in meters. The flux meter can be dragged horizontally across the pipe
    this.xPositionProperty = new Property( -6.5 );

    // @public
    this.updateEmitter = new Emitter();
  }

  /**
   * @public
   */
  reset() {
    this.xPositionProperty.reset();
  }

  /**
   * Compute the area as the pi * r * r of the pipe at the cross section where the flux meter is currently positioned
   * Returns the area in meters squared
   * @public
   */
  getArea() {
    return this.pipe.getCrossSectionalArea( this.xPositionProperty.value );
  }

  /**
   * Returns the flow rate in liters per sec (L/s)
   * @public
   */
  getFlowRate() {
    return this.pipe.flowRateProperty.value;
  }

  /**
   * Assume incompressible fluid (like water), so the flow rate must remain constant throughout the pipe
   * flux = rate / area
   * @returns {number}
   * @public
   */
  getFlux() {
    return this.getFlowRate() / this.getArea();
  }
}

fluidPressureAndFlow.register( 'FluxMeter', FluxMeter );
export default FluxMeter;