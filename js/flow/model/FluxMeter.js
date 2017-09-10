// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the flux meter tool in the flow tab of FPAF sim. Measures the flux at a given cross section
 * using the cross section area and flow rate. All units are in metric.
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  // modules
  var Events = require( 'AXON/Events' );
  var Property = require( 'AXON/Property' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Constructor for the flux meter.
   * @param {Pipe} pipe for which the flux needs to be measured at a particular cross section.
   * @constructor
   */
  function FluxMeter( pipe ) {

    // pipe that the flux meter attaches to and measures
    this.pipe = pipe;

    // @public {Property.<number>} in meters. The flux meter can be dragged horizontally across the pipe
    this.xPositionProperty = new Property( -6.5 );

    Property.preventGetSet( this, 'xPosition' );

    Events.call( this );
  }

  fluidPressureAndFlow.register( 'FluxMeter', FluxMeter );

  return inherit( Events, FluxMeter, {

    reset: function() {
      this.xPositionProperty.reset();
    },

    // Compute the area as the pi * r * r of the pipe at the cross section where the flux meter is currently positioned
    // Returns the area in meters squared
    getArea: function() {
      return this.pipe.getCrossSectionalArea( this.xPositionProperty.value );
    },

    // Returns the flow rate in liters per sec (L/s)
    getFlowRate: function() {
      return this.pipe.flowRate;
    },

    //Assume incompressible fluid (like water), so the flow rate must remain constant throughout the pipe
    //flux = rate / area
    getFlux: function() {
      return this.getFlowRate() / this.getArea();
    }
  } );
} );