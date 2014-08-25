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

  // strings
  var flowRateString = require( 'string!FLUID_PRESSURE_AND_FLOW/flowRate' );
  var areaString = require( 'string!FLUID_PRESSURE_AND_FLOW/area' );
  var fluxString = require( 'string!FLUID_PRESSURE_AND_FLOW/flux' );

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
      lineWidth: 1
    }, options );
    this.modelViewTransform = modelViewTransform;
    var textOptions = {font: new PhetFont( 14 )};

    var flowRateText = new Text( flowRateString, textOptions );
    var area = new Text( areaString, textOptions );
    var flux = new Text( fluxString, textOptions );
    var flowRateValue = new Text( '', { font: new PhetFont( 14 )} );
    var areaValue = new Text( '', textOptions );
    var fluxValue = new Text( '', textOptions );

    var content = new VBox( {
      spacing: 2,
      children: [
        new HBox( {spacing: 2, children: [new HStrut( 2 ), flowRateText, flowRateValue, new HStrut( 60 )]} ),
        new HBox( {spacing: 2, children: [new HStrut( 30 ), area, areaValue, new HStrut( 30 )]} ),
        new HBox( {spacing: 2, children: [new HStrut( 30 ), flux, fluxValue, new HStrut( 30 )]} )
      ],
      align: 'left'
    } );

    var panel = new Panel( content, options );

    // todo: center will be the cetner of the cross section
    // radiusY == crossSection height/2. radiusX = 10
    this.ellipse = new Path( new Shape().ellipticalArc( 50, 40, 50, 10, Math.PI / 2, 0, Math.PI, false ), {lineWidth: '3', stroke: 'blue'} );
    this.addChild( this.ellipse );

    this.ellipse2 = new Path( new Shape().ellipticalArc( 50, 40, 50, 10, Math.PI / 2, Math.PI, 0, false ), {lineWidth: '3', stroke: new Color( 0, 0, 255, 0.5 )} );
    this.addChild( this.ellipse2 );


    var upperLineShape = new Shape().
      moveTo( this.ellipse2.centerX - 3, this.ellipse2.centerY - 20 ).
      lineTo( this.ellipse2.right, this.ellipse2.top );

    var upperLine = new Path( upperLineShape, {stroke: 'blue', lineWidth: 3, /* top: panel.bottom,*/ left: this.ellipse.right, bottom: this.ellipse2.top } );

    this.addChild( upperLine );
    panel.bottom = upperLine.top;


    var lowerLineShape = new Shape().
      moveTo( this.ellipse2.centerX - 3, this.ellipse2.centerY + 20 ).
      lineTo( this.ellipse2.centerX - 3, this.ellipse2.centerY + 60 );

    this.line = new Path( lowerLineShape, {stroke: 'blue', lineWidth: 2, top: this.ellipse2.bottom, left: this.ellipse.right} );
    this.addChild( this.line );
    var handleImage = new Image( twoSideHandleImage );
    this.handle = new Node( {children: [handleImage], top: this.line.bottom, left: this.line.right - 25, scale: 0.5} );
    this.addChild( this.handle );

    this.addChild( panel );
    flowModel.fluxMeterPositionProperty.linkAttribute( this, 'translation' );

    flowModel.isFluxMeterVisibleProperty.linkAttribute( this, 'visible' );

    Property.multilink( [flowModel.fluidFlowRateProperty], function( flowRate ) {
      flowRateValue.setText( Math.round( flowRate ) );
      fluxValue.setText( Math.round( flowRate / 20 ) );
    } );

    var clickXOffset = 0;

    this.handle.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        clickXOffset = fluxMeterNode.globalToParentPoint( e.pointer.point ).x;
      },
      drag: function( e ) {

        var x = fluxMeterNode.globalToParentPoint( e.pointer.point ).x;
        x = x < 0 ? 0 : x > 650 ? 650 : x;
        fluxMeterNode.setTranslation( x, flowModel.fluxMeterPosition.y );
        var newEllipse1 = new Shape().ellipticalArc( 50, 40, 50, 10, Math.PI / 2, 0, Math.PI, false );
        var newEllipse2 = new Shape().ellipticalArc( 50, 40, 50, 10, Math.PI / 2, Math.PI, 0, false );

        fluxMeterNode.ellipse.setShape( newEllipse1 );
        fluxMeterNode.ellipse2.setShape( newEllipse2 );

      }
    } ) );
    this.mutate( options );
  }

  return inherit( Panel, FluxMeterNode );
} );