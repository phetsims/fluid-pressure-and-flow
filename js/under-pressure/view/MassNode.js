// Copyright 2013-2022, University of Colorado Boulder

/**
 * View for a single mass
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { LinearGradient, Node, Rectangle, SimpleDragHandler, Text } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';

const massLabelPatternString = FluidPressureAndFlowStrings.massLabelPattern;

class MassNode extends Node {

  /**
   * @param {MassModel} massModel of simulation
   * @param {ChamberPoolModel} chamberPoolModel
   * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
   * @param {Bounds2} dragBounds - bounds that define where the node may be dragged
   */
  constructor( massModel, chamberPoolModel, modelViewTransform, dragBounds ) {

    super( { cursor: 'pointer' } );

    const width = modelViewTransform.modelToViewDeltaX( massModel.width );
    const height = Math.abs( modelViewTransform.modelToViewDeltaY( massModel.height ) );

    // add mass rectangle
    const mass = new Rectangle( -width / 2, -height / 2, width, height, {
      fill: new LinearGradient( -width / 2, 0, width, 0 )
        .addColorStop( 0, '#8C8D8D' )
        .addColorStop( 0.3, '#C0C1C2' )
        .addColorStop( 0.5, '#F0F1F1' )
        .addColorStop( 0.6, '#F8F8F7' ),
      stroke: '#918e8e',
      lineWidth: 1
    } );
    this.addChild( mass );

    const massText = new Text( StringUtils.format( massLabelPatternString, massModel.mass ),
      {
        //x: mass.centerX - 15,
        //y: mass.centerY + 3,
        font: new PhetFont( 9 ),
        fill: 'black',
        pickable: false,
        fontWeight: 'bold',
        maxWidth: width - 5
      } );
    this.addChild( massText );

    const massClickOffset = { x: 0, y: 0 };

    // mass drag handler
    this.addInputListener( new SimpleDragHandler( {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      start: event => {
        massClickOffset.x = this.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
        massClickOffset.y = this.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
        this.moveToFront();
        massModel.isDraggingProperty.value = true;
      },
      end: () => {
        massModel.positionProperty.value = modelViewTransform.viewToModelPosition( this.translation );
        massModel.isDraggingProperty.value = false;
      },
      //Translate on drag events
      drag: event => {
        const point = this.globalToParentPoint( event.pointer.point ).subtract( massClickOffset );
        this.translation = dragBounds.getClosestPoint( point.x, point.y );
      }
    } ) );

    massModel.positionProperty.link( position => {
      if ( !chamberPoolModel.isDragging ) {
        this.translation = new Vector2( modelViewTransform.modelToViewX( position.x ),
          modelViewTransform.modelToViewY( position.y ) );
        massText.centerX = mass.centerX;
        massText.centerY = mass.centerY;
      }
    } );
  }
}

fluidPressureAndFlow.register( 'MassNode', MassNode );
export default MassNode;