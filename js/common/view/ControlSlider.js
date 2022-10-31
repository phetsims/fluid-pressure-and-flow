// Copyright 2013-2022, University of Colorado Boulder

/**
 * A generic slider control that can be used to control a numeric property within a given range.
 * It has a slider and buttons on either ends of the display to change the property value.
 * It can be expanded or collapsed using a plus/minus button at top left.
 * Has support to show ticks for important values and snaps to these values when the value is within 5% of a tick.
 * Triggers a callback function to update the display value when trackProperty or unitsProperty changes.
 *
 * @author Anton Ulyanov, Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Rectangle, RichText, Text } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import HSlider from '../../../../sun/js/HSlider.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

// constants
const PLUS_MINUS_SPACING = 6;

class ControlSlider extends Node {

  /**
   * @param {Property.<string>} measureUnitsProperty tracks the units to use (english/metric/atmosphere)
   * @param {Property.<Number>} trackProperty tracks the property used in the slider
   * @param {function} getPropertyStringFunction returns a display value
   * @param {Range} trackRange is the range of values that the trackProperty can take
   * @param {Property.<boolean>} expandedProperty tracks whether the control is expanded or collapsed
   * @param {Object} [options]
   */
  constructor( measureUnitsProperty, trackProperty, getPropertyStringFunction, trackRange, expandedProperty,
               options ) {

    options = merge( {
      fill: '#f2fa6a',
      xMargin: 5,
      decimals: 0,
      thumbSize: new Dimension2( 12, 25 ),
      ticks: [],
      ticksVisible: true,
      titleAlign: 'left',
      labelMaxWidth: 35
    }, options );

    super();

    const trackSize = new Dimension2( 115, 6 );

    function getSlider( trackSize ) {
      const aSlider = new HSlider( trackProperty, trackRange, {
        trackSize: trackSize,
        thumbSize: options.thumbSize,
        majorTickLineWidth: ( options.ticksVisible ? 1 : 0 ),
        majorTickLength: 15
      } );
      const labelFont = new PhetFont( 9.5 );

      options.ticks.forEach( tick => {
        aSlider.addMajorTick( tick.value, new Text( tick.title, {
          font: labelFont,
          visible: options.ticksVisible,
          maxWidth: options.labelMaxWidth,
          pickable: false
        } ) );
      } );
      return aSlider;
    }

    const hSlider = getSlider( trackSize );
    this.content = new Node();

    const plusButton = new ArrowButton( 'right', () => {
      trackProperty.set( Utils.toFixedNumber( Math.min( trackProperty.get() + 1 / Math.pow( 10, options.decimals ),
        trackRange.max ), options.decimals ) );
    }, {
      scale: 0.6
    } );

    plusButton.touchArea = new Bounds2( plusButton.localBounds.minX - 20, plusButton.localBounds.minY - 5,
      plusButton.localBounds.maxX + 20, plusButton.localBounds.maxY + 20 );

    const minusButton = new ArrowButton( 'left', () => {
      trackProperty.set( Utils.toFixedNumber( Math.max( trackProperty.get() - 1 / Math.pow( 10, options.decimals ),
        trackRange.min ), options.decimals ) );
    }, {
      scale: 0.6
    } );

    minusButton.touchArea = new Bounds2( minusButton.localBounds.minX - 20, minusButton.localBounds.minY - 5,
      minusButton.localBounds.maxX + 20, minusButton.localBounds.maxY + 20 );

    const valueLabel = new RichText( '', { font: new PhetFont( 12 ), pickable: false, maxWidth: 60 } );
    const valueField = new Rectangle( 0, 0, trackSize.width * 0.6, 18, 3, 3,
      { fill: '#FFF', stroke: 'black', lineWidth: 1, pickable: false } );

    // rendering order
    this.content.addChild( valueField );
    this.content.addChild( valueLabel );
    this.content.addChild( hSlider );
    this.content.addChild( plusButton );
    this.content.addChild( minusButton );

    // relative layout, everything relative to the track
    valueField.centerX = this.content.centerX;
    valueField.bottom = hSlider.top - 5;

    // plus button to the right of the value
    plusButton.left = valueField.right + PLUS_MINUS_SPACING;
    plusButton.centerY = valueField.centerY;

    // minus button to the left of the value
    minusButton.right = valueField.left - PLUS_MINUS_SPACING;
    minusButton.centerY = valueField.centerY;

    this.accordionContent = new Node();
    this.accordionContent.addChild( this.content );
    this.accordionContent.left = 0;
    const accordionBox = new AccordionBox( this.accordionContent, {
      titleNode: new Text( options.title, {
        font: new PhetFont( { size: 13 } ),
        maxWidth: trackSize.width + 2 * options.xMargin
      } ),
      fill: options.fill,
      stroke: 'gray',
      expandedProperty: expandedProperty,
      contentAlign: 'center',
      titleAlign: options.titleAlign,
      buttonAlign: 'left',
      cornerRadius: 4,
      contentYSpacing: 2,
      contentYMargin: 5,
      contentXMargin: 4,
      buttonYMargin: 4,
      buttonXMargin: 6,
      minWidth: trackSize.width + 12 * options.xMargin,
      expandCollapseButtonOptions: {
        sideLength: 12,
        touchAreaYDilation: 2 // empirically determined so that it does not overlap touch area of arrow button
      }
    } );
    this.addChild( accordionBox );

    // question mark, show if unknown property
    this.questionMark = new Node( { visible: false } );
    this.questionMark.addChild( new Text( '?', { font: new PhetFont( 60 ) } ) );
    this.questionMark.centerX = this.content.centerX;
    this.questionMark.top = this.content.top;
    this.accordionContent.addChild( this.questionMark );

    trackProperty.link( value => {
      valueLabel.string = getPropertyStringFunction();
      valueLabel.center = valueField.center; // keep the value centered in the field
      plusButton.enabled = ( value < trackRange.max );
      minusButton.enabled = ( value > trackRange.min );
    } );

    measureUnitsProperty.link( () => {
      valueLabel.string = getPropertyStringFunction();
      valueLabel.center = valueField.center; // keep the value centered in the field
    } );

    this.mutate( options );
  }

  // hide the slider and show the question mark
  // @public
  disable() {
    this.content.visible = false;
    this.questionMark.visible = true;
  }

  // show the slider and hide the question mark
  // @public
  enable() {
    this.content.visible = true;
    this.questionMark.visible = false;
  }
}

fluidPressureAndFlow.register( 'ControlSlider', ControlSlider );
export default ControlSlider;