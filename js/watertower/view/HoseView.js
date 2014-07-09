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

  var nozzleImg = require( 'image!FLUID_PRESSURE_AND_FLOW/nozzle.png' );
  var spoutHandleImg = require( 'image!FLUID_PRESSURE_AND_FLOW/spout-handle.png' );
  var handle = require( 'image!FLUID_PRESSURE_AND_FLOW/handle.png' );


  function HoseView( hoseModel, tankPositionProperty, modelViewTransform, isHoseVisibleProperty, options ) {
    var hoseView = this;
    Node.call( this );

    this.model = hoseModel;
    this.modelViewTransform = modelViewTransform;
    this.hoseHeight = hoseModel.height;
    this.hoseWidth = hoseModel.hoseWidth;

    this.tankPositionProperty = tankPositionProperty;


    this.angleInRadians = Math.PI * hoseModel.angle / 180;

    this.angleWithPerpendicularInRadians = Math.PI * (90 - hoseModel.angle) / 180;  // angle with perpendicular

    this.varX = this.hoseWidth - hoseModel.H2 * Math.cos( this.angleInRadians );
    this.varY = -this.hoseHeight + hoseModel.H2 - hoseModel.H2 * Math.sin( this.angleInRadians );


    this.upperLineEndPointX = this.hoseWidth - hoseModel.width * Math.sin( this.angleInRadians );
    this.upperLineEndPointY = -this.hoseHeight + hoseModel.H2 + hoseModel.width * Math.cos( this.angleInRadians );


    this.upperLinePointX = this.upperLineEndPointX - hoseModel.H2 * Math.cos( this.angleInRadians );
    this.upperLinePointY = this.upperLineEndPointY - hoseModel.H2 * Math.sin( this.angleInRadians );


    this.x2 = this.varX - hoseModel.width * Math.cos( this.angleWithPerpendicularInRadians );
    this.y2 = this.varY - (hoseModel.width - hoseModel.width * Math.sin( this.angleWithPerpendicularInRadians ));


    this.model.nozzleX = this.model.hoseWidth + 0.57;
    this.model.nozzleY = this.varY + this.model.H2 * Math.sin( this.angleInRadians ) + 2.0;


    // TODO : compare this.varX with tank bottom Y
    if ( this.varY >= 0.05445405423281646 ) {
      this.hoseShape = new Shape()
        .moveTo( modelViewTransform.modelToViewX( this.varX ), modelViewTransform.modelToViewY( this.varY ) )
        .lineTo( modelViewTransform.modelToViewX( this.hoseWidth ), modelViewTransform.modelToViewY( -this.hoseHeight + hoseModel.H2 ) )
        .lineTo( modelViewTransform.modelToViewX( this.upperLineEndPointX ), modelViewTransform.modelToViewY( this.upperLineEndPointY ) )
        .lineTo( modelViewTransform.modelToViewX( this.upperLinePointX ), modelViewTransform.modelToViewY( this.upperLinePointY ) )
        .lineTo( modelViewTransform.modelToViewX( hoseModel.L1 - hoseModel.width ), modelViewTransform.modelToViewY( this.upperLinePointY ) )
        .lineTo( modelViewTransform.modelToViewX( hoseModel.L1 - hoseModel.width ), modelViewTransform.modelToViewY( hoseModel.width ) )
        .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( hoseModel.width ) )
        .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( 0 ) )
        .lineTo( modelViewTransform.modelToViewX( hoseModel.L1 ), modelViewTransform.modelToViewY( 0 ) )
        .lineTo( modelViewTransform.modelToViewX( hoseModel.L1 ), modelViewTransform.modelToViewY( this.y2 ) )
        .lineTo( modelViewTransform.modelToViewX( this.x2 ), modelViewTransform.modelToViewY( this.y2 ) )
        .moveTo( modelViewTransform.modelToViewX( this.upperLinePointX ), modelViewTransform.modelToViewY( this.upperLinePointY ) )
        .arc( modelViewTransform.modelToViewX( this.upperLinePointX ), modelViewTransform.modelToViewY( this.upperLinePointY ), 21,
          Math.PI / 2, this.angleWithPerpendicularInRadians, true );
    }
    else {

      this.hoseShape = new Shape()
        .moveTo( modelViewTransform.modelToViewX( this.varX ), modelViewTransform.modelToViewY( this.varY ) )
        .lineTo( modelViewTransform.modelToViewX( this.hoseWidth ), modelViewTransform.modelToViewY( -this.hoseHeight + hoseModel.H2 ) )
        .lineTo( modelViewTransform.modelToViewX( this.upperLineEndPointX ), modelViewTransform.modelToViewY( this.upperLineEndPointY ) )
        .lineTo( modelViewTransform.modelToViewX( this.upperLinePointX ), modelViewTransform.modelToViewY( this.upperLinePointY ) )
        .lineTo( modelViewTransform.modelToViewX( hoseModel.L1 + hoseModel.width ), modelViewTransform.modelToViewY( this.upperLinePointY ) )
        .lineTo( modelViewTransform.modelToViewX( hoseModel.L1 + hoseModel.width ), modelViewTransform.modelToViewY( hoseModel.width ) )
        .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( hoseModel.width ) )
        .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( 0 ) )
        .lineTo( modelViewTransform.modelToViewX( hoseModel.L1 ), modelViewTransform.modelToViewY( 0 ) )
        .lineTo( modelViewTransform.modelToViewX( hoseModel.L1 ), modelViewTransform.modelToViewY( this.y2 ) )
        .lineTo( modelViewTransform.modelToViewX( this.x2 ), modelViewTransform.modelToViewY( this.y2 ) )
        .moveTo( modelViewTransform.modelToViewX( this.upperLinePointX ), modelViewTransform.modelToViewY( this.upperLinePointY ) )
        .arc( modelViewTransform.modelToViewX( this.upperLinePointX ), modelViewTransform.modelToViewY( this.upperLinePointY ), 21,
          Math.PI / 2, this.angleWithPerpendicularInRadians, true );

    }

    this.hosePath = new Path( this.hoseShape, {top: 100, stroke: 'grey', fill: '#00FF00'} );
    this.addChild( this.hosePath );

    this.handleNodeCenterX = (this.upperLinePointX - (this.model.L1 + this.model.width)) / 2 + this.model.L1 + this.model.width;

    this.handleNode = new Image( handle, { rotation: Math.PI, cursor: 'pointer', scale: 0.3, y: this.hosePath.bottom + modelViewTransform.modelToViewDeltaY( 0.3 ), centerX: modelViewTransform.modelToViewX( this.handleNodeCenterX )} );
    this.addChild( this.handleNode );

    var clickYOffset;
    var initialHeight;
    this.handleNode.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        clickYOffset = hoseView.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
        initialHeight = hoseView.hoseHeight;
      },
      drag: function( e ) {
        var y = hoseView.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        hoseView.updateHoseHeight( initialHeight + y - 115 );
      }
    } ) );


    var nozzle = new Node( {children: [new Image( nozzleImg )], scale: 1.0 } );

    this.spoutHandle = new Node( {children: [new Image( spoutHandleImg )], scale: 1.0, cursor: 'pointer', bottom: nozzle.bottom, left: nozzle.right - 4} );

    this.spoutAndNozzle = new Node( { children: [nozzle, this.spoutHandle],
      bottom: this.modelViewTransform.modelToViewDeltaY( -this.hoseHeight + this.model.H2 ) + 122 + 40 * Math.cos( this.angleInRadians ),
      left: this.modelViewTransform.modelToViewX( this.hoseWidth ) - 26 * Math.sin( this.angleInRadians ),
      rotation: this.angleWithPerpendicularInRadians
    } );

    this.addChild( this.spoutAndNozzle );

    var startX;
    var startY;
    var initialHoseAngle;

    this.spoutHandle.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        startY = hoseView.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
        startX = hoseView.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;
        initialHoseAngle = hoseView.angleInRadians * 180 / Math.PI;
      },
      drag: function( e ) {

        var endY = hoseView.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
        var endX = hoseView.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;

        //finding angle
        var deltaX = 30 - (startX - endX);
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

    hoseView.setTranslation( 180, 115 );

    this.mutate( options );

  }

  return inherit( Node, HoseView, {
    updateHoseHeight: function( y ) {
      var newHeight = -this.modelViewTransform.viewToModelDeltaY( y );
      newHeight = newHeight > this.tankPositionProperty.value.y + 0.6 ? this.tankPositionProperty.value.y + 0.6 :
                  newHeight < this.tankPositionProperty.value.y - 2.5 ? this.tankPositionProperty.value.y - 2.5 : newHeight;

      this.hoseHeight = newHeight;
      this.update();
    },

    updateHoseAngle: function( angle ) {
      this.model.angle = angle;
      this.angleInRadians = Math.PI * angle / 180;
      this.angleWithPerpendicularInRadians = Math.PI * (90 - angle) / 180;
      this.update();
    },

    update: function() {

      this.varX = this.hoseWidth - this.model.H2 * Math.cos( this.angleInRadians );
      this.varY = -this.hoseHeight + this.model.H2 - this.model.H2 * Math.sin( this.angleInRadians );


      this.upperLineEndPointX = this.hoseWidth - this.model.width * Math.sin( this.angleInRadians );
      this.upperLineEndPointY = -this.hoseHeight + this.model.H2 + this.model.width * Math.cos( this.angleInRadians );


      this.upperLinePointX = this.upperLineEndPointX - this.model.H2 * Math.cos( this.angleInRadians );
      this.upperLinePointY = this.upperLineEndPointY - this.model.H2 * Math.sin( this.angleInRadians );

      this.x2 = this.varX - this.model.width * Math.cos( this.angleWithPerpendicularInRadians );
      this.y2 = this.varY - (this.model.width - this.model.width * Math.sin( this.angleWithPerpendicularInRadians ));

      this.model.nozzleX = this.model.hoseWidth + 0.57;
      this.model.nozzleY = this.varY + this.model.H2 * Math.sin( this.angleInRadians ) + 2.0;


      // TODo : compare this.varX with tank bottom Y
      if ( this.varY >= 0.05445405423281646 /*this.tankPosition.Y*/ ) {
        this.hosePath.setShape( new Shape()
          .moveTo( this.modelViewTransform.modelToViewX( this.varX ), this.modelViewTransform.modelToViewY( this.varY ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.hoseWidth ), this.modelViewTransform.modelToViewY( -this.hoseHeight + this.model.H2 ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.upperLineEndPointX ), this.modelViewTransform.modelToViewY( this.upperLineEndPointY ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.upperLinePointX ), this.modelViewTransform.modelToViewY( this.upperLinePointY ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.model.L1 - this.model.width ), this.modelViewTransform.modelToViewY( this.upperLinePointY ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.model.L1 - this.model.width ), this.modelViewTransform.modelToViewY( this.model.width ) )
          .lineTo( this.modelViewTransform.modelToViewX( 0 ), this.modelViewTransform.modelToViewY( this.model.width ) )
          .lineTo( this.modelViewTransform.modelToViewX( 0 ), this.modelViewTransform.modelToViewY( 0 ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.model.L1 ), this.modelViewTransform.modelToViewY( 0 ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.model.L1 ), this.modelViewTransform.modelToViewY( this.y2 ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.x2 ), this.modelViewTransform.modelToViewY( this.y2 ) )
          .moveTo( this.modelViewTransform.modelToViewX( this.upperLinePointX ), this.modelViewTransform.modelToViewY( this.upperLinePointY ) )
          .arc( this.modelViewTransform.modelToViewX( this.upperLinePointX ), this.modelViewTransform.modelToViewY( this.upperLinePointY ), 21,
            Math.PI / 2, this.angleWithPerpendicularInRadians, true ) );


        this.handleNodeCenterX = (this.upperLinePointX - this.model.L1 ) / 2 + this.model.L1;

        this.handleNode.centerX = this.modelViewTransform.modelToViewX( this.handleNodeCenterX );
        this.handleNode.y = this.modelViewTransform.modelToViewY( this.upperLinePointY ) - 228;


      }
      else {
        this.hosePath.setShape( new Shape()
          .moveTo( this.modelViewTransform.modelToViewX( this.varX ), this.modelViewTransform.modelToViewY( this.varY ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.hoseWidth ), this.modelViewTransform.modelToViewY( -this.hoseHeight + this.model.H2 ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.upperLineEndPointX ), this.modelViewTransform.modelToViewY( this.upperLineEndPointY ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.upperLinePointX ), this.modelViewTransform.modelToViewY( this.upperLinePointY ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.model.L1 + this.model.width ), this.modelViewTransform.modelToViewY( this.upperLinePointY ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.model.L1 + this.model.width ), this.modelViewTransform.modelToViewY( this.model.width ) )
          .lineTo( this.modelViewTransform.modelToViewX( 0 ), this.modelViewTransform.modelToViewY( this.model.width ) )
          .lineTo( this.modelViewTransform.modelToViewX( 0 ), this.modelViewTransform.modelToViewY( 0 ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.model.L1 ), this.modelViewTransform.modelToViewY( 0 ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.model.L1 ), this.modelViewTransform.modelToViewY( this.y2 ) )
          .lineTo( this.modelViewTransform.modelToViewX( this.x2 ), this.modelViewTransform.modelToViewY( this.y2 ) )
          .moveTo( this.modelViewTransform.modelToViewX( this.upperLinePointX ), this.modelViewTransform.modelToViewY( this.upperLinePointY ) )
          .arc( this.modelViewTransform.modelToViewX( this.upperLinePointX ), this.modelViewTransform.modelToViewY( this.upperLinePointY ), 21,
            Math.PI / 2, this.angleWithPerpendicularInRadians, true ) );


        this.handleNodeCenterX = (this.upperLinePointX - (this.model.L1 + this.model.width)) / 2 + this.model.L1 + this.model.width;
        this.handleNode.centerX = this.modelViewTransform.modelToViewX( this.handleNodeCenterX );
        this.handleNode.y = this.hosePath.bottom + this.modelViewTransform.modelToViewDeltaY( this.model.width );
      }
      this.model.height = this.hoseHeight;

      this.spoutAndNozzle.bottom = this.modelViewTransform.modelToViewDeltaY( -this.hoseHeight + this.model.H2 ) + 122 + 40 * Math.cos( this.angleInRadians );
      this.spoutAndNozzle.left = this.modelViewTransform.modelToViewX( this.hoseWidth ) - 26 * Math.sin( this.angleInRadians );
      this.spoutAndNozzle.rotation = this.angleWithPerpendicularInRadians;

    }
  } );

} );