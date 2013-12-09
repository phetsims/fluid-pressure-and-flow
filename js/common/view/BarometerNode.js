// Copyright 2002-2013, University of Colorado Boulder

/**
 * Slider and button for changing fluid density and gravitation.
 *
 * @author Anton Ulyanov, Vasily Shakhov (Mlearner)
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

  var pressureString = require( 'string!UNDER_PRESSURE/pressure' );

  function BarometerNode( model, thisBarometerStatement ) {
    var self = this;

    Node.call( this, {cursor: "pointer", pickable: true, x: 570, y: 45 } );

    var gaugeNode = new GaugeNode( thisBarometerStatement, pressureString, {min: model.MIN_PRESSURE, max: model.MAX_PRESSURE}, {scale: 0.5} );
    this.addChild( gaugeNode );

    var underGaugeRectangleWidth = 25,
      underGaugeRectangleHeight = 25;

    var underGaugeRectangle = new Rectangle( gaugeNode.centerX - underGaugeRectangleWidth / 2, gaugeNode.bottom - 3, underGaugeRectangleWidth, underGaugeRectangleHeight, 5, 5, {
      fill: new LinearGradient( gaugeNode.centerX - underGaugeRectangleWidth / 2, 0, gaugeNode.centerX + underGaugeRectangleWidth / 2, 0 )
        .addColorStop( 0, "#938b63" )
        .addColorStop( 0.2, "#dedcdc" )
        .addColorStop( 0.5, "#e6e7ef" )
        .addColorStop( 0.8, "#dedcdc" )
        .addColorStop( 1, "#938b63" )
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
        .addColorStop( 0, "#938b63" )
        .addColorStop( 0.2, "#dedcdc" )
        .addColorStop( 0.5, "#e6e7ef" )
        .addColorStop( 0.8, "#dedcdc" )
        .addColorStop( 1, "#938b63" )
    } ) );


    var barometerDragHandler = new SimpleDragHandler( {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      start: function() {
        self.moveToFront();
      },
      //Translate on drag events
      translate: function( args ) {
        self.translation = args.position;
        thisBarometerStatement.set( model.getPressureAtCoords( args.position ) );
      }
    } );
    this.addInputListener( barometerDragHandler );

    thisBarometerStatement.set( model.getPressureAtCoords( self.translation ) );


  }


  inherit( Node, BarometerNode );

  return BarometerNode;
} )
;
