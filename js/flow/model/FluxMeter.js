// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * FluxMeter
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  function FluxMeter( pipe ) {
    this.pipe = pipe;
    PropertySet.call( this, {
      xPosition: -6.5 //m
    } );
  }

  return inherit( PropertySet, FluxMeter, {
    // Compute the area as the pi * r * r of the pipe at the crosssection where the flux meter is currently positioned
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