// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * FluxMeter
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define(function (require) {
  'use strict';

  var inherit = require('PHET_CORE/inherit');
  var PropertySet = require('AXON/PropertySet');

  function FluxMeter(pipe) {
    var fluxMeter = this;
    PropertySet.call(this, {
      visible: false,//flag that indicates whether the flux meter is visible
      x: 0,
      area: 0,
      flux: 0
    });

    // Compute the area as the pi * r * r of the pipe, and make sure it updates when the user drags the cross section or deforms the pipe
    this.area = pipe.getCrossSectionalArea( fluxMeter.x );


    //Assume incompressible fluid (like water), so the flow rate must remain constant throughout the pipe
    //flux = rate / area, so rate = flux * area
    this.flux = pipe.flowRate / this.area;

/*
    this.getTop = function() {
      return pipe.getPoint( this.x.get(), 1 );
    };

    this.getBottom=function() {
      return pipe.getPoint( this.x.get(), 0 );
    }*/
  }

  return inherit(PropertySet, FluxMeter);
});