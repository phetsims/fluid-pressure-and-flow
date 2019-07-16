// Copyright 2014-2019, University of Colorado Boulder

/**
 * Model for the flux meter tool in the flow tab of FPAF sim. Measures the flux at a given cross section
 * using the cross section area and flow rate. All units are in metric.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( require => {
  'use strict';

  // modules
  const Emitter = require( 'AXON/Emitter' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Property = require( 'AXON/Property' );

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

    reset() {
      this.xPositionProperty.reset();
    }

    // Compute the area as the pi * r * r of the pipe at the cross section where the flux meter is currently positioned
    // Returns the area in meters squared
    getArea() {
      return this.pipe.getCrossSectionalArea( this.xPositionProperty.value );
    }

    // Returns the flow rate in liters per sec (L/s)
    getFlowRate() {
      return this.pipe.flowRateProperty.value;
    }

    //Assume incompressible fluid (like water), so the flow rate must remain constant throughout the pipe
    //flux = rate / area
    getFlux() {
      return this.getFlowRate() / this.getArea();
    }
  }

  return fluidPressureAndFlow.register( 'FluxMeter', FluxMeter );
} );