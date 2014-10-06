// Copyright 2002-2013, University of Colorado Boulder

/**
 * Barometer Node with a gauge and needle to display the pressure.
 * Also has a text box to display the pressure value.
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
  var Constants = require( 'UNDER_PRESSURE/common/Constants' );

  // strings
  var pressureString = require( 'string!UNDER_PRESSURE/pressure' );

  /**
   * Main constructor for BarometerNode.
   *
   * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
   * @param {Barometer} barometer - the barometer model
   * @param {Property<String>} measureUnitsProperty -- english/metric
   * @param {Property[]} linkedProperties - the set of properties which affect the barometer value
   * @param {Function} getPressureAt - function to be called to get pressure at the given coords
   * @param {Function} getPressureString - function to be called to get the pressure display string at the given coords
   * @param {Bounds2} containerBounds - bounds of container for all barometers, needed to snap barometer to initial position when it in container
   * @param {Bounds2} dragBounds - bounds that define where the barometer may be dragged
   * @param {Object} [options] that can be passed on to the underlying node
   * @constructor
   *
   * Note the params passed for the functions:
   *  getPressureAt (x, y) where x, y are model values.
   *  getPressureString (pressure, units, x, y) where pressure in Pascals, x, y are model values
   */
  function BarometerNode( modelViewTransform, barometer, measureUnitsProperty, linkedProperties, getPressureAt, getPressureString, containerBounds, dragBounds, options ) {
    var barometerNode = this;

    options = _.extend( {
      pressureReadOffset: 53,
      scale: 1,
      minPressure: Constants.MIN_PRESSURE,
      maxPressure: Constants.MAX_PRESSURE
    }, options );

    Node.call( this, {cursor: 'pointer'} );

    // Show the circular part of the gauge and the needle
    var gaugeNode = new GaugeNode( barometer.valueProperty, pressureString, {min: options.minPressure, max: options.maxPressure}, {scale: 0.4} );
    this.addChild( gaugeNode );

    var underGaugeRectangleWidth = 18;
    var underGaugeRectangleHeight = 15;
    var underGaugeRectangle = new Rectangle( gaugeNode.centerX - underGaugeRectangleWidth / 2, gaugeNode.bottom - 3,
      underGaugeRectangleWidth, underGaugeRectangleHeight, 1, 1, {
        fill: new LinearGradient( gaugeNode.centerX - underGaugeRectangleWidth / 2, 0, gaugeNode.centerX + underGaugeRectangleWidth / 2, 0 )
          .addColorStop( 0, '#656570' )
          .addColorStop( 0.2, '#bdc3cf' )
          .addColorStop( 0.5, '#dee6f5' )
          .addColorStop( 0.8, '#bdc3cf' )
          .addColorStop( 1, '#656570' ),
        top: gaugeNode.bottom - 2
      } );
    this.addChild( underGaugeRectangle );

    //pressure text, y position empirically determined
    var text = new Text( '', {font: new PhetFont( 10 ), y: 40, fontWeight: 'bold'} );
    var textBackground = new Rectangle( 0, 0, 0, 0.5, {stroke: 'black', fill: 'white'} );
    this.addChild( textBackground );
    this.addChild( text );

    var bottomTriangleShapeWidth = 6;
    var bottomTriangleShapeHeight = 12;

    var bottomTriangleShape = new Shape()
      .moveTo( gaugeNode.centerX - bottomTriangleShapeWidth / 2, underGaugeRectangle.rectY + underGaugeRectangleHeight )
      .lineTo( gaugeNode.centerX, bottomTriangleShapeHeight + underGaugeRectangle.rectY + underGaugeRectangleHeight )
      .lineTo( gaugeNode.centerX + bottomTriangleShapeWidth / 2, underGaugeRectangle.rectY + underGaugeRectangleHeight );
    this.addChild( new Path( bottomTriangleShape, {
      fill: new LinearGradient( gaugeNode.centerX - bottomTriangleShapeWidth / 2, 0, gaugeNode.centerX + bottomTriangleShapeWidth / 2, 0 )
        .addColorStop( 0, '#656570' )
        .addColorStop( 0.5, '#dee6f5' )
        .addColorStop( 1, '#656570' ),
      top: underGaugeRectangle.bottom - 1
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
      if ( barometer.positionProperty.initialValue === position ) {
        // In the initial position barometer has no value.
        // The value needs to be a number for the needle to be visible, so using 0.
        barometer.value = 0;
      }
      else {
        barometer.value = getPressureAt( modelViewTransform.viewToModelX( position.x ), modelViewTransform.viewToModelY( position.y + (options.pressureReadOffset * options.scale) ) );
      }
    } );

    //Update the text when the value, units or position changes.
    // If the barometer reading is 0 and it is touching the sensor panel, then only the position changes.
    // In order to trigger the text display change, need to listen to position property here as well.
    Property.multilink( [barometer.valueProperty, measureUnitsProperty, barometer.positionProperty], function( barometerValue, units ) {
      if ( barometer.position === barometer.positionProperty.initialValue ) {
        text.text = '-';
        textBackground.setRect( 0, 0, text.width + 50, text.height + 2 );
      }
      else {
        text.text = getPressureString( barometerValue, units, modelViewTransform.viewToModelX( barometer.position.x ),
          modelViewTransform.viewToModelY( barometer.position.y + (options.pressureReadOffset * options.scale) ) );
        textBackground.setRect( 0, 0, text.width + 4, text.height + 2 );
      }

      textBackground.centerX = gaugeNode.centerX;
      textBackground.bottom = gaugeNode.bottom;
      text.center = textBackground.center;
    } );

    barometer.positionProperty.linkAttribute( barometerNode, 'translation' );

    barometerNode.touchArea = barometerNode.localBounds.dilatedXY( 0, 0 );

    barometer.on( 'update', function() {
      if ( barometer.position !== barometer.positionProperty.initialValue ) {
        barometer.value = getPressureAt( modelViewTransform.viewToModelX( barometer.position.x ), modelViewTransform.viewToModelY( barometer.position.y + (options.pressureReadOffset * options.scale) ) );
      }
    } );

    this.mutate( options );
  }

  return inherit( Node, BarometerNode );
} );