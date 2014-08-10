// Copyright 2002-2013, University of Colorado Boulder

/**
 * Barometer view modified from under-pressure
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (ActualConcepts)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Property = require( 'AXON/Property' );
  var Units = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/Units' );
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/watertower/Constants' );

  // strings
  var pressureString = require( 'string!FLUID_PRESSURE_AND_FLOW/pressure' );

  /**
   * Main constructor for BarometerNode.
   *
   * @param {WaterTowerModel} waterTowerModel of simulation
   * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
   * @param {Barometer} barometer - the barometer model
   * @param {Property[]} linkedProperties - the set of properties which affect the barometer value
   * @param {Bounds2} containerBounds - bounds of container for all barometers, needed to snap barometer to initial position when it in container
   * @param {Bounds2} dragBounds - bounds that define where the barometer may be dragged
   * @param {options} options that can be passed on to the underlying node
   * @constructor
   */
  function BarometerNode( waterTowerModel, modelViewTransform, barometer, linkedProperties, containerBounds, dragBounds, options ) {
    var barometerNode = this;

    Node.call( this, {cursor: 'pointer'} );

    // Show the circular part of the gauge and the needle
    var gaugeNode = new GaugeNode( barometer.valueProperty, pressureString, {min: Constants.MIN_PRESSURE, max: Constants.MAX_PRESSURE}, {scale: 0.4} );
    this.addChild( gaugeNode );

    var underGaugeRectangleWidth = 25;
    var underGaugeRectangleHeight = 25;
    var underGaugeRectangle = new Rectangle( gaugeNode.centerX - underGaugeRectangleWidth / 2, gaugeNode.bottom - 3, underGaugeRectangleWidth, underGaugeRectangleHeight, 5, 5, {
      fill: new LinearGradient( gaugeNode.centerX - underGaugeRectangleWidth / 2, 0, gaugeNode.centerX + underGaugeRectangleWidth / 2, 0 )
        .addColorStop( 0, '#656570' )
        .addColorStop( 0.2, '#bdc3cf' )
        .addColorStop( 0.5, '#dee6f5' )
        .addColorStop( 0.8, '#bdc3cf' )
        .addColorStop( 1, '#656570' )
    } );
    this.addChild( underGaugeRectangle );

    //pressure text, y position empirically determined
    var text = new Text( '', {font: new PhetFont( 10 ), y: 40, fontWeight: 'bold'} );
    var textBackground = new Rectangle( 0, 0, 0, 0.5, {stroke: 'black', fill: 'white'} );
    this.addChild( textBackground );
    this.addChild( text );

    var bottomTriangleShapeWidth = 6,
      bottomTriangleShapeHeight = 12;

    var bottomTriangleShape = new Shape()
      .moveTo( gaugeNode.centerX - bottomTriangleShapeWidth / 2, underGaugeRectangle.rectY + underGaugeRectangleHeight )
      .lineTo( gaugeNode.centerX, bottomTriangleShapeHeight + underGaugeRectangle.rectY + underGaugeRectangleHeight )
      .lineTo( gaugeNode.centerX + bottomTriangleShapeWidth / 2, underGaugeRectangle.rectY + underGaugeRectangleHeight );
    this.addChild( new Path( bottomTriangleShape, {
      fill: new LinearGradient( gaugeNode.centerX - bottomTriangleShapeWidth / 2, 0, gaugeNode.centerX + bottomTriangleShapeWidth / 2, 0 )
        .addColorStop( 0, '#656570' )
        .addColorStop( 0.5, '#dee6f5' )
        .addColorStop( 1, '#656570' )
    } ) );

    // Add an input listener so the BarometerNode can be dragged
    // Constrain the location so it cannot be dragged offscreen
    this.addInputListener( new MovableDragHandler( {locationProperty: barometer.positionProperty, dragBounds: dragBounds},
      ModelViewTransform2.createIdentity(),
      {
        startDrag: function() {
          barometerNode.moveToFront();
        },
        endDrag: function() {
          if ( containerBounds.intersectsBounds( barometerNode.visibleBounds ) ) {
            barometer.positionProperty.reset();
          }
        }
      } ) );

    //Update the value in the barometer value model by reading from the model.
    Property.multilink( [barometer.positionProperty].concat( linkedProperties ), function( position ) {
      barometer.valueProperty.set( waterTowerModel.getPressureAtCoords( modelViewTransform.viewToModelX( position.x ), modelViewTransform.viewToModelY( position.y + (62) ) ) );
    } );

    //Update the text when the value or units changes.
    Property.multilink( [barometer.valueProperty, waterTowerModel.measureUnitsProperty], function( barometerValue, units ) {
      text.text = Units.getPressureString[units]( barometerValue );
      textBackground.setRect( 0, 0, text.width + 4, text.height + 2 );
      textBackground.center = underGaugeRectangle.center;
      text.center = textBackground.center;
    } );

    barometer.positionProperty.linkAttribute( barometerNode, 'translation' );

    this.mutate( options );
  }

  return inherit( Node, BarometerNode );
} );