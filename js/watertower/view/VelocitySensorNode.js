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
  var ArrowShapeNode = require( 'SCENERY_PHET/ArrowNode' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );

  // strings
  var speedString = require( 'string!FLUID_PRESSURE_AND_FLOW/speed' );
  var speedMeterString = require( 'string!FLUID_PRESSURE_AND_FLOW/speedMeter' );
  var mPerS = require( 'string!FLUID_PRESSURE_AND_FLOW/mPerS' );
  var ftPerS = require( 'string!FLUID_PRESSURE_AND_FLOW/fPerS' );

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

    var outerNode = new Rectangle( 0, 0, 80, 70, 10, 10, {stroke: 'gray', lineWidth: 1, fill: '#CD9E4D', x: 400, y: 45} );
    velocitySensorNode.addChild( outerNode );
    velocitySensorNode.addChild( new Text( speedString, {fill: 'black', font: new PhetFont( {size: 16, weight: 'bold'} ), x: 410, y: 72} ) );

    var innerNode = new Rectangle( 0, 0, 72, 22, {stroke: 'gray', lineWidth: 1, fill: '#ffffff', x: 403, y: 80} );
    velocitySensorNode.addChild( innerNode );

    var labelNode = new Text( speedMeterString, {fill: 'black', font: new PhetFont( {size: 12, weight: 'bold'} ), x: 402, y: 92} );
    velocitySensorNode.addChild( labelNode );

    velocitySensorNode.addChild( new ArrowShapeNode( 5, 0, 4, 16, {stroke: '#CD9E4D', fill: '#CD9E4D', x: 435, y: 110} ) );

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

    positionProperty.linkAttribute( velocitySensorNode, 'translation');

    //Update the text when the value or units changes.
    DerivedProperty.multilink( [velocityProperty, model.measureUnitsProperty], function( velocity, units ) {
      if ( units === 'metric' ) {
        labelNode.text = velocity.magnitude() + ' ' + mPerS;
      } else {
        labelNode.text = (velocity.magnitude() * 3.28) + ' ' + ftPerS;
      }
      labelNode.center = innerNode.center;
    });

  }

  return inherit( Node, VelocitySensorNode );
} );