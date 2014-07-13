// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * HoseView
 * @author Siddhartha Chinthapally (Actual Concepts) on 7/4/2014.
 */

define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Property = require( 'AXON/Property' );

  // images
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
    this.tankPositionProperty = tankPositionProperty;

    //When the hose is above
    if ( this.hose.elbowOuterY >= 0.2 * Math.cos( this.hose.angleWithVertical ) ) {
      this.hoseShape = this.getTopShape();
    }
    else {
      this.hoseShape = this.getBottomShape();
    }

    this.hosePath = new Path( this.hoseShape, {top: 100, stroke: 'grey', fill: '#00FF00'} );
    this.addChild( this.hosePath );

    this.handleNodeCenterX = (this.hose.elbowInnerX - (this.hose.L1 )) / 2 + this.hose.L1;

    this.handleNode = new Image( handle, { rotation: Math.PI, cursor: 'pointer', scale: 0.3, y: this.hosePath.bottom + modelViewTransform.modelToViewDeltaY( 0.3 ), centerX: modelViewTransform.modelToViewX( this.handleNodeCenterX )} );
    this.addChild( this.handleNode );

    var clickYOffset;
    var initialHeight;
    this.handleNode.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        initialHeight = hoseView.hose.height;
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
      bottom: this.modelViewTransform.modelToViewDeltaY( -this.hose.height + this.hose.H2 ) + 122 + 40 * Math.cos( this.hose.angle ),
      left: this.modelViewTransform.modelToViewX( this.hose.hoseLengthX ) - 26 * Math.sin( this.hose.angle ),
      rotation: this.hose.angleWithVertical
    } );

    this.addChild( this.spoutAndNozzle );

    var startX;
    var startY;
    var initialHoseAngle;

    this.spoutHandle.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        startY = hoseView.globalToParentPoint( e.pointer.point ).y;
        startX = hoseView.globalToParentPoint( e.pointer.point ).x;
        initialHoseAngle = hoseView.hose.angle * 180 / Math.PI;
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
        hoseView.hose.angle = Math.PI * (angleToUpdate) / 180;
      }
    } ) );

    // add observers
    isHoseVisibleProperty.linkAttribute( this, 'visible' );

    hoseView.setTranslation( this.hose.initialPosition );

    Property.multilink( [this.hose.heightProperty, this.hose.angleProperty], function() {
      hoseView.update();
    } );

    this.mutate( options );
  }

  return inherit( Node, HoseView, {
    updateHoseHeight: function( height ) {
      //bound the hose to ground and 3.3 mtr above the ground
      height = height > this.tankPositionProperty.value.y + 0.6 ? this.tankPositionProperty.value.y + 0.6 :
               height < this.tankPositionProperty.value.y - 2.5 ? this.tankPositionProperty.value.y - 2.5 : height;

      this.hose.height = height;
    },

    update: function() {

      if ( this.hose.elbowOuterY >= 0.2 * Math.cos( this.hose.angleWithVertical ) ) {
        this.hosePath.setShape( this.getTopShape() );
        this.handleNodeCenterX = (this.hose.elbowInnerX - this.hose.L1 ) / 2 + this.hose.L1;
        this.handleNode.centerX = this.modelViewTransform.modelToViewX( this.handleNodeCenterX );
        this.handleNode.y = this.modelViewTransform.modelToViewY( this.hose.elbowInnerY ) - 115 - 112;
      }
      else {
        this.hosePath.setShape( this.getBottomShape() );
        this.handleNodeCenterX = (this.hose.elbowInnerX - (this.hose.L1)) / 2 + this.hose.L1;
        this.handleNode.centerX = this.modelViewTransform.modelToViewX( this.handleNodeCenterX );
        this.handleNode.y = this.hosePath.bottom + this.modelViewTransform.modelToViewDeltaY( this.hose.width );
      }

      this.spoutAndNozzle.setRotation( this.hose.angleWithVertical );
      this.spoutAndNozzle.bottom = this.modelViewTransform.modelToViewDeltaY( -this.hose.height + this.hose.H2 ) + 122 + 40 * Math.cos( this.hose.angle );
      this.spoutAndNozzle.left = this.modelViewTransform.modelToViewX( this.hose.hoseLengthX ) - 26 * Math.sin( this.hose.angle );
    },

    reset: function() {
      this.setTranslation( this.hose.initialPosition );
      this.hose.reset();
    },

    /**
     * @private
     * @returns {Shape}
     */
    getTopShape: function() {
      var shape = new Shape();
      shape = shape.moveTo( this.modelViewTransform.modelToViewX( this.hose.elbowOuterX ), this.modelViewTransform.modelToViewY( this.hose.elbowOuterY ) )
        .lineTo( this.modelViewTransform.modelToViewX( this.hose.hoseLengthX ), this.modelViewTransform.modelToViewY( -this.hose.height + this.hose.H2 ) )
        .lineTo( this.modelViewTransform.modelToViewX( this.hose.nozzleAttachmentInnerX ), this.modelViewTransform.modelToViewY( this.hose.nozzleAttachmentInnerY ) )
        .lineTo( this.modelViewTransform.modelToViewX( this.hose.elbowInnerX ), this.modelViewTransform.modelToViewY( this.hose.elbowInnerY ) - CORNER_RADIUS * Math.cos( this.hose.angleWithVertical ) )
        .arc( this.modelViewTransform.modelToViewX( this.hose.elbowInnerX ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.hose.elbowInnerY ) - CORNER_RADIUS, CORNER_RADIUS, this.hose.angleWithVertical, Math.PI / 2, false )
        .lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ) + CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.hose.elbowInnerY ) );

      if ( this.hose.elbowInnerY - this.hose.width > 0.08 ) {
        shape = shape.arc( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ) + CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.hose.elbowInnerY ) + CORNER_RADIUS, CORNER_RADIUS, -Math.PI / 2, Math.PI, true )
          .lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ), this.modelViewTransform.modelToViewY( this.hose.width ) - CORNER_RADIUS )
          .arc( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.hose.width ) - CORNER_RADIUS, CORNER_RADIUS, 0, Math.PI / 2, false );
      }

      shape = shape.lineTo( this.modelViewTransform.modelToViewX( 0 ), this.modelViewTransform.modelToViewY( this.hose.width ) )
        .lineTo( this.modelViewTransform.modelToViewX( 0 ), this.modelViewTransform.modelToViewY( 0 ) );


      if ( this.hose.elbowInnerY - this.hose.width > 0.08 ) {
        shape = shape.lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( 0 ) )
          .arc( this.modelViewTransform.modelToViewX( this.hose.L1 ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( 0 ) - CORNER_RADIUS, CORNER_RADIUS, Math.PI / 2, 0, true )
          .lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 ), this.modelViewTransform.modelToViewY( this.hose.elbowLowerY ) + CORNER_RADIUS )
          .arc( this.modelViewTransform.modelToViewX( this.hose.L1 ) + CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.hose.elbowLowerY ) + CORNER_RADIUS, CORNER_RADIUS, Math.PI, -Math.PI / 2, false );
      }
      else {
        shape = shape.lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 ), this.modelViewTransform.modelToViewY( this.hose.elbowLowerY ) );
      }

      shape = shape.lineTo( this.modelViewTransform.modelToViewX( this.hose.elbowLowerX ), this.modelViewTransform.modelToViewY( this.hose.elbowLowerY ) )
        .arc( this.modelViewTransform.modelToViewX( this.hose.elbowInnerX ), this.modelViewTransform.modelToViewY( this.hose.elbowInnerY ), this.modelViewTransform.modelToViewDeltaX( this.hose.width ),
          Math.PI / 2, this.hose.angleWithVertical, true );

      return shape;
    },

    /**
     * @private
     * @returns {Shape}
     */
    getBottomShape: function() {
      var shape = new Shape();
      shape = shape.moveTo( this.modelViewTransform.modelToViewX( this.hose.elbowOuterX ), this.modelViewTransform.modelToViewY( this.hose.elbowOuterY ) )
        .lineTo( this.modelViewTransform.modelToViewX( this.hose.hoseLengthX ), this.modelViewTransform.modelToViewY( -this.hose.height + this.hose.H2 ) )
        .lineTo( this.modelViewTransform.modelToViewX( this.hose.nozzleAttachmentInnerX ), this.modelViewTransform.modelToViewY( this.hose.nozzleAttachmentInnerY ) )
        .lineTo( this.modelViewTransform.modelToViewX( this.hose.elbowInnerX ), this.modelViewTransform.modelToViewY( this.hose.elbowInnerY ) - CORNER_RADIUS * Math.cos( this.hose.angleWithVertical ) )
        .arc( this.modelViewTransform.modelToViewX( this.hose.elbowInnerX ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.hose.elbowInnerY ) - CORNER_RADIUS, CORNER_RADIUS, this.hose.angleWithVertical, Math.PI / 2, false )
        .lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 ) + CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.hose.elbowInnerY ) );

      if ( -this.hose.elbowInnerY + this.hose.width > 0.08 ) {
        shape = shape.arc( this.modelViewTransform.modelToViewX( this.hose.L1 ) + CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.hose.elbowInnerY ) - CORNER_RADIUS, CORNER_RADIUS, Math.PI / 2, Math.PI, false )
          .lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 ), this.modelViewTransform.modelToViewY( this.hose.width ) + CORNER_RADIUS )
          .arc( this.modelViewTransform.modelToViewX( this.hose.L1 ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.hose.width ) + CORNER_RADIUS, CORNER_RADIUS, 0, -Math.PI / 2, true );
      }

      shape = shape.lineTo( this.modelViewTransform.modelToViewX( 0 ), this.modelViewTransform.modelToViewY( this.hose.width ) )
        .lineTo( this.modelViewTransform.modelToViewX( 0 ), this.modelViewTransform.modelToViewY( 0 ) );

      if ( -this.hose.elbowInnerY + this.hose.width > 0.08 ) {
        shape = shape.lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( 0 ) )
          .arc( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ) - CORNER_RADIUS, this.modelViewTransform.modelToViewY( 0 ) + CORNER_RADIUS, CORNER_RADIUS, -Math.PI / 2, 0, false )
          .lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ), this.modelViewTransform.modelToViewY( this.hose.elbowLowerY ) - CORNER_RADIUS )
          .arc( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ) + CORNER_RADIUS, this.modelViewTransform.modelToViewY( this.hose.elbowLowerY ) - CORNER_RADIUS, CORNER_RADIUS, Math.PI, Math.PI / 2, true );
      }
      else {
        shape = shape.lineTo( this.modelViewTransform.modelToViewX( this.hose.L1 - this.hose.width ), this.modelViewTransform.modelToViewY( this.hose.elbowLowerY ) );
      }
      shape = shape.lineTo( this.modelViewTransform.modelToViewX( this.hose.elbowLowerX ), this.modelViewTransform.modelToViewY( this.hose.elbowLowerY ) )
        .arc( this.modelViewTransform.modelToViewX( this.hose.elbowInnerX ), this.modelViewTransform.modelToViewY( this.hose.elbowInnerY ), this.modelViewTransform.modelToViewDeltaX( this.hose.width ),
          Math.PI / 2, this.hose.angleWithVertical, true );

      return shape;
    }
  } );

} );