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

  // strings
  var speedString = require( 'string!FLUID_PRESSURE_AND_FLOW/speed' );
  var speedMeterString = require( 'string!FLUID_PRESSURE_AND_FLOW/speedMeter' );
  var mPerS = require( 'string!FLUID_PRESSURE_AND_FLOW/mPerS' );
  var ftPerS = require( 'string!FLUID_PRESSURE_AND_FLOW/ftPerS' );

  /**
   * Main constructor for VelocitySensorNode.
   *
   * @param {WaterTowerModel} model of simulation
   * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
   * @param {Property} velocityProperty - value {Vector2}, associated with current sensor instance
   * @param {Property} positionProperty - position (Vector2), associated with current sensor instance
   * @param {Bounds2} containerBounds - bounds of container for all velocity sensors, needed to reset to initial position
   * @param {Bounds2} dragBounds - bounds that define where the sensor may be dragged
   * @constructor
   */
  function VelocitySensorNode( model, modelViewTransform, velocityProperty, positionProperty, containerBounds, dragBounds ) {
    var velocitySensorNode = this;
    Node.call( this, {cursor: 'pointer', pickable: true} );

    var outerNode = new Rectangle( 0, 0, 80, 70, 10, 10, {stroke: 'gray', lineWidth: 1, fill: '#CD9E4D'} );
    velocitySensorNode.addChild( outerNode );

    velocitySensorNode.addChild( new Text( speedString, {fill: 'black', font: new PhetFont( {size: 16, weight: 'bold'} ), x: 15, y: 20} ) );

    var innerNode = new Rectangle( 0, 0, 70, 22, {stroke: 'gray', lineWidth: 1, fill: '#ffffff', x: 5, y: 30} );
    velocitySensorNode.addChild( innerNode );

    var labelNode = new Text( speedMeterString, {fill: 'black', font: new PhetFont( {size: 12, weight: 'bold'} ), x: 10, y: 40} );
    velocitySensorNode.addChild( labelNode );

    var bottomTriangleShapeWidth = 30;
    var bottomTriangleShapeHeight = 12;

    var bottomTriangleShape = new Shape()
      .moveTo( outerNode.centerX - bottomTriangleShapeWidth / 2, innerNode.rectY + 1 )
      .lineTo( outerNode.centerX, bottomTriangleShapeHeight + innerNode.rectY + 1 )
      .lineTo( outerNode.centerX + bottomTriangleShapeWidth / 2, innerNode.rectY + 1 );

    this.addChild( new Path( bottomTriangleShape, {
      fill: new LinearGradient( outerNode.centerX - bottomTriangleShapeWidth / 2, 0, outerNode.centerX + bottomTriangleShapeWidth / 2, 0 )
        .addColorStop( 1, '#CD9E4D' )
        .addColorStop( 1, '#CD9E4D' )
        .addColorStop( 1, '#CD9E4D' ), x: 0, y: 69, stroke: 'gray'
    } ) );

    //handlers
    this.addInputListener( new MovableDragHandler( {locationProperty: positionProperty, dragBounds: dragBounds},
      ModelViewTransform2.createIdentity(),
      {
        endDrag: function() {
          if ( containerBounds.intersectsBounds( velocitySensorNode.visibleBounds ) ) {
            positionProperty.reset();
            labelNode.centerX = outerNode.centerX;
            labelNode.text = '-';
          }
        }
      } ) );

    positionProperty.linkAttribute( velocitySensorNode, 'translation' );

    //Update the text when the value or units changes.
    DerivedProperty.multilink( [velocityProperty, model.measureUnitsProperty], function( velocity, units ) {
      labelNode.text = units === 'metric' ?
                       velocity.magnitude().toFixed( 2 ) + ' ' + mPerS :
                       (velocity.magnitude() * 3.28).toFixed( 2 ) + ' ' + ftPerS
      labelNode.center = innerNode.center;
    } );

  }

  return inherit( Node, VelocitySensorNode );
} );