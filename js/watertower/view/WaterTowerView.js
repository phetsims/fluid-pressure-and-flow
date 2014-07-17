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
  var VBox = require( 'SCENERY/nodes/VBox' );

  var PlayPauseButton = require( 'SCENERY_PHET/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/StepButton' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );

  var BarometerNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/BarometerNode' );
  var ControlSlider = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/ControlSlider' );
  var ToolsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/ToolsControlPanel' );
  var MeasuringTape = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/MeasuringTape' );
  var SluiceControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/SluiceControlPanel' );
  var UnitsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/UnitsControlPanel' );
  var WaterTowerRuler = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerRuler' );
  var WaterTowerNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerNode' );
  var WaterDropNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterDropNode' );
  var HoseNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/HoseNode' );
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
  function WaterTowerView( waterTowerModel ) {
    var waterTowerScreenView = this;
    ScreenView.call( this, {renderer: 'svg'} );

    var textOptions = {font: new PhetFont( 14 )};

    // Invert the y-axis, so that y grows up.
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, 350 ),
      70 ); //1m = 70px, (0,0) - top left corner

    var groundY = modelViewTransform.modelToViewY( 0 ) - 6;

    // TODO: find a way to not do this
    waterTowerModel.modelViewTransform = modelViewTransform;

    // add background -- sky
    this.addChild( new SkyNode( -1000, 0, 2000, groundY, groundY ) );

    var hoseDropsLayer = new Node();
    waterTowerScreenView.addChild( hoseDropsLayer );

    var waterTowerDropsLayer = new Node();
    waterTowerScreenView.addChild( waterTowerDropsLayer );

    // add background -- earth
    this.addChild( new GroundNode( -1000, groundY, 2000, this.layoutBounds.height - groundY, this.layoutBounds.height ) );

    // add the hose
    this.hoseNode = new HoseNode( waterTowerModel.hose, waterTowerModel.waterTower.tankPositionProperty, modelViewTransform, waterTowerModel.isHoseVisibleProperty );
    this.addChild( this.hoseNode );

    var waterTowerNode = new WaterTowerNode( waterTowerModel.waterTower, waterTowerModel.fluidColorModel, modelViewTransform, this.hoseNode );
    this.addChild( waterTowerNode );

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

    // tools control panel
    this.toolsControlPanel = new ToolsControlPanel( waterTowerModel, {right: this.layoutBounds.right - inset, top: inset} );
    this.addChild( this.toolsControlPanel );
    this.addChild( new UnitsControlPanel( waterTowerModel.measureUnitsProperty, this.toolsControlPanel.width, {left: this.toolsControlPanel.left, top: this.toolsControlPanel.bottom + inset} ) );

    // add reset button near the bottom right
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        waterTowerModel.reset();
        controlSlider.reset();
        waterTowerScreenView.hoseNode.reset();
      },
      right: this.layoutBounds.right - inset,
      bottom: this.layoutBounds.bottom - inset
    } );
    this.addChild( resetAllButton );

    // add the fluid density control slider
    var controlSlider = new ControlSlider( waterTowerModel, waterTowerModel.fluidDensityProperty, waterTowerModel.getFluidDensityString.bind( waterTowerModel ), waterTowerModel.fluidDensityRange, {
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
    this.addChild( controlSlider );

    // add the sluice control near bottom left
    var sluiceControlPanel = new SluiceControlPanel( waterTowerModel.isSluiceOpenProperty, { xMargin: 10, yMargin: 15, fill: '#1F5EFF', right: waterTowerNode.right + 36, bottom: this.layoutBounds.bottom - 70} );
    this.addChild( sluiceControlPanel );

    // add play pause button and step button
    var stepButton = new StepButton( function() {
      waterTowerModel.stepInternal( 0.016 );
    }, waterTowerModel.isPlayProperty, { stroke: 'black', fill: '#005566', right: controlSlider.left - inset, bottom: controlSlider.bottom - inset} );

    this.addChild( stepButton );

    var playPauseButton = new PlayPauseButton( waterTowerModel.isPlayProperty, { stroke: 'black', fill: '#005566', y: stepButton.centerY, right: stepButton.left - inset } );
    this.addChild( playPauseButton );

    var speedControl = new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        new AquaRadioButton( waterTowerModel.speedProperty, 'normal', new Text( normalString, textOptions ), {radius: 6} ),
        new AquaRadioButton( waterTowerModel.speedProperty, 'slow', new Text( slowMotionString, textOptions ), {radius: 6} )
      ]} );

    this.addChild( speedControl.mutate( {right: playPauseButton.left - inset, bottom: playPauseButton.bottom} ) );

    // add the sensors panel
    var sensorPanel = new Rectangle( 0, 0, 190, 105, 10, 10, {stroke: 'gray', lineWidth: 1, fill: '#f2fa6a', right: this.toolsControlPanel.left - inset, top: this.toolsControlPanel.top} );
    this.addChild( sensorPanel );

    // add barometers within the sensor panel bounds
    _.each( waterTowerModel.barometers, function( barometer ) {
      barometer.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX + 55, sensorPanel.visibleBounds.centerY - 15 ) );
      barometer.reset();
      this.addChild( new BarometerNode( waterTowerModel, modelViewTransform, barometer, sensorPanel.visibleBounds, this.layoutBounds ) );
    }.bind( this ) );

    // add speedometers within the sensor panel bounds
    _.each( waterTowerModel.speedometers, function( velocitySensor ) {
      velocitySensor.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX - 85, sensorPanel.visibleBounds.centerY - 35 ) );
      velocitySensor.positionProperty.reset();
      this.addChild( new VelocitySensorNode( waterTowerModel, modelViewTransform, velocitySensor, sensorPanel.visibleBounds, this.layoutBounds ) );
    }.bind( this ) );

    this.addChild( new WaterTowerRuler( waterTowerModel.isRulerVisibleProperty, waterTowerModel.rulerPositionProperty, waterTowerModel.measureUnitsProperty, modelViewTransform, this.layoutBounds ) );
    this.addChild( new MeasuringTape( waterTowerModel ) );

    // add a waterdrop node to the view when a waterdrop is added to faucetdrops
    waterTowerModel.faucetDrops.addItemAddedListener( function( waterDrop ) {
      var waterDropNode = new WaterDropNode( waterDrop, waterTowerModel.fluidColorModel, modelViewTransform );
      faucetDropsLayer.addChild( waterDropNode );
      waterDrop.node = waterDropNode;
    } );

    // remove the waterdrop node linked to the faucet drop that was removed from faucetdrops
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
        waterTowerNode.sluiceGate.bottom = waterTowerNode.waterTankFrame.bottom + modelViewTransform.modelToViewDeltaY( waterTowerNode.waterTower.HOLE_SIZE );
      }
      else {
        waterTowerNode.sluiceGate.bottom = waterTowerNode.waterTankFrame.bottom;
      }
    } );

    waterTowerModel.waterTower.fluidVolumeProperty.link( function( fluidVolume ) {
      if ( waterTowerModel.isSluiceOpen && waterTowerModel.faucetMode === 'matchLeakage' ) {
        // Disable the fill button if the tank is nearly full in match leakage mode to prevent fill button flickering.
        // See https://github.com/phetsims/fluid-pressure-and-flow/issues/44
        waterTowerNode.fillButton.enabled = fluidVolume < 0.99 * waterTowerModel.waterTower.TANK_VOLUME;
      }
      else {
        waterTowerNode.fillButton.enabled = (fluidVolume < waterTowerModel.waterTower.TANK_VOLUME);
      }
    } );

  }

  return inherit( ScreenView, WaterTowerView );
} );