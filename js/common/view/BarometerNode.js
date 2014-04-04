// Copyright 2002-2013, University of Colorado Boulder

/**
 * Barometer view
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // Imports
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

  var pressureString = require( 'string!UNDER_PRESSURE/pressure' );

  /**
   * @param {UnderPressureModel} model of simulation
   * @param {ModelViewTransform2} mvt , Transform between model and view coordinate frames
   * @param {Property} barometerValueProperty - value {Pa}, associated with current barometer instance
   * @param {Property} barometerPositionProperty - position (Vector2), associated with current barometer instance
   * @param {Bounds2} containerBounds - bounds of container for all barometers, needed to snap barometer to initial position when it in container
   * @param {Bounds2} dragBounds - bounds that define where the barometer may be dragged
   */

  function BarometerNode( model, mvt, barometerValueProperty, barometerPositionProperty, containerBounds, dragBounds ) {
    var self = this;

    Node.call( this, {cursor: 'pointer', pickable: true, x: barometerPositionProperty.get().x, y: barometerPositionProperty.get().y} );


    //visual
    var gaugeNode = new GaugeNode( barometerValueProperty, pressureString, {min: model.MIN_PRESSURE, max: model.MAX_PRESSURE}, {scale: 0.6} );
    this.addChild( gaugeNode );

    var underGaugeRectangleWidth = 25,
      underGaugeRectangleHeight = 25;

    var underGaugeRectangle = new Rectangle( gaugeNode.centerX - underGaugeRectangleWidth / 2, gaugeNode.bottom - 3, underGaugeRectangleWidth, underGaugeRectangleHeight, 5, 5, {
      fill: new LinearGradient( gaugeNode.centerX - underGaugeRectangleWidth / 2, 0, gaugeNode.centerX + underGaugeRectangleWidth / 2, 0 )
        .addColorStop( 0, '#656570' )
        .addColorStop( 0.2, '#bdc3cf' )
        .addColorStop( 0.5, '#dee6f5' )
        .addColorStop( 0.8, '#bdc3cf' )
        .addColorStop( 1, '#656570' )
    } );
    this.addChild( underGaugeRectangle );

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

    //pressure text, y position empirically determined
    var text = new Text( '', {font: new PhetFont( 14 ), y: 40, fontWeight: 'bold'} );
    var textBackground = new Rectangle( 0, 0, 1, 1, {stroke: 'black', fill: 'white'} );
    this.addChild( textBackground );
    this.addChild( text );

    //handlers
    var barometerDragHandler = new MovableDragHandler( { locationProperty: barometerPositionProperty, dragBounds: dragBounds },
      ModelViewTransform2.createIdentity(),
      {
        endDrag: function() {
          if ( containerBounds.intersectsBounds( self.visibleBounds ) ) {
            barometerPositionProperty.reset();
          }
        }
      } );

    this.addInputListener( barometerDragHandler );

    barometerValueProperty.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );

    var setText = function() {
      text.text = model.units.getPressureString[model.measureUnits]( barometerValueProperty.get() );
      text.centerX = gaugeNode.centerX;
      textBackground.setRect( text.x - 2, text.y - text.height + 2, text.width + 4, text.height + 2 );
      textBackground.visible = (text.text !== '-');
    };

    var dy = barometerPositionProperty.get().y - self.bottom;
    //we can't use  self.centerX,self.bottom because these vars not updated yet
    barometerPositionProperty.link( function( position ) {
      barometerValueProperty.set( model.getPressureAtCoords( mvt.viewToModelX( position.x ), mvt.viewToModelY( position.y - dy ) ) );
    } );

    model.currentSceneProperty.link( function() {
      barometerValueProperty.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );
    } );

    model.gravityProperty.link( function() {
      barometerValueProperty.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );
    } );
    model.fluidDensityProperty.link( function() {
      barometerValueProperty.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );
    } );
    model.isAtmosphereProperty.link( function() {
      barometerValueProperty.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );
    } );
    model.currentVolumeProperty.link( function() {
      barometerValueProperty.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );
    } );
    model.leftDisplacementProperty.link( function() {
      barometerValueProperty.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );
    } );
    barometerValueProperty.link( function() {
      setText();
    } );
    model.measureUnitsProperty.link( function() {
      setText();
    } );

    barometerPositionProperty.link( function( newPosition ) {
      self.translation = newPosition;
    } );

  }


  return inherit( Node, BarometerNode );
} );
