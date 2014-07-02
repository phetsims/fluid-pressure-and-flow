// Copyright 2002-2013, University of Colorado Boulder

/**
 * Velocity Sensor view
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
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ArrowShape = require( 'SCENERY_PHET/ArrowShape' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  // strings
  var speedString = require( 'string!FLUID_PRESSURE_AND_FLOW/speed' );
  var mPerS = require( 'string!FLUID_PRESSURE_AND_FLOW/mPerS' );
  var ftPerS = require( 'string!FLUID_PRESSURE_AND_FLOW/ftPerS' );

  /**
   * Main constructor for VelocitySensorNode.
   *
   * @param {WaterTowerModel} model of simulation
   * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
   * @param {VelocitySensor} velocitySensor - model for the velocity sensor
   * @param {Bounds2} containerBounds - bounds of container for all velocity sensors, needed to reset to initial position
   * @param {Bounds2} dragBounds - bounds that define where the sensor may be dragged
   * @constructor
   */
  function VelocitySensorNode( model, modelViewTransform, velocitySensor, containerBounds, dragBounds ) {
    var velocitySensorNode = this;
    Node.call( this, {cursor: 'pointer', pickable: true} );

// adding outer rectangle
    var outerRectangle = new Rectangle( 0, 0, 100, 60, 10, 10, {stroke: new LinearGradient( 0, 0, 0, 100 )
      .addColorStop( .0, '#FFAD73' )
      .addColorStop( .1, '#C5631E' )
      .addColorStop( .2, '#C5631E' )
      .addColorStop( .3, '#C5631E' )
      .addColorStop( .4, '#C5631E' )
      .addColorStop( .6, '#C5631E' ), lineWidth: 1, fill: new LinearGradient( 0, 0, 0, 100 )
      .addColorStop( .0, '#FFAD73' )
      .addColorStop( .1, '#FFAD73' )
      .addColorStop( .2, '#FFAD73' )
      .addColorStop( .3, '#FFAD73' )
      .addColorStop( .4, '#FFAD73' )
      .addColorStop( .6, '#C5631E' )} );
    velocitySensorNode.addChild( outerRectangle );
    //second rectangle
    var innerRectangle = new Rectangle( 0, 0, 96, 54, 10, 10, {stroke: '#C5631E', lineWidth: 1, fill: '#C5631E', y: outerRectangle.centerY - 27, x: outerRectangle.centerX - 47} );
    velocitySensorNode.addChild( innerRectangle );

    // adding inner rectangle
    var innerMostRectangle = new Rectangle( 10, 0, 70, 22, 5, 5, {stroke: 'white', lineWidth: 1, fill: '#ffffff', x: innerRectangle.centerX - 45, y: innerRectangle.centerY} );
    velocitySensorNode.addChild( innerMostRectangle );

    // adding speed meter title text
    velocitySensorNode.addChild( new Text( speedString, {fill: 'black', font: new PhetFont( {size: 16, weight: 'bold'} ), x: innerMostRectangle.top - 10, y: innerMostRectangle.top - 10} ) );

    // adding speed measure label
    var labelNode = new Text( '', {fill: 'black', font: new PhetFont( {size: 12, weight: 'bold'} ), y: innerMostRectangle.centerY} );
    velocitySensorNode.addChild( labelNode );

    var outerBottomTriangleShapeWidth = 20, outerBottomTriangleShapeHeight = 22, innerBottomTriangleShapeWidth = 16
      , innerBottomTriangleShapeHeight = 16;
    // adding bottom triangle shape
    var outerTriangleShapeNode = new Path( new Shape()
      .moveTo( innerRectangle.centerX - outerBottomTriangleShapeWidth / 2, innerMostRectangle.rectY + 1 )
      .lineTo( innerRectangle.centerX, outerBottomTriangleShapeHeight + innerMostRectangle.rectY + 1 )
      .lineTo( innerRectangle.centerX + outerBottomTriangleShapeWidth / 2, innerMostRectangle.rectY + 1 ), {
      fill: new LinearGradient( 0, 0, 0, 30 )
        .addColorStop( .0, '#FFAD73' ).addColorStop( .1, '#FFAD73' ).addColorStop( .2, '#FFAD73' ).addColorStop( .3, '#FFAD73' )
        .addColorStop( .4, '#FFAD73' ).addColorStop( .6, '#FFAD73' ), y: outerRectangle.bottom - 2, stroke: new LinearGradient( 0, 0, 0, 30 )
        .addColorStop( .0, '#8D4716' ).addColorStop( .1, '#8D4716' ).addColorStop( .2, '#8D4716' ).addColorStop( .3, '#8D4716' )
        .addColorStop( .4, '#8D4716' ).addColorStop( .6, '#8D4716' )  } );
    this.addChild( outerTriangleShapeNode );
    var innerTriangleShapeNode = new Path( new Shape()
      .moveTo( innerRectangle.centerX - innerBottomTriangleShapeWidth / 2, innerMostRectangle.rectY + 1 )
      .lineTo( innerRectangle.centerX, innerBottomTriangleShapeHeight + innerMostRectangle.rectY + 1 )
      .lineTo( innerRectangle.centerX + innerBottomTriangleShapeWidth / 2, innerMostRectangle.rectY + 1 ), {
      fill: '#C5631E', bottom: outerTriangleShapeNode.bottom - 4, stroke: '#C5631E'  } );
    this.addChild( innerTriangleShapeNode );

    // arrow shape
    var arrowShape = new Path( new ArrowShape( 0, 0, 0.3 * modelViewTransform.modelToViewDeltaX( velocitySensor.value.x ), 0.3 * modelViewTransform.modelToViewDeltaY( velocitySensor.value.y ), {fill: 'black'} ), {fill: 'blue'} );
    this.addChild( arrowShape );

    velocitySensor.valueProperty.link( function( velocity ) {
      // fixing arrowShape path position.
      if ( velocity.y > 0 ) {
        arrowShape.bottom = outerTriangleShapeNode.bottom;
      }
      else {
        arrowShape.top = outerTriangleShapeNode.bottom;
      }
      if ( velocity.x > 0 ) {
        arrowShape.left = outerRectangle.centerX;
      }
      else {
        arrowShape.right = outerRectangle.centerX;
      }
    } );
    velocitySensor.isArrowVisibleProperty.linkAttribute( arrowShape, 'visible' );


    //handlers
    this.addInputListener( new MovableDragHandler( {locationProperty: velocitySensor.positionProperty, dragBounds: dragBounds},
      ModelViewTransform2.createIdentity(),
      {
        endDrag: function() {
          if ( containerBounds.intersectsBounds( velocitySensorNode.visibleBounds ) ) {
            velocitySensor.positionProperty.reset();
            labelNode.center = innerMostRectangle.center;
            labelNode.text = '-';
          }
        }
      } ) );

    velocitySensor.positionProperty.linkAttribute( velocitySensorNode, 'translation' );

    //Update the text when the value or units changes.
    DerivedProperty.multilink( [velocitySensor.valueProperty, model.measureUnitsProperty], function( velocity, units ) {
      labelNode.text = units === 'metric' ?
                       velocity.magnitude().toFixed( 2 ) + ' ' + mPerS :
                       (velocity.magnitude() * 3.28).toFixed( 2 ) + ' ' + ftPerS;
      labelNode.center = innerMostRectangle.center;
    } );

  }

  return inherit( Node, VelocitySensorNode );
} );