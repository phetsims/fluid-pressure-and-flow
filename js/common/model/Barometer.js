// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Barometer model
 * @author Siddhartha Chinthapally (Actual Concepts).
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Sensor = require( 'UNDER_PRESSURE/common/model/Sensor' );

  /**
   * @param {Vector2} position of the sensor
   * @param {number} value Pressure as measured by the sensor
   * @constructor
   */
  function Barometer( position, value ) {
    Sensor.call( this, position, value );
  }

  return inherit( Sensor, Barometer );
} );