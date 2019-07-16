// Copyright 2014-2019, University of Colorado Boulder

/**
 * Data structure for a control point. Modified from energy-skate-park/js/model/ControlPoint.js.
 *
 * @author Sam Reid
 */
define( require => {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  /**
   * A control point that can be dragged around to change the shape of the pipe
   * @param {number} x - position of the control point
   * @param {number} y - position of the control point
   * @constructor
   */
  function PipeControlPoint( x, y ) {
    this.positionProperty = new Vector2Property( new Vector2( x, y ) );
  }

  fluidPressureAndFlow.register( 'PipeControlPoint', PipeControlPoint );

  return inherit( Object, PipeControlPoint, {
    reset: function() {
      this.positionProperty.reset();
    }
  } );
} );