// Copyright 2014-2015, University of Colorado Boulder

/**
 * Hose
 * @author Siddhartha Chinthapally (Actual Concepts) on 7/4/2014.
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Hose constructor
   * @param {number} height -- total vertical length of the hose
   * @param {number} angle rotated (in radians) by the spout, measured from a horizontal line. Initially this will be PI/2.
   * @constructor
   */

  function Hose( height, angle ) {
    //Layout parameters for the Hose

    this.L1 = 6.3; // length of the horizontal portion of the hose from the tank hole
    this.H2 = 2.1; // length of the vertical/horizontal portion of the hose attached to the spout and nozzle (not including spout/nozzle)
    this.width = 1.5; // diameter of the hose
    this.hoseLengthX = 17.5; //the total width of the hose node

    this.elbowOuterX = 0; //position of the elbow in model co-ordinates
    this.elbowOuterY = 0;
    this.initialPosition = new Vector2( 17, 22.8 );
    this.angleWithVertical = Math.PI / 2 - angle;

    this.H3 = 3.5; // spout height

    PropertySet.call( this, {
      //height increases downwards, decreases when the hose goes up. It will be negative when the hose is above the hole
      height: height,
      angle: angle
    } );

    this.update();

    Property.multilink( [ this.heightProperty, this.angleProperty ], function() {
      this.update();
    }.bind( this ) );

  }

  return inherit( PropertySet, Hose, {

    /**
     * @private
     * Updates hose dependant variables
     */
    update: function() {

      this.angleWithVertical = Math.PI / 2 - this.angle;
      this.rotationPivotX = this.hoseLengthX;
      this.rotationPivotY = -this.height + this.H2;
      this.nozzleAttachmentOuterX = this.rotationPivotX - this.H3 * Math.cos( this.angle ) + this.width / 2 * Math.sin( this.angle );
      this.nozzleAttachmentOuterY = this.rotationPivotY - this.H3 * Math.sin( this.angle ) - this.width / 2 * Math.cos( this.angle );
      this.elbowOuterX = this.nozzleAttachmentOuterX - this.H2 * Math.cos( this.angle );
      this.elbowOuterY = this.nozzleAttachmentOuterY - this.H2 * Math.sin( this.angle );
      this.nozzleAttachmentInnerX = this.nozzleAttachmentOuterX - this.width * Math.sin( this.angle );
      this.nozzleAttachmentInnerY = this.nozzleAttachmentOuterY + this.width * Math.cos( this.angle );
      this.elbowInnerX = this.nozzleAttachmentInnerX - this.H2 * Math.cos( this.angle );
      this.elbowInnerY = this.nozzleAttachmentInnerY - this.H2 * Math.sin( this.angle );
      this.elbowLowerX = this.elbowOuterX - this.width * Math.sin( this.angle );
      this.elbowLowerY = this.elbowOuterY - (this.width - this.width * Math.cos( this.angle ));
      this.trigger( 'updated' );
    }
  } );
} );

