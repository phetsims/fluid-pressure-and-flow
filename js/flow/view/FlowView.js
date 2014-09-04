// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * FlowView.
 * @author Siddhartha Chinthapally (Actual Concepts).
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SkyNode = require( 'SCENERY_PHET/SkyNode' );
  var GroundNode = require( 'SCENERY_PHET/GroundNode' );
  var Pattern = require( 'SCENERY/util/Pattern' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var ToolsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/ToolsControlPanel' );
  var UnitsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/UnitsControlPanel' );
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
  var Color = require( 'SCENERY/util/Color' );
  var HSlider = require( 'SUN/HSlider' );


  var PipeNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/PipeNode' );
  var FluxMeterNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/FluxMeterNode' );
  var GridInjectorNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/GridInjectorNode' );
  var Image = require( 'SCENERY/nodes/Image' );

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
  var flowMockupImg = require( 'image!FLUID_PRESSURE_AND_FLOW/images/flow-mockup.jpg' );

  //View layout related constants
  var inset = 10;

  /**
   * Main view of the flow sim.
   * @param {FlowModel} flowModel of the simulation
   * @constructor
   */
  function FlowView( flowModel ) {
    var flowView = this;

    ScreenView.call( this, {renderer: 'svg'} );
    /*  ScreenView.call( this, {
     renderer: 'svg',
     layoutBounds: ScreenView.UPDATED_LAYOUT_BOUNDS
     } );*/
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 370, 160 ),
      50 ); //1m = 50Px, (0,0) - top left corner

    // add sky node
    this.addChild( new Rectangle( -5000, -1000, 10000, 1000, {stroke: '#01ACE4', fill: '#01ACE4'} ) );

    var skyNode = new SkyNode( -5000, 0, 10000, 142, 200 );
    this.addChild( skyNode );

    // Injector which generates grid particles
    this.gridInjectorNode = new GridInjectorNode( flowModel, {bottom: skyNode.bottom + 78 + 13, left: 22 } );
    this.addChild( this.gridInjectorNode );

    // add ground node
    var groundNode = new GroundNode( -5000, 143, 10000, 10000, 400, {topColor: /*'#9D8B61'*/  new Color( 157, 139, 97, 0.8 ), bottomColor: '#645A3C'} );
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
    this.toolsControlPanel = new ToolsControlPanel( flowModel, {right: this.layoutBounds.right - 7, top: 7} );
    this.addChild( this.toolsControlPanel );

    // units control panel
    var unitsControlPanel = new UnitsControlPanel( flowModel.measureUnitsProperty, 50, { right: this.toolsControlPanel.left - 7, top: this.toolsControlPanel.top } );
    this.addChild( unitsControlPanel );


    // add the fluid density control slider
    var controlSlider = new ControlSlider( flowModel, flowModel.fluidDensityProperty, flowModel.getFluidDensityString.bind( flowModel ), flowModel.fluidDensityRange, {
      right: this.layoutBounds.right - 105,
      bottom: this.layoutBounds.bottom - 7,
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
      ],
      scale: 0.9,
      titleAlign: 'center'
    } );
    this.addChild( controlSlider );
    var fluxMeterNode = new FluxMeterNode( flowModel, modelViewTransform, {stroke: 'blue'} );

    flowModel.isFluxMeterVisibleProperty.linkAttribute( fluxMeterNode.ellipse2, 'visible' );

    // add the back ellipse of the fluxMeter before the particle layer
    this.addChild( fluxMeterNode.ellipse2 );

    //adding pipe Node
    this.pipeNode = new PipeNode( flowModel, flowModel.pipe, modelViewTransform, this.layoutBounds );
    flowModel.pipe.reset();
    this.addChild( this.pipeNode );

    this.addChild( fluxMeterNode );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        flowModel.reset();
        controlSlider.reset();
        flowRateSlider.reset();
        flowView.pipeNode.reset();
      },
      radius: 18,
      bottom: this.layoutBounds.bottom - 7,
      right: this.layoutBounds.right - 13

    } );
    this.addChild( resetAllButton );


    // add the sensors panel
    var sensorPanel = new Rectangle( 0, 0, 167, 85, 10, 10, {stroke: 'gray', lineWidth: 1, fill: '#f2fa6a', right: unitsControlPanel.left - 4, top: this.toolsControlPanel.top} );
    this.addChild( sensorPanel );


    flowModel.isGridInjectorPressedProperty.link( function( isGridInjectorPressed ) {
      if ( isGridInjectorPressed ) {
        flowModel.injectGridParticles();
        flowView.gridInjectorNode.redButton.enabled = false;
      }
      else {
        flowView.gridInjectorNode.redButton.enabled = true;
      }
    } );


    // add play pause button and step button
    var stepButton = new StepButton( function() {
      flowModel.timer.step( 0.016 );
      flowModel.propagateParticles( 0.016 );
    }, flowModel.isPlayProperty, { radius: 12, stroke: 'black', fill: '#005566', right: controlSlider.left - 82, bottom: this.layoutBounds.bottom - 14 } );

    this.addChild( stepButton );

    var playPauseButton = new PlayPauseButton( flowModel.isPlayProperty, { radius: 18, stroke: 'black', fill: '#005566', y: stepButton.centerY, right: stepButton.left - inset } );
    this.addChild( playPauseButton );

    var speedControl = new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        new AquaRadioButton( flowModel.speedProperty, 'slow', new Text( slowMotionString, {font: new PhetFont( 12 )} ), {radius: 8} ),
        new AquaRadioButton( flowModel.speedProperty, 'normal', new Text( normalString, {font: new PhetFont( 12 )} ), {radius: 8} )
      ]} );
    this.addChild( speedControl.mutate( {right: playPauseButton.left - 8, bottom: playPauseButton.bottom} ) );

    //add flow rate panel
    var flowRateSlider = new ControlSlider( flowModel, flowModel.fluidFlowRateProperty, flowModel.getFluidFlowRateString.bind( flowModel ), flowModel.flowRateRange, {
      right: speedControl.left - 20,
      bottom: this.layoutBounds.bottom - 7,
      title: flowRateString,
      ticks: [
        {
          title: 'Min',
          value: 1000
        },
        {
          title: 'Max',
          value: 10000
        }
      ],
      ticksVisible: false,
      titleAlign: 'center',
      scale: 0.9
    } );
    this.addChild( flowRateSlider );

    // convert between m3/sec and liter/sec
    flowModel.fluidFlowRateProperty.link( function( flowRate ) {
      flowModel.pipe.flowRate = flowRate * 0.001;
    } );


    // add speedometers within the sensor panel bounds
    _.each( flowModel.speedometers, function( velocitySensor ) {
      velocitySensor.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX - 75, sensorPanel.visibleBounds.centerY - 30 ) );
      velocitySensor.positionProperty.reset();
      this.addChild( new VelocitySensorNode( flowModel, modelViewTransform, velocitySensor, [flowModel.fluidFlowRateProperty, flowModel.pipe.frictionProperty], sensorPanel.visibleBounds, this.layoutBounds, {scale: 0.9} ) );
    }.bind( this ) );

    // add barometers within the sensor panel bounds
    _.each( flowModel.barometers, function( barometer ) {
      barometer.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX + 50, sensorPanel.visibleBounds.centerY - 15 ) );
      barometer.reset();
      this.addChild( new BarometerNode( flowModel, modelViewTransform, barometer, [flowModel.fluidDensityProperty, flowModel.fluidFlowRateProperty, flowModel.pipe.frictionProperty], sensorPanel.visibleBounds, this.layoutBounds, {scale: 0.9} ) );
    }.bind( this ) );


    this.addChild( new FlowRuler( flowModel.isRulerVisibleProperty, flowModel.rulerPositionProperty, flowModel.measureUnitsProperty, modelViewTransform, this.layoutBounds ) );

    /*var mockupBackground = new Image( flowMockupImg, {opacity: 0.5} );
     this.addChild( mockupBackground );
     this.addChild( new HSlider(flowModel.opacityProperty, { min: 0,  max: 1 }));
     flowModel.opacityProperty.linkAttribute( mockupBackground, 'opacity');*/
  }

  return inherit( ScreenView, FlowView, {
    step: function( dt ) {
      this.pipeNode.particlesLayer.step( dt );
    }
  } );
} );