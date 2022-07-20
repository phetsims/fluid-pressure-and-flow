// Copyright 2014-2022, University of Colorado Boulder

/**
 * HoseNode represents a draggable and bendable hose.
 * The hose can be expanded in the y direction by dragging the attached handle.
 * Hose can be bent about its elbow by dragging the spout handle. The rotation is limited to 90 degrees.
 * Hose adjusts its height and width to ensure that the nozzle is always above the ground.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import { Shape } from '../../../../kite/js/imports.js';
import { Image, Node, Path, SimpleDragHandler } from '../../../../scenery/js/imports.js';
import handle_png from '../../../images/handle_png.js';
import nozzle_png from '../../../images/nozzle_png.js';
import spoutHandle_png from '../../../images/spoutHandle_png.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

// constants
const CORNER_RADIUS = 3; // px

class HoseNode extends Node {

  /**
   * @param {Hose} hose model
   * @param {Property.<Vector2>} tankPositionProperty the bottom left of the tank frame
   * @param {ModelViewTransform2} modelViewTransform transform to convert between model and view values
   * @param {Property.<boolean>} isHoseVisibleProperty controls the hose visibility
   * @param {Object} [options]
   */
  constructor( hose, tankPositionProperty, modelViewTransform, isHoseVisibleProperty, options ) {

    super();

    this.hose = hose;
    this.modelViewTransform = modelViewTransform;
    this.tankPositionProperty = tankPositionProperty;

    // When the hose is above
    if ( this.hose.elbowOuterY >= 0.2 * Math.cos( this.hose.angleWithVertical ) ) {
      this.hoseShape = createTopShape( this.hose, this.modelViewTransform );
    }
    else {
      this.hoseShape = createBottomShape( this.hose, this.modelViewTransform );
    }

    this.hosePath = new Path( this.hoseShape, { top: 100, stroke: 'grey', fill: '#00FF00' } );
    this.addChild( this.hosePath );

    this.handleNodeCenterX = ( this.hose.elbowInnerX - ( this.hose.L1 ) ) / 2 + this.hose.L1;

    this.handleNode = new Image( handle_png, {
      rotation: Math.PI,
      cursor: 'pointer',
      scale: 0.3,
      y: this.hosePath.bottom + this.modelViewTransform.modelToViewDeltaY( this.hose.width ),
      centerX: modelViewTransform.modelToViewX( this.handleNodeCenterX )
    } );
    this.addChild( this.handleNode );
    this.handleNode.touchArea = this.handleNode.localBounds.dilatedXY( 20, 20 );

    let clickYOffset;
    let initialHeight;
    this.handleNode.addInputListener( new SimpleDragHandler( {
      start: event => {
        initialHeight = this.hose.heightProperty.value;
        clickYOffset = this.globalToParentPoint( event.pointer.point ).y;
      },
      drag: event => {
        const deltaY = this.globalToParentPoint( event.pointer.point ).y - clickYOffset;
        this.updateHoseHeight( -modelViewTransform.viewToModelDeltaY( deltaY ) + initialHeight );
      }
    } ) );

    const nozzle = new Image( nozzle_png, { scale: 0.75 } );

    this.spoutHandle = new Node( {
      children: [ new Image( spoutHandle_png ) ],
      scale: 0.75,
      cursor: 'pointer',
      bottom: nozzle.bottom,
      left: nozzle.right - 4
    } );
    this.spoutHandle.touchArea = this.spoutHandle.localBounds.dilatedXY( 10, 10 );

    this.spoutAndNozzle = new Node( {
      children: [ nozzle, this.spoutHandle ],
      bottom: this.modelViewTransform.modelToViewDeltaY( this.hose.nozzleAttachmentOuterY ) + 116 + 40 * Math.cos( this.hose.angleProperty.value ),
      left: this.modelViewTransform.modelToViewX( this.hose.nozzleAttachmentOuterX ) - 19 * Math.sin( this.hose.angleProperty.value ),
      rotation: this.hose.angleWithVertical
    } );

    this.addChild( this.spoutAndNozzle );

    let startX;
    let startY;
    let startPointAngle;
    let initialHoseAngle;
    this.spoutHandle.addInputListener( new SimpleDragHandler( {
      start: event => {

        startY = this.globalToParentPoint( event.pointer.point ).y;
        startX = this.globalToParentPoint( event.pointer.point ).x;

        initialHoseAngle = this.hose.angleProperty.value * 180 / Math.PI;

        const deltaY = this.modelViewTransform.modelToViewY( this.hose.rotationPivotY + this.tankPositionProperty.value.y ) - startY;
        const deltaX = this.modelViewTransform.modelToViewX( this.hose.rotationPivotX + this.tankPositionProperty.value.x + 10 ) - startX;

        startPointAngle = Math.atan2( deltaY, deltaX );
      },

      drag: event => {

        const endY = this.globalToParentPoint( event.pointer.point ).y;
        const endX = this.globalToParentPoint( event.pointer.point ).x;

        const deltaY = this.modelViewTransform.modelToViewY( this.hose.rotationPivotY + this.tankPositionProperty.value.y ) - endY;
        const deltaX = this.modelViewTransform.modelToViewX( this.hose.rotationPivotX + this.tankPositionProperty.value.x + 10 ) - endX;

        if ( deltaY > 0 ) {
          return;
        }

        const finalPointAngle = Math.atan2( deltaY, deltaX );
        const angleMoved = ( finalPointAngle - startPointAngle ) * 180 / Math.PI;

        let angleToUpdate = initialHoseAngle - angleMoved;
        angleToUpdate = angleToUpdate > 90 ? 90 : angleToUpdate < 0 ? 0 : angleToUpdate;
        this.hose.angleProperty.value = Math.PI * ( angleToUpdate ) / 180;
      }
    } ) );

    // add observers
    isHoseVisibleProperty.linkAttribute( this, 'visible' );

    this.setTranslation( modelViewTransform.modelToViewX( this.hose.initialPosition.x ),
      modelViewTransform.modelToViewY( this.hose.initialPosition.y ) );

    this.hose.updatedEmitter.addListener( () => {
      this.update();
    } );

    this.mutate( options );
  }

  /**
   * Updates the hose height while ensuring that the nozzle does not go below the ground
   * @param {number} height to which the hose needs to be expanded or contracted.
   * @private
   */
  updateHoseHeight( height ) {
    height = height > this.tankPositionProperty.value.y + 2 ? this.tankPositionProperty.value.y + 2 :
             height < this.tankPositionProperty.value.y - 25 ? this.tankPositionProperty.value.y - 25 : height;

    this.hose.heightProperty.value = height;
  }

  /**
   * Updates the hose node with the latest height and angle.
   * @private
   */
  update() {

    if ( this.hose.elbowOuterY >= 0.2 * Math.cos( this.hose.angleWithVertical ) ) {
      this.hosePath.setShape( createTopShape( this.hose, this.modelViewTransform ) );
      this.handleNodeCenterX = ( this.hose.elbowInnerX - this.hose.L1 ) / 2 + this.hose.L1;
      this.handleNode.centerX = this.modelViewTransform.modelToViewX( this.handleNodeCenterX );
      this.handleNode.y = this.modelViewTransform.modelToViewY( this.hose.elbowInnerY ) - 115 - 119;
    }
    else {
      this.hosePath.setShape( createBottomShape( this.hose, this.modelViewTransform ) );
      this.handleNodeCenterX = ( this.hose.elbowInnerX - ( this.hose.L1 ) ) / 2 + this.hose.L1;
      this.handleNode.centerX = this.modelViewTransform.modelToViewX( this.handleNodeCenterX );
      this.handleNode.y = this.hosePath.bottom + this.modelViewTransform.modelToViewDeltaY( this.hose.width );
    }

    this.spoutAndNozzle.setRotation( this.hose.angleWithVertical );
    this.spoutAndNozzle.bottom = this.modelViewTransform.modelToViewDeltaY( this.hose.nozzleAttachmentOuterY ) + 116 + 29 * Math.cos( this.hose.angleProperty.value );
    this.spoutAndNozzle.left = this.modelViewTransform.modelToViewX( this.hose.nozzleAttachmentOuterX ) - 19 * Math.sin( this.hose.angleProperty.value );
  }

  /**
   * @public
   */
  reset() {
    this.setTranslation( this.modelViewTransform.modelToViewX( this.hose.initialPosition.x ),
      this.modelViewTransform.modelToViewY( this.hose.initialPosition.y ) );
    this.hose.reset();
  }
}

// creates the shape of the hose when the y-drag handle is above the top of the hole
function createTopShape( hose, modelViewTransform ) {
  let shape = new Shape();
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
}

// creates the shape of the hose when the y-drag handle is below (not above) the top of the hole
function createBottomShape( hose, modelViewTransform ) {
  let shape = new Shape();
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
}

fluidPressureAndFlow.register( 'HoseNode', HoseNode );
export default HoseNode;