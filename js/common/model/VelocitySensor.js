// Copyright 2014-2015, University of Colorado Boulder

/**
 * VelocitySensor that has a position and measures velocity
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/24/2014.
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Property = require( 'AXON/Property' );
  var Sensor = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Sensor' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Vector2} position of the sensor
   * @param {Vector2} value Velocity as measured by the sensor
   * @constructor
   */
  function VelocitySensor( position, value ) {
    Sensor.call( this, position, value );

    // @public
    this.isArrowVisibleProperty = new DerivedProperty( [ this.valueProperty ], function( value ) {
      return value.magnitude() > 0;
    } );

    Property.preventGetSet( this, 'isArrowVisible' );
  }

  fluidPressureAndFlow.register( 'VelocitySensor', VelocitySensor );

  return inherit( Sensor, VelocitySensor );
} );