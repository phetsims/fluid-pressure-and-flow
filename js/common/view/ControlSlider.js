// Copyright 2002-2013, University of Colorado Boulder

/**
 * Slider and button for changing fluid density and gravitation.
 *
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
  var Image = require( 'SCENERY/nodes/Image' );
  var Panel = require( 'SUN/Panel' );
  var FillHighlightListener = require( 'SCENERY_PHET/input/FillHighlightListener' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var AccordionBox = require( 'SUN/AccordionBox' );

  var valueWithUnitsPattern = require( 'string!UNDER_PRESSURE/valueWithUnitsPattern' );


  // Constants
  var TRACK_SIZE = new Dimension2( 170, 3 );
  var THUMB_SIZE = new Dimension2( 22, 42 );
  var THUMB_FILL_ENABLED = 'rgb(50,145,184)';
  var THUMB_FILL_HIGHLIGHTED = 'rgb(71,207,255)';
  var THUMB_RADIUS = 0.25 * THUMB_SIZE.width;

  function Track( trackProperty, trackRange ) {
    Rectangle.call( this, 0, 0, TRACK_SIZE.width, TRACK_SIZE.height, { cursor: 'pointer', fill: "black" } );
    var thisNode = this,
      positionToConcentration = new LinearFunction( 0, TRACK_SIZE.width, trackRange.min, trackRange.max, true ),
      handleEvent = function( event ) {
        trackProperty.set( Math.round( positionToConcentration( thisNode.globalToLocalPoint( event.pointer.point ).x ) ) );
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
    Path.call( this, Shape.lineSegment( 0, 0, 0, ( THUMB_SIZE.height / 2 ) + ( TRACK_SIZE.height / 2 ) + 2 ), {
      stroke: 'black',
      lineWidth: 1 } );
  }

  inherit( Path, TickLine );

  function TickLabel( value ) {
    Text.call( this, value, { font: new PhetFont( 14 ), fill: 'black' } );
  }

  inherit( Text, TickLabel );

  function Thumb( trackProperty, trackRange ) {
    Node.call( this, { cursor: 'pointer' } );

    var thisNode = this;
    var massToPosition = new LinearFunction( trackRange.min, trackRange.max, 0, TRACK_SIZE.width, true );
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
          trackProperty.set( Math.round( massToPosition.inverse( x ) ) );
        }
      } ) );
    trackProperty.link( function( concentration ) {
      thisNode.x = massToPosition( concentration );
    } );
  }

  inherit( Node, Thumb );

  function ControlSlider( trackProperty, trackRange, options ) {

    options = _.extend( {
      scale: 0.6,
      fill: '#f2fa6a',
      xMargin: 15,
      yMargin: 5
    }, options );

    Node.call( this, {
      x:options.x,
      y:options.y
    } );

    // nodes
    var content = new Node();
    var track = new Track( trackProperty, trackRange );
    var thumb = new Thumb( trackProperty, trackRange );
    var plusButton = new ArrowButton( 'right', function propertyPlus() {
      trackProperty.set( Math.min( trackProperty.get() + 1, trackRange.max ) );
    } );
    var minusButton = new ArrowButton( 'left', function propertyMinus() {
      trackProperty.set( Math.max( trackProperty.get() - 1, trackRange.min ) );
    } );
    var valueLabel = new Text( "", { font: new PhetFont( 18 ), pickable: false } );
    var valueField = new Rectangle( 0, 0, 100, 30, 3, 3, { fill: "#FFF", stroke: 'black', lineWidth: 1, pickable: false } );
    var labelFont = new PhetFont( 14 );
    var minLabel = new Text( trackRange.min.toFixed( 0 ), { font: labelFont, pickable: false } );
    var maxLabel = new Text( trackRange.max.toFixed( 0 ), { font: labelFont, pickable: false } );
    var minTickLine = new TickLine();
    var maxTickLine = new TickLine();

    // rendering order
    content.addChild( valueField );
    content.addChild( valueLabel );
    content.addChild( minTickLine );
    content.addChild( maxTickLine );
    content.addChild( minLabel );
    content.addChild( maxLabel );
    content.addChild( track );
    content.addChild( thumb );
    content.addChild( plusButton );
    content.addChild( minusButton );

    // relative layout, everything relative to the track
    {
      // thumb centered on track, x location will be computed
      thumb.centerY = track.centerY;
      // min tick at left end of track
      minTickLine.bottom = track.bottom;
      minTickLine.left = track.left;
      minLabel.centerX = minTickLine.centerX;
      minLabel.bottom = minTickLine.top - 3;
      // max tick at right end of track
      maxTickLine.bottom = track.bottom;
      maxTickLine.right = track.right;
      maxLabel.centerX = maxTickLine.centerX;
      maxLabel.bottom = maxTickLine.top - 3;
      // value centered above the track
      valueField.centerX = track.centerX;
      valueField.bottom = minLabel.top - 10;
      valueLabel.centerX = valueField.centerX;
      valueLabel.centerY = valueField.centerY;
      // plus button to the right of the value
      plusButton.left = valueField.right + 10;
      plusButton.centerY = valueField.centerY;
      // minus button to the left of the value
      minusButton.right = valueField.left - 10;
      minusButton.centerY = valueField.centerY;
    }


    var chargeMeterBox = new AccordionBox( content,
      {
        title: options.title,
        fill: options.fill,
        initiallyOpen: true,
        minWidth: 230,
        contentPosition: 'center',
        titlePosition: 'left',
        buttonPosition: 'left',
        scale:0.7
      } );
    this.addChild( chargeMeterBox );

    trackProperty.link( function updateProperty( value ) {
      valueLabel.text = StringUtils.format( valueWithUnitsPattern, value, "unit" );
      valueLabel.centerX = valueField.centerX; // keep the value centered in the field
      plusButton.setEnabled( value < trackRange.max );
      minusButton.setEnabled( value > trackRange.min );
    } );
  }

  inherit( Node, ControlSlider );

  return ControlSlider;
} )
;
