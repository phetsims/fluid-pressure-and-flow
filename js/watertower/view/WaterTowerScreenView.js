//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Water Tower' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var SkyNode = require( 'SCENERY_PHET/SkyNode' );
  var GroundNode = require( 'SCENERY_PHET/GroundNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );

  var PlayPauseButton = require( 'SCENERY_PHET/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/StepButton' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );

  var BarometerNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/BarometerNode' );
  var ControlSlider = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/ControlSlider' );
  var ControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/ControlPanel' );
  var MeasuringTape = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/MeasuringTape' );
  var SluiceControl = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/SluiceControl' );
  var UnitsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/UnitsControlPanel' );
  var WaterTowerRuler = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerRuler' );
  var WaterTowerView = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerView' );
  var WaterDropNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterDropNode' );
  var HoseView = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/HoseView' );
  var VelocitySensorNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/VelocitySensorNode' );
  var FaucetControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/FaucetControlPanel' );

  //strings
  var fluidDensityString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidDensity' );
  var gasolineString = require( 'string!FLUID_PRESSURE_AND_FLOW/gasoline' );
  var waterString = require( 'string!FLUID_PRESSURE_AND_FLOW/water' );
  var honeyString = require( 'string!FLUID_PRESSURE_AND_FLOW/honey' );
  var normalString = require( 'string!FLUID_PRESSURE_AND_FLOW/normal' );
  var slowMotionString = require( 'string!FLUID_PRESSURE_AND_FLOW/slowMotion' );

  //View layout related constants
  var inset = 10;

  /**
   * @param {WaterTowerModel} waterTowerModel
   * @constructor
   */
  function WaterTowerScreenView( waterTowerModel ) {
    var waterTowerScreenView = this;
    ScreenView.call( this, {renderer: 'svg'} );

    var textOptions = {font: new PhetFont( 14 )};

    //Invert the y-axis, so that y grows up.
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, 350 ),
      70 ); //1m = 70px, (0,0) - top left corner

    var groundY = modelViewTransform.modelToViewY( 0 ) - 6;

    // TODO: find a way to not do this
    waterTowerModel.modelViewTransform = modelViewTransform;

    // add background -- sky
    this.addChild( new SkyNode( this.layoutBounds.centerX - ((this.layoutBounds.width * 3) / 2), (groundY - this.layoutBounds.height), this.layoutBounds.width * 3, this.layoutBounds.height, this.layoutBounds.height, {skyGradientHeight: this.layoutBounds.height / 2} ) );

    var hoseDropsLayer = new Node();
    waterTowerScreenView.addChild( hoseDropsLayer );

    var waterTowerDropsLayer = new Node();
    waterTowerScreenView.addChild( waterTowerDropsLayer );

    // add background -- earth
    this.addChild( new GroundNode( this.layoutBounds.centerX - ( (this.layoutBounds.width * 3) / 2), groundY, this.layoutBounds.width * 3, this.layoutBounds.height, groundY + (this.layoutBounds.height / 2) ) );

    // add the hose
    this.hoseView = new HoseView( waterTowerModel.hose, waterTowerModel.waterTower.tankPositionProperty, modelViewTransform, waterTowerModel.isHoseVisibleProperty );
    this.addChild( this.hoseView );

    var waterTowerView = new WaterTowerView( waterTowerModel.waterTower, waterTowerModel.fluidColorModel, modelViewTransform, this.hoseView );
    this.addChild( waterTowerView );

    var faucetDropsLayer = new Node();
    waterTowerScreenView.addChild( faucetDropsLayer );


    var faucetNode = new FaucetNode( 0.6, waterTowerModel.faucetFlowRateProperty, waterTowerModel.isFaucetEnabledProperty, {
      horizontalPipeLength: 1000,
      right: modelViewTransform.modelToViewX( waterTowerModel.faucetPosition.x ) + 20,
      top: this.layoutBounds.top + inset,
      scale: 0.3, //size of the faucet,
      closeOnRelease: false
    } );
    this.addChild( faucetNode );

    this.addChild( new FaucetControlPanel( waterTowerModel.faucetModeProperty, { left: faucetNode.right + inset, bottom: faucetNode.bottom, fill: 'green'} ) );

    // control panel
    this.controlPanel = new ControlPanel( waterTowerModel, {right: this.layoutBounds.right - inset, top: inset} );
    this.addChild( this.controlPanel );
    this.addChild( new UnitsControlPanel( waterTowerModel, {left: this.controlPanel.left, top: this.controlPanel.bottom + inset} ) );

    // add reset button near the bottom right
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        waterTowerModel.reset();
        controlSlider.reset();
        waterTowerScreenView.hoseView.reset();
      },
      right: this.layoutBounds.right - inset,
      bottom: this.layoutBounds.bottom - inset
    } );
    this.addChild( resetAllButton );

    //add the fluid density control slider
    var controlSlider = new ControlSlider( waterTowerModel, waterTowerModel.fluidDensityProperty, waterTowerModel.getFluidDensityString.bind( waterTowerModel ), waterTowerModel.fluidDensityRange, {
      right: resetAllButton.left - 4 * inset,
      bottom: this.layoutBounds.bottom - inset,
      title: fluidDensityString,
      ticks: [
        {
          title: waterString,
          value: 1000
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
    this.addChild( controlSlider );

    // add the sluice control near bottom left
    var sluiceControl = new SluiceControl( waterTowerModel.isSluiceOpenProperty, { right: waterTowerView.right + 36, bottom: this.layoutBounds.bottom - 70} );
    this.addChild( sluiceControl );

    //add the normal/slow motion options
    var normalOption = new AquaRadioButton( waterTowerModel.speedProperty, "normal", new Text( normalString, textOptions ), {radius: 6, y: this.layoutBounds.bottom - 2 * inset, x: sluiceControl.right + 3 * inset} );
    this.addChild( normalOption );
    this.addChild( new AquaRadioButton( waterTowerModel.speedProperty, "slow", new Text( slowMotionString, textOptions ), {radius: 6, x: sluiceControl.right + 3 * inset, y: normalOption.y - 2 * inset} ) );

    // add play pause button and step button
    var playPauseButton = new PlayPauseButton( waterTowerModel.isPlayProperty, { stroke: 'black', fill: '#005566', bottom: normalOption.bottom, right: (normalOption.right + controlSlider.left) / 2 } );
    this.addChild( playPauseButton );
    this.addChild( new StepButton( function() {
      waterTowerModel.stepInternal( 0.016 );
    }, waterTowerModel.isPlayProperty, { stroke: 'black', fill: '#005566', left: playPauseButton.right + inset, y: playPauseButton.centerY} ) );

    //Add the sensors panel
    var sensorPanel = new Rectangle( 0, 0, 190, 105, 10, 10, {stroke: 'gray', lineWidth: 1, fill: '#f2fa6a', right: this.controlPanel.left - inset, top: this.controlPanel.top} );
    this.addChild( sensorPanel );

    //Add barometers within the sensor panel bounds
    _.each( waterTowerModel.barometers, function( barometer ) {
      barometer.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX + 55, sensorPanel.visibleBounds.centerY - 15 ) );
      barometer.reset();
      this.addChild( new BarometerNode( waterTowerModel, modelViewTransform, barometer, sensorPanel.visibleBounds, this.layoutBounds ) );
    }.bind( this ) );

    //Add speedometers within the sensor panel bounds
    _.each( waterTowerModel.speedometers, function( velocitySensor ) {
      velocitySensor.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX - 85, sensorPanel.visibleBounds.centerY - 35 ) );
      velocitySensor.positionProperty.reset();
      this.addChild( new VelocitySensorNode( waterTowerModel, modelViewTransform, velocitySensor, sensorPanel.visibleBounds, this.layoutBounds ) );
    }.bind( this ) );

    this.addChild( new WaterTowerRuler( waterTowerModel.isRulerVisibleProperty, waterTowerModel.rulerPositionProperty, waterTowerModel.measureUnitsProperty, modelViewTransform, this.layoutBounds ) );
    this.addChild( new MeasuringTape( waterTowerModel ) );

    waterTowerModel.faucetDrops.addItemAddedListener( function( waterDrop ) {
      var waterDropNode = new WaterDropNode( waterDrop, waterTowerModel.fluidColorModel, modelViewTransform );
      faucetDropsLayer.addChild( waterDropNode );
      waterDrop.node = waterDropNode;
    } );

    waterTowerModel.faucetDrops.addItemRemovedListener( function( removedDrop ) {
      faucetDropsLayer.removeChild( removedDrop.node );
    } );

    waterTowerModel.waterTowerDrops.addItemAddedListener( function( waterDrop ) {
      var waterDropNode = new WaterDropNode( waterDrop, waterTowerModel.fluidColorModel, modelViewTransform );
      waterTowerDropsLayer.addChild( waterDropNode );
      waterDrop.node = waterDropNode;
    } );

    waterTowerModel.waterTowerDrops.addItemRemovedListener( function( removedDrop ) {
      waterTowerDropsLayer.removeChild( removedDrop.node );
    } );

    //For waterDrops from hose
    waterTowerModel.hoseDrops.addItemAddedListener( function( waterDrop ) {
      var waterDropNode = new WaterDropNode( waterDrop, waterTowerModel.fluidColorModel, modelViewTransform );
      hoseDropsLayer.addChild( waterDropNode );
      waterDrop.node = waterDropNode;
    } );

    waterTowerModel.hoseDrops.addItemRemovedListener( function( removedDrop ) {
      hoseDropsLayer.removeChild( removedDrop.node );
    } );

    waterTowerModel.isSluiceOpenProperty.link( function( isSluiceOpen ) {
      if ( isSluiceOpen ) {
        waterTowerView.sluiceGate.bottom = waterTowerView.waterTankFrame.bottom + modelViewTransform.modelToViewDeltaY( waterTowerView.waterTower.HOLE_SIZE );
      }
      else {
        waterTowerView.sluiceGate.bottom = waterTowerView.waterTankFrame.bottom;
      }
    } );

    waterTowerModel.waterTower.fluidVolumeProperty.link( function( fluidVolume ) {
      if ( waterTowerModel.isSluiceOpen && waterTowerModel.faucetMode === 'matchLeakage' ) {
        // Disable the fill button if the tank is nearly full in match leakage mode to prevent fill button flickering.
        // See https://github.com/phetsims/fluid-pressure-and-flow/issues/44
        waterTowerView.fillButton.enabled = fluidVolume < 0.99 * waterTowerModel.waterTower.TANK_VOLUME;
      }
      else {
        waterTowerView.fillButton.enabled = (fluidVolume < waterTowerModel.waterTower.TANK_VOLUME);
      }
    } );

  }

  return inherit( ScreenView, WaterTowerScreenView );
} );