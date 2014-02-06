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
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  var pressureString = require( 'string!UNDER_PRESSURE/pressure' );

  //DOC - add header
  function BarometerNode( model, mvt, thisBarometerStatement, barometerPositionProperty, containerBounds ) {
    var self = this;

    Node.call( this, {cursor: 'pointer', pickable: true, x: barometerPositionProperty.get().x, y: barometerPositionProperty.get().y} );


    //visual
    var gaugeNode = new GaugeNode( thisBarometerStatement, pressureString, {min: model.MIN_PRESSURE, max: model.MAX_PRESSURE}, {scale: 0.6} );
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

    //pressure text
    var text = new Text( '', {font: new PhetFont( 14 ), y: 25, fontWeight: 'bold'} );
    var textBackground = new Rectangle( 0, 0, 1, 1, {stroke: 'black', fill: 'white'} );
    this.addChild( textBackground );
    this.addChild( text );

    //handlers
    var barometerDragHandler = new SimpleDragHandler( {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      start: function() {
        self.moveToFront();
      },
      //Translate on drag events
      translate: function( args ) {
        barometerPositionProperty.set( args.position );
      },
      end: function() {
        if ( containerBounds.intersectsBounds( self.visibleBounds ) ) {
          barometerPositionProperty.reset();
        }
      }
    } );
    this.addInputListener( barometerDragHandler );

    thisBarometerStatement.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );

    var setText = function() {
      text.text = model.units.getPressureString[model.measureUnits]( thisBarometerStatement.get() );
      text.centerX = gaugeNode.centerX;
      textBackground.setRect( text.x - 2, text.y - text.height + 2, text.width + 4, text.height + 2 );
      textBackground.visible = (text.text !== '-');
    };

    var dy = barometerPositionProperty.get().y - self.bottom;
   //we can't use  self.centerX,self.bottom because these vars not updated yet
    barometerPositionProperty.link(function(position) {
      thisBarometerStatement.set( model.getPressureAtCoords( mvt.viewToModelX( position.x ), mvt.viewToModelY( position.y-dy) ) );
    });

    model.currentSceneProperty.link(function() {
      thisBarometerStatement.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );
    });

    model.gravityProperty.link( function() {
      thisBarometerStatement.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );
    } );
    model.fluidDensityProperty.link( function() {
      thisBarometerStatement.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );
    } );
    model.isAtmosphereProperty.link( function() {
      thisBarometerStatement.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );
    } );
    model.currentVolumeProperty.link( function() {
      thisBarometerStatement.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );
    } );
    model.leftDisplacementProperty.link( function() {
      thisBarometerStatement.set( model.getPressureAtCoords( mvt.viewToModelX( self.centerX ), mvt.viewToModelY( self.bottom ) ) );
    } );
    thisBarometerStatement.link( function() {
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
