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
    var handleImage = new Image( twoSideHandleImage );
    var handle = new Node( {children: [handleImage], top: panel.bottom, scale: 0.5} );
    this.addChild( handle );

    this.addChild( panel );
    flowModel.fluxMeterPositionProperty.linkAttribute( this, 'translation' );

    flowModel.isFluxMeterVisibleProperty.linkAttribute( this, 'visible' );

    Property.multilink( [flowModel.fluidFlowRateProperty], function( flowRate ) {
      flowRateValue.setText( Math.round( flowRate ) );
      fluxValue.setText( Math.round( flowRate / 20 ) );
    } );

    var clickYOffset = 0;
    handle.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        clickYOffset = fluxMeterNode.globalToParentPoint( e.pointer.point ).x;
      },
      drag: function( e ) {
        //Todo
      }
    } ) );
  }

  return inherit( Panel, FluxMeterNode );
} );