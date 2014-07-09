// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * HoseView
 * @author Siddhartha Chinthapally (Actual Concepts) on 7/4/2014.
 */

define( function( require ) {
  'use strict';

  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  var nozzleImg = require( 'image!FLUID_PRESSURE_AND_FLOW/nozzle.png' );
  var spoutHandleImg = require( 'image!FLUID_PRESSURE_AND_FLOW/spout-handle.png' );
  var handle = require( 'image!FLUID_PRESSURE_AND_FLOW/handle.png' );

  // view constants
  var CORNER_RADIUS = 4; //px

  /**
   *
   * @param {Hose} hose model
   * @param {Property<Vector2>} tankPositionProperty the bottom left of the tank frame
   * @param {ModelViewTransform2} modelViewTransform transform to convert between model and view values
   * @param {Property<Boolean>} isHoseVisibleProperty controls the hose visibility
   * @param options
   * @constructor
   */
  function HoseView( hose, tankPositionProperty, modelViewTransform, isHoseVisibleProperty, options ) {
    var hoseView = this;
    Node.call( this );

    this.hose = hose;
    this.modelViewTransform = modelViewTransform;
    this.hoseHeight = hose.height;
    this.hoseLengthX = hose.hoseLengthX;
    this.initialPosition = new Vector2( 180, 115 );

    this.tankPositionProperty = tankPositionProperty;

    this.angle = Math.PI * hose.angle / 180;

    this.angleWithVertical = Math.PI * (90 - hose.angle) / 180;  // angle with perpendicular

    this.computeInternalVariables();

    //When the hose is above
    if ( this.elbowOuterY >= 0 ) {
      this.hoseShape = this.getTopShape();
    }
    else {
      this.hoseShape = this.getBottomShape();
    }

    this.hosePath = new Path( this.hoseShape, {top: 100, stroke: 'grey', fill: '#00FF00'} );
    this.addChild( this.hosePath );

    this.handleNodeCenterX = (this.elbowInnerX - (this.hose.L1 + this.hose.width)) / 2 + this.hose.L1 + this.hose.width;

    this.handleNode = new Image( handle, { rotation: Math.PI, cursor: 'pointer', scale: 0.3, y: this.hosePath.bottom + modelViewTransform.modelToViewDeltaY( 0.3 ), centerX: modelViewTransform.modelToViewX( this.handleNodeCenterX )} );
    this.addChild( this.handleNode );

    var clickYOffset;
    var initialHeight;
    this.handleNode.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        initialHeight = hoseView.hoseHeight;
        clickYOffset = hoseView.globalToParentPoint( e.pointer.point ).y;
      },
      drag: function( e ) {
        var deltaY = hoseView.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        hoseView.updateHoseHeight( -modelViewTransform.viewToModelDeltaY( deltaY ) + initialHeight );
      }
    } ) );

    var nozzle = new Node( {children: [new Image( nozzleImg )], scale: 1.0 } );

    this.spoutHandle = new Node( {children: [new Image( spoutHandleImg )], scale: 1.0, cursor: 'pointer', bottom: nozzle.bottom, left: nozzle.right - 4} );

    this.spoutAndNozzle = new Node( { children: [nozzle, this.spoutHandle],
      bottom: this.modelViewTransform.modelToViewDeltaY( -this.hoseHeight + this.hose.H2 ) + 122 + 40 * Math.cos( this.angle ),
      left: this.modelViewTransform.modelToViewX( this.hoseLengthX ) - 26 * Math.sin( this.angle ),
      rotation: this.angleWithVertical
    } );

    this.addChild( this.spoutAndNozzle );

    var startX;
    var startY;
    var initialHoseAngle;

    this.spoutHandle.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        startY = hoseView.globalToParentPoint( e.pointer.point ).y;
        startX = hoseView.globalToParentPoint( e.pointer.point ).x;
        initialHoseAngle = hoseView.angle * 180 / Math.PI;
      },
      drag: function( e ) {

        var endY = hoseView.globalToParentPoint( e.pointer.point ).y;
        var endX = hoseView.globalToParentPoint( e.pointer.point ).x;

        //finding angle
        var deltaX = endX - startX + 40;
        var deltaY = endY - startY;

        // drag bounds
        if ( deltaX < 0 || deltaX > 180 ) {
          return;
        }

        if ( Math.abs( deltaY ) > 100 ) {
          return;
        }

        var angleMoved = Math.atan2( deltaY, deltaX );
        angleMoved = (angleMoved * 180 / Math.PI);    //radians to degree conversion

        var angleToUpdate = initialHoseAngle - angleMoved;
        angleToUpdate = angleToUpdate > 90 ? 90 : angleToUpdate < 0 ? 0 : angleToUpdate;

        hoseView.updateHoseAngle( angleToUpdate );
      }
    } ) );

    // add observers
    isHoseVisibleProperty.linkAttribute( this, 'visible' );

    hoseView.setTranslation( this.initialPosition );

    this.mutate( options );

  }

  return inherit( Node, HoseView, {
    updateHoseHeight: function( height ) {
      //bound the hose to ground and 3.3 mtr above the ground
      height = height > this.tankPositionProperty.value.y + 0.6 ? this.tankPositionProperty.value.y + 0.6 :
               height < this.tankPositionProperty.value.y - 2.5 ? this.tankPositionProperty.value.y - 2.5 : height;

      this.hoseHeight = height;
      this.update();
    },

    updateHoseAngle: function( angle ) {
      this.hose.angle = angle;
      this.angle = Math.PI * angle / 180;
      this.angleWithVertical = Math.PI * (90 - angle) / 180;
      this.update();
    },

    update: function() {

      this.computeInternalVariables();

      if ( this.elbowOuterY >= 0 ) {
        this.hosePath.setShape( this.getTopShape() );
        this.handleNodeCenterX = (this.elbowInnerX - this.hose.L1 ) / 2 + this.hose.L1;
        this.handleNode.centerX = this.modelViewTransform.modelToViewX( this.handleNodeCenterX );
        this.handleNode.y = this.modelViewTransform.modelToViewY( this.elbowInnerY ) - 115 - 112;
      }
      else {
        this.hosePath.setShape( this.getBottomShape() );
        this.handleNodeCenterX = (this.elbowInnerX - (this.hose.L1)) / 2 + this.hose.L1;
        this.handleNode.centerX = this.modelViewTransform.modelToViewX( this.handleNodeCenterX );
        this.handleNode.y = this.hosePath.bottom + this.modelViewTransform.modelToViewDeltaY( this.hose.width );
      }

      this.hose.height = this.hoseHeight;

      this.spoutAndNozzle.setRotation( this.angleWithVertical );
      this.spoutAndNozzle.bottom = this.modelViewTransform.modelToViewDeltaY( -this.hoseHeight + this.hose.H2 ) + 122 + 40 * Math.cos( this.angle );
      this.spoutAndNozzle.left = this.modelViewTransform.modelToViewX( this.hoseLengthX ) - 26 * Math.sin( this.angle );
    },

    reset: function() {
      this.setTranslation( this.initialPosition );
    },

    getTopShape: function() {
      var shape = new Shape();
      shape = shape.moveTo( this.modelViewTransform.modelToViewX( this.elbowOuterX ), this.modelViewTransform.modelToViewY( this.elbowOuterY ) )
        .lineTo( this.modelViewTransform.modelToViewX( this.hoseLengthX ), this.modelViewTransform.modelToViewY( -this.hoseHeight + this.hose.H2 ) )
        .lineTo( this.modelViewTransform.modelToViewX( this.nozzleAttachmentInnerX ), this.modelViewTransform.modelToViewY( this.nozzleAttachmentInnerY ) )
        .lineTo( this.modelViewTransform.modelToViewX( this.elbowInnerX ), this.modelViewTransform.modelToViewY( this.elbowInnerY ) - CORNER_RADIUS * Math.cos( this.angleWithVertical ) )
        .arc( this.modelViewTransform.modelToViewX( this.elbowInnerX ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.elbowInnerY ) - CORNER_RADIUS, CORNER_RADIUS, this.angleWithVertical, Math.PI / 2, false )
        .lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ) + CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.elbowInnerY ) );

      if ( this.elbowInnerY - this.hose.width > 0.1 ) {
        shape = shape.arc( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ) + CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.elbowInnerY ) + CORNER_RADIUS, CORNER_RADIUS, -Math.PI / 2, Math.PI, true )
          .lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ), this.modelViewTransform.modelToViewY( this.hose.width ) - CORNER_RADIUS )
          .arc( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.hose.width ) - CORNER_RADIUS, CORNER_RADIUS, 0, Math.PI / 2, false );
      }

      shape = shape.lineTo( this.modelViewTransform.modelToViewX( 0 ), this.modelViewTransform.modelToViewY( this.hose.width ) )
        .lineTo( this.modelViewTransform.modelToViewX( 0 ), this.modelViewTransform.modelToViewY( 0 ) );


      if ( this.elbowInnerY - this.hose.width > 0.1 ) {
        shape = shape.lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( 0 ) )
          .arc( this.modelViewTransform.modelToViewX( this.hose.L1 ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( 0 ) - CORNER_RADIUS, CORNER_RADIUS, Math.PI / 2, 0, true )
          .lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 ), this.modelViewTransform.modelToViewY( this.elbowLowerY ) + CORNER_RADIUS )
          .arc( this.modelViewTransform.modelToViewX( this.hose.L1 ) + CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.elbowLowerY ) + CORNER_RADIUS, CORNER_RADIUS, Math.PI, -Math.PI / 2, false );
      }
      else {
        shape = shape.lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 ), this.modelViewTransform.modelToViewY( this.elbowLowerY ) );
      }

      shape = shape.lineTo( this.modelViewTransform.modelToViewX( this.elbowLowerX ), this.modelViewTransform.modelToViewY( this.elbowLowerY ) )
        .arc( this.modelViewTransform.modelToViewX( this.elbowInnerX ), this.modelViewTransform.modelToViewY( this.elbowInnerY ), this.modelViewTransform.modelToViewDeltaX( this.hose.width ),
          Math.PI / 2, this.angleWithVertical, true );

      return shape;
    },

    getBottomShape: function() {
      var shape = new Shape();

      shape = shape.moveTo( this.modelViewTransform.modelToViewX( this.elbowOuterX ), this.modelViewTransform.modelToViewY( this.elbowOuterY ) )
        .lineTo( this.modelViewTransform.modelToViewX( this.hoseLengthX ), this.modelViewTransform.modelToViewY( -this.hoseHeight + this.hose.H2 ) )
        .lineTo( this.modelViewTransform.modelToViewX( this.nozzleAttachmentInnerX ), this.modelViewTransform.modelToViewY( this.nozzleAttachmentInnerY ) )
        .lineTo( this.modelViewTransform.modelToViewX( this.elbowInnerX ), this.modelViewTransform.modelToViewY( this.elbowInnerY ) - CORNER_RADIUS * Math.cos( this.angleWithVertical ) )
        .arc( this.modelViewTransform.modelToViewX( this.elbowInnerX ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.elbowInnerY ) - CORNER_RADIUS, CORNER_RADIUS, this.angleWithVertical, Math.PI / 2, false )
        .lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 ) + CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.elbowInnerY ) );

      if ( -this.elbowInnerY + this.hose.width > 0.1 ) {
        shape = shape.arc( this.modelViewTransform.modelToViewX( this.hose.L1 ) + CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.elbowInnerY ) - CORNER_RADIUS, CORNER_RADIUS, Math.PI / 2, Math.PI, false )
          .lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 ), this.modelViewTransform.modelToViewY( this.hose.width ) + CORNER_RADIUS )
          .arc( this.modelViewTransform.modelToViewX( this.hose.L1 ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.hose.width ) + CORNER_RADIUS, CORNER_RADIUS, 0, -Math.PI / 2, true );
      }

      shape = shape.lineTo( this.modelViewTransform.modelToViewX( 0 ), this.modelViewTransform.modelToViewY( this.hose.width ) )
        .lineTo( this.modelViewTransform.modelToViewX( 0 ), this.modelViewTransform.modelToViewY( 0 ) );

      if ( -this.elbowInnerY + this.hose.width > 0.1 ) {
        shape = shape.lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( 0 ) )
          .arc( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( 0 ) + CORNER_RADIUS, CORNER_RADIUS, -Math.PI / 2, 0, false )
          .lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ), this.modelViewTransform.modelToViewY( this.elbowLowerY ) - CORNER_RADIUS )
          .arc( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ) + CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.elbowLowerY ) - CORNER_RADIUS, CORNER_RADIUS, Math.PI, Math.PI / 2, true );
      }
      else {
        shape = shape.lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ), this.modelViewTransform.modelToViewY( this.elbowLowerY ) );
      }
      shape = shape.lineTo( this.modelViewTransform.modelToViewX( this.elbowLowerX ), this.modelViewTransform.modelToViewY( this.elbowLowerY ) )
        .arc( this.modelViewTransform.modelToViewX( this.elbowInnerX ), this.modelViewTransform.modelToViewY( this.elbowInnerY ), this.modelViewTransform.modelToViewDeltaX( this.hose.width ),
          Math.PI / 2, this.angleWithVertical, true );

      return shape;
    },

    computeInternalVariables: function() {
      this.elbowOuterX = this.hoseLengthX - this.hose.H2 * Math.cos( this.angle );
      this.elbowOuterY = -this.hoseHeight + this.hose.H2 - this.hose.H2 * Math.sin( this.angle );
      this.nozzleAttachmentInnerX = this.hoseLengthX - this.hose.width * Math.sin( this.angle );
      this.nozzleAttachmentInnerY = -this.hoseHeight + this.hose.H2 + this.hose.width * Math.cos( this.angle );
      this.elbowInnerX = this.nozzleAttachmentInnerX - this.hose.H2 * Math.cos( this.angle );
      this.elbowInnerY = this.nozzleAttachmentInnerY - this.hose.H2 * Math.sin( this.angle );
      this.elbowLowerX = this.elbowOuterX - this.hose.width * Math.cos( this.angleWithVertical );
      this.elbowLowerY = this.elbowOuterY - (this.hose.width - this.hose.width * Math.sin( this.angleWithVertical ));
      this.hose.elbowOuterX = this.elbowOuterX;
      this.hose.elbowOuterY = this.elbowOuterY;
    }
  } );

} );