// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Data structure for a control point. Modified from energy-skate-park/js/model/ControlPoint.js.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * A control point that can be dragged around to change the shape of the pipe
   * @param {number} x position of the control point
   * @param {number} y position of the control point
   * @constructor
   */
  function PipeControlPoint( x, y ) {

    PropertySet.call( this, {
      position: new Vector2( x, y )
    } );
  }

  return inherit( PropertySet, PipeControlPoint );
} );