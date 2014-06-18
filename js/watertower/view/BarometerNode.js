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

  // strings
  var pressureString = require( 'string!FLUID_PRESSURE_AND_FLOW/pressure' );

  /**
   * Main constructor for BarometerNode.
   *
   * @param {WaterTowerModel} model of simulation
   * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
   * @param {Property} barometerValueProperty - value {Pa}, associated with current barometer instance
   * @param {Property} barometerPositionProperty - position (Vector2), associated with current barometer instance
   * @param {Bounds2} containerBounds - bounds of container for all barometers, needed to snap barometer to initial position when it in container
   * @param {Bounds2} dragBounds - bounds that define where the barometer may be dragged
   * @constructor
   */
  function BarometerNode( model, modelViewTransform, barometerValueProperty, barometerPositionProperty, containerBounds, dragBounds, options ) {
    var barometerNode = this;

    Node.call( this, {cursor: 'pointer'} );

    // Show the circuar part of the gauge and the needle
    var gaugeNode = new GaugeNode( barometerValueProperty, pressureString, {min: model.MIN_PRESSURE, max: model.MAX_PRESSURE}, {scale: 0.3} );
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

    //handlers
    this.addInputListener( new MovableDragHandler( {locationProperty: barometerPositionProperty, dragBounds: dragBounds},
      ModelViewTransform2.createIdentity(),
      {
        endDrag: function() {
          if ( containerBounds.intersectsBounds( barometerNode.visibleBounds ) ) {
            barometerPositionProperty.reset();
          }
        }
      } ) );

    barometerValueProperty.set( model.getPressureAtCoords( modelViewTransform.viewToModelX( barometerNode.centerX ), modelViewTransform.viewToModelY( barometerNode.bottom ) ) );

    var updateText = function() {
      text.text = model.units.getPressureString[model.measureUnits]( barometerValueProperty.get() );
      text.centerX = gaugeNode.centerX;
      textBackground.setRect( text.x - 2, text.y - text.height + 2, text.width + 4, text.height + 2 );
      textBackground.visible = (text.text !== '-');
    };

    var updateValue = function() {
      barometerValueProperty.set( model.getPressureAtCoords( modelViewTransform.viewToModelX( barometerNode.centerX ), modelViewTransform.viewToModelY( barometerNode.bottom ) ) );
    };
    model.fluidDensityProperty.link( updateValue );
    model.isAtmosphereProperty.link( updateValue );
    barometerPositionProperty.link( updateValue );

    barometerValueProperty.link( updateText );
    model.measureUnitsProperty.link( updateText );

    barometerPositionProperty.linkAttribute( barometerNode, 'translation' );

    this.mutate( options );
  }

  return inherit( Node, BarometerNode );
} );