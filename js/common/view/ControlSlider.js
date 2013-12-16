// Copyright 2002-2013, University of Colorado Boulder

/**
 * Slider and button for changing fluid density and gravitation.
 * @author Anton Ulyanov, Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // Imports
  var ArrowButton = require( 'SCENERY_PHET/ArrowButton' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Panel = require( 'SUN/Panel' );
  var FillHighlightListener = require( 'SCENERY_PHET/input/FillHighlightListener' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );


  // Constants
  var TRACK_SIZE = new Dimension2( 170, 10 );
  var THUMB_SIZE = new Dimension2( 22, 42 );
  var THUMB_FILL_ENABLED = 'rgb(50,145,184)';
  var THUMB_FILL_HIGHLIGHTED = 'rgb(71,207,255)';
  var THUMB_RADIUS = 0.25 * THUMB_SIZE.width;

  function Track( trackProperty, trackRange, decimals ) {
    Rectangle.call( this, 0, 0, TRACK_SIZE.width, TRACK_SIZE.height, { cursor: 'pointer', fill: new LinearGradient( 0, 0, TRACK_SIZE.width, 0 )
      .addColorStop( 0, "#fff" )
      .addColorStop( 1, "#000" ),
      stroke: 1} );
    var thisNode = this,
      positionToConcentration = new LinearFunction( 0, TRACK_SIZE.width, trackRange.min, trackRange.max, true ),
      handleEvent = function( event ) {
        trackProperty.set( (Math.round( Math.pow( 10, decimals ) * positionToConcentration( thisNode.globalToLocalPoint( event.pointer.point ).x ) ) / Math.pow( 10, decimals )).toFixed( decimals ) );
      };
    this.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          handleEvent( event );
        },
        drag: function( event ) {
          handleEvent( event );
        }
      } ) );
    // increase the vertical hit area, so the track is easier to hit
    var hitAreaMargin = 8;
    thisNode.mouseArea = thisNode.touchArea = Shape.rectangle( 0, -hitAreaMargin, TRACK_SIZE.width, TRACK_SIZE.height + hitAreaMargin + hitAreaMargin );
  }

  inherit( Rectangle, Track );

  function TickLine() {
    Path.call( this, Shape.lineSegment( 0, 0, 0, ( THUMB_SIZE.height / 2 ) + ( TRACK_SIZE.height / 2 ) ), {
      stroke: 'black',
      lineWidth: 1 } );
  }

  inherit( Path, TickLine );

  function Thumb( trackProperty, trackRange, valueToPosition, decimals ) {
    Node.call( this, { cursor: 'pointer' } );

    var thisNode = this;
    var clickXOffset;

    // draw the thumb
    var body = new Rectangle( -THUMB_SIZE.width / 2, -THUMB_SIZE.height / 2, THUMB_SIZE.width, THUMB_SIZE.height, THUMB_RADIUS, THUMB_RADIUS,
      { cursor: 'pointer', fill: THUMB_FILL_ENABLED, stroke: 'black', lineWidth: 1 } );
    var CENTER_LINE_Y_MARGIN = 3;
    body.addChild( new Path( Shape.lineSegment( 0, -( THUMB_SIZE.height / 2 ) + CENTER_LINE_Y_MARGIN, 0, ( THUMB_SIZE.height / 2 ) - CENTER_LINE_Y_MARGIN ), {
      stroke: 'white' } ) );
    body.left = -body.width / 2;
    this.addChild( body );

    // make the thumb highlight
    body.addInputListener( new FillHighlightListener( THUMB_FILL_ENABLED, THUMB_FILL_HIGHLIGHTED ) );

    // touch area
    var dx = 0.25 * this.width;
    var dy = 0.5 * this.height;
    this.touchArea = Shape.rectangle( ( -this.width / 2 ) - dx, ( -this.height / 2 ) - dy, this.width + dx + dx, this.height + dy + dy );

    this.addInputListener( new SimpleDragHandler(
      {
        allowTouchSnag: true,
        start: function( event ) {
          clickXOffset = thisNode.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
        },
        drag: function( event ) {
          var x = thisNode.globalToParentPoint( event.pointer.point ).x - clickXOffset;
          x = Math.max( Math.min( x, TRACK_SIZE.width ), 0 );
          trackProperty.set( (Math.round( Math.pow( 10, decimals ) * ( valueToPosition.inverse( x ) ) ) / Math.pow( 10, decimals )).toFixed( decimals ) );
        }
      } ) );
    trackProperty.link( function( concentration ) {
      thisNode.x = valueToPosition( concentration );
    } );
  }

  inherit( Node, Thumb );

  function ControlSlider( model, trackProperty, getPropertyStringFunction, trackRange, options ) {
    var self = this;

    options = _.extend( {
      scale: 0.6,
      fill: '#f2fa6a',
      xMargin: 15,
      yMargin: 5,
      decimals: 0,
      ticks: []
    }, options );

    Node.call( this, {
      x: options.x,
      y: options.y
    } );

    var valueToPosition = new LinearFunction( trackRange.min, trackRange.max, 0, TRACK_SIZE.width, true );

    // nodes
    this.content = new Node();
    var track = new Track( trackProperty, trackRange, options.decimals );
    var thumb = new Thumb( trackProperty, trackRange, valueToPosition, options.decimals );
    var plusButton = new ArrowButton( 'right', function propertyPlus() {
      trackProperty.set( (parseFloat( Math.min( trackProperty.get() ) + 1 / Math.pow( 10, options.decimals ), trackRange.max )).toFixed( options.decimals ) );
    } );
    var minusButton = new ArrowButton( 'left', function propertyMinus() {
      trackProperty.set( (Math.max( trackProperty.get() - 1 / Math.pow( 10, options.decimals ), trackRange.min )).toFixed( options.decimals ) );
    } );
    var valueLabel = new HTMLText( "", { font: new PhetFont( 18 ), pickable: false } );
    var valueField = new Rectangle( 0, 0, 100, 30, 3, 3, { fill: "#FFF", stroke: 'black', lineWidth: 1, pickable: false } );
    var labelFont = new PhetFont( 14 );


    var label, tickLine;
    options.ticks.forEach( function( tick ) {
      tickLine = new TickLine();
      tickLine.centerX = valueToPosition( tick.value );
      tickLine.bottom = track.bottom;
      label = new Text( tick.title, { font: labelFont, pickable: false, centerX: tickLine.centerX, bottom: tickLine.top - 2 } );
      self.content.addChild( label );
      self.content.addChild( tickLine );
    } );

    // rendering order
    this.content.addChild( valueField );
    this.content.addChild( valueLabel );
    this.content.addChild( track );
    this.content.addChild( thumb );
    this.content.addChild( plusButton );
    this.content.addChild( minusButton );

    // relative layout, everything relative to the track
    // thumb centered on track, x location will be computed
    thumb.centerY = track.centerY;
    // value centered above the track
    valueField.centerX = track.centerX;
    valueField.bottom = label.top - 5;
    valueLabel.centerX = valueField.centerX;
    valueLabel.centerY = valueField.centerY - 3;
    // plus button to the right of the value
    plusButton.left = valueField.right + 10;
    plusButton.centerY = valueField.centerY;
    // minus button to the left of the value
    minusButton.right = valueField.left - 10;
    minusButton.centerY = valueField.centerY;


    var chargeMeterBox = new AccordionBox( this.content,
      {
        title: options.title,
        fill: options.fill,
        initiallyOpen: true,
        minWidth: 250,
        contentPosition: 'center',
        titlePosition: 'left',
        buttonPosition: 'left',
        scale: 0.65
      } );
    this.addChild( chargeMeterBox );


    //question mark, show if unknown property
    this.questionMark = new Node( {visible: false} );
    this.questionMark.addChild( new Text( "?", { font: new PhetFont( 40 )} ) );
    this.questionMark.centerX = track.centerX;
    this.questionMark.top = this.content.top;
    this.addChild( this.questionMark );

    trackProperty.link( function updateProperty( value ) {
      valueLabel.text = getPropertyStringFunction();
      valueLabel.centerX = valueField.centerX; // keep the value centered in the field
      plusButton.setEnabled( value < trackRange.max );
      minusButton.setEnabled( value > trackRange.min );
    } );


    model.measureUnitsProperty.link( function() {
      valueLabel.text = getPropertyStringFunction();
      valueLabel.centerX = valueField.centerX; // keep the value centered in the field
    } )


  }

  inherit( Node, ControlSlider, {
    disable: function() {
      this.content.visible = false;
      this.questionMark.visible = true;
    },
    enable: function() {
      this.content.visible = true;
      this.questionMark.visible = false;
    }
  } );

  return ControlSlider;
} )
;
