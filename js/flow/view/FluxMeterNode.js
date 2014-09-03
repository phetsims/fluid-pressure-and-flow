// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * FluxMeterNode
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SUN/HStrut' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );

  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Color = require( 'SCENERY/util/Color' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );

  // strings
  var flowRateString = require( 'string!FLUID_PRESSURE_AND_FLOW/flowRateWithColon' );
  var areaString = require( 'string!FLUID_PRESSURE_AND_FLOW/area' );
  var fluxString = require( 'string!FLUID_PRESSURE_AND_FLOW/flux' );
  var rateUnitsMetric = require( 'string!FLUID_PRESSURE_AND_FLOW/rateUnitsMetric' );
  var areaUnitsMetric = require( 'string!FLUID_PRESSURE_AND_FLOW/areaUnitsMetric' );
  var fluxUnitsMetric = require( 'string!FLUID_PRESSURE_AND_FLOW/fluxUnitsMetric' );
  var rateUnitsEnglish = require( 'string!FLUID_PRESSURE_AND_FLOW/rateUnitsEnglish' );
  var areaUnitsEnglish = require( 'string!FLUID_PRESSURE_AND_FLOW/areaUnitsEnglish' );
  var fluxUnitsEnglish = require( 'string!FLUID_PRESSURE_AND_FLOW/fluxUnitsEnglish' );
  var valueWithUnitsPattern = require( 'string!FLUID_PRESSURE_AND_FLOW/valueWithUnitsPattern' );

  // images
  var twoSideHandleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/images/handle-two-sided.png' );

  function FluxMeterNode( flowModel, modelViewTransform, options ) {
    var fluxMeterNode = this;
    Node.call( this );

    options = _.extend( {
      xMargin: 10,
      yMargin: 10,
      fill: '#f2fa6a ',
      stroke: 'blue',
      lineWidth: 2
    }, options );


    this.flowModel = flowModel;
    this.modelViewTransform = modelViewTransform;
    var textOptions = {font: new PhetFont( 10 ),right : 30};

    var flowRateText = new Text( flowRateString, textOptions );
    var area = new Text( areaString, textOptions );
    var flux = new Text( fluxString, textOptions );

    this.flowRateValue = new SubSupText( 'dummy', { font: new PhetFont( 10 ), pickable: false } );
    this.areaValue = new SubSupText( 'dummy', { font: new PhetFont( 10 ), pickable: false } );
    this.fluxValue = new SubSupText( 'dummy', { font: new PhetFont( 10 ), pickable: false } );

    var content = new VBox( {
      spacing: 0,
      children: [
        new HBox( {spacing: 0, children: [new HStrut( 2 ), flowRateText, new HStrut( 5 ), this.flowRateValue]} ),
        new HBox( {spacing: 0, children: [new HStrut( 30 ), area, new HStrut( 15 ), this.areaValue]} ),
        new HBox( {spacing: 0, children: [new HStrut( 30 ), flux, new HStrut( 3 ),this.fluxValue]} )
      ],
      align: 'left'
    } );

    this.displayPanel = new Panel( content, {xMargin: 7,
      yMargin: 6,
      fill: '#f2fa6a ',
      stroke: 'blue',
      lineWidth: 2} );


    var yTop = modelViewTransform.modelToViewY( flowModel.pipe.fractionToLocation( flowModel.fluxMeter.xPosition, 1 ) );
    var yBottom = modelViewTransform.modelToViewY( flowModel.pipe.fractionToLocation( flowModel.fluxMeter.xPosition, 0 ) );
    var centerY = ( yTop + yBottom ) / 2;
    var radiusY = ( yBottom - yTop ) / 2;

    this.ellipse = new Path( new Shape().ellipticalArc( 60, centerY, radiusY, 6, Math.PI / 2, 0, Math.PI, false ), {lineWidth: '5', stroke: 'blue'} );
    this.ellipse2 = new Path( new Shape().ellipticalArc( 60, centerY, radiusY, 6, Math.PI / 2, Math.PI, 0, false ), {lineWidth: '5', stroke: new Color( 0, 0, 255, 0.5 )} );

    this.addChild( this.ellipse );

    var upperLineShape = new Shape().
      moveTo( this.ellipse2.centerX - 3, this.ellipse2.centerY - 20 ).
      lineTo( this.ellipse2.right, this.ellipse2.top );

    this.upperLine = new Path( upperLineShape, {stroke: 'blue', lineWidth: 3, left: this.ellipse.right - 1, bottom: this.ellipse2.top + 3 } );

    this.addChild( this.upperLine );
    this.displayPanel.bottom = this.upperLine.top;
    this.displayPanel.left = fluxMeterNode.upperLine.left - 50;

    var lowerLineShape = new Shape().
      moveTo( this.ellipse2.centerX - 3, this.ellipse2.centerY + 20 ).
      lineTo( this.ellipse2.centerX - 3, this.ellipse2.centerY + 60 );

    this.lowerLine = new Path( lowerLineShape, {stroke: 'blue', lineWidth: 2, top: this.ellipse2.bottom, left: this.ellipse.right - 1} );
    this.addChild( this.lowerLine );

    var handleImage = new Image( twoSideHandleImage );
    handleImage.touchArea = handleImage.localBounds.dilatedXY( 5, 5 );
    this.handle = new Node( {children: [handleImage], cursor: 'pointer', top: this.lowerLine.bottom, left: this.lowerLine.right - 16, scale: 0.35} );

    this.addChild( this.handle );

    this.addChild( this.displayPanel );

    flowModel.isFluxMeterVisibleProperty.linkAttribute( this, 'visible' );


    Property.multilink( [flowModel.fluidFlowRateProperty , flowModel.measureUnitsProperty], function( flowRate, units ) {
      fluxMeterNode.updateFluxMeterValues( units );
    } );

    flowModel.fluxMeter.xPositionProperty.link( function( value ) {
      fluxMeterNode.updateFluxMeter();
    } );

    this.handle.addInputListener( new SimpleDragHandler( {
      drag: function( e ) {
        fluxMeterNode.moveToFront();
        var x = fluxMeterNode.globalToParentPoint( e.pointer.point ).x;
        x = x < 47 ? 47 : x > 698 ? 698 : x;
        flowModel.fluxMeter.xPosition = modelViewTransform.viewToModelX( x );
      }
    } ) );

    flowModel.fluxMeter.on( 'update', function() {
      fluxMeterNode.updateFluxMeter();
    } );

    this.mutate( options );
  }

  return inherit( Panel, FluxMeterNode, {

    updateFluxMeter: function() {

      var yTop = this.modelViewTransform.modelToViewY( this.flowModel.pipe.fractionToLocation( this.flowModel.fluxMeter.xPosition, 1 ) );
      var yBottom = this.modelViewTransform.modelToViewY( this.flowModel.pipe.fractionToLocation( this.flowModel.fluxMeter.xPosition, 0 ) );
      var centerX = this.modelViewTransform.modelToViewX( this.flowModel.fluxMeter.xPosition );
      var centerY = ( yTop + yBottom ) / 2;
      var radiusY = ( yBottom - yTop ) / 2;

      var newEllipse1 = new Shape().ellipticalArc( centerX, centerY, radiusY, 6, Math.PI / 2, 0, Math.PI, false );
      var newEllipse2 = new Shape().ellipticalArc( centerX, centerY, radiusY, 6, Math.PI / 2, Math.PI, 0, false );

      this.ellipse.setShape( newEllipse1 );
      this.ellipse2.setShape( newEllipse2 );

      this.upperLine.left = this.ellipse.right - 1;
      this.upperLine.bottom = this.ellipse2.top + 3;
      this.displayPanel.bottom = this.upperLine.top;
      this.displayPanel.left = this.upperLine.left - 50;
      this.lowerLine.top = this.ellipse2.bottom;
      this.lowerLine.left = this.ellipse.right - 1;
      this.handle.top = this.lowerLine.bottom-3;
      this.handle.left = this.lowerLine.right - 16;

      this.updateFluxMeterValues( this.flowModel.measureUnits );

    },

    updateFluxMeterValues: function( units ) {

      if ( units === 'metric' ) {
        this.areaValue.text = StringUtils.format( valueWithUnitsPattern, this.flowModel.fluxMeter.getArea().toFixed( 1 ), areaUnitsMetric );
        this.flowRateValue.text = StringUtils.format( valueWithUnitsPattern, this.flowModel.fluxMeter.getFlowRate().toFixed( 1 ), rateUnitsMetric );
        this.fluxValue.text = StringUtils.format( valueWithUnitsPattern, this.flowModel.fluxMeter.getFlux().toFixed( 1 ), fluxUnitsMetric );

      }
      else {
        var area = this.flowModel.fluxMeter.getArea() * 10.7639;
        var flowRate = this.flowModel.fluxMeter.getFlowRate() * 0.0353146;
        var flux = this.flowModel.fluxMeter.getFlux() * 0.00328;

        this.areaValue.text = StringUtils.format( valueWithUnitsPattern, area.toFixed( 1 ), areaUnitsEnglish );
        this.flowRateValue.text = StringUtils.format( valueWithUnitsPattern, flowRate.toFixed( 1 ), rateUnitsEnglish );
        this.fluxValue.text = StringUtils.format( valueWithUnitsPattern, flux.toFixed( 1 ), fluxUnitsEnglish );

      }
    }

  } );
} );