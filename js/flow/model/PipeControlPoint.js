// Copyright 2014-2017, University of Colorado Boulder

/**
 * Data structure for a control point. Modified from energy-skate-park/js/model/ControlPoint.js.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * A control point that can be dragged around to change the shape of the pipe
   * @param {number} x position of the control point
   * @param {number} y position of the control point
   * @constructor
   */
  function PipeControlPoint( x, y ) {
    this.positionProperty = new Property( new Vector2( x, y ) );
  }

  fluidPressureAndFlow.register( 'PipeControlPoint', PipeControlPoint );

  return inherit( Object, PipeControlPoint, {
    reset: function() {
      this.positionProperty.reset();
    }
  } );
} );