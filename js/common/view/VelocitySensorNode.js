// Copyright 2014-2023, University of Colorado Boulder

/**
 * View for the Velocity Sensor tool. Measures the velocity at the sensor's tip and shows it in the display box.
 * Also points a blue arrow along the direction of the velocity and the arrow length is proportional to the velocity.
 * Supports metric and english units.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { DragListener, LinearGradient, Node, Path, Rectangle, Text } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';

const ftPerSString = FluidPressureAndFlowStrings.ftPerS;
const mPerSString = FluidPressureAndFlowStrings.mPerS;
const speedString = FluidPressureAndFlowStrings.speed;

class VelocitySensorNode extends Node {

  /**
   * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
   * @param {VelocitySensor} velocitySensor - model for the velocity sensor
   * @param {Property.<string>} measureUnitsProperty -- english/metric
   * @param {Property[]} linkedProperties - the set of properties which affect the sensor value
   * @param {Function} getVelocityAt - function to be called to get the velocity at the given model coords
   * @param {Bounds2} containerBounds - bounds of container for all velocity sensors, needed to reset to initial position
   * @param {Bounds2} dragBounds - bounds that define where the sensor may be dragged
   * @param {Object} [options] that can be passed to the underlying node
   */
  constructor( modelViewTransform, velocitySensor, measureUnitsProperty, linkedProperties,
               getVelocityAt, containerBounds, dragBounds, options ) {

    options = merge( {
      scale: 1,
      isIcon: false, // if just using as an icon, don't add listeners to it and whatnot
      initialPosition: null // TODO figure out a better way to reset the velocitySensor to have the position of the icon
    }, options );

    super( { cursor: 'pointer', pickable: true } );

    this.options = options; // @private
    this.velocitySensor = velocitySensor; // @private

    const rectangleWidth = 100;
    const rectangleHeight = 56;

    // adding outer rectangle
    const outerRectangle = new Rectangle( 0, 0, rectangleWidth, rectangleHeight, 10, 10, {
      stroke: new LinearGradient( 0, 0, 0, rectangleHeight ).addColorStop( 0, '#FFAD73' ).addColorStop( 0.6,
        '#893D11' ),
      fill: new LinearGradient( 0, 0, 0, rectangleHeight ).addColorStop( 0, '#FFAD73' ).addColorStop( 0.6, '#893D11' )
    } );
    this.addChild( outerRectangle );

    // second rectangle
    const innerRectangle = new Rectangle( 2, 2, rectangleWidth - 4, rectangleHeight - 4, 10, 10, { fill: '#C5631E' } );
    this.addChild( innerRectangle );

    // adding velocity meter title text
    const titleText = new Text( speedString,
      {
        fill: 'black',
        font: new PhetFont( { size: 16, weight: 'normal' } ),
        centerX: innerRectangle.centerX,
        top: innerRectangle.top + 2
      } );
    this.addChild( titleText );

    // adding inner rectangle
    const innerMostRectangle = new Rectangle( 10, 0, rectangleWidth - 30, rectangleHeight - 38, 5, 5,
      {
        stroke: 'white',
        lineWidth: 1,
        fill: '#ffffff',
        centerX: innerRectangle.centerX,
        top: titleText.bottom + 2
      } );
    this.addChild( innerMostRectangle );

    // adding velocity measure label
    const labelText = new Text( '',
      { fill: 'black', font: new PhetFont( { size: 12, weight: 'bold' } ), center: innerMostRectangle.center } );
    this.addChild( labelText );

    const triangleWidth = 30;
    const triangleHeight = 16;

    // adding bottom triangle shape
    const outerTriangleShapeNode = new Path( new Shape()
      .moveTo( innerRectangle.centerX - triangleWidth / 2, innerMostRectangle.rectY + 1 )
      .lineTo( innerRectangle.centerX, triangleHeight + innerMostRectangle.rectY + 1 )
      .lineTo( innerRectangle.centerX + triangleWidth / 2, innerMostRectangle.rectY + 1 ), {
      fill: new LinearGradient( 0, 0, 0, 2 * rectangleHeight )
        .addColorStop( 0.0, '#FFAD73' ).addColorStop( 0.1, '#C5631E' ), top: outerRectangle.bottom -
                                                                             1, stroke: '#8D4716'
    } );
    this.addChild( outerTriangleShapeNode );

    const innerTriangleShapeNode = new Path( new Shape()
      .moveTo( innerRectangle.centerX + 8 - ( ( triangleWidth ) / 2 ), innerMostRectangle.rectY + 1 )
      .lineTo( innerRectangle.centerX + 5, ( triangleHeight ) + innerMostRectangle.rectY - 4 )
      .lineTo( innerRectangle.centerX + ( triangleWidth ) / 2, innerMostRectangle.rectY + 1 ), {
      fill: '#C5631E', center: outerTriangleShapeNode.center, stroke: '#C5631E'
    } );
    this.addChild( innerTriangleShapeNode );

    // arrow shape
    const arrowWidth = 6;
    this.arrowShape = new Path( new ArrowShape( 0, 0, modelViewTransform.modelToViewDeltaX( velocitySensor.valueProperty.value.x ),
      modelViewTransform.modelToViewDeltaY( velocitySensor.valueProperty.value.y ) ), { fill: 'blue' } );
    this.addChild( this.arrowShape );

    velocitySensor.valueProperty.link( velocity => {
      this.arrowShape.setShape( new ArrowShape( 0, 0, modelViewTransform.modelToViewDeltaX( velocitySensor.valueProperty.value.x ),
        modelViewTransform.modelToViewDeltaY( velocitySensor.valueProperty.value.y ),
        { tailWidth: arrowWidth, headWidth: 2 * arrowWidth, headHeight: 2 * arrowWidth } ) );

      // set the arrowShape path position so that the center of the tail coincides with the tip of the sensor
      if ( this.arrowShape.bounds.isFinite() ) {
        // if the velocity y component is positive then the arrow will face up,
        // so set the bottom of the arrow to the tip of the sensor
        if ( velocity.y >= 0 ) {
          this.arrowShape.bottom = outerTriangleShapeNode.bottom +
                                   arrowWidth / 2 * Math.cos( Math.abs( velocity.angle ) );
        }
        else {
          // if the velocity y component is negative then the arrow will face down,
          // so set the top of the arrow to the tip of the sensor
          this.arrowShape.top = outerTriangleShapeNode.bottom -
                                arrowWidth / 2 * Math.cos( Math.abs( velocity.angle ) );
        }

        // if the velocity x component is positive then the arrow will direct towards right
        // so set the left of the arrow to the tip of the sensor
        if ( velocity.x > 0 ) {
          this.arrowShape.left = outerRectangle.centerX - arrowWidth / 2 * Math.sin( Math.abs( velocity.angle ) );
        }
        else if ( velocity.x === 0 ) {
          this.arrowShape.left = outerRectangle.centerX - arrowWidth;
        }
        else {
          this.arrowShape.right = outerRectangle.centerX + arrowWidth / 2 * Math.sin( Math.abs( velocity.angle ) );
        }
      }
    } );

    velocitySensor.isArrowVisibleProperty.linkAttribute( this.arrowShape, 'visible' );
    const speedMeterDragBounds = dragBounds.withMaxX( dragBounds.maxX - rectangleWidth * options.scale );

    // @public - drag handler
    this.dragListener = new DragListener( {
        positionProperty: velocitySensor.positionProperty,
        dragBoundsProperty: new Property( speedMeterDragBounds ),
        useParentOffset: true,
        start: () => {
          this.moveToFront();
        },

        end: () => {
          // check intersection only with the outer rectangle.
          // Add a 5px tolerance. See https://github.com/phetsims/fluid-pressure-and-flow/issues/105
          if ( containerBounds.intersectsBounds( Bounds2.rect( velocitySensor.positionProperty.value.x, velocitySensor.positionProperty.value.y,
            rectangleWidth, rectangleHeight ).eroded( 5 ) ) ) {

            if ( options.initialPosition ) {
              velocitySensor.positionProperty.value = options.initialPosition;
              this.visible = false; // TODO does this want to be in all cases, not just for toolbox?
            }
            else {
              velocitySensor.positionProperty.reset();
            }

            this.moveToBack();
          }
        }
      } );
    !options.isIcon && this.addInputListener( this.dragListener );

    velocitySensor.positionProperty.linkAttribute( this, 'translation' );

    // update the value of the
    //TODO this listener is a little dangerous, signature relies on order of concat
    Multilink.multilink( [ velocitySensor.positionProperty ].concat( linkedProperties ), position => {
      velocitySensor.valueProperty.value = getVelocityAt(
        modelViewTransform.viewToModelX( position.x + rectangleWidth / 2 * options.scale ),
        modelViewTransform.viewToModelY( position.y + ( rectangleHeight + triangleHeight ) * options.scale ) );
    } );

    // Update the text when the value or units changes.
    // TODO is the positionProperty needed in this multilink?
    Multilink.multilink( [ velocitySensor.valueProperty, measureUnitsProperty, velocitySensor.positionProperty ],
      ( velocity, units, position ) => {
        if ( velocitySensor.positionProperty.initialValue.equals( position ) ) {
          labelText.string = MathSymbols.NO_VALUE;
        }
        else {
          labelText.string = units === 'metric' ?
                           `${Utils.toFixed( velocity.magnitude, 1 )} ${mPerSString}` :
                           `${Utils.toFixed( velocity.magnitude * 3.28, 1 )} ${ftPerSString}`;
        }
        labelText.center = innerMostRectangle.center;
      } );

    velocitySensor.updateEmitter.addListener( () => {
      velocitySensor.valueProperty.value = getVelocityAt(
        modelViewTransform.viewToModelX( velocitySensor.positionProperty.value.x + rectangleWidth / 2 * options.scale ),
        modelViewTransform.viewToModelY( velocitySensor.positionProperty.value.y +
                                         ( rectangleHeight + triangleHeight ) * options.scale )
      );
    } );

    // for visually inspecting the touch area
    this.touchArea = this.localBounds;

    this.mutate( options );
  }
}

fluidPressureAndFlow.register( 'VelocitySensorNode', VelocitySensorNode );
export default VelocitySensorNode;