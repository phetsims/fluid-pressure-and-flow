// Copyright 2014-2019, University of Colorado Boulder

/**
 * View for the Fluid Pressure and Flow sim's Flow tab. The view contains a flexible pipe that can be dragged
 * and scaled using handles, particles to show the fluid flow and tools to measure flux, area, length, velocity etc.
 *
 * @author Siddhartha Chinthapally (Actual Concepts).
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  const ControlSlider = require( 'FLUID_PRESSURE_AND_FLOW/common/view/ControlSlider' );
  const FlowToolsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/FlowToolsControlPanel' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const FluxMeterNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/FluxMeterNode' );
  const FPAFRuler = require( 'FLUID_PRESSURE_AND_FLOW/common/view/FPAFRuler' );
  const GridInjectorNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/GridInjectorNode' );
  const GroundNode = require( 'SCENERY_PHET/GroundNode' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Pattern = require( 'SCENERY/util/Pattern' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PipeHandlesNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/PipeHandlesNode' );
  const PipeNode = require( 'FLUID_PRESSURE_AND_FLOW/flow/view/PipeNode' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SensorToolbox = require( 'FLUID_PRESSURE_AND_FLOW/common/view/SensorToolbox' );
  const SkyNode = require( 'SCENERY_PHET/SkyNode' );
  const StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const UnitsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/common/view/UnitsControlPanel' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const flowRateString = require( 'string!FLUID_PRESSURE_AND_FLOW/flowRate' );
  const fluidDensityString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidDensity' );
  const gasolineString = require( 'string!FLUID_PRESSURE_AND_FLOW/gasoline' );
  const honeyString = require( 'string!FLUID_PRESSURE_AND_FLOW/honey' );
  const normalString = require( 'string!FLUID_PRESSURE_AND_FLOW/normal' );
  const slowMotionString = require( 'string!FLUID_PRESSURE_AND_FLOW/slowMotion' );
  const waterString = require( 'string!FLUID_PRESSURE_AND_FLOW/water' );

  //images
  const grassImg = require( 'image!FLUID_PRESSURE_AND_FLOW/grass-texture.png' );

  //View layout related constants
  const INSET = 10;

  class FlowScreenView extends ScreenView {

    /**
     * @param {FlowModel} flowModel
     */
    constructor( flowModel ) {

      super( Constants.SCREEN_VIEW_OPTIONS );

      // view co-ordinates (370,140) map to model origin (0,0) with inverted y-axis (y grows up in the model)
      const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
        Vector2.ZERO,
        new Vector2( 370, 140 ),
        50 ); //1m = 50Px

      const groundY = modelViewTransform.modelToViewY( 0 );
      const backgroundNodeStartX = -5000;
      const backgroundNodeWidth = 10000;
      const skyExtensionHeight = 10000;
      const groundDepth = 10000;
      this.flowModel = flowModel;

      // add rectangle on top of the sky node to extend sky upwards.
      // See https://github.com/phetsims/fluid-pressure-and-flow/issues/87
      this.addChild( new Rectangle( backgroundNodeStartX, -skyExtensionHeight, backgroundNodeWidth, skyExtensionHeight,
        { stroke: '#01ACE4', fill: '#01ACE4' } ) );

      // add sky node
      this.addChild( new SkyNode( backgroundNodeStartX, 0, backgroundNodeWidth, groundY, groundY ) );

      // add ground node with gradient
      const groundNode = new GroundNode( backgroundNodeStartX, groundY, backgroundNodeWidth, groundDepth, 400,
        { topColor: '#9D8B61', bottomColor: '#645A3C' } );
      this.addChild( groundNode );

      // add grass above the ground
      const grassPattern = new Pattern( grassImg ).setTransformMatrix( Matrix3.scale( 0.25 ) );
      const grassRectYOffset = 1;
      const grassRectHeight = 10;

      this.addChild( new Rectangle( backgroundNodeStartX, grassRectYOffset, backgroundNodeWidth, grassRectHeight, {
        fill: grassPattern,
        bottom: groundNode.top
      } ) );

      // Control panel with checkboxes to toggle tools on the screen
      const toolsControlPanel = new FlowToolsControlPanel( flowModel, { right: this.layoutBounds.right - 7, top: 7 } );
      this.addChild( toolsControlPanel );

      // all the movable tools are added to this layer
      const toolsLayer = new Node();
      this.addChild( toolsLayer );

      // units control panel
      const unitsControlPanel = new UnitsControlPanel( flowModel.measureUnitsProperty,
        { right: toolsControlPanel.left - 7, top: toolsControlPanel.top } );
      this.addChild( unitsControlPanel );

      const fluxMeterNode = new FluxMeterNode( flowModel, modelViewTransform, { stroke: 'blue' } );
      flowModel.isFluxMeterVisibleProperty.linkAttribute( fluxMeterNode.ellipse2, 'visible' );

      // Injector which generates grid particles
      const gridInjectorNode = new GridInjectorNode( flowModel.isGridInjectorPressedProperty, modelViewTransform,
        flowModel.pipe );
      this.addChild( gridInjectorNode );

      // add the pipe (without handles)
      this.pipeNode = new PipeNode( flowModel, modelViewTransform, this.layoutBounds );
      this.addChild( this.pipeNode );

      // add the handles
      const pipeHandlesNode = new PipeHandlesNode( flowModel, this.pipeNode, gridInjectorNode, modelViewTransform,
        this.layoutBounds );
      this.addChild( pipeHandlesNode );

      // add the back ellipse of the fluxMeter to the pipe node's pre-particle layer
      this.pipeNode.preParticleLayer.addChild( fluxMeterNode.ellipse2 );

      // now add the front part of the fluxMeter
      toolsLayer.addChild( fluxMeterNode );

      // add the reset button
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          flowModel.reset();
          this.pipeNode.reset();
          pipeHandlesNode.reset();
          sensorPanel.reset();
        },
        radius: 18,
        bottom: this.layoutBounds.bottom - 7,
        right: this.layoutBounds.right - 13
      } );
      this.addChild( resetAllButton );

      // add the fluid density control slider
      const fluidDensityControlNode = new ControlSlider(
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
      const sensorPanel = new SensorToolbox( flowModel, modelViewTransform, this, {
        stroke: 'gray', lineWidth: 1, fill: '#f2fa6a',
        right: unitsControlPanel.left - 4, top: toolsControlPanel.top
      } );
      this.addChild( sensorPanel );

      flowModel.isGridInjectorPressedProperty.link( isGridInjectorPressed => {
        if ( isGridInjectorPressed ) {
          flowModel.injectGridParticles();
        }
      } );
      // add play pause button and step button
      const stepButton = new StepForwardButton( {
        isPlayingProperty: flowModel.isPlayingProperty,
        listener: () => {
          flowModel.timer.step( 0.016 );
          flowModel.propagateParticles( 0.016 );
          this.pipeNode.particlesLayer.step();
        },
        radius: 12,
        stroke: 'black',
        fill: '#005566',
        right: fluidDensityControlNode.left - 82,
        bottom: this.layoutBounds.bottom - 14
      } );

      this.addChild( stepButton );

      const playPauseButton = new PlayPauseButton( flowModel.isPlayingProperty,
        { radius: 18, stroke: 'black', fill: '#005566', y: stepButton.centerY, right: stepButton.left - INSET } );
      this.addChild( playPauseButton );

      // add sim speed controls
      const slowMotionRadioBox = new AquaRadioButton( flowModel.speedProperty, 'slow',
        new Text( slowMotionString, { font: new PhetFont( 12 ) } ), { radius: 8 } );
      const normalMotionRadioBox = new AquaRadioButton( flowModel.speedProperty, 'normal',
        new Text( normalString, { font: new PhetFont( 12 ) } ), { radius: 8 } );

      const speedControlMaxWidth = ( slowMotionRadioBox.width > normalMotionRadioBox.width ) ? slowMotionRadioBox.width :
                                   normalMotionRadioBox.width;

      const radioButtonSpacing = 5;
      const touchAreaYDilation = radioButtonSpacing / 2;
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

      const speedControl = new VBox( {
        align: 'left',
        spacing: radioButtonSpacing,
        children: [ slowMotionRadioBox, normalMotionRadioBox ]
      } );
      this.addChild( speedControl.mutate( { right: playPauseButton.left - 8, bottom: playPauseButton.bottom } ) );

      // add flow rate panel
      const flowRateControlNode = new ControlSlider(
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

    /**
     * Called by the animation loop.
     */
    step() {
      if ( this.flowModel.isPlayingProperty.value ) {
        this.pipeNode.particlesLayer.step();
      }
    }
  }

  return fluidPressureAndFlow.register( 'FlowScreenView', FlowScreenView );
} );