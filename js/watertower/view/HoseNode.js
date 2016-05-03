// Copyright 2014-2015, University of Colorado Boulder

/**
 * HoseNode represents a draggable and bendable hose.
 * The hose can be expanded in the y direction by dragging the attached handle.
 * Hose can be bent about its elbow by dragging the spout handle. The rotation is limited to 90 degrees.
 * Hose adjusts its height and width to ensure that the nozzle is always above the ground.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 7/4/2014.
 */

define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  // images
  var nozzleImg = require( 'image!FLUID_PRESSURE_AND_FLOW/nozzle.png' );
  var spoutHandleImg = require( 'image!FLUID_PRESSURE_AND_FLOW/spout-handle.png' );
  var handle = require( 'image!FLUID_PRESSURE_AND_FLOW/handle.png' );

  // view constants
  var CORNER_RADIUS = 3; //px

  /**
   * HoseNode constructor
   * @param {Hose} hose model
   * @param {Property.<Vector2>} tankPositionProperty the bottom left of the tank frame
   * @param {ModelViewTransform2} modelViewTransform transform to convert between model and view values
   * @param {Property.<boolean>} isHoseVisibleProperty controls the hose visibility
   * @param {Object} [options]
   * @constructor
   */
  function HoseNode( hose, tankPositionProperty, modelViewTransform, isHoseVisibleProperty, options ) {
    var hoseNode = this;
    Node.call( this );

    this.hose = hose;
    this.modelViewTransform = modelViewTransform;
    this.tankPositionProperty = tankPositionProperty;

    //When the hose is above
    if ( this.hose.elbowOuterY >= 0.2 * Math.cos( this.hose.angleWithVertical ) ) {
      this.hoseShape = createTopShape( this.hose, this.modelViewTransform );
    }
    else {
      this.hoseShape = createBottomShape( this.hose, this.modelViewTransform );
    }

    this.hosePath = new Path( this.hoseShape, { top: 100, stroke: 'grey', fill: '#00FF00' } );
    this.addChild( this.hosePath );

    this.handleNodeCenterX = (this.hose.elbowInnerX - (this.hose.L1 )) / 2 + this.hose.L1;

    this.handleNode = new Image( handle, {
      rotation: Math.PI,
      cursor: 'pointer',
      scale: 0.3,
      y: this.hosePath.bottom + this.modelViewTransform.modelToViewDeltaY( this.hose.width ),
      centerX: modelViewTransform.modelToViewX( this.handleNodeCenterX )
    } );
    this.addChild( this.handleNode );
    this.handleNode.touchArea = this.handleNode.localBounds.dilatedXY( 20, 20 );

    var clickYOffset;
    var initialHeight;
    this.handleNode.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        initialHeight = hoseNode.hose.height;
        clickYOffset = hoseNode.globalToParentPoint( e.pointer.point ).y;
      },
      drag: function( e ) {
        var deltaY = hoseNode.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        hoseNode.updateHoseHeight( -modelViewTransform.viewToModelDeltaY( deltaY ) + initialHeight );
      }
    } ) );

    var nozzle = new Image( nozzleImg, { scale: 0.75 } );

    this.spoutHandle = new Node( {
      children: [ new Image( spoutHandleImg ) ],
      scale: 0.75,
      cursor: 'pointer',
      bottom: nozzle.bottom,
      left: nozzle.right - 4
    } );
    this.spoutHandle.touchArea = this.spoutHandle.localBounds.dilatedXY( 10, 10 );

    this.spoutAndNozzle = new Node( {
      children: [ nozzle, this.spoutHandle ],
      bottom: this.modelViewTransform.modelToViewDeltaY( this.hose.nozzleAttachmentOuterY ) + 116 + 40 * Math.cos( this.hose.angle ),
      left: this.modelViewTransform.modelToViewX( this.hose.nozzleAttachmentOuterX ) - 19 * Math.sin( this.hose.angle ),
      rotation: this.hose.angleWithVertical
    } );

    this.addChild( this.spoutAndNozzle );

    var startX;
    var startY;
    var startPointAngle;
    var initialHoseAngle;
    this.spoutHandle.addInputListener( new SimpleDragHandler( {
      start: function( e ) {

        startY = hoseNode.globalToParentPoint( e.pointer.point ).y;
        startX = hoseNode.globalToParentPoint( e.pointer.point ).x;

        initialHoseAngle = hoseNode.hose.angle * 180 / Math.PI;

        var deltaY = hoseNode.modelViewTransform.modelToViewY( hoseNode.hose.rotationPivotY + hoseNode.tankPositionProperty.value.y ) - startY;
        var deltaX = hoseNode.modelViewTransform.modelToViewX( hoseNode.hose.rotationPivotX + hoseNode.tankPositionProperty.value.x + 10 ) - startX;

        startPointAngle = Math.atan2( deltaY, deltaX );
      },

      drag: function( e ) {

        var endY = hoseNode.globalToParentPoint( e.pointer.point ).y;
        var endX = hoseNode.globalToParentPoint( e.pointer.point ).x;

        var deltaY = hoseNode.modelViewTransform.modelToViewY( hoseNode.hose.rotationPivotY + hoseNode.tankPositionProperty.value.y ) - endY;
        var deltaX = hoseNode.modelViewTransform.modelToViewX( hoseNode.hose.rotationPivotX + hoseNode.tankPositionProperty.value.x + 10 ) - endX;

        if ( deltaY > 0 ) {
          return;
        }

        var finalPointAngle = Math.atan2( deltaY, deltaX );
        var angleMoved = (finalPointAngle - startPointAngle) * 180 / Math.PI;

        var angleToUpdate = initialHoseAngle - angleMoved;
        angleToUpdate = angleToUpdate > 90 ? 90 : angleToUpdate < 0 ? 0 : angleToUpdate;
        hoseNode.hose.angle = Math.PI * (angleToUpdate) / 180;
      }
    } ) );

    // add observers
    isHoseVisibleProperty.linkAttribute( this, 'visible' );

    hoseNode.setTranslation( modelViewTransform.modelToViewX( this.hose.initialPosition.x ), modelViewTransform.modelToViewY( this.hose.initialPosition.y ) );

    this.hose.on( 'updated', function() {
      hoseNode.update();
    } );

    this.mutate( options );
  }

  // creates the shape of the hose when the y-drag handle is above the top of the hole
  var createTopShape = function( hose, modelViewTransform ) {
    var shape = new Shape();
    shape = shape.moveTo( modelViewTransform.modelToViewX( hose.elbowOuterX ), modelViewTransform.modelToViewY( hose.elbowOuterY ) )
      .lineTo( modelViewTransform.modelToViewX( hose.nozzleAttachmentOuterX ), modelViewTransform.modelToViewY( hose.nozzleAttachmentOuterY ) )
      .lineTo( modelViewTransform.modelToViewX( hose.nozzleAttachmentInnerX ), modelViewTransform.modelToViewY( hose.nozzleAttachmentInnerY ) )
      .lineTo( modelViewTransform.modelToViewX( hose.elbowInnerX ), modelViewTransform.modelToViewY( hose.elbowInnerY ) - CORNER_RADIUS * Math.cos( hose.angleWithVertical ) )
      .arc( modelViewTransform.modelToViewX( hose.elbowInnerX ) - CORNER_RADIUS, modelViewTransform.modelToViewY( hose.elbowInnerY ) - CORNER_RADIUS, CORNER_RADIUS, hose.angleWithVertical, Math.PI / 2, false )
      .lineTo( modelViewTransform.modelToViewX( hose.L1 - hose.width ) + CORNER_RADIUS, modelViewTransform.modelToViewY( hose.elbowInnerY ) );

    if ( hose.elbowInnerY - hose.width > 0.6 ) {
      shape = shape.arc( modelViewTransform.modelToViewX( hose.L1 - hose.width ) + CORNER_RADIUS, modelViewTransform.modelToViewY( hose.elbowInnerY ) + CORNER_RADIUS, CORNER_RADIUS, -Math.PI / 2, Math.PI, true )
        .lineTo( modelViewTransform.modelToViewX( hose.L1 - hose.width ), modelViewTransform.modelToViewY( hose.width ) - CORNER_RADIUS )
        .arc( modelViewTransform.modelToViewX( hose.L1 - hose.width ) - CORNER_RADIUS, modelViewTransform.modelToViewY( hose.width ) - CORNER_RADIUS, CORNER_RADIUS, 0, Math.PI / 2, false );
    }

    shape = shape.lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( hose.width ) )
      .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( 0 ) );

    if ( hose.elbowInnerY - hose.width > 0.6 ) {
      shape = shape.lineTo( modelViewTransform.modelToViewX( hose.L1 ) - CORNER_RADIUS, modelViewTransform.modelToViewY( 0 ) )
        .arc( modelViewTransform.modelToViewX( hose.L1 ) - CORNER_RADIUS, modelViewTransform.modelToViewY( 0 ) - CORNER_RADIUS, CORNER_RADIUS, Math.PI / 2, 0, true )
        .lineTo( modelViewTransform.modelToViewX( hose.L1 ), modelViewTransform.modelToViewY( hose.elbowLowerY ) + CORNER_RADIUS )
        .arc( modelViewTransform.modelToViewX( hose.L1 ) + CORNER_RADIUS, modelViewTransform.modelToViewY( hose.elbowLowerY ) + CORNER_RADIUS, CORNER_RADIUS, Math.PI, -Math.PI / 2, false );
    }
    else {
      shape = shape.lineTo( modelViewTransform.modelToViewX( hose.L1 ), modelViewTransform.modelToViewY( hose.elbowLowerY ) );
    }

    shape = shape.lineTo( modelViewTransform.modelToViewX( hose.elbowLowerX ), modelViewTransform.modelToViewY( hose.elbowLowerY ) )
      .arc( modelViewTransform.modelToViewX( hose.elbowInnerX ), modelViewTransform.modelToViewY( hose.elbowInnerY ), modelViewTransform.modelToViewDeltaX( hose.width ),
        Math.PI / 2, hose.angleWithVertical, true );

    return shape;
  };

  // creates the shape of the hose when the y-drag handle is below (not above) the top of the hole
  var createBottomShape = function( hose, modelViewTransform ) {
    var shape = new Shape();
    shape = shape.moveTo( modelViewTransform.modelToViewX( hose.elbowOuterX ), modelViewTransform.modelToViewY( hose.elbowOuterY ) )
      .lineTo( modelViewTransform.modelToViewX( hose.nozzleAttachmentOuterX ), modelViewTransform.modelToViewY( hose.nozzleAttachmentOuterY ) )
      .lineTo( modelViewTransform.modelToViewX( hose.nozzleAttachmentInnerX ), modelViewTransform.modelToViewY( hose.nozzleAttachmentInnerY ) )
      .lineTo( modelViewTransform.modelToViewX( hose.elbowInnerX ), modelViewTransform.modelToViewY( hose.elbowInnerY ) - CORNER_RADIUS * Math.cos( hose.angleWithVertical ) )
      .arc( modelViewTransform.modelToViewX( hose.elbowInnerX ) - CORNER_RADIUS, modelViewTransform.modelToViewY( hose.elbowInnerY ) - CORNER_RADIUS, CORNER_RADIUS, hose.angleWithVertical, Math.PI / 2, false )
      .lineTo( modelViewTransform.modelToViewX( hose.L1 ) + CORNER_RADIUS, modelViewTransform.modelToViewY( hose.elbowInnerY ) );

    if ( -hose.elbowInnerY + hose.width > 0.6 ) {
      shape = shape.arc( modelViewTransform.modelToViewX( hose.L1 ) + CORNER_RADIUS, modelViewTransform.modelToViewY( hose.elbowInnerY ) - CORNER_RADIUS, CORNER_RADIUS, Math.PI / 2, Math.PI, false )
        .lineTo( modelViewTransform.modelToViewX( hose.L1 ), modelViewTransform.modelToViewY( hose.width ) + CORNER_RADIUS )
        .arc( modelViewTransform.modelToViewX( hose.L1 ) - CORNER_RADIUS, modelViewTransform.modelToViewY( hose.width ) + CORNER_RADIUS, CORNER_RADIUS, 0, -Math.PI / 2, true );
    }

    shape = shape.lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( hose.width ) )
      .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( 0 ) );

    if ( -hose.elbowInnerY + hose.width > 0.6 ) {
      shape = shape.lineTo( modelViewTransform.modelToViewX( hose.L1 - hose.width ) - CORNER_RADIUS, modelViewTransform.modelToViewY( 0 ) )
        .arc( modelViewTransform.modelToViewX( hose.L1 - hose.width ) - CORNER_RADIUS, modelViewTransform.modelToViewY( 0 ) + CORNER_RADIUS, CORNER_RADIUS, -Math.PI / 2, 0, false )
        .lineTo( modelViewTransform.modelToViewX( hose.L1 - hose.width ), modelViewTransform.modelToViewY( hose.elbowLowerY ) - CORNER_RADIUS )
        .arc( modelViewTransform.modelToViewX( hose.L1 - hose.width ) + CORNER_RADIUS, modelViewTransform.modelToViewY( hose.elbowLowerY ) - CORNER_RADIUS, CORNER_RADIUS, Math.PI, Math.PI / 2, true );
    }
    else {
      shape = shape.lineTo( modelViewTransform.modelToViewX( hose.L1 - hose.width ), modelViewTransform.modelToViewY( hose.elbowLowerY ) );
    }
    shape = shape.lineTo( modelViewTransform.modelToViewX( hose.elbowLowerX ), modelViewTransform.modelToViewY( hose.elbowLowerY ) )
      .arc( modelViewTransform.modelToViewX( hose.elbowInnerX ), modelViewTransform.modelToViewY( hose.elbowInnerY ), modelViewTransform.modelToViewDeltaX( hose.width ),
        Math.PI / 2, hose.angleWithVertical, true );

    return shape;
  };

  fluidPressureAndFlow.register( 'HoseNode', HoseNode );

  return inherit( Node, HoseNode, {
    /**
     * Updates the hose height while ensuring that the nozzle does not go below the ground
     * @param {number} height to which the hose needs to be expanded or contracted.
     * @private
     */
    updateHoseHeight: function( height ) {
      height = height > this.tankPositionProperty.value.y + 2 ? this.tankPositionProperty.value.y + 2 :
               height < this.tankPositionProperty.value.y - 25 ? this.tankPositionProperty.value.y - 25 : height;

      this.hose.height = height;
    },

    /**
     * Updates the hose node with the latest height and angle.
     * @private
     */
    update: function() {

      if ( this.hose.elbowOuterY >= 0.2 * Math.cos( this.hose.angleWithVertical ) ) {
        this.hosePath.setShape( createTopShape( this.hose, this.modelViewTransform ) );
        this.handleNodeCenterX = (this.hose.elbowInnerX - this.hose.L1 ) / 2 + this.hose.L1;
        this.handleNode.centerX = this.modelViewTransform.modelToViewX( this.handleNodeCenterX );
        this.handleNode.y = this.modelViewTransform.modelToViewY( this.hose.elbowInnerY ) - 115 - 119;
      }
      else {
        this.hosePath.setShape( createBottomShape( this.hose, this.modelViewTransform ) );
        this.handleNodeCenterX = (this.hose.elbowInnerX - (this.hose.L1)) / 2 + this.hose.L1;
        this.handleNode.centerX = this.modelViewTransform.modelToViewX( this.handleNodeCenterX );
        this.handleNode.y = this.hosePath.bottom + this.modelViewTransform.modelToViewDeltaY( this.hose.width );
      }

      this.spoutAndNozzle.setRotation( this.hose.angleWithVertical );
      this.spoutAndNozzle.bottom = this.modelViewTransform.modelToViewDeltaY( this.hose.nozzleAttachmentOuterY ) + 116 + 29 * Math.cos( this.hose.angle );
      this.spoutAndNozzle.left = this.modelViewTransform.modelToViewX( this.hose.nozzleAttachmentOuterX ) - 19 * Math.sin( this.hose.angle );
    },

    reset: function() {
      this.setTranslation( this.modelViewTransform.modelToViewX( this.hose.initialPosition.x ), this.modelViewTransform.modelToViewY( this.hose.initialPosition.y ) );
      this.hose.reset();
    }
  } );

} );