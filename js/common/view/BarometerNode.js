// Copyright 2013-2019, University of Colorado Boulder

/**
 * Barometer Node with a gauge and needle to display the pressure.
 * Also has a text box to display the pressure value.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (ActualConcepts)
 * @author Sam Reid
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const pressureString = require( 'string!FLUID_PRESSURE_AND_FLOW/pressure' );

  class BarometerNode extends Node {

    /**
     * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
     * @param {Sensor} barometer - the barometer model
     * @param {Property<String>} measureUnitsProperty -- english/metric
     * @param {Property[]} linkedProperties - the set of properties which affect the barometer value
     * @param {function} getPressureAt - function to be called to get pressure at the given coords
     * @param {function} getPressureString - function to be called to get the pressure display string at the given coords
     * @param {Bounds2} containerBounds - bounds of container for all barometers, needed to snap barometer to initial position when it in container
     * @param {Bounds2} dragBounds - bounds that define where the barometer may be dragged
     * @param {Object} [options] that can be passed on to the underlying node
     *
     * Note the params passed for the functions:
     *  getPressureAt (x, y) where x, y are model values.
     *  getPressureString (pressure, units, x, y) where pressure in Pascals, x, y are model values
     */
    constructor( modelViewTransform, barometer, measureUnitsProperty, linkedProperties, getPressureAt,
                 getPressureString, containerBounds, dragBounds, options ) {

      options = _.extend( {
        pressureReadOffset: 53, //distance between center and reading tip of the barometer in view co-ordinates
        scale: 1,
        minPressure: Constants.MIN_PRESSURE,
        maxPressure: Constants.MAX_PRESSURE,
        initialPosition: null // TODO figure out a better way to reset the barometer to have the position of the icon
      }, options );

      super( { cursor: 'pointer' } );

      // Show the circular part of the gauge and the needle
      const gaugeNode = new GaugeNode( barometer.valueProperty, pressureString,
        new Range( options.minPressure, options.maxPressure ), { radius: 67, scale: 0.4 } );
      this.addChild( gaugeNode );

      const underGaugeRectangleWidth = 18;
      const underGaugeRectangleHeight = 15;
      const underGaugeRectangle = new Rectangle( gaugeNode.centerX - underGaugeRectangleWidth / 2, gaugeNode.bottom - 3,
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
      const READOUT_SIZE = new Dimension2( containerBounds.width * 0.8, 18 );
      const text = new Text( '', {
        font: new PhetFont( 12 ),
        fontWeight: 'bold',
        maxWidth: READOUT_SIZE.width * 0.95
      } );
      const readoutPanel = new Panel( text, {
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

      const bottomTriangleShapeWidth = 6;
      const bottomTriangleShapeHeight = 12;
      readoutPanel.centerX = gaugeNode.centerX;
      readoutPanel.bottom = gaugeNode.bottom + 5;

      const bottomTriangleShape = new Shape()
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

      const barometerDragBounds = modelViewTransform.viewToModelBounds( new Bounds2(
        this.width / 2,
        this.height / 2,
        dragBounds.width - this.width / 2,
        dragBounds.height - this.height / 2 ) );

      barometer.positionProperty.link( position => {
        this.centerX = modelViewTransform.modelToViewX( position.x );
        this.centerY = modelViewTransform.modelToViewY( position.y );
      } );

      // @public
      // Add an input listener so the BarometerNode can be dragged
      // Constrain the location so it cannot be dragged offscreen
      this.dragListener = new MovableDragHandler( barometer.positionProperty,
        {
          dragBounds: barometerDragBounds,
          modelViewTransform: modelViewTransform,

          startDrag: () => {
            this.moveToFront();
          },

          endDrag: () => {
            if ( containerBounds.intersectsBounds( this.visibleBounds ) ) {

              if ( options.initialPosition ) {
                barometer.positionProperty.value = options.initialPosition;
                this.visible = false; // TODO does this want to be in all cases, not just for toolbox?
              }
              else {
                barometer.positionProperty.reset();
              }

              this.moveToBack();
            }
          }
        } );
      !options.isIcon && this.addInputListener( this.dragListener );

      // Update the value in the barometer value model by reading from the model.
      Property.multilink( [ barometer.positionProperty ].concat( linkedProperties ), position => {
        if ( barometer.positionProperty.value === barometer.positionProperty.initialValue ) {
          barometer.valueProperty.value = null; // when the barometer is in the sensor panel making sure it shows no value for accessibility
        }
        else {
          barometer.valueProperty.value = getPressureAt( position.x,
            position.y + modelViewTransform.viewToModelDeltaY( this.bottom - this.centerY ) );
        }
      } );

      // update barometer value when weights are added to chamber pool
      barometer.updateEmitter.addListener( () => {
        if ( barometer.positionProperty.value === barometer.positionProperty.initialValue ) {
          barometer.valueProperty.value = null; // when the barometer is in the sensor panel making sure it shows no value for accessibility
        }
        else {
          barometer.valueProperty.value = getPressureAt( barometer.positionProperty.value.x,
            barometer.positionProperty.value.y + modelViewTransform.viewToModelDeltaY( this.bottom - this.centerY ) );
        }
      } );

      // Update the text when the value, units or position changes.
      // If the barometer reading is 0 and it is touching the sensor panel, then only the position changes.
      // In order to trigger the text display change, need to listen to position property here as well.
      Property.multilink( [ barometer.valueProperty, measureUnitsProperty, barometer.positionProperty ],
        ( barometerValue, units, position ) => {
          if ( position === barometer.positionProperty.initialValue || barometerValue === null ) {
            text.text = MathSymbols.NO_VALUE; // showing no value when barometer is in the sensor panel
            text.centerX = READOUT_SIZE.width / 2;
          }
          else {
            text.text = getPressureString( barometerValue, units );
            text.centerX = READOUT_SIZE.width / 2;
            text.centerY = READOUT_SIZE.height * 0.7;
          }
        } );

      this.touchArea = this.localBounds.dilatedXY( 0, 0 ); //TODO why?
    }
  }

  return fluidPressureAndFlow.register( 'BarometerNode', BarometerNode );
} );