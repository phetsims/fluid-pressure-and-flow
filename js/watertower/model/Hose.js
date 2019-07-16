// Copyright 2014-2017, University of Colorado Boulder

/**
 * Hose
 * @author Siddhartha Chinthapally (Actual Concepts) on 7/4/2014.
 */

define( function( require ) {
  'use strict';

  // modules
  const Emitter = require( 'AXON/Emitter' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  /**
   * Hose constructor
   * @param {number} height -- total vertical length of the hose
   * @param {number} angle rotated (in radians) by the spout, measured from a horizontal line. Initially this will be PI/2.
   * @constructor
   */

  function Hose( height, angle ) {

    // Layout parameters for the Hose
    this.L1 = 6.3; // length of the horizontal portion of the hose from the tank hole
    this.H2 = 2.1; // length of the vertical/horizontal portion of the hose attached to the spout and nozzle (not including spout/nozzle)
    this.width = 1.5; // diameter of the hose
    this.hoseLengthX = 17.5; //the total width of the hose node

    this.elbowOuterX = 0; //position of the elbow in model co-ordinates
    this.elbowOuterY = 0;
    this.initialPosition = new Vector2( 17, 22.8 );
    this.angleWithVertical = Math.PI / 2 - angle;

    this.H3 = 3.5; // spout height

    // @public
    this.angleProperty = new Property( angle );

    // @public height increases downwards, decreases when the hose goes up. It will be negative when the hose is above the hole
    this.heightProperty = new Property( height );

    // @public emitted when the update function is called.
    this.updatedEmitter = new Emitter();

    this.update();

    Property.multilink( [ this.heightProperty, this.angleProperty ], function() {
      this.update();
    }.bind( this ) );

  }

  fluidPressureAndFlow.register( 'Hose', Hose );

  return inherit( Object, Hose, {

    /**
     * @private
     * Updates hose dependant variables
     */
    update: function() {

      var angle = this.angleProperty.get();

      this.angleWithVertical = Math.PI / 2 - angle;
      this.rotationPivotX = this.hoseLengthX;
      this.rotationPivotY = -this.heightProperty.value + this.H2;
      this.nozzleAttachmentOuterX = this.rotationPivotX - this.H3 * Math.cos( angle ) + this.width / 2 * Math.sin( angle );
      this.nozzleAttachmentOuterY = this.rotationPivotY - this.H3 * Math.sin( angle ) - this.width / 2 * Math.cos( angle );
      this.elbowOuterX = this.nozzleAttachmentOuterX - this.H2 * Math.cos( angle );
      this.elbowOuterY = this.nozzleAttachmentOuterY - this.H2 * Math.sin( angle );
      this.nozzleAttachmentInnerX = this.nozzleAttachmentOuterX - this.width * Math.sin( angle );
      this.nozzleAttachmentInnerY = this.nozzleAttachmentOuterY + this.width * Math.cos( angle );
      this.elbowInnerX = this.nozzleAttachmentInnerX - this.H2 * Math.cos( angle );
      this.elbowInnerY = this.nozzleAttachmentInnerY - this.H2 * Math.sin( angle );
      this.elbowLowerX = this.elbowOuterX - this.width * Math.sin( angle );
      this.elbowLowerY = this.elbowOuterY - (this.width - this.width * Math.cos( angle ));
      this.updatedEmitter.emit();
    },

    /**
     * @public
     * reset the public model properties
     */
    reset: function() {
      this.angleProperty.reset();
      this.heightProperty.reset();
    }
  } );
} );

