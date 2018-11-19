// Copyright 2014-2018, University of Colorado Boulder

/**
 * View for the Fluid Pressure and Flow sim's Flow tab. The view contains a flexible pipe that can be dragged
 * and scaled using handles, particles to show the fluid flow and tools to measure flux, area, length, velocity etc.
 * @author Siddhartha Chinthapally (Actual Concepts).
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  var ControlSlider = require( 'FLUID_PRESSURE_AND_FLOW/common/view/ControlSlider' );
  var FlowToolsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/FlowToolsControlPanel' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var FluxMeterNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/FluxMeterNode' );
  var FPAFRuler = require( 'FLUID_PRESSURE_AND_FLOW/common/view/FPAFRuler' );
  var GridInjectorNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/GridInjectorNode' );
  var GroundNode = require( 'SCENERY_PHET/GroundNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Pattern = require( 'SCENERY/util/Pattern' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PipeHandlesNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/PipeHandlesNode' );
  var PipeNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/PipeNode' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SensorToolbox = require( 'FLUID_PRESSURE_AND_FLOW/common/view/SensorToolbox' );
  var SkyNode = require( 'SCENERY_PHET/SkyNode' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var UnitsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/common/view/UnitsControlPanel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var flowRateString = require( 'string!FLUID_PRESSURE_AND_FLOW/flowRate' );
  var fluidDensityString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidDensity' );
  var gasolineString = require( 'string!FLUID_PRESSURE_AND_FLOW/gasoline' );
  var honeyString = require( 'string!FLUID_PRESSURE_AND_FLOW/honey' );
  var normalString = require( 'string!FLUID_PRESSURE_AND_FLOW/normal' );
  var slowMotionString = require( 'string!FLUID_PRESSURE_AND_FLOW/slowMotion' );
  var waterString = require( 'string!FLUID_PRESSURE_AND_FLOW/water' );

  //images
  var grassImg = require( 'image!FLUID_PRESSURE_AND_FLOW/grass-texture.png' );

  //View layout related constants
  var inset = 10;

  /**
   * Main view of the flow sim.
   * @param {FlowModel} flowModel of the simulation
   * @constructor
   */
  function FlowScreenView( flowModel ) {

    var self = this;
    ScreenView.call( this, Constants.SCREEN_VIEW_OPTIONS );

    // view co-ordinates (370,140) map to model origin (0,0) with inverted y-axis (y grows up in the model)
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 370, 140 ),
      50 ); //1m = 50Px

    var groundY = modelViewTransform.modelToViewY( 0 );
    var backgroundNodeStartX = -5000;
    var backgroundNodeWidth = 10000;
    var skyExtensionHeight = 10000;
    var groundDepth = 10000;
    this.flowModel = flowModel;

    // add rectangle on top of the sky node to extend sky upwards.
    // See https://github.com/phetsims/fluid-pressure-and-flow/issues/87
    this.addChild( new Rectangle( backgroundNodeStartX, -skyExtensionHeight, backgroundNodeWidth, skyExtensionHeight,
      { stroke: '#01ACE4', fill: '#01ACE4' } ) );

    // add sky node
    this.addChild( new SkyNode( backgroundNodeStartX, 0, backgroundNodeWidth, groundY, groundY ) );

    // add ground node with gradient
    var groundNode = new GroundNode( backgroundNodeStartX, groundY, backgroundNodeWidth, groundDepth, 400,
      { topColor: '#9D8B61', bottomColor: '#645A3C' } );
    this.addChild( groundNode );

    // add grass above the ground
    var grassPattern = new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) );
    var grassRectYOffset = 1;
    var grassRectHeight = 10;

    this.addChild( new Rectangle( backgroundNodeStartX, grassRectYOffset, backgroundNodeWidth, grassRectHeight, {
      fill: grassPattern,
      bottom: groundNode.top
    } ) );

    // Control panel with checkboxes to toggle tools on the screen
    var toolsControlPanel = new FlowToolsControlPanel( flowModel, { right: this.layoutBounds.right - 7, top: 7 } );
    this.addChild( toolsControlPanel );

    // all the movable tools are added to this layer
    var toolsLayer = new Node();
    this.addChild( toolsLayer );

    // units control panel
    var unitsControlPanel = new UnitsControlPanel( flowModel.measureUnitsProperty,
      { right: toolsControlPanel.left - 7, top: toolsControlPanel.top } );
    this.addChild( unitsControlPanel );

    var fluxMeterNode = new FluxMeterNode( flowModel, modelViewTransform, { stroke: 'blue' } );
    flowModel.isFluxMeterVisibleProperty.linkAttribute( fluxMeterNode.ellipse2, 'visible' );

    // Injector which generates grid particles
    var gridInjectorNode = new GridInjectorNode( flowModel.isGridInjectorPressedProperty, modelViewTransform,
      flowModel.pipe );
    this.addChild( gridInjectorNode );

    // add the pipe (without handles)
    this.pipeNode = new PipeNode( flowModel, modelViewTransform, this.layoutBounds );
    this.addChild( this.pipeNode );

    // add the handles
    var pipeHandlesNode = new PipeHandlesNode( flowModel, this.pipeNode, gridInjectorNode, modelViewTransform,
      this.layoutBounds );
    this.addChild( pipeHandlesNode );

    // add the back ellipse of the fluxMeter to the pipe node's pre-particle layer
    this.pipeNode.preParticleLayer.addChild( fluxMeterNode.ellipse2 );

    // now add the front part of the fluxMeter
    toolsLayer.addChild( fluxMeterNode );

    // add the reset button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        flowModel.reset();
        self.pipeNode.reset();
        pipeHandlesNode.reset();
        sensorPanel.reset();
      },
      radius: 18,
      bottom: this.layoutBounds.bottom - 7,
      right: this.layoutBounds.right - 13
    } );
    this.addChild( resetAllButton );

    // add the fluid density control slider
    var fluidDensityControlNode = new ControlSlider(
      flowModel.measureUnitsProperty,
      flowModel.fluidDensityProperty,
      flowModel.getFluidDensityString.bind( flowModel ),
      flowModel.fluidDensityRange,
      flowModel.fluidDensityControlExpandedProperty,
      {
        right: resetAllButton.left - 55,
        bottom: resetAllButton.bottom,
        title: fluidDensityString,
        ticks: [
          {
            title: waterString,
            value: flowModel.fluidDensityProperty.value
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
        titleAlign: 'center',
        xMargin: 10
      } );
    this.addChild( fluidDensityControlNode );

    // add the sensors panel
    var sensorPanel = new SensorToolbox( flowModel, modelViewTransform, this, {
      stroke: 'gray', lineWidth: 1, fill: '#f2fa6a',
      right: unitsControlPanel.left - 4, top: toolsControlPanel.top
    } );
    this.addChild( sensorPanel );

    flowModel.isGridInjectorPressedProperty.link( function( isGridInjectorPressed ) {
      if ( isGridInjectorPressed ) {
        flowModel.injectGridParticles();
      }
    } );
    // add play pause button and step button
    var stepButton = new StepForwardButton( {
      isPlayingProperty: flowModel.isPlayingProperty,
      listener: function() {
        flowModel.timer.step( 0.016 );
        flowModel.propagateParticles( 0.016 );
        self.pipeNode.particlesLayer.step();
      },
      radius: 12,
      stroke: 'black',
      fill: '#005566',
      right: fluidDensityControlNode.left - 82,
      bottom: this.layoutBounds.bottom - 14
    } );

    this.addChild( stepButton );

    var playPauseButton = new PlayPauseButton( flowModel.isPlayingProperty,
      { radius: 18, stroke: 'black', fill: '#005566', y: stepButton.centerY, right: stepButton.left - inset } );
    this.addChild( playPauseButton );

    // add sim speed controls
    var slowMotionRadioBox = new AquaRadioButton( flowModel.speedProperty, 'slow',
      new Text( slowMotionString, { font: new PhetFont( 12 ) } ), { radius: 8 } );
    var normalMotionRadioBox = new AquaRadioButton( flowModel.speedProperty, 'normal',
      new Text( normalString, { font: new PhetFont( 12 ) } ), { radius: 8 } );

    var speedControlMaxWidth = ( slowMotionRadioBox.width > normalMotionRadioBox.width ) ? slowMotionRadioBox.width :
                               normalMotionRadioBox.width;

    var radioButtonSpacing = 5;
    var touchAreaYDilation = radioButtonSpacing / 2;
    slowMotionRadioBox.touchArea = new Bounds2(
      slowMotionRadioBox.localBounds.minX,
      slowMotionRadioBox.localBounds.minY - touchAreaYDilation,
      ( slowMotionRadioBox.localBounds.minX + speedControlMaxWidth ),
      slowMotionRadioBox.localBounds.maxY + touchAreaYDilation
    );

    normalMotionRadioBox.touchArea = new Bounds2(
      normalMotionRadioBox.localBounds.minX,
      normalMotionRadioBox.localBounds.minY - touchAreaYDilation,
      ( normalMotionRadioBox.localBounds.minX + speedControlMaxWidth ),
      normalMotionRadioBox.localBounds.maxY + touchAreaYDilation
    );

    var speedControl = new VBox( {
      align: 'left',
      spacing: radioButtonSpacing,
      children: [ slowMotionRadioBox, normalMotionRadioBox ]
    } );
    this.addChild( speedControl.mutate( { right: playPauseButton.left - 8, bottom: playPauseButton.bottom } ) );

    // add flow rate panel
    var flowRateControlNode = new ControlSlider(
      flowModel.measureUnitsProperty,
      flowModel.pipe.flowRateProperty,
      flowModel.getFluidFlowRateString.bind( flowModel ),
      flowModel.flowRateRange,
      flowModel.flowRateControlExpandedProperty,
      {
        right: speedControl.left - 20,
        bottom: fluidDensityControlNode.bottom,
        title: flowRateString,
        ticks: [
          {
            title: 'Min',
            value: Constants.MIN_FLOW_RATE
          },
          {
            title: 'Max',
            value: Constants.MAX_FLOW_RATE
          }
        ],
        ticksVisible: false,
        titleAlign: 'center'
      } );
    this.addChild( flowRateControlNode );



    // add the rule node
    toolsLayer.addChild( new FPAFRuler(
      flowModel.isRulerVisibleProperty,
      flowModel.rulerPositionProperty,
      flowModel.measureUnitsProperty,
      modelViewTransform,
      this.layoutBounds )
    );

    toolsLayer.moveToFront();
  }

  fluidPressureAndFlow.register( 'FlowScreenView', FlowScreenView );

  return inherit( ScreenView, FlowScreenView, {

    /**
     * Called by the animation loop.
     */
    step: function() {
      if ( this.flowModel.isPlayingProperty.value ) {
        this.pipeNode.particlesLayer.step();
      }
    }
  } );
} );