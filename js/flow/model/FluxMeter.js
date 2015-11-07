// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the flux meter tool in the flow tab of FPAF sim. Measures the flux at a given cross section
 * using the cross section area and flow rate. All units are in metric.
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Constructor for the flux meter.
   * @param {Pipe} pipe for which the flux needs to be measured at a particular cross section.
   * @constructor
   */
  function FluxMeter( pipe ) {

    // pipe that the flux meter attaches to and measures
    this.pipe = pipe;
    PropertySet.call( this, {

      //The flux meter can be dragged horizontally across the pipe
      xPosition: -6.5 //in meters
    } );
  }

  return inherit( PropertySet, FluxMeter, {

    // Compute the area as the pi * r * r of the pipe at the cross section where the flux meter is currently positioned
    // Returns the area in meters squared
    getArea: function() {
      return this.pipe.getCrossSectionalArea( this.xPosition );
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