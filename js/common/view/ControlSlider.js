// Copyright 2013-2015, University of Colorado Boulder

/**
 * A generic slider control that can be used to control a numeric property within a given range.
 * It has a slider and buttons on either ends of the display to change the property value.
 * It can be expanded or collapsed using a plus/minus button at top left.
 * Has support to show ticks for important values and snaps to these values when the value is within 5% of a tick.
 * Triggers a callback function to update the display value when trackProperty or unitsProperty changes.
 * @author Anton Ulyanov, Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HSlider = require( 'SUN/HSlider' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Util = require( 'DOT/Util' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // constants
  var PLUS_MINUS_SPACING = 6;

  /**
   * Constructor for the slider control
   * @param {Property<string>} measureUnitsProperty tracks the units to use (english/metric/atmosphere)
   * @param {Property<Number>} trackProperty tracks the property used in the slider
   * @param {function} getPropertyStringFunction returns a display value
   * @param {Range} trackRange is the range of values that the trackProperty can take
   * @param {Property<boolean>} expandedProperty tracks whether the control is expanded or collapsed
   * @param {Object} [options]
   * @constructor
   */
  function ControlSlider( measureUnitsProperty, trackProperty, getPropertyStringFunction, trackRange, expandedProperty,
                          options ) {

    options = _.extend( {
      fill: '#f2fa6a',
      xMargin: 5,
      decimals: 0,
      thumbSize: new Dimension2( 12, 25 ),
      ticks: [],
      ticksVisible: true,
      titleAlign: 'left'
    }, options );

    Node.call( this );
    var trackSize = new Dimension2( 100, 6 );

    var getSlider = function( trackSize ) {
      var aSlider = new HSlider( trackProperty, trackRange, {
        trackSize: trackSize,
        thumbSize: options.thumbSize,
        majorTickLineWidth: (options.ticksVisible ? 1 : 0),
        majorTickLength: 15,
        trackFill: new LinearGradient( 0, 0, trackSize.width, 0 )
          .addColorStop( 0, '#fff' )
          .addColorStop( 1, '#000' ),
        endDrag: function() {
          for ( var i = 0; i < options.ticks.length; i++ ) {
            if ( Math.abs( options.ticks[ i ].value - trackProperty.value ) <= 0.05 * options.ticks[ i ].value ) {
              trackProperty.value = options.ticks[ i ].value;
              break;
            }
          }
        }
      } );
      var labelFont = new PhetFont( 10 );

      options.ticks.forEach( function( tick ) {
        aSlider.addMajorTick( tick.value, new Text( tick.title, {
          font: labelFont,
          visible: options.ticksVisible,
          maxWidth: 40
        } ) );
      } );
      return aSlider;
    };

    var hSlider = getSlider( trackSize );
    this.content = new Node();

    var plusButton = new ArrowButton( 'right', function propertyPlus() {
      trackProperty.set( Util.toFixedNumber( Math.min( trackProperty.get() + 1 / Math.pow( 10, options.decimals ),
        trackRange.max ), options.decimals ) );
    }, {
      scale: 0.6
    } );

    plusButton.touchArea = new Bounds2( plusButton.localBounds.minX - 20, plusButton.localBounds.minY - 5,
      plusButton.localBounds.maxX + 20, plusButton.localBounds.maxY + 20 );

    var minusButton = new ArrowButton( 'left', function propertyMinus() {
      trackProperty.set( Util.toFixedNumber( Math.max( trackProperty.get() - 1 / Math.pow( 10, options.decimals ),
        trackRange.min ), options.decimals ) );
    }, {
      scale: 0.6
    } );

    minusButton.touchArea = new Bounds2( minusButton.localBounds.minX - 20, minusButton.localBounds.minY - 5,
      minusButton.localBounds.maxX + 20, minusButton.localBounds.maxY + 20 );

    var valueLabel = new SubSupText( '', { font: new PhetFont( 10 ), pickable: false, maxWidth: 40 } );
    var valueField = new Rectangle( 0, 0, trackSize.width / 2, 18, 3, 3,
      { fill: '#FFF', stroke: 'black', lineWidth: 1, pickable: false } );


    var hSliderWidth = hSlider.width;

    // Simple heuristic to expand the slider.
    // Expand the slider track to the previous track+ticks width
    //if ( hSliderWidth > trackSize.width ) {
    //  trackSize.width = hSliderWidth;
    //  hSlider = getSlider( trackSize );
    //  valueField.setRect( 0, 0, trackSize.width / 2, 18, 3, 3 );
    //}
    hSliderWidth = hSlider.width;
    // rendering order
    this.content.addChild( valueField );
    this.content.addChild( valueLabel );
    this.content.addChild( hSlider );
    this.content.addChild( plusButton );
    this.content.addChild( minusButton );

    // relative layout, everything relative to the track
    valueField.centerX = this.content.centerX;
    valueField.bottom = hSlider.top - 5;
    valueLabel.centerX = valueField.centerX;
    valueLabel.centerY = valueField.centerY - 3;

    // plus button to the right of the value
    plusButton.left = valueField.right + PLUS_MINUS_SPACING;
    plusButton.centerY = valueField.centerY;

    // minus button to the left of the value
    minusButton.right = valueField.left - PLUS_MINUS_SPACING;
    minusButton.centerY = valueField.centerY;

    this.accordionContent = new Node();
    this.accordionContent.addChild( this.content );
    this.accordionContent.left = 0;
    var accordionBox = new AccordionBox( this.accordionContent,
      {
        titleNode: new Text( options.title, {
          font: new PhetFont( { size: 12 } ),
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
        buttonLength: 12,
        minWidth: trackSize.width + 12 * options.xMargin,
        maxWidth: trackSize.width + 12 * options.xMargin
      } );
    this.addChild( accordionBox );

    // question mark, show if unknown property
    this.questionMark = new Node( { visible: false } );
    this.questionMark.addChild( new Text( '?', { font: new PhetFont( 60 ) } ) );
    this.questionMark.centerX = this.content.centerX;
    this.questionMark.top = this.content.top;
    this.accordionContent.addChild( this.questionMark );

    trackProperty.link( function( value ) {
      valueLabel.text = getPropertyStringFunction();
      valueLabel.center = valueField.center; // keep the value centered in the field
      plusButton.enabled = ( value < trackRange.max );
      minusButton.enabled = ( value > trackRange.min );
    } );

    measureUnitsProperty.link( function() {
      valueLabel.text = getPropertyStringFunction();
      valueLabel.center = valueField.center; // keep the value centered in the field
    } );

    this.mutate( options );
  }

  return inherit( Node, ControlSlider, {
    // hide the slider and show the question mark
    disable: function() {
      this.content.visible = false;
      this.questionMark.visible = true;
    },

    // show the slider and hide the question mark
    enable: function() {
      this.content.visible = true;
      this.questionMark.visible = false;
    }
  } );
} );
