// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Hose
 * @author Siddhartha Chinthapally (Actual Concepts) on 7/4/2014.
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Hose constructor
   * @param {Number} height -- total vertical length of the hose
   * @param {Number} angle rotated in degrees by the spout measure from a horizontal line. Initially this will be 90.
   * @constructor
   */

  function Hose( height, angle ) {
    //Layout parameters for the Hose

    this.L1 = 0.5;
    this.H2 = 1.0; //initially 1  make it 0.3
    this.width = 0.3;   // initially 0.3   make it 0.25
    this.hoseWidth = 2.5;

    this.nozzleX = 0;
    this.nozzleY = 0;

    this.angle = angle;
    this.height = height;

    PropertySet.call( this, {
      enabled: false
    } );
  }

  return inherit( PropertySet, Hose );
} );

