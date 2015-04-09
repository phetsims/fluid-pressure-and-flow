// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Water Tower' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules


  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds2 = require( 'DOT/Bounds2' );

  var SkyNode = require( 'SCENERY_PHET/SkyNode' );
  var GroundNode = require( 'SCENERY_PHET/GroundNode' );
  var WaterDropsCanvasNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterDropsCanvasNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var BarometerNode = require( 'UNDER_PRESSURE/common/view/BarometerNode' );
  var ControlSlider = require( 'UNDER_PRESSURE/common/view/ControlSlider' );
  var ToolsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/ToolsControlPanel' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var SluiceControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/SluiceControlPanel' );
  var UnitsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/common/view/UnitsControlPanel' );
  var FPAFRuler = require( 'FLUID_PRESSURE_AND_FLOW/common/view/FPAFRuler' );
  var WaterTowerNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerNode' );
  var HoseNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/HoseNode' );
  var VelocitySensorNode = require( 'FLUID_PRESSURE_AND_FLOW/common/view/VelocitySensorNode' );
  var FaucetControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/FaucetControlPanel' );
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );

  //strings
  var fluidDensityString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidDensity' );
  var gasolineString = require( 'string!FLUID_PRESSURE_AND_FLOW/gasoline' );
  var waterString = require( 'string!FLUID_PRESSURE_AND_FLOW/water' );
  var honeyString = require( 'string!FLUID_PRESSURE_AND_FLOW/honey' );
  var normalString = require( 'string!FLUID_PRESSURE_AND_FLOW/normal' );
  var slowMotionString = require( 'string!FLUID_PRESSURE_AND_FLOW/slowMotion' );
  var feetString = require( 'string!FLUID_PRESSURE_AND_FLOW/feet' );
  var metersString = require( 'string!FLUID_PRESSURE_AND_FLOW/meters' );

  //View layout related constants
  var inset = 10;

  /**
   * @param {WaterTowerModel} waterTowerModel
   * @constructor
   */
  function WaterTowerView( waterTowerModel ) {
    var waterTowerScreenView = this;
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

    waterTowerScreenView.addChild( this.hoseDropsLayer );

    this.waterTowerDropsLayer = new WaterDropsCanvasNode( waterTowerModel.waterTowerDrops, waterTowerModel.fluidColorModel, waterTowerModel.modelViewTransform, {
      canvasBounds: new Bounds2( 0, 0, 500, 350 )
    } );
    waterTowerScreenView.addChild( this.waterTowerDropsLayer );
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
    waterTowerScreenView.addChild( this.faucetDropsLayer );

    var faucetNode = new FaucetNode( 30, waterTowerModel.faucetFlowRateProperty, waterTowerModel.isFaucetEnabledProperty, {
      horizontalPipeLength: 1500,
      right: modelViewTransform.modelToViewX( waterTowerModel.faucetPosition.x ) + 20,
      top: this.layoutBounds.top + inset,
      scale: 0.3, //size of the faucet,
      closeOnRelease: false,

      // Faucet is interactive in manual mode, non-interactive in 'matchLeakage' mode, see #132
      interactiveProperty: new DerivedProperty( [waterTowerModel.faucetModeProperty],
        function( faucetMode ) { return faucetMode === 'manual'; } )
    } );
    this.addChild( faucetNode );

    this.addChild( new FaucetControlPanel( waterTowerModel.faucetModeProperty, {
      left: faucetNode.right + inset,
      bottom: faucetNode.bottom,
      fill: 'green'
    } ) );

    // tools control panel
    this.toolsControlPanel = new ToolsControlPanel( waterTowerModel, { right: this.layoutBounds.right - inset, top: inset } );
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

    var measuringTape = new MeasuringTape( unitsProperty, waterTowerModel.isMeasuringTapeVisibleProperty, {
      basePositionProperty: waterTowerModel.measuringTapePositionProperty,
      unrolledTapeDistance: 7.35, // // in model coordinates
      modelViewTransform: modelViewTransform,
      significantFigures: 2,
      lineColor: 'black', // color of the tapeline itself
      tipCircleColor: 'black', // color of the circle at the tip
      tipCircleRadius: 8, // radius of the circle on the tip
      isBaseCrosshairRotating: false, // do crosshairs rotate around their own axis to line up with the tapeline
      isTipCrosshairRotating: false, // do crosshairs rotate around their own axis to line up with the tapeline
      dragBounds: this.layoutBounds.eroded( 10 )
    } );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        waterTowerModel.reset();
        waterTowerScreenView.hoseNode.reset();
        measuringTape.reset();
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
          value: waterTowerModel.fluidDensity
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
      right:  waterTowerNode.right + 36,
      bottom: this.layoutBounds.bottom - 70
    } );
    this.addChild( sluiceControlPanel );

    // add play pause button and step button
    var stepButton = new StepButton( function() {
      waterTowerModel.stepInternal( 0.016 );
    }, waterTowerModel.isPlayingProperty, {
      stroke: 'black', fill: '#005566', right: fluidDensityControlSlider.left -
                                               inset, bottom: fluidDensityControlSlider.bottom -
                                               inset
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
      barometer.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX + 55, sensorPanel.visibleBounds.centerY - 10 ) );
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
      velocitySensor.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX - 85, sensorPanel.visibleBounds.centerY - 35 ) );
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
        meterUnitsSpacing: 50,
        feetUnitSpacing: 34,
        meterTicks: _.range( 0, 35, 5 ),
        feetTicks: _.range( 0, 110, 10 ),
        insetsWidth: 0
      } ) );
    toolsLayer.addChild( measuringTape );


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
      waterTowerModel.isFaucetEnabled = (tankFullLevelDuration < 0.2);
    } );

    // if the sim is paused, disable the fill button as soon as the tank is filled
    new DerivedProperty( [waterTowerModel.waterTower.fluidVolumeProperty], function( fluidVolume ) {
      return fluidVolume === waterTowerModel.waterTower.TANK_VOLUME;
    } ).link( function() {
      if ( !waterTowerModel.isPlaying ) {
        waterTowerNode.fillButton.enabled = false;
        waterTowerModel.tankFullLevelDuration = 1;
      }
    } );

    // Handles the case when switching from play to pause or viceversa
    waterTowerModel.isPlayingProperty.link( function( isPlaying ) {
      if ( waterTowerModel.waterTower.fluidVolume >= waterTowerModel.waterTower.TANK_VOLUME ) {
        waterTowerModel.tankFullLevelDuration = 1;
        if ( !isPlaying ) {
          // disable the fill button if the tank is full and switching from play to pause
          waterTowerNode.fillButton.enabled = false;
        }
      }
    } );
    toolsLayer.moveToFront();

  }

  return inherit( ScreenView, WaterTowerView, {
    step: function( dt ) {
      this.waterTowerDropsLayer.step( dt );
      this.hoseDropsLayer.step( dt );
      this.faucetDropsLayer.step( dt );
    }
  } );
} );