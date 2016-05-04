// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for a generic sensor with position and value.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Vector2} position of the sensor
   * @param {Object} value as measured by the sensor
   * @constructor
   */
  function Sensor( position, value ) {
    PropertySet.call( this, {
      position: position, // @public
      value: value // @public
    } );
  }

  fluidPressureAndFlow.register( 'Sensor', Sensor );

  return inherit( PropertySet, Sensor, {
    reset: function() {
      this.positionProperty.reset();
    }
  } );
} );
