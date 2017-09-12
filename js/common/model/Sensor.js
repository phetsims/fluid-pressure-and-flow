// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for a generic sensor with position and value.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var Events = require( 'AXON/Events' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Vector2} position of the sensor
   * @param {Object} value as measured by the sensor
   * @constructor
   */
  function Sensor( position, value ) {

    // @public (Property.<Vector2>}
    this.positionProperty = new Property( position );

    // @public (Object}
    this.valueProperty = new Property( value );

    Events.call( this );// TODO: Use Emitters
  }

  fluidPressureAndFlow.register( 'Sensor', Sensor );

  return inherit( Events, Sensor, {
    reset: function() {
      this.positionProperty.reset();
      this.valueProperty.reset();
    }
  } );
} );
