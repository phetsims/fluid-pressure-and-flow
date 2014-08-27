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
      xPosition: 0.5
    } );
  }

  return inherit( PropertySet, FluxMeter, {
    // Compute the area as the pi * r * r of the pipe, and make sure it updates when the user drags the cross section or deforms the pipe
    getArea: function() {
      return this.pipe.getCrossSectionalArea( this.xPosition );
    },

    //Assume incompressible fluid (like water), so the flow rate must remain constant throughout the pipe
    //flux = rate / area
    getFlux: function() {
      return this.pipe.flowRate * 1000 / this.getArea();
    }
  } );
} );