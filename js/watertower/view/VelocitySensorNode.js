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
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var ArrowShape = require( 'SCENERY_PHET/ArrowShape' );
  var Vector2 = require( 'DOT/Vector2' );


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

    this.velocitySensor = velocitySensor;
    this.modelViewTransform = modelViewTransform;
    this.model = model;
    var rectangleWidth = 100;
    var rectangleHeight = 56;
    this.layoutBounds = dragBounds;

    // adding outer rectangle
    var outerRectangle = new Rectangle( 0, 0, rectangleWidth, rectangleHeight, 10, 10, {
      stroke: new LinearGradient( 0, 0, 0, rectangleHeight ).addColorStop( 0, '#FFAD73' ).addColorStop( 0.6, '#893D11' ),
      fill: new LinearGradient( 0, 0, 0, rectangleHeight ).addColorStop( 0, '#FFAD73' ).addColorStop( 0.6, '#893D11' )} );
    velocitySensorNode.addChild( outerRectangle );
    //second rectangle
    var innerRectangle = new Rectangle( 2, 2, rectangleWidth - 4, rectangleHeight - 4, 10, 10, { fill: '#C5631E'} );
    velocitySensorNode.addChild( innerRectangle );

    // adding velocity meter title text
    var titleText = new Text( speedString, {fill: 'black', font: new PhetFont( {size: 16, weight: 'normal'} ), center: innerRectangle.center, top: innerRectangle.top + 2} );
    velocitySensorNode.addChild( titleText );

    // adding inner rectangle
    var innerMostRectangle = new Rectangle( 10, 0, rectangleWidth - 30, rectangleHeight - 38, 5, 5, {stroke: 'white', lineWidth: 1, fill: '#ffffff', center: innerRectangle.center, top: titleText.bottom + 2} );
    velocitySensorNode.addChild( innerMostRectangle );

    // adding velocity measure label
    var labelText = new Text( '', {fill: 'black', font: new PhetFont( {size: 12, weight: 'bold'} ), center: innerMostRectangle.center} );
    velocitySensorNode.addChild( labelText );

    var triangleWidth = 30;
    var triangleHeight = 16;

    // adding bottom triangle shape
    var outerTriangleShapeNode = new Path( new Shape()
      .moveTo( innerRectangle.centerX - triangleWidth / 2, innerMostRectangle.rectY + 1 )
      .lineTo( innerRectangle.centerX, triangleHeight + innerMostRectangle.rectY + 1 )
      .lineTo( innerRectangle.centerX + triangleWidth / 2, innerMostRectangle.rectY + 1 ), {
      fill: new LinearGradient( 0, 0, 0, 2 * rectangleHeight )
        .addColorStop( 0.0, '#FFAD73' ).addColorStop( 0.1, '#C5631E' ), top: outerRectangle.bottom - 1, stroke: '#8D4716'  } );
    this.addChild( outerTriangleShapeNode );

    var innerTriangleShapeNode = new Path( new Shape()
      .moveTo( innerRectangle.centerX + 8 - ((triangleWidth) / 2), innerMostRectangle.rectY + 1 )
      .lineTo( innerRectangle.centerX + 5, (triangleHeight ) + innerMostRectangle.rectY - 4 )
      .lineTo( innerRectangle.centerX + (triangleWidth) / 2, innerMostRectangle.rectY + 1 ), {
      fill: '#C5631E', center: outerTriangleShapeNode.center, stroke: '#C5631E'  } );
    this.addChild( innerTriangleShapeNode );

    // arrow shape
    this.arrowShape = new Path( new ArrowShape( 0, 0, 0.3 * modelViewTransform.modelToViewDeltaX( velocitySensor.value.x ), 0.3 * modelViewTransform.modelToViewDeltaY( velocitySensor.value.y ) ), {fill: 'blue'} );
    this.addChild( this.arrowShape );

    velocitySensor.valueProperty.link( function( velocity ) {

      this.arrowShape.setShape( new ArrowShape( 0, 0, 0.3 * this.modelViewTransform.modelToViewDeltaX( this.velocitySensor.value.x ), 0.3 * this.modelViewTransform.modelToViewDeltaY( this.velocitySensor.value.y ) ) );

      // set the arrowShape path position.
      if ( velocity.y > 0 ) {
        this.arrowShape.bottom = outerTriangleShapeNode.bottom;
      }
      else {
        this.arrowShape.top = outerTriangleShapeNode.bottom;
      }
      if ( velocity.x > 0 ) {
        this.arrowShape.left = outerRectangle.centerX;
      }
      else {
        this.arrowShape.right = outerRectangle.centerX;
      }

    }.bind( velocitySensorNode ) );
    velocitySensor.isArrowVisibleProperty.linkAttribute( this.arrowShape, 'visible' );

    //handlers
    this.addInputListener( new MovableDragHandler( {locationProperty: velocitySensor.positionProperty, dragBounds: dragBounds},
      ModelViewTransform2.createIdentity(),
      {
        endDrag: function() {
          if ( containerBounds.intersectsBounds( velocitySensorNode.visibleBounds ) ) {
            velocitySensor.positionProperty.reset();
            velocitySensor.value = new Vector2( 0, 0 );
            labelText.centerX = innerRectangle.centerX + 20;
            labelText.text = '-';
          }
        }
      } ) );

    velocitySensor.positionProperty.linkAttribute( velocitySensorNode, 'translation' );

    velocitySensor.positionProperty.link( this.checkForWaterDrops.bind( velocitySensorNode ) );

    //Update the text when the value or units changes.
    DerivedProperty.multilink( [velocitySensor.valueProperty, model.measureUnitsProperty], function( velocity, units ) {
      labelText.text = units === 'metric' ?
                       velocity.magnitude().toFixed( 2 ) + ' ' + mPerS :
                       (velocity.magnitude() * 3.28).toFixed( 2 ) + ' ' + ftPerS;
      labelText.center = innerMostRectangle.center;
    } );

  }

  return inherit( Node, VelocitySensorNode, {
    checkForWaterDrops: function( position ) {
      var modelPosition = new Vector2( this.modelViewTransform.viewToModelX( position.x + 50 ), this.modelViewTransform.viewToModelY( position.y + 75 ) );
      var waterDropExists = false;
      for ( var i = 0, j = this.model.waterTowerDrops.length; i < j; i++ ) {
        if ( this.model.waterTowerDrops.get( i ).contains( modelPosition ) ) {
          this.velocitySensor.value = this.model.waterTowerDrops.get( i ).velocity;
          waterDropExists = true;
          break;
        }
      }

      if ( !waterDropExists ) {
        this.velocitySensor.value = new Vector2( 0, 0 );
      }

    }
  } );
} );