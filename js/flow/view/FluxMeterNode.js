// Copyright 2014-2023, University of Colorado Boulder

/**
 * View for the flux meter tool. Looks like a ring around the pipe with a display panel at the top and a drag handle
 * at the bottom. The ring is rendered in two layers so that particles can pass through the ring.
 * A flux meter that display flow rate, area and flux at a particular cross section.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, HBox, HStrut, Image, Node, Path, RichText, SimpleDragHandler, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import handleTwoSided_png from '../../../images/handleTwoSided_png.js';
import Units from '../../common/model/Units.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';

const areaString = FluidPressureAndFlowStrings.area;
const areaUnitsEnglishString = FluidPressureAndFlowStrings.areaUnitsEnglish;
const areaUnitsMetricString = FluidPressureAndFlowStrings.areaUnitsMetric;
const flowRateWithColonString = FluidPressureAndFlowStrings.flowRateWithColon;
const fluxString = FluidPressureAndFlowStrings.flux;
const fluxUnitsEnglishString = FluidPressureAndFlowStrings.fluxUnitsEnglish;
const fluxUnitsMetricString = FluidPressureAndFlowStrings.fluxUnitsMetric;
const rateUnitsEnglishString = FluidPressureAndFlowStrings.rateUnitsEnglish;
const rateUnitsMetricString = FluidPressureAndFlowStrings.rateUnitsMetric;


class FluxMeterNode extends Node {

  /**
   * @param {FlowModel} flowModel of the simulation
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   * @param {Object} [options] that can be passed on to the underlying node
   */
  constructor( flowModel, modelViewTransform, options ) {

    super();

    options = merge( {
      xMargin: 10,
      yMargin: 10,
      fill: '#f2fa6a ',
      stroke: 'blue',
      lineWidth: 2
    }, options );

    this.flowModel = flowModel;
    this.modelViewTransform = modelViewTransform;
    const textOptions = { font: new PhetFont( 10 ) };

    // flowRate row
    const flowRateText = new Text( flowRateWithColonString, textOptions );
    this.flowRateValue = new Text( '', textOptions );
    this.flowRateUnit = new RichText( rateUnitsMetricString, textOptions );

    // area row
    const area = new Text( areaString, textOptions );
    this.areaValue = new Text( '', textOptions );
    this.areaUnit = new RichText( areaUnitsMetricString, textOptions );

    // flux row
    const flux = new Text( fluxString, textOptions );
    this.fluxValue = new Text( '', textOptions );
    this.fluxUnit = new RichText( fluxUnitsMetricString, textOptions );

    // Split the content into 3 vboxes. First vbox holds the right aligned title,
    // second the right aligned value and the third vbox holds the left aligned units text
    const content = new HBox( {
      spacing: 5,
      children: [
        new VBox( {
          align: 'right', children: [
            new HBox( { children: [ new HStrut( 4 ), flowRateText ] } ),
            new HBox( { children: [ new HStrut( 4 ), area ] } ),
            new HBox( { children: [ new HStrut( 4 ), flux ] } )
          ]
        } ),
        new VBox( {
          align: 'right', children: [
            new HBox( { children: [ new HStrut( 4 ), this.flowRateValue ] } ),
            new HBox( { children: [ new HStrut( 4 ), this.areaValue ] } ),
            new HBox( { children: [ new HStrut( 4 ), this.fluxValue ] } )
          ]
        } ),
        new VBox( {
          align: 'left', children: [
            this.flowRateUnit,
            this.areaUnit,
            this.fluxUnit
          ]
        } )
      ]
    } );

    this.displayPanel = new Panel( content, {
      xMargin: 7,
      yMargin: 6,
      fill: '#f2fa6a ',
      stroke: 'blue',
      lineWidth: 2
    } );

    const yTop = modelViewTransform.modelToViewY( flowModel.pipe.fractionToPosition( flowModel.fluxMeter.xPositionProperty.value, 1 ) );
    const yBottom = modelViewTransform.modelToViewY( flowModel.pipe.fractionToPosition( flowModel.fluxMeter.xPositionProperty.value,
      0 ) );
    const centerY = ( yTop + yBottom ) / 2;
    const radiusY = ( yBottom - yTop ) / 2;
    const initialCenterX = 60; // initial center x of ellipse
    this.radiusX = 6; // x radius for the ellipse is  always constant

    // split the ring into two ellipses
    this.ellipse = new Path( new Shape().ellipticalArc( initialCenterX, centerY, radiusY, this.radiusX, Math.PI / 2,
      0, Math.PI, false ), {
      lineWidth: 5,
      stroke: 'blue'
    } );
    this.ellipse2 = new Path( new Shape().ellipticalArc( initialCenterX, centerY, radiusY, this.radiusX, Math.PI / 2,
      Math.PI,
      0, false ),
      {
        lineWidth: 5,
        stroke: new Color( 0, 0, 255, 0.5 )
      } );

    // add only the first ellipse. The second ellipse is added by the pipe node.
    this.addChild( this.ellipse );

    // the line connecting the ring and the display panel
    const upperLineShape = new Shape().moveTo( this.ellipse2.centerX - 3, this.ellipse2.centerY - 20 ).lineTo( this.ellipse2.right, this.ellipse2.top );

    this.upperLine = new Path( upperLineShape,
      {
        stroke: 'blue',
        lineWidth: 3,
        left: this.ellipse.right - 1,
        bottom: this.ellipse2.top + 3
      } );

    this.addChild( this.upperLine );
    this.displayPanel.bottom = this.upperLine.top;
    this.displayPanel.left = this.upperLine.left - 50;

    // the line connecting the ring and the bottom handle
    const lowerLineShape = new Shape().moveTo( this.ellipse2.centerX - 3, this.ellipse2.centerY + 20 ).lineTo( this.ellipse2.centerX - 3, this.ellipse2.centerY + 60 );

    this.lowerLine = new Path( lowerLineShape,
      {
        stroke: 'blue', lineWidth: 2,
        top: this.ellipse2.bottom,
        left: this.ellipse.right - 1
      } );
    this.addChild( this.lowerLine );

    this.handle = new Image( handleTwoSided_png,
      { cursor: 'pointer', top: this.lowerLine.bottom, left: this.lowerLine.right - 16, scale: 0.35 } );
    this.handle.touchArea = this.handle.localBounds.dilatedXY( 20, 20 );

    this.addChild( this.handle );

    this.addChild( this.displayPanel );

    flowModel.isFluxMeterVisibleProperty.linkAttribute( this, 'visible' );

    Multilink.multilink( [ flowModel.pipe.flowRateProperty, flowModel.measureUnitsProperty ],
      ( flowRate, units ) => {
        this.updateDisplayPanel( units );
      } );

    flowModel.fluxMeter.xPositionProperty.link( () => {
      this.updateFluxMeter();
    } );

    // flux meter drag handle
    this.handle.addInputListener( new SimpleDragHandler( {
      drag: event => {
        this.moveToFront();
        let x = this.globalToParentPoint( event.pointer.point ).x;
        x = x < 46 ? 46 : x > 698 ? 698 : x; // min, max view values (emperically determined)
        flowModel.fluxMeter.xPositionProperty.value = modelViewTransform.viewToModelX( x );
      }
    } ) );

    flowModel.fluxMeter.updateEmitter.addListener( () => {
      this.updateFluxMeter();
    } );

    this.mutate( options );
  }

  /**
   * Redraws the flux meter's ellipses based on the pipe shape at that x position
   * @private
   */
  updateFluxMeter() {

    const yTop = this.modelViewTransform.modelToViewY( this.flowModel.pipe.fractionToPosition(
      this.flowModel.fluxMeter.xPositionProperty.value, 1 ) );
    const yBottom = this.modelViewTransform.modelToViewY( this.flowModel.pipe.fractionToPosition(
      this.flowModel.fluxMeter.xPositionProperty.value, 0 ) );
    const centerX = this.modelViewTransform.modelToViewX( this.flowModel.fluxMeter.xPositionProperty.value );
    const centerY = ( yTop + yBottom ) / 2;
    const radiusY = ( yBottom - yTop ) / 2;

    const newEllipse1 = new Shape().ellipticalArc( centerX, centerY, radiusY, this.radiusX, Math.PI / 2, 0, Math.PI,
      false );
    const newEllipse2 = new Shape().ellipticalArc( centerX, centerY, radiusY, this.radiusX, Math.PI / 2, Math.PI, 0,
      false );

    this.ellipse.setShape( newEllipse1 );
    this.ellipse2.setShape( newEllipse2 );

    this.upperLine.left = this.ellipse.right - 1;
    this.upperLine.bottom = this.ellipse2.top + 3;
    this.displayPanel.bottom = this.upperLine.top;
    this.displayPanel.left = this.upperLine.left - 50;
    this.lowerLine.top = this.ellipse2.bottom;
    this.lowerLine.left = this.ellipse.right - 1;
    this.handle.top = this.lowerLine.bottom - 3;
    this.handle.left = this.lowerLine.right - 16;

    this.updateDisplayPanel( this.flowModel.measureUnitsProperty.value );
  }

  /**
   * Updates the display text in the panel as per the new x position
   * @param {string} units can be metric/english
   * @private
   */
  updateDisplayPanel( units ) {

    if ( units === 'metric' ) {
      this.flowRateValue.string = Utils.toFixed( this.flowModel.fluxMeter.getFlowRate(), 1 );
      this.flowRateUnit.string = rateUnitsMetricString;

      this.areaValue.string = Utils.toFixed( this.flowModel.fluxMeter.getArea(), 1 );
      this.areaUnit.string = areaUnitsMetricString;

      this.fluxValue.string = Utils.toFixed( this.flowModel.fluxMeter.getFlux(), 1 );
      this.fluxUnit.string = fluxUnitsMetricString;
    }
    else { // use english for either english or atmospheres
      const flowRate = this.flowModel.fluxMeter.getFlowRate() * Units.FEET_CUBE_PER_LITER;
      this.flowRateValue.string = Utils.toFixed( flowRate, 1 );
      this.flowRateUnit.string = rateUnitsEnglishString;

      const area = this.flowModel.fluxMeter.getArea() * Units.SQUARE_FEET_PER_SQUARE_METER;
      this.areaValue.string = Utils.toFixed( area, 1 );
      this.areaUnit.string = areaUnitsEnglishString;

      const flux = this.flowModel.fluxMeter.getFlux() * Units.FEET_PER_CENTIMETER;
      this.fluxValue.string = Utils.toFixed( flux, 1 );
      this.fluxUnit.string = fluxUnitsEnglishString;
    }
  }
}

fluidPressureAndFlow.register( 'FluxMeterNode', FluxMeterNode );
export default FluxMeterNode;