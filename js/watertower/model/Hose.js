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
   * @param {Number} angle rotated in degrees by the spout, measured from a horizontal line. Initially this will be 90.
   * @constructor
   */

  function Hose( height, angle ) {
    //Layout parameters for the Hose

    this.L1 = 0.6; // length of the horizontal portion of the hose from the tank hole
    this.H2 = 0.6; // length of the vertical/horizontal portion of the hose attached to the spout and nozzle (not including spout/nozzle)
    this.width = 0.3; // diameter of the hose
    this.hoseLengthX = 2.5; //the total width of the hose node

    this.elbowOuterX = 0; //position of the elbow in model co-ordinates
    this.elbowOuterY = 0;

    this.angle = angle;
    this.height = height; //height between the two horizontal portions of the hose

    PropertySet.call( this, {
      enabled: false
    } );
  }

  return inherit( PropertySet, Hose );
} );

