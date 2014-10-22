// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the Velocity Sensor tool. Measures the velocity at the sensor's tip and shows it in the display box.
 * Also points a blue arrow along the direction of the velocity and the arrow length is proportional to the velocity.
 * Supports metric and english units.
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var ArrowShape = require( 'SCENERY_PHET/ArrowShape' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // strings
  var speedString = require( 'string!FLUID_PRESSURE_AND_FLOW/speed' );
  var mPerS = require( 'string!FLUID_PRESSURE_AND_FLOW/mPerS' );
  var ftPerS = require( 'string!FLUID_PRESSURE_AND_FLOW/ftPerS' );

  /**
   * Main constructor for VelocitySensorNode.
   *
   * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
   * @param {VelocitySensor} velocitySensor - model for the velocity sensor
   * @param {Property<String>} measureUnitsProperty -- english/metric
   * @param {Property[]} linkedProperties - the set of properties which affect the sensor value
   * @param {Function} getVelocityAt - function to be called to get the velocity at the given model coords
   * @param {Bounds2} containerBounds - bounds of container for all velocity sensors, needed to reset to initial position
   * @param {Bounds2} dragBounds - bounds that define where the sensor may be dragged
   * @param {Object} [options] that can be passed to the underlying node
   * @constructor
   */
  function VelocitySensorNode( modelViewTransform, velocitySensor, measureUnitsProperty, linkedProperties, getVelocityAt, containerBounds, dragBounds, options ) {
    var velocitySensorNode = this;
    Node.call( this, {cursor: 'pointer', pickable: true} );

    var rectangleWidth = 100;
    var rectangleHeight = 56;

    // adding outer rectangle
    var outerRectangle = new Rectangle( 0, 0, rectangleWidth, rectangleHeight, 10, 10, {
      stroke: new LinearGradient( 0, 0, 0, rectangleHeight ).addColorStop( 0, '#FFAD73' ).addColorStop( 0.6, '#893D11' ),
      fill: new LinearGradient( 0, 0, 0, rectangleHeight ).addColorStop( 0, '#FFAD73' ).addColorStop( 0.6, '#893D11' )
    } );
    this.addChild( outerRectangle );

    //second rectangle
    var innerRectangle = new Rectangle( 2, 2, rectangleWidth - 4, rectangleHeight - 4, 10, 10, { fill: '#C5631E'} );
    this.addChild( innerRectangle );

    // adding velocity meter title text
    var titleText = new Text( speedString,
      {fill: 'black', font: new PhetFont( {size: 16, weight: 'normal'} ), center: innerRectangle.center, top: innerRectangle.top +
                                                                                                              2} );
    this.addChild( titleText );

    // adding inner rectangle
    var innerMostRectangle = new Rectangle( 10, 0, rectangleWidth - 30, rectangleHeight - 38, 5, 5,
      {stroke: 'white', lineWidth: 1, fill: '#ffffff', center: innerRectangle.center, top: titleText.bottom + 2} );
    this.addChild( innerMostRectangle );

    // adding velocity measure label
    var labelText = new Text( '',
      {fill: 'black', font: new PhetFont( {size: 12, weight: 'bold'} ), center: innerMostRectangle.center} );
    this.addChild( labelText );

    var triangleWidth = 30;
    var triangleHeight = 16;

    // adding bottom triangle shape
    var outerTriangleShapeNode = new Path( new Shape()
      .moveTo( innerRectangle.centerX - triangleWidth / 2, innerMostRectangle.rectY + 1 )
      .lineTo( innerRectangle.centerX, triangleHeight + innerMostRectangle.rectY + 1 )
      .lineTo( innerRectangle.centerX + triangleWidth / 2, innerMostRectangle.rectY + 1 ), {
      fill: new LinearGradient( 0, 0, 0, 2 * rectangleHeight )
        .addColorStop( 0.0, '#FFAD73' ).addColorStop( 0.1, '#C5631E' ), top: outerRectangle.bottom -
                                                                             1, stroke: '#8D4716'  } );
    this.addChild( outerTriangleShapeNode );

    var innerTriangleShapeNode = new Path( new Shape()
      .moveTo( innerRectangle.centerX + 8 - ((triangleWidth) / 2), innerMostRectangle.rectY + 1 )
      .lineTo( innerRectangle.centerX + 5, (triangleHeight ) + innerMostRectangle.rectY - 4 )
      .lineTo( innerRectangle.centerX + (triangleWidth) / 2, innerMostRectangle.rectY + 1 ), {
      fill: '#C5631E', center: outerTriangleShapeNode.center, stroke: '#C5631E'  } );
    this.addChild( innerTriangleShapeNode );

    // arrow shape
    this.arrowShape = new Path( new ArrowShape( 0, 0, modelViewTransform.modelToViewDeltaX( velocitySensor.value.x ),
      modelViewTransform.modelToViewDeltaY( velocitySensor.value.y ) ), {fill: 'blue'} );
    this.addChild( this.arrowShape );

    velocitySensor.valueProperty.link( function( velocity ) {
      this.arrowShape.setShape( new ArrowShape( 0, 0, modelViewTransform.modelToViewDeltaX( velocitySensor.value.x ),
        modelViewTransform.modelToViewDeltaY( velocitySensor.value.y ) ) );

      // set the arrowShape path position.
      // using approximate values (for better performance) instead of using exact values computed using sin, cos.
      // Note: the arrow position could be off the center of the sensor tip by a pixel in some cases.
      if ( this.arrowShape.bounds.isFinite() ) {
        if ( velocity.y >= 0 ) {
          this.arrowShape.bottom = outerTriangleShapeNode.bottom + 2;//3 * Math.cos( Math.abs( velocity.angle() ) );
        }
        else {
          this.arrowShape.top = outerTriangleShapeNode.bottom - 2;//3 * Math.cos( Math.abs( velocity.angle() ) );
        }
        if ( velocity.x > 0 ) {
          this.arrowShape.left = outerRectangle.centerX - 1.5;//3  * Math.sin( Math.abs( velocity.angle() ) );
        }
        else if ( velocity.x === 0 ) {
          this.arrowShape.left = outerRectangle.centerX - 5;
        }
        else {
          this.arrowShape.right = outerRectangle.centerX + 1.5; //3 * Math.sin( Math.abs( velocity.angle() ) );
        }
      }
    }.bind( velocitySensorNode ) );

    velocitySensor.isArrowVisibleProperty.linkAttribute( this.arrowShape, 'visible' );

    // drag handler
    this.addInputListener( new MovableDragHandler( {locationProperty: velocitySensor.positionProperty, dragBounds: dragBounds},
      ModelViewTransform2.createIdentity(),
      {
        startDrag: function() {
          velocitySensorNode.moveToFront();
        },
        endDrag: function() {
          // check intersection only with the outer rectangle.
          // Add a 5px tolerance. See https://github.com/phetsims/fluid-pressure-and-flow/issues/105
          if ( containerBounds.intersectsBounds( Bounds2.rect( velocitySensor.position.x, velocitySensor.position.y,
            rectangleWidth, rectangleHeight ).eroded( 5 ) ) ) {
            velocitySensor.positionProperty.reset();
          }
        }
      } ) );

    velocitySensor.positionProperty.linkAttribute( velocitySensorNode, 'translation' );

    Property.multilink( [velocitySensor.positionProperty].concat( linkedProperties ), function( position ) {
      velocitySensor.value = getVelocityAt( modelViewTransform.viewToModelX( position.x + 50 ),
        modelViewTransform.viewToModelY( position.y + 72 ) );
    } );

    // Update the text when the value or units changes.
    Property.multilink( [velocitySensor.valueProperty, measureUnitsProperty, velocitySensor.positionProperty],
      function( velocity, units ) {
        if ( velocitySensor.positionProperty.initialValue === velocitySensor.position ) {
          labelText.text = '-';
        }
        else {
          labelText.text = units === 'metric' ?
                           velocity.magnitude().toFixed( 1 ) + ' ' + mPerS :
                           (velocity.magnitude() * 3.28).toFixed( 1 ) + ' ' + ftPerS;
        }
        labelText.center = innerMostRectangle.center;
      } );

    velocitySensor.on( 'update', function() {
      velocitySensor.value = getVelocityAt(
        modelViewTransform.viewToModelX( velocitySensor.position.x + 50 ),
        modelViewTransform.viewToModelY( velocitySensor.position.y + 72 )
      );
    } );

    // for visually inspecting the touch area
    this.touchArea = this.localBounds;

    this.mutate( options );
  }

  return inherit( Node, VelocitySensorNode );
} );