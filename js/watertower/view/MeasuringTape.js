// Copyright 2002-2014, University of Colorado Boulder

/**
 * Measuring tape modified from gravity-and-orbits.
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (ActualConcepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  var Image = require( 'SCENERY/nodes/Image' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // images
  var measuringTapeImg = require( 'image!FLUID_PRESSURE_AND_FLOW/measuringTape.png' );

  // strings
  var feetString = require( 'string!FLUID_PRESSURE_AND_FLOW/feet' );
  var metersString = require( 'string!FLUID_PRESSURE_AND_FLOW/meters' );

  // constants
  var FONT = new PhetFont( 16 );

  var options = [
    {
      x: 100,
      y: 175,
      tipX: 119.5,
      tipY: 0,
      scale: 1,
      length: 119.5,
      value: 50000,
      precision: 2
    }
  ];

  function MeasuringTape( model ) {
    var measuringTape = this;
    Node.call( this );

    this.mode = 0;
    this.prevScale = 1;

    this.options = options;
    this.init( model );

    // add base of tape and not base node
    this.base = new Node( {children: [new Image( measuringTapeImg )], scale: 0.8} );
    this.addChild( this.base );
    this.centerRotation = new Vector2( measuringTape.base.getWidth(), measuringTape.base.getHeight() );
    this.notBase = new Node();

    // init drag and drop for measuring tape
    var clickYOffset, clickXOffset, angle = 0, v, currentlyDragging = '';
    this.base.cursor = 'pointer';
    this.base.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        currentlyDragging = 'base';
        var h,
          y0 = measuringTape.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y,
          x0 = measuringTape.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;

        h = measuringTape.centerRotation.timesScalar( Math.cos( angle / 2 ) ).rotated( angle / 2 );
        v = measuringTape.centerRotation.plus( h.minus( measuringTape.centerRotation ).multiply( 2 ) );

        clickYOffset = y0 - v.y;
        clickXOffset = x0 - v.x;
      },
      drag: function( e ) {
        if ( currentlyDragging !== 'base' ) {
          return;
        }
        var x = measuringTape.globalToParentPoint( e.pointer.point ).x - clickXOffset;
        var y = measuringTape.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        measuringTape.translate( x, y, v );
      }
    } ) );

    // add line
    this.line = new Path( new Shape().moveTo( 0, 0 ).lineTo( 0, 0 ), {stroke: 'black', lineWidth: 2} );
    this.notBase.addChild( this.line );
    //measuring units


    // add center point
    var size = 5;
    this.mediator = new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ), {stroke: '#E05F20', lineWidth: 2} );
    this.notBase.addChild( this.mediator );

    // add tip
    this.tip = new Node( {children: [new Circle( 8, {fill: 'black'} ), new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ), {stroke: '#E05F20', lineWidth: 2} )]} );
    this.tip.cursor = 'pointer';
    this.notBase.addChild( this.tip );

    // init drag and drop for tip
    this.tip.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        currentlyDragging = 'tip';
        clickYOffset = measuringTape.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
        clickXOffset = measuringTape.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;
      },
      drag: function( e ) {
        if ( currentlyDragging !== 'tip' ) {
          return;
        }
        var y = measuringTape.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        var x = measuringTape.globalToParentPoint( e.pointer.point ).x - clickXOffset;
        // return to previous angle
        measuringTape.rotate( -angle );

        // set new angle
        angle = Math.atan2( y, x );
        measuringTape.rotate( angle );
        measuringTape.setTip( x, y );
      }
    } ) );

    // add text
    this.text = new Text( '', {font: FONT, fontWeight: 'bold', fill: 'white', pickable: false, x: -75, y: 20} );
    this.notBase.addChild( this.text );

    this.addChild( this.notBase );
    model.measureUnitsProperty.link( function( data ) {
      var lengthValue = measuringTape.getText();
      if ( data === "metric" ) {
        measuringTape.text.setText( lengthValue + " " + metersString );
      }
      else {
        measuringTape.text.setText( (lengthValue * 3.28).toFixed( options[measuringTape.mode].precision ) + " " + feetString );
      }
    } );

    // add observers
    model.isMeasuringTapeVisibleProperty.linkAttribute( this, 'visible' );

    model.scaleProperty.link( function( newScale ) {
      measuringTape.scale( newScale );
    } );
  }

  return inherit( Node, MeasuringTape, {

    // init tape for view mode
    init: function( model ) {
      this.options.forEach( function( el ) {
        el.valueDefault = el.value;//
        el.lengthDefault = el.length;
      } );

      this.model = model;
    },

    // init tape
    initTape: function( option, angle ) {
      this.rotate( -angle );
      this.translate( option.x, option.y );
      this.setTip( option.lengthDefault, 0 );
      this.base.setTranslation( -this.centerRotation.x + option.x, -this.centerRotation.y + option.y );
    },

    // return text for current planet mode
    getText: function() {
      var option = this.options[this.mode];
      return (option.length / 70).toFixed( option.precision );
    },

    rotate: function( angle ) {
      this.base.rotateAround( new Vector2( this.notBase.x, this.notBase.y ), angle );
    },

    scale: function( scale ) {
      this.options[this.mode].lengthDefault *= 1 / this.prevScale;
      this.options[this.mode].lengthDefault *= scale;
      this.setTip( this.options[this.mode].tipX / this.prevScale, this.options[this.mode].tipY / this.prevScale );
      this.setTip( this.options[this.mode].tipX * scale, this.options[this.mode].tipY * scale );
      this.prevScale = scale;
    },

    setTip: function( x, y ) {
      var option = this.options[this.mode];
      option.length = Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );

      this.line.setShape( new Shape().moveTo( 0, 0 ).lineTo( x, y ) );
      //this.text.setText( this.getText() );
      var lengthValue = this.getText();

      if ( this.model.measureUnits === "english" ) {
        this.text.setText( (lengthValue * 3.28).toFixed( options[this.mode].precision ) + " " + feetString );
      }
      else {
        this.text.setText( lengthValue + " " + metersString );
      }
      this.tip.setTranslation( x, y );
      option.tipX = x;
      option.tipY = y;
    },

    translate: function( x, y, v ) {
      this.notBase.setTranslation( x, y );

      v = v || new Vector2( 0, 0 );
      this.base.setTranslation( x - v.x, y - v.y );
    }
  } );
} );