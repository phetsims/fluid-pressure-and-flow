// Copyright 2014-2017, University of Colorado Boulder

/**
 * View for the 'Water Tower' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Vector2 = require( 'DOT/Vector2' );

  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var BarometerNode = require( 'FLUID_PRESSURE_AND_FLOW/common/view/BarometerNode' );
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  var ControlSlider = require( 'FLUID_PRESSURE_AND_FLOW/common/view/ControlSlider' );
  var FaucetControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/FaucetControlPanel' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var FPAFRuler = require( 'FLUID_PRESSURE_AND_FLOW/common/view/FPAFRuler' );
  var GroundNode = require( 'SCENERY_PHET/GroundNode' );
  var HoseNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/HoseNode' );
  var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var SkyNode = require( 'SCENERY_PHET/SkyNode' );
  var SluiceControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/SluiceControlPanel' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ToolsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/ToolsControlPanel' );
  var UnitsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/common/view/UnitsControlPanel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VelocitySensorNode = require( 'FLUID_PRESSURE_AND_FLOW/common/view/VelocitySensorNode' );
  var WaterDropsCanvasNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterDropsCanvasNode' );
  var WaterTowerNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerNode' );

  //  strings
  var feetString = require( 'string!FLUID_PRESSURE_AND_FLOW/feet' );
  var fluidDensityString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidDensity' );
  var gasolineString = require( 'string!FLUID_PRESSURE_AND_FLOW/gasoline' );
  var honeyString = require( 'string!FLUID_PRESSURE_AND_FLOW/honey' );
  var metersString = require( 'string!FLUID_PRESSURE_AND_FLOW/meters' );
  var normalString = require( 'string!FLUID_PRESSURE_AND_FLOW/normal' );
  var slowMotionString = require( 'string!FLUID_PRESSURE_AND_FLOW/slowMotion' );
  var waterString = require( 'string!FLUID_PRESSURE_AND_FLOW/water' );

  // View layout related constants
  var inset = 10;

  /**
   * @param {WaterTowerModel} waterTowerModel
   * @constructor
   */
  function WaterTowerView( waterTowerModel ) {
    var self = this;
    ScreenView.call( this, Constants.SCREEN_VIEW_OPTIONS );

    var textOptions = { font: new PhetFont( 14 ) };

    // Invert the y-axis, so that y grows up.
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, 350 ),
      10 ); //1m = 10px, (0,0) - top left corner

    var groundY = modelViewTransform.modelToViewY( 0 );

    // TODO: find a way to not do this
    waterTowerModel.modelViewTransform = modelViewTransform;

    // add background -- sky
    // rectangle with uniform sky color for y < groundY - 200
    this.addChild( new Rectangle( -5000, -1000, 10000, 1000 + groundY - 198, { stroke: '#01ACE4', fill: '#01ACE4' } ) );
    // gradient background skynode between y = groundY - 200 and y = groundY
    this.addChild( new SkyNode( -5000, groundY - 200, 10000, 200, groundY ) );

    this.hoseDropsLayer = new WaterDropsCanvasNode( waterTowerModel.hoseDrops, waterTowerModel.fluidColorModel, waterTowerModel.modelViewTransform, {
      canvasBounds: new Bounds2( 0, 0, 850, 350 )
    } );

    self.addChild( this.hoseDropsLayer );

    this.waterTowerDropsLayer = new WaterDropsCanvasNode( waterTowerModel.waterTowerDrops, waterTowerModel.fluidColorModel, waterTowerModel.modelViewTransform, {
      canvasBounds: new Bounds2( 0, 0, 500, 350 )
    } );
    self.addChild( this.waterTowerDropsLayer );
    // add background -- earth
    this.addChild( new GroundNode( -5000, groundY, 10000, 10000, groundY + 50 ) );

    // add the hose
    this.hoseNode = new HoseNode( waterTowerModel.hose, waterTowerModel.waterTower.tankPositionProperty, modelViewTransform, waterTowerModel.isHoseVisibleProperty );
    this.addChild( this.hoseNode );

    var waterTowerNode = new WaterTowerNode( waterTowerModel.waterTower, waterTowerModel.fluidColorModel, modelViewTransform, this.hoseNode );
    waterTowerNode.bottom = modelViewTransform.modelToViewY( 0 );
    this.addChild( waterTowerNode );

    this.faucetDropsLayer = new WaterDropsCanvasNode( waterTowerModel.faucetDrops, waterTowerModel.fluidColorModel, waterTowerModel.modelViewTransform, {
      canvasBounds: new Bounds2( 50, 0, 150, 350 )
    } );
    self.addChild( this.faucetDropsLayer );

    var faucetNode = new FaucetNode( 30, waterTowerModel.faucetFlowRateProperty, waterTowerModel.isFaucetEnabledProperty, {
      horizontalPipeLength: 1500,
      right: modelViewTransform.modelToViewX( waterTowerModel.faucetPosition.x ) + 20,
      top: this.layoutBounds.top + inset,
      scale: 0.3, //size of the faucet,
      closeOnRelease: false,

      // Faucet is interactive in manual mode, non-interactive in 'matchLeakage' mode, see #132
      interactiveProperty: new DerivedProperty( [ waterTowerModel.faucetModeProperty ],
        function( faucetMode ) { return faucetMode === 'manual'; } )
    } );
    this.addChild( faucetNode );

    this.addChild( new FaucetControlPanel( waterTowerModel.faucetModeProperty, {
      left: faucetNode.right + inset,
      bottom: faucetNode.bottom,
      fill: 'green'
    } ) );

    // tools control panel
    this.toolsControlPanel = new ToolsControlPanel( waterTowerModel, {
      right: this.layoutBounds.right - inset,
      top: inset
    } );
    this.addChild( this.toolsControlPanel );
    this.addChild( new UnitsControlPanel( waterTowerModel.measureUnitsProperty, this.toolsControlPanel.width, {
      left: this.toolsControlPanel.left, xMargin: 10, yMargin: 10, fontSize: 14,
      top: this.toolsControlPanel.bottom + inset
    } ) );

    // all the movable tools are added to this layer
    var toolsLayer = new Node();
    this.addChild( toolsLayer );

    var unitsProperty = new DerivedProperty( [ waterTowerModel.measureUnitsProperty ],
      function( measureUnits ) {
        var units = {};
        if ( measureUnits === 'metric' ) {
          units = { name: metersString, multiplier: 1 };
        }
        else  /// then it must be english
        {
          units = { name: feetString, multiplier: 3.28 };
        }
        return units;
      } );

    var measuringTapeNode = new MeasuringTapeNode( unitsProperty, waterTowerModel.isMeasuringTapeVisibleProperty, {
      basePositionProperty: waterTowerModel.measuringTapeBasePositionProperty,
      tipPositionProperty: waterTowerModel.measuringTapeTipPositionProperty,
      modelViewTransform: modelViewTransform,
      significantFigures: 2,
      lineColor: 'black', // color of the tapeline itself
      tipCircleColor: 'black', // color of the circle at the tip
      tipCircleRadius: 8, // radius of the circle on the tip
      isBaseCrosshairRotating: false, // do crosshairs rotate around their own axis to line up with the tapeline
      isTipCrosshairRotating: false, // do crosshairs rotate around their own axis to line up with the tapeline
      dragBounds: modelViewTransform.viewToModelBounds( this.layoutBounds.eroded( 10 ) )
    } );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        waterTowerModel.reset();
        self.hoseNode.reset();
        measuringTapeNode.reset();
        waterTowerNode.fillButton.enabled = true;
      },
      right: this.layoutBounds.right - inset,
      bottom: this.layoutBounds.bottom - inset
    } );
    this.addChild( resetAllButton );

    // add the fluid density control slider
    var fluidDensityControlSlider = new ControlSlider( waterTowerModel.measureUnitsProperty, waterTowerModel.fluidDensityProperty, waterTowerModel.getFluidDensityString.bind( waterTowerModel ), waterTowerModel.fluidDensityRange, waterTowerModel.fluidDensityControlExpandedProperty, {
      right: resetAllButton.left - 4 * inset,
      bottom: this.layoutBounds.bottom - inset,
      title: fluidDensityString,
      ticks: [
        {
          title: waterString,
          value: waterTowerModel.fluidDensityProperty.value
        },
        {
          title: gasolineString,
          value: waterTowerModel.fluidDensityRange.min
        },
        {
          title: honeyString,
          value: waterTowerModel.fluidDensityRange.max
        }
      ]
    } );
    this.addChild( fluidDensityControlSlider );

    // add the sluice control near bottom left
    var sluiceControlPanel = new SluiceControlPanel( waterTowerModel.isSluiceOpenProperty, {
      xMargin: 10,
      yMargin: 15,
      fill: '#1F5EFF',
      right: waterTowerNode.right + 36,
      bottom: this.layoutBounds.bottom - 70
    } );
    this.addChild( sluiceControlPanel );

    // add play pause button and step button
    var stepButton = new StepForwardButton( {
      isPlayingProperty: waterTowerModel.isPlayingProperty,
      listener: function() { waterTowerModel.stepInternal( 0.016 ); },
      stroke: 'black',
      fill: '#005566',
      right: fluidDensityControlSlider.left - inset,
      bottom: fluidDensityControlSlider.bottom - inset
    } );

    this.addChild( stepButton );

    var playPauseButton = new PlayPauseButton( waterTowerModel.isPlayingProperty,
      { stroke: 'black', fill: '#005566', y: stepButton.centerY, right: stepButton.left - inset } );
    this.addChild( playPauseButton );

    var speedControl = new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        new AquaRadioButton( waterTowerModel.speedProperty, 'slow', new Text( slowMotionString, textOptions ), { radius: 6 } ),
        new AquaRadioButton( waterTowerModel.speedProperty, 'normal', new Text( normalString, textOptions ), { radius: 6 } )
      ]
    } );

    this.addChild( speedControl.mutate( { right: playPauseButton.left - inset, bottom: playPauseButton.bottom } ) );

    // add the sensors panel
    var sensorPanel = new Rectangle( 0, 0, 190, 105, 10, 10, {
      stroke: 'gray',
      lineWidth: 1,
      fill: '#f2fa6a',
      right: this.toolsControlPanel.left - inset,
      top: this.toolsControlPanel.top
    } );
    this.addChild( sensorPanel );

    // add barometers within the sensor panel bounds
    _.each( waterTowerModel.barometers, function( barometer ) {
      barometer.reset();
      toolsLayer.addChild( new BarometerNode( modelViewTransform, barometer, waterTowerModel.measureUnitsProperty,
        [ waterTowerModel.fluidDensityProperty, waterTowerModel.waterTower.tankPositionProperty, waterTowerModel.waterTower.fluidLevelProperty ],
        waterTowerModel.getPressureAtCoords.bind( waterTowerModel ), waterTowerModel.getPressureString.bind( waterTowerModel ),
        sensorPanel.visibleBounds, this.layoutBounds.withMaxY( this.layoutBounds.maxY - 62 ), {
          minPressure: Constants.MIN_PRESSURE,
          maxPressure: Constants.MAX_PRESSURE
        } ) );
    }.bind( this ) );

    // add speedometers within the sensor panel bounds
    _.each( waterTowerModel.speedometers, function( velocitySensor ) {
      velocitySensor.positionProperty.reset();
      toolsLayer.addChild( new VelocitySensorNode( modelViewTransform, velocitySensor,
        waterTowerModel.measureUnitsProperty, [], waterTowerModel.getWaterDropVelocityAt.bind( waterTowerModel ),
        sensorPanel.visibleBounds, this.layoutBounds.withMaxY( this.layoutBounds.maxY - 72 ) ) );
    }.bind( this ) );

    toolsLayer.addChild( new FPAFRuler( waterTowerModel.isRulerVisibleProperty, waterTowerModel.rulerPositionProperty,
      waterTowerModel.measureUnitsProperty, modelViewTransform, this.layoutBounds, {
        rulerWidth: 40,
        rulerHeight: 30,
        meterMajorStickWidth: 5,
        feetMajorStickWidth: 3,
        scaleFont: 12,
        meterTicks: _.range( 0, 31, 5 ),
        feetTicks: _.range( 0, 101, 10 ),
        insetsWidth: 0
      } ) );
    toolsLayer.addChild( measuringTapeNode );


    waterTowerModel.isSluiceOpenProperty.link( function( isSluiceOpen ) {
      if ( isSluiceOpen ) {
        waterTowerNode.sluiceGate.bottom = waterTowerNode.waterTankFrame.bottom + modelViewTransform.modelToViewDeltaY( waterTowerNode.waterTower.HOLE_SIZE ) - 5;
      }
      else {
        waterTowerNode.sluiceGate.bottom = waterTowerNode.waterTankFrame.bottom;
      }
    } );

    waterTowerModel.tankFullLevelDurationProperty.link( function( tankFullLevelDuration ) {
      waterTowerNode.fillButton.enabled = (tankFullLevelDuration < 0.2);
      waterTowerModel.isFaucetEnabledProperty.value = (tankFullLevelDuration < 0.2);
    } );

    // if the sim is paused, disable the fill button as soon as the tank is filled
    new DerivedProperty( [ waterTowerModel.waterTower.fluidVolumeProperty ], function( fluidVolume ) {
      return fluidVolume === waterTowerModel.waterTower.TANK_VOLUME;
    } ).link( function() {
      if ( !waterTowerModel.isPlayingProperty.value ) {
        waterTowerNode.fillButton.enabled = false;
        waterTowerModel.tankFullLevelDurationProperty.value = 1;
      }
    } );

    // Handles the case when switching from play to pause or viceversa
    waterTowerModel.isPlayingProperty.link( function( isPlaying ) {
      if ( waterTowerModel.waterTower.fluidVolumeProperty.value >= waterTowerModel.waterTower.TANK_VOLUME ) {
        waterTowerModel.tankFullLevelDurationProperty.value = 1;
        if ( !isPlaying ) {
          // disable the fill button if the tank is full and switching from play to pause
          waterTowerNode.fillButton.enabled = false;
        }
      }
    } );
    toolsLayer.moveToFront();
  }

  fluidPressureAndFlow.register( 'WaterTowerView', WaterTowerView );

  return inherit( ScreenView, WaterTowerView, {
    step: function( dt ) {
      this.waterTowerDropsLayer.step( dt );
      this.hoseDropsLayer.step( dt );
      this.faucetDropsLayer.step( dt );
    }
  } );
} );