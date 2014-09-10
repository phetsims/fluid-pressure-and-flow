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
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Units = require( 'FLUID_PRESSURE_AND_FLOW/flow/model/Units' );

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

  // images
  var twoSidedHandleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/images/handle-two-sided.png' );

  /**
   * A flux meter that display flow rate, area and flux at a particular cross section
   * @param {FlowModel} flowModel of the simulation
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   * @param options
   * @constructor
   */
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
    var textOptions = {font: new PhetFont( 10 )};

    var flowRateText = new Text( flowRateString, textOptions );
    var area = new Text( areaString, textOptions );
    var flux = new Text( fluxString, textOptions );

    this.flowRateValue = new Text( '', textOptions );
    this.areaValue = new Text( '', textOptions );
    this.fluxValue = new Text( '', textOptions );

    this.flowRateUnit = new SubSupText( 'dummy', textOptions );
    this.areaUnit = new SubSupText( 'dummy', textOptions );
    this.fluxUnit = new SubSupText( 'dummy', textOptions );

    // Split the content into 3 vboxes. First vbox holds the right aligned title,
    // second the right aligned value and
    // the third vbox hold the left aligned units text
    var content = new HBox( {
      spacing: 0,
      children: [
        new VBox( { align: 'right', children: [
          new HBox( { children: [ new HStrut( 4 ), flowRateText]} ),
          new HBox( { children: [new HStrut( 4 ), area]} ),
          new HBox( { children: [new HStrut( 4 ), flux ]} )
        ]} ),
        new VBox( { align: 'right', children: [
          new HBox( { children: [ new HStrut( 4 ), this.flowRateValue]} ),
          new HBox( { children: [ new HStrut( 4 ), this.areaValue]} ),
          new HBox( { children: [ new HStrut( 4 ), this.fluxValue ] } )
        ]} ),
        new VBox( { align: 'left', children: [
          new HBox( { children: [ new HStrut( 8 ), this.flowRateUnit]} ),
          new HBox( { children: [ new HStrut( 8 ), this.areaUnit]} ),
          new HBox( { children: [ new HStrut( 8 ), this.fluxUnit ]} )
        ]} )
      ],
      align: 'left'
    } );

    this.displayPanel = new Panel( content, {
      xMargin: 7,
      yMargin: 6,
      fill: '#f2fa6a ',
      stroke: 'blue',
      lineWidth: 2
    } );


    var yTop = modelViewTransform.modelToViewY( flowModel.pipe.fractionToLocation( flowModel.fluxMeter.xPosition, 1 ) );
    var yBottom = modelViewTransform.modelToViewY( flowModel.pipe.fractionToLocation( flowModel.fluxMeter.xPosition, 0 ) );
    var centerY = ( yTop + yBottom ) / 2;
    var radiusY = ( yBottom - yTop ) / 2;

    // split the ring into two ellipses
    this.ellipse = new Path( new Shape().ellipticalArc( 60, centerY, radiusY, 6, Math.PI / 2, 0, Math.PI, false ), {lineWidth: '5', stroke: 'blue'} );
    this.ellipse2 = new Path( new Shape().ellipticalArc( 60, centerY, radiusY, 6, Math.PI / 2, Math.PI, 0, false ), {lineWidth: '5', stroke: new Color( 0, 0, 255, 0.5 )} );

    // add only the first ellipse. The second ellipse is added by the particle node.
    this.addChild( this.ellipse );

    // the line connecting the ring and the display panel
    var upperLineShape = new Shape().
      moveTo( this.ellipse2.centerX - 3, this.ellipse2.centerY - 20 ).
      lineTo( this.ellipse2.right, this.ellipse2.top );

    this.upperLine = new Path( upperLineShape, {stroke: 'blue', lineWidth: 3, left: this.ellipse.right - 1, bottom: this.ellipse2.top + 3 } );

    this.addChild( this.upperLine );
    this.displayPanel.bottom = this.upperLine.top;
    this.displayPanel.left = fluxMeterNode.upperLine.left - 50;

    // the line connecting the ring and the bottom handle
    var lowerLineShape = new Shape().
      moveTo( this.ellipse2.centerX - 3, this.ellipse2.centerY + 20 ).
      lineTo( this.ellipse2.centerX - 3, this.ellipse2.centerY + 60 );

    this.lowerLine = new Path( lowerLineShape, {stroke: 'blue', lineWidth: 2, top: this.ellipse2.bottom, left: this.ellipse.right - 1} );
    this.addChild( this.lowerLine );

    var handleImage = new Image( twoSidedHandleImage );
    handleImage.touchArea = handleImage.localBounds.dilatedXY( 20, 20 );
    this.handle = new Node( {children: [handleImage], cursor: 'pointer', top: this.lowerLine.bottom, left: this.lowerLine.right - 16, scale: 0.35} );

    this.addChild( this.handle );

    this.addChild( this.displayPanel );

    flowModel.isFluxMeterVisibleProperty.linkAttribute( this, 'visible' );

    Property.multilink( [flowModel.pipe.flowRateProperty , flowModel.measureUnitsProperty], function( flowRate, units ) {
      fluxMeterNode.updateDisplayPanel( units );
    } );

    flowModel.fluxMeter.xPositionProperty.link( function() {
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

    /**
     * Redraws the flux meter's ellipses based on the pipe shape at that x position
     * @private
     */
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
      this.handle.top = this.lowerLine.bottom - 3;
      this.handle.left = this.lowerLine.right - 16;

      this.updateDisplayPanel( this.flowModel.measureUnits );

    },

    /**
     * Updates the display text in the panel as per the new x position
     * @private
     */
    updateDisplayPanel: function( units ) {

      if ( units === 'metric' ) {
        this.flowRateValue.text = this.flowModel.fluxMeter.getFlowRate().toFixed( 1 );
        this.areaValue.text = this.flowModel.fluxMeter.getArea().toFixed( 1 );
        this.fluxValue.text = this.flowModel.fluxMeter.getFlux().toFixed( 1 );

        this.areaUnit.text = areaUnitsMetric;
        this.flowRateUnit.text = rateUnitsMetric;
        this.fluxUnit.text = fluxUnitsMetric;
      }
      else {
        var area = this.flowModel.fluxMeter.getArea() * Units.SQUARE_FEET_PER_SQUARE_METER;
        var flowRate = this.flowModel.fluxMeter.getFlowRate() * Units.FEET_CUBE_PER_LITER;
        var flux = this.flowModel.fluxMeter.getFlux() * Units.FEET_PER_CENTIMETER;

        this.flowRateValue.text = flowRate.toFixed( 1 );
        this.areaValue.text = area.toFixed( 1 );
        this.fluxValue.text = flux.toFixed( 1 );

        this.areaUnit.text = areaUnitsEnglish;
        this.flowRateUnit.text = rateUnitsEnglish;
        this.fluxUnit.text = fluxUnitsEnglish;

      }
    }

  } );
} );