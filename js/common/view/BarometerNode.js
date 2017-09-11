// Copyright 2013-2015, University of Colorado Boulder

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
  var Bounds2 = require( 'DOT/Bounds2' );
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var pressureString = require( 'string!FLUID_PRESSURE_AND_FLOW/pressure' );

  /**
   * Main constructor for BarometerNode.
   *
   * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
   * @param {Sensor} barometer - the barometer model
   * @param {Property<String>} measureUnitsProperty -- english/metric
   * @param {Property[]} linkedProperties - the set of properties which affect the barometer value
   * @param {function} getPressureAt - function to be called to get pressure at the given coords
   * @param {function} getPressureString - function to be called to get the pressure display string at the given coords
   * @param {Bounds2} containerBounds - bounds of container for all barometers, needed to snap barometer to initial position when it in container
   * @param {Bounds2} dragBounds - bounds that define where the barometer may be dragged
   * @param {Object} [options] that can be passed on to the underlying node
   * @constructor
   *
   * Note the params passed for the functions:
   *  getPressureAt (x, y) where x, y are model values.
   *  getPressureString (pressure, units, x, y) where pressure in Pascals, x, y are model values
   */
  function BarometerNode( modelViewTransform, barometer, measureUnitsProperty, linkedProperties, getPressureAt,
                          getPressureString, containerBounds, dragBounds, options ) {
    var self = this;

    options = _.extend( {
      pressureReadOffset: 53, //distance between center and reading tip of the barometer in view co-ordinates
      scale: 1,
      minPressure: Constants.MIN_PRESSURE,
      maxPressure: Constants.MAX_PRESSURE
    }, options );

    Node.call( this, { cursor: 'pointer' } );

    // Show the circular part of the gauge and the needle
    var gaugeNode = new GaugeNode( barometer.valueProperty, pressureString,
      { min: options.minPressure, max: options.maxPressure }, { scale: 0.4 } );
    this.addChild( gaugeNode );

    var underGaugeRectangleWidth = 18;
    var underGaugeRectangleHeight = 15;
    var underGaugeRectangle = new Rectangle( gaugeNode.centerX - underGaugeRectangleWidth / 2, gaugeNode.bottom - 3,
      underGaugeRectangleWidth, underGaugeRectangleHeight, 1, 1, {
        fill: new LinearGradient( gaugeNode.centerX - underGaugeRectangleWidth / 2, 0,
          gaugeNode.centerX + underGaugeRectangleWidth / 2, 0 )
          .addColorStop( 0, '#656570' )
          .addColorStop( 0.2, '#bdc3cf' )
          .addColorStop( 0.5, '#dee6f5' )
          .addColorStop( 0.8, '#bdc3cf' )
          .addColorStop( 1, '#656570' ),
        top: gaugeNode.bottom - 2
      } );
    this.addChild( underGaugeRectangle );

    //pressure text, y position empirically determined
    var READOUT_SIZE = new Dimension2( containerBounds.width * 0.8, 18 );
    var text = new Text( '', { font: new PhetFont( 12 ), fontWeight: 'bold', maxWidth: READOUT_SIZE.width * 0.95 } );
    var readoutPanel = new Panel( text, {
      minWidth: READOUT_SIZE.width,
      maxWidth: READOUT_SIZE.width,
      minHeight: READOUT_SIZE.height,
      maxHeight: READOUT_SIZE.height,
      resize: false,
      cornerRadius: 5,
      lineWidth: 1,
      align: 'center',
      fill: 'white',
      xMargin: 0
    } );

    var bottomTriangleShapeWidth = 6;
    var bottomTriangleShapeHeight = 12;
    readoutPanel.centerX = gaugeNode.centerX;
    readoutPanel.bottom = gaugeNode.bottom + 5;

    var bottomTriangleShape = new Shape()
      .moveTo( gaugeNode.centerX - bottomTriangleShapeWidth / 2, underGaugeRectangle.rectY + underGaugeRectangleHeight )
      .lineTo( gaugeNode.centerX, bottomTriangleShapeHeight + underGaugeRectangle.rectY + underGaugeRectangleHeight )
      .lineTo( gaugeNode.centerX + bottomTriangleShapeWidth / 2,
        underGaugeRectangle.rectY + underGaugeRectangleHeight );
    this.addChild( new Path( bottomTriangleShape, {
      fill: new LinearGradient( gaugeNode.centerX - bottomTriangleShapeWidth / 2, 0,
        gaugeNode.centerX + bottomTriangleShapeWidth / 2, 0 )
        .addColorStop( 0, '#656570' )
        .addColorStop( 0.5, '#dee6f5' )
        .addColorStop( 1, '#656570' ),
      top: underGaugeRectangle.bottom - 1
    } ) );
    this.addChild( readoutPanel );
    this.mutate( options );

    var barometerDragBounds = modelViewTransform.viewToModelBounds( new Bounds2(
      this.width / 2,
      this.height / 2,
      dragBounds.width - this.width / 2,
      dragBounds.height - this.height / 2 ) );

    barometer.positionProperty.link( function( value ) {
      self.centerX = modelViewTransform.modelToViewX( value.x );
      self.centerY = modelViewTransform.modelToViewY( value.y );
    } );

    // Add an input listener so the BarometerNode can be dragged
    // Constrain the location so it cannot be dragged offscreen
    this.addInputListener( new MovableDragHandler( barometer.positionProperty,
      {
        dragBounds: barometerDragBounds,
        modelViewTransform: modelViewTransform,
        startDrag: function() {
          self.moveToFront();
        },
        endDrag: function() {
          if ( containerBounds.intersectsBounds( self.visibleBounds ) ) {
            barometer.positionProperty.reset();
            self.moveToBack();
          }
        }
      } ) );

    //Update the value in the barometer value model by reading from the model.
    Property.multilink( [ barometer.positionProperty ].concat( linkedProperties ), function( position ) {
      if ( barometer.positionProperty.value === barometer.positionProperty.initialValue ) {
        barometer.valueProperty.value = null; // when the barometer is in the sensor panel making sure it shows no value for accessibility
      }
      else {
        barometer.valueProperty.value = getPressureAt( position.x,
          position.y + modelViewTransform.viewToModelDeltaY( self.bottom - self.centerY ) );
      }
    } );

    // update barometer value when weights are added to chamber pool
    barometer.on( 'update', function() {
      if ( barometer.positionProperty.value === barometer.positionProperty.initialValue ) {
        barometer.valueProperty.value = null; // when the barometer is in the sensor panel making sure it shows no value for accessibility
      }
      else {
        barometer.valueProperty.value = getPressureAt( barometer.positionProperty.value.x, barometer.positionProperty.value.y + modelViewTransform.viewToModelDeltaY( self.bottom - self.centerY ) );
      }
    } );

    // Update the text when the value, units or position changes.
    // If the barometer reading is 0 and it is touching the sensor panel, then only the position changes.
    // In order to trigger the text display change, need to listen to position property here as well.
    Property.multilink( [ barometer.valueProperty, measureUnitsProperty, barometer.positionProperty ],
      function( barometerValue, units ) {
        if ( barometer.positionProperty.value === barometer.positionProperty.initialValue || barometerValue === null ) {
          text.text = '-'; // showing no value when barometer is in the sensor panel
          text.centerX = READOUT_SIZE.width / 2;
        }
        else {
          text.text = getPressureString( barometerValue, units );
          text.centerX = READOUT_SIZE.width / 2;
          text.centerY = READOUT_SIZE.height * 0.7;
        }
      } );

    self.touchArea = self.localBounds.dilatedXY( 0, 0 );
  }

  fluidPressureAndFlow.register( 'BarometerNode', BarometerNode );

  return inherit( Node, BarometerNode );
} );