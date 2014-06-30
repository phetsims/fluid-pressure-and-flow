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
  var OutsideBackgroundNode = require( 'SCENERY_PHET/OutsideBackgroundNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

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
  var VelocitySensorNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/VelocitySensorNode' );

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

    // Please note that this is to help line up elements in the play area, and some user interface components from the Sun repo will
    // be much bigger to make the sims usable on tablets.
    // Also note, the sky and ground should extend to the sides of the browser window.  Please use OutsideBackgroundNode for this.

    var textOptions = {font: new PhetFont( 14 )};

    //Invert the y-axis, so that y grows up.
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, this.layoutBounds.maxY ),
      70 ); //1m = 70px, (0,0) - top left corner

    // add background -- sky, earth

    this.addChild( new OutsideBackgroundNode( this.layoutBounds.centerX, this.layoutBounds.centerY + 100, this.layoutBounds.width * 3, this.layoutBounds.height, this.layoutBounds.height ) );

    var waterTowerView = new WaterTowerView( waterTowerModel.waterTower, modelViewTransform, { left: this.layoutBounds.left + 50, top: this.layoutBounds.top + 90} );
    this.addChild( waterTowerView );

    this.addChild( new FaucetNode( 1, waterTowerModel.faucetFlowRateProperty, waterTowerModel.isFaucetEnabledProperty, {
      horizontalPipeLength: 1000,
      right: waterTowerView.left + 40,
      top: this.layoutBounds.top + inset,
      scale: 0.3 //size of the faucet
    } ) );

    // control panel
    this.controlPanel = new ControlPanel( waterTowerModel, {right: this.layoutBounds.right - inset, top: inset} );
    this.addChild( this.controlPanel );
    this.addChild( new UnitsControlPanel( waterTowerModel, {left: this.controlPanel.left, top: this.controlPanel.bottom + inset} ) );

    // add reset button near the bottom right
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        waterTowerModel.reset();
        waterTowerView.y = 100;
      },
      right: this.layoutBounds.right - 2 * inset,
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
    var sluiceControl = new SluiceControl( waterTowerModel, { left: this.layoutBounds.left, bottom: this.layoutBounds.bottom - 70} );
    this.addChild( sluiceControl );

    //add the normal/slow motion options
    var normalOption = new AquaRadioButton( waterTowerModel.waterSpeedProperty, normalString, new Text( normalString, textOptions ), {radius: 6, y: this.layoutBounds.bottom - 2 * inset, x: sluiceControl.right + 3 * inset} );
    this.addChild( normalOption );
    this.addChild( new AquaRadioButton( waterTowerModel.waterSpeedProperty, slowMotionString, new Text( slowMotionString, textOptions ), {radius: 6, x: sluiceControl.right + 3 * inset, y: normalOption.y - 2 * inset} ) );

    // add play pause button and step button
    var playPauseButton = new PlayPauseButton( waterTowerModel.isPlayProperty, { stroke: 'black', fill: '#005566', bottom: normalOption.bottom, right: (normalOption.right + controlSlider.left) / 2 } );
    this.addChild( playPauseButton );
    this.addChild( new StepButton( function() {}, waterTowerModel.isPlayProperty, { stroke: 'black', fill: '#005566', left: playPauseButton.right + inset, y: playPauseButton.centerY} ) );

    //Add the sensors panel
    var sensorPanel = new Rectangle( 0, 0, 180, 90, 10, 10, {stroke: 'gray', lineWidth: 1, fill: '#f2fa6a', right: this.controlPanel.left - inset, top: this.controlPanel.top} );
    this.addChild( sensorPanel );

    //Add barometers within the sensor panel bounds
    _.each( waterTowerModel.barometers, function( barometer ) {
      barometer.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX + 50, sensorPanel.visibleBounds.centerY - 15 ) );
      barometer.reset();
      this.addChild( new BarometerNode( waterTowerModel, modelViewTransform, barometer, sensorPanel.visibleBounds, this.layoutBounds ) );
    }.bind( this ) );

    //Add speedometers within the sensor panel bounds
    _.each( waterTowerModel.speedometers, function( velocitySensor ) {
      velocitySensor.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX - 70, sensorPanel.visibleBounds.centerY - 40 ) );
      velocitySensor.positionProperty.reset();
      this.addChild( new VelocitySensorNode( waterTowerModel, modelViewTransform, velocitySensor, sensorPanel.visibleBounds, this.layoutBounds ) );
    }.bind( this ) );

    this.addChild( new WaterTowerRuler( waterTowerModel.isRulerVisibleProperty, waterTowerModel.rulerPositionProperty, waterTowerModel.measureUnitsProperty, modelViewTransform, this.layoutBounds ) );
    this.addChild( new MeasuringTape( waterTowerModel, modelViewTransform, this.layoutBounds, {x: 10, y: 100} ) );

    waterTowerModel.faucetDrops.addItemAddedListener( function( waterDrop ) {
      var waterDropNode = new WaterDropNode( waterDrop, modelViewTransform );
      waterTowerScreenView.addChild( waterDropNode );
      waterDrop.node = waterDropNode;
    } );

    waterTowerModel.faucetDrops.addItemRemovedListener( function( removedDrop ) {
      waterTowerScreenView.removeChild( removedDrop.node );
    } );
  }

  return inherit( ScreenView, WaterTowerScreenView );
} );