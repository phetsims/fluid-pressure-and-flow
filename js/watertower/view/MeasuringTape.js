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

  /**
   * Constructor for the measuring tape
   * @param {WaterTowerModel} waterTowerModel of the simulation
   * @param {Bounds2} layoutBounds of the simulation
   * @constructor
   */
  function MeasuringTape( waterTowerModel, layoutBounds ) {
    var measuringTape = this;
    Node.call( this );
    this.prevScale = 1;
    this.options = [
      {
        initialMeasuringTapePosition: waterTowerModel.measuringTapePosition,
        tipX: 73.5,
        tipY: 0,
        scale: 1,
        length: 73.5,
        lengthDefault: 73.5,
        precision: 2
      }
    ];
    this.waterTowerModel = waterTowerModel;
    // add base of tape and not base node
    this.base = new Image( measuringTapeImg, {scale: 0.8} );
    this.addChild( this.base );
    this.centerRotation = new Vector2( measuringTape.base.getWidth(), measuringTape.base.getHeight() );
    this.notBase = new Node();
    // init drag and drop for measuring tape
    var clickYOffset;
    var clickXOffset;
    this.angle = 0;
    var v;
    var currentlyDragging = '';
    this.base.cursor = 'pointer';
    this.base.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        currentlyDragging = 'base';
        var h;
        var y0 = measuringTape.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
        var x0 = measuringTape.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;
        h = measuringTape.centerRotation.timesScalar( Math.cos( measuringTape.angle /
                                                                2 ) ).rotated( measuringTape.angle / 2 );
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

        x = (x < layoutBounds.left ) ? layoutBounds.left : (x > layoutBounds.right) ? layoutBounds.right : x;
        y = (y < layoutBounds.top + 10) ? layoutBounds.top + 10 : (y > layoutBounds.bottom) ? layoutBounds.bottom : y;

        measuringTape.translate( x, y, v );
      }
    } ) );

    // add line
    this.line = new Path( new Shape().moveTo( 0, 0 ).lineTo( 0, 0 ), {stroke: 'black', lineWidth: 2} );
    this.notBase.addChild( this.line );

    // add center point
    var size = 5;
    this.mediator = new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ),
      {stroke: '#E05F20', lineWidth: 2} );
    this.notBase.addChild( this.mediator );

    // add tip
    this.tip = new Node( {children: [new Circle( 8, {fill: 'black'} ),
                                     new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0,
                                       -size ).lineTo( 0, size ), {stroke: '#E05F20', lineWidth: 2} )]} );
    this.tip.cursor = 'pointer';
    this.tip.touchArea = this.tip.localBounds.dilatedXY( 10, 10 );
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
        measuringTape.rotate( -measuringTape.angle );
        // set new angle
        measuringTape.angle = Math.atan2( y, x );
        measuringTape.rotate( measuringTape.angle );
        measuringTape.setTip( x, y );

      }
    } ) );

    // add text
    this.text = new Text( '', {font: FONT, fontWeight: 'bold', fill: 'white', pickable: false, x: -75, y: 20} );
    this.notBase.addChild( this.text );

    this.addChild( this.notBase );
    waterTowerModel.measureUnitsProperty.link( function( data ) {
      data === 'metric' ? measuringTape.text.setText( measuringTape.getText().toFixed( 2 ) + ' ' + metersString ) :
      measuringTape.text.setText( (measuringTape.getText() * 3.28).toFixed( 2 ) + ' ' + feetString );
    } );

    // add observers
    waterTowerModel.isMeasuringTapeVisibleProperty.linkAttribute( this, 'visible' );

    //Inital position for tape
    measuringTape.initTape( measuringTape.options[0], this.angle );

    waterTowerModel.scaleProperty.link( function( newScale ) {
      measuringTape.scale( newScale );
    } );
  }

  return inherit( Node, MeasuringTape, {

    // init tape
    initTape: function( option, angle ) {
      this.rotate( -angle );
      this.translate( option.initialMeasuringTapePosition.x, option.initialMeasuringTapePosition.y );
      this.setTip( option.lengthDefault, 0 );
      this.base.setTranslation( -this.centerRotation.x + option.initialMeasuringTapePosition.x,
          -this.centerRotation.y + option.initialMeasuringTapePosition.y );
    },

    // return text(length)
    getText: function() {
      return  this.options[0].length.toFixed( 2 ) / 10;
    },

    rotate: function( angle ) {
      this.base.rotateAround( new Vector2( this.notBase.x, this.notBase.y ), angle );
    },

    scale: function( scale ) {
      this.options[0].lengthDefault *= 1 / this.prevScale;
      this.options[0].lengthDefault *= scale;
      this.setTip( this.options[0].tipX / this.prevScale, this.options[0].tipY / this.prevScale );
      this.setTip( this.options[0].tipX * scale, this.options[0].tipY * scale );
      this.prevScale = scale;
    },

    setTip: function( x, y ) {

      this.options[0].length = Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );
      this.line.setShape( new Shape().moveTo( 0, 0 ).lineTo( x, y ) );
      this.waterTowerModel.measureUnits === 'english' ?
      this.text.setText( (this.getText() * 3.28).toFixed( this.options[0].precision ) + ' ' + feetString ) :
      this.text.setText( this.getText().toFixed( this.options[0].precision ) + ' ' + metersString );
      this.tip.setTranslation( x, y );
      this.options[0].tipX = x;
      this.options[0].tipY = y;
    },

    translate: function( x, y, v ) {
      this.notBase.setTranslation( x, y );
      v = v || new Vector2( 0, 0 );
      this.base.setTranslation( x - v.x, y - v.y );
    },

    reset: function() {
      this.angle = 0;
      this.initTape( this.options[0], this.angle );
      this.base.setRotation( this.angle );
    }
  } );
} );