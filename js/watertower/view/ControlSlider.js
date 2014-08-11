// Copyright 2002-2013, University of Colorado Boulder

/**
 * Slider and button for changing fluid density and gravitation.
 * @author Anton Ulyanov, Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/ArrowButton' );
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

  // constants
  var TRACK_SIZE = new Dimension2( 190, 10 );

  /**
   *
   * @param {WaterTowerModel} waterTowerModel of the simulation
   * @param {Property<Number>} trackProperty tracks the property used in the slider
   * @param {function} getPropertyStringFunction returns a display value
   * @param {Range} trackRange is the range of values that the trackProperty can take
   * @param options
   * @constructor
   */
  function ControlSlider( waterTowerModel, trackProperty, getPropertyStringFunction, trackRange, options ) {
    options = _.extend( {
      scale: 1.0,
      fill: '#f2fa6a',
      xMargin: 15,
      yMargin: 5,
      decimals: 0,
      ticks: []
    }, options );

    Node.call( this );


    var hSlider = new HSlider( trackProperty, trackRange, {
      trackSize: TRACK_SIZE,
      trackFill: new LinearGradient( 0, 0, TRACK_SIZE.width, 0 )
        .addColorStop( 0, '#fff' )
        .addColorStop( 1, '#000' ),
      endDrag: function() {
        for ( var i = 0; i < options.ticks.length; i++ ) {
          if ( Math.abs( options.ticks[i].value - trackProperty.value ) <= 0.05 * options.ticks[i].value ) {
            trackProperty.value = options.ticks[i].value;
            break;
          }
        }
      }
    } );

    // nodes
    this.content = new Node();
    var plusButton = new ArrowButton( 'right', function propertyPlus() {
      trackProperty.set( Util.toFixed( parseFloat( Math.min( trackProperty.get() ) + 1 / Math.pow( 10, options.decimals ), trackRange.max ), options.decimals ) );
    } );
    var minusButton = new ArrowButton( 'left', function propertyMinus() {
      trackProperty.set( Util.toFixed( parseFloat( Math.max( trackProperty.get() ) - 1 / Math.pow( 10, options.decimals ), trackRange.min ), options.decimals ) );
    } );
    var valueLabel = new SubSupText( '', { font: new PhetFont( 18 ), pickable: false } );
    var valueField = new Rectangle( 0, 0, 100, 30, 3, 3, { fill: '#FFF', stroke: 'black', lineWidth: 1, pickable: false } );
    var labelFont = new PhetFont( 14 );

    options.ticks.forEach( function( tick ) {
      hSlider.addMajorTick( tick.value, new Text( tick.title, { font: labelFont } ) );
    } );

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
    plusButton.left = valueField.right + 10;
    plusButton.centerY = valueField.centerY;

    // minus button to the left of the value
    minusButton.right = valueField.left - 10;
    minusButton.centerY = valueField.centerY;

    var scale = 0.65;
    this.accordionContent = new Node();
    this.accordionContent.addChild( this.content );

    this.accordionBox = new AccordionBox( this.accordionContent,
      {
        title: options.title,
        fill: options.fill,
        stroke: 'gray',
        font: new PhetFont( { size: 19 } ),
        initiallyOpen: false,
        minWidth: 270,
        contentPosition: 'center',
        titlePosition: 'left',
        buttonPosition: 'left',
        scale: scale,
        cornerRadius: 10,
        controlButtonInsetX: 8,
        controlButtonYMargin: 8
      } );
    this.addChild( this.accordionBox );


    trackProperty.link( function( value ) {
      valueLabel.text = getPropertyStringFunction();
      valueLabel.center = valueField.center; // keep the value centered in the field
      plusButton.setEnabled( value < trackRange.max );
      minusButton.setEnabled( value > trackRange.min );
    } );

    waterTowerModel.measureUnitsProperty.link( function() {
      valueLabel.text = getPropertyStringFunction();
      valueLabel.center = valueField.center; // keep the value centered in the field
    } );
    this.mutate( options );
  }

  return inherit( Node, ControlSlider, {
    disable: function() {
      this.content.visible = false;
    },
    enable: function() {
      this.content.visible = true;
    },
    reset: function() {
      this.accordionBox.open.set( false );
    }
  } );

} );