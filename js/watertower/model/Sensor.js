// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Sensor
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/24/2014.
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Vector2} position of the sensor
   * @param {*} value as measured by the sensor
   * @constructor
   */
  function Sensor( position, value ) {
    PropertySet.call( this, {
      position: position,
      value: value
    } );
  }

  return inherit( PropertySet, Sensor, {
    reset: function() {
      this.positionProperty.reset();
      this.valueProperty.reset();
    }
  } );
} );
