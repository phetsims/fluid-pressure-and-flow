// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * FlowView
 * @author Siddhartha Chinthapally (Actual Concepts) on 8/7/2014.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SkyNode = require( 'SCENERY_PHET/SkyNode' );
  var GroundNode = require( 'SCENERY_PHET/GroundNode' );
  var Pattern = require( 'SCENERY/util/Pattern' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Bounds2 = require( "DOT/Bounds2" );
  var ToolsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/ToolsControlPanel' );
  var UnitsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/UnitsControlPanel' );
  var ControlSlider = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/ControlSlider' );
  var VelocitySensorNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/VelocitySensorNode' );
  var BarometerNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/BarometerNode' );
  var FlowRuler = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/FlowRuler' );

  var VBox = require( 'SCENERY/nodes/VBox' );
  var PlayPauseButton = require( 'SCENERY_PHET/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/StepButton' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  var ParticleNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/ParticleNode' );
  var PipeNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/PipeNode' );
  var FluxMeterNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/FluxMeterNode' );

  //strings
  var fluidDensityString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidDensity' );
  var gasolineString = require( 'string!FLUID_PRESSURE_AND_FLOW/gasoline' );
  var waterString = require( 'string!FLUID_PRESSURE_AND_FLOW/water' );
  var honeyString = require( 'string!FLUID_PRESSURE_AND_FLOW/honey' );
  var flowRateString = require( 'string!FLUID_PRESSURE_AND_FLOW/flowRate' );
  var normalString = require( 'string!FLUID_PRESSURE_AND_FLOW/normal' );
  var slowMotionString = require( 'string!FLUID_PRESSURE_AND_FLOW/slowMotion' );

  //images
  var grassImg = require( 'image!FLUID_PRESSURE_AND_FLOW/images/grass-texture.png' );
  //View layout related constants
  var inset = 10;

  function FlowView( flowModel ) {
    var flowView = this;
    var textOptions = {font: new PhetFont( 14 )};

    ScreenView.call( this, {renderer: 'svg'} );

    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( new Bounds2( 0, 0, 5, 10 ), new Bounds2( 0, 0, 680, 66 ) );

    // add sky node
    this.addChild( new Rectangle( -5000, -1000, 10000, 1000, {stroke: '#01ACE4', fill: '#01ACE4'} ) );

    var skyNode = new SkyNode( -5000, 0, 10000, 150, 200 );
    this.addChild( skyNode );

    // add ground node
    var groundNode = new GroundNode( -5000, 143, 10000, 400, 400, {topColor: '#9D8B61', bottomColor: '#645A3C'} );
    this.addChild( groundNode );

    //grass
    var grassPattern = new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) );
    var grassRectYOffset = 1;
    var grassRectHeight = 10;

    this.addChild( new Rectangle( -1000, grassRectYOffset, 10000, grassRectHeight, {
      fill: grassPattern,
      bottom: groundNode.top
    } ) );

    // tools control panel
    this.toolsControlPanel = new ToolsControlPanel( flowModel, {right: this.layoutBounds.right - inset, top: inset} );
    this.addChild( this.toolsControlPanel );

    // units control panel
    var unitsControlPanel = new UnitsControlPanel( flowModel.measureUnitsProperty, 50, {yMargin: 18, right: this.toolsControlPanel.left - inset, top: this.toolsControlPanel.top } );
    this.addChild( unitsControlPanel );


    // add the fluid density control slider
    var controlSlider = new ControlSlider( flowModel, flowModel.fluidDensityProperty, flowModel.getFluidDensityString.bind( flowModel ), flowModel.fluidDensityRange, {
      right: this.layoutBounds.right - 10 * inset,
      bottom: this.layoutBounds.bottom - inset,
      title: fluidDensityString,
      ticks: [
        {
          title: waterString,
          value: flowModel.fluidDensity
        },
        {
          title: gasolineString,
          value: flowModel.fluidDensityRange.min
        },
        {
          title: honeyString,
          value: flowModel.fluidDensityRange.max
        }
      ]
    } );
    this.addChild( controlSlider );


    //add flow rate panel
    var flowRateSlider = new ControlSlider( flowModel, flowModel.fluidFlowRateProperty, flowModel.getFluidFlowRateString.bind( flowModel ), flowModel.flowRateRange, {
      left: this.layoutBounds.left,
      bottom: this.layoutBounds.bottom - inset,
      title: flowRateString
    } );
    this.addChild( flowRateSlider );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        flowModel.reset();
        controlSlider.reset();
        // pipeNode.reset();

      },
      bottom: this.layoutBounds.bottom - inset,
      right: this.layoutBounds.right - inset

    } );
    this.addChild( resetAllButton );

    //adding pipe Node
    var pipeNode = new PipeNode( flowModel, flowModel.pipeFlowLine, modelViewTransform, this.layoutBounds, {top: skyNode.bottom - 160} );
    flowModel.pipeFlowLine.reset();
    this.addChild( pipeNode );


    // add the sensors panel
    var sensorPanel = new Rectangle( 0, 0, 190, 95, 10, 10, {stroke: 'gray', lineWidth: 1, fill: '#f2fa6a', right: unitsControlPanel.left - inset, top: this.toolsControlPanel.top} );
    this.addChild( sensorPanel );

    // add particle layer
    var particleLayer = new Node();
    flowView.addChild( particleLayer );

    // add play pause button and step button
    var stepButton = new StepButton( function() {
      flowModel.stepInternal( 0.016 );
    }, flowModel.isPlayProperty, { stroke: 'black', fill: '#005566', right: controlSlider.left - inset, bottom: controlSlider.bottom - inset} );

    this.addChild( stepButton );

    var playPauseButton = new PlayPauseButton( flowModel.isPlayProperty, { stroke: 'black', fill: '#005566', y: stepButton.centerY, right: stepButton.left - inset } );
    this.addChild( playPauseButton );


    var speedControl = new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        new AquaRadioButton( flowModel.speedProperty, 'normal', new Text( normalString, textOptions ), {radius: 6} ),
        new AquaRadioButton( flowModel.speedProperty, 'slow', new Text( slowMotionString, textOptions ), {radius: 6} )
      ]} );
    this.addChild( speedControl.mutate( {right: playPauseButton.left - inset, bottom: playPauseButton.bottom} ) );


    var fluxMeterNode = new FluxMeterNode( flowModel, modelViewTransform, {stroke: 'blue'} );
    flowView.addChild( fluxMeterNode );

    // add speedometers within the sensor panel bounds
    _.each( flowModel.speedometers, function( velocitySensor ) {
      velocitySensor.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX - 85, sensorPanel.visibleBounds.centerY - 35 ) );
      velocitySensor.positionProperty.reset();
      this.addChild( new VelocitySensorNode( flowModel, modelViewTransform, velocitySensor, sensorPanel.visibleBounds, this.layoutBounds ) );
    }.bind( this ) );

    // add barometers within the sensor panel bounds
    _.each( flowModel.barometers, function( barometer ) {
      barometer.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX + 55, sensorPanel.visibleBounds.centerY - 15 ) );
      barometer.reset();
      this.addChild( new BarometerNode( flowModel, modelViewTransform, barometer, [flowModel.fluidDensityProperty], sensorPanel.visibleBounds, this.layoutBounds ) );
    }.bind( this ) );

    this.addChild( new FlowRuler( flowModel.isRulerVisibleProperty, flowModel.rulerPositionProperty, flowModel.measureUnitsProperty, modelViewTransform, this.layoutBounds ) );


    flowModel.flowParticles.addItemAddedListener( function( particle ) {
      var particleNode = new ParticleNode( particle, flowModel.fluidColorModel, modelViewTransform );
      particleLayer.addChild( particleNode );
      particle.node = particleNode;
    } );


    flowModel.flowParticles.addItemRemovedListener( function( removedDrop ) {
      particleLayer.removeChild( removedDrop.node );
    } );


  }

  return inherit( ScreenView, FlowView );
} );