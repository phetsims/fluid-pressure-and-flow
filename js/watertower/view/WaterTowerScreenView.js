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
  var VelocitySensorNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/VelocitySensorNode' );

  //strings
  var fluidDensityString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidDensity' );
  var gasolineString = require( 'string!FLUID_PRESSURE_AND_FLOW/gasoline' );
  var waterString = require( 'string!FLUID_PRESSURE_AND_FLOW/water' );
  var honeyString = require( 'string!FLUID_PRESSURE_AND_FLOW/honey' );
  var normalString = require( 'string!FLUID_PRESSURE_AND_FLOW/normal' );
  var slowMotionString = require( 'string!FLUID_PRESSURE_AND_FLOW/slowMotion' );

  /**
   * @param {WaterTowerModel} model
   * @constructor
   */
  function WaterTowerScreenView( model ) {
    ScreenView.call( this, {renderer: 'svg'} );

    // Please note that this is to help line up elements in the play area, and some user interface components from the Sun repo will
    // be much bigger to make the sims usable on tablets.
    // Also note, the sky and ground should extend to the sides of the browser window.  Please use OutsideBackgroundNode for this.

    var textOptions = {font: new PhetFont( 14 )};

    //TODO: Invert the y-axis, so that y grows up.
    var mvt = ModelViewTransform2.createSinglePointScaleMapping(
      Vector2.ZERO,
      Vector2.ZERO,
      70 ); //1m = 70px, (0,0) - top left corner

    this.addChild( new FaucetNode( 1, model.faucetFlowRateProperty, model.isFaucetEnabledProperty, {
      horizontalPipeLength: 1000,
      x: 0,
      y: 100,
      scale: 0.4 //size of the faucet
    } ) );

    //control panel
    this.controlPanel = new ControlPanel( model, {right: this.layoutBounds.right - 10, top: 10} );
    this.addChild( this.controlPanel );

    this.addChild( new UnitsControlPanel( model, {left: this.controlPanel.left, top: this.controlPanel.bottom + 10} ) );

    //control slider
    this.addChild( new ControlSlider( model, model.fluidDensityProperty, model.getFluidDensityString.bind( model ), model.fluidDensityRange, {
      x: 495,
      bottom: this.layoutBounds.bottom - 10,
      title: fluidDensityString,
      ticks: [
        {
          title: waterString,
          value: 1000
        },
        {
          title: gasolineString,
          value: model.fluidDensityRange.min
        },
        {
          title: honeyString,
          value: model.fluidDensityRange.max
        }
      ]
    } ) );

    model.isPlayProperty.link( function( data ) {
      // TODO;
    } );

    this.addChild( new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      scale: 0.66, x: 705, y: 450
    } ) );

    //adding radio button and play pause button at bottom of the page
    this.addChild( new AquaRadioButton( model.waterSpeedProperty, slowMotionString, new Text( slowMotionString, textOptions ), {radius: 8, x: 250, y: 430} ) );
    this.addChild( new AquaRadioButton( model.waterSpeedProperty, normalString, new Text( normalString, textOptions ), {radius: 8, x: 250, y: 450} ) );
    var playPauseButton = new PlayPauseButton( model.isPlayProperty, { stroke: 'black', fill: '#005566', x: 400, y: 440} );
    this.addChild( playPauseButton );
    this.addChild( new StepButton( function() {}, model.isPlayProperty, { stroke: 'black', fill: '#005566', left: playPauseButton.right + 10, y: 440} ) );

    //Add the sensors panel
    var sensorPanel = new Rectangle( 0, 0, 180, 90, 10, 10, {stroke: 'gray', lineWidth: 1, fill: '#f2fa6a', right: this.controlPanel.left - 10, top: this.controlPanel.top} );
    this.addChild( sensorPanel );

    //Add barometers within the sensor panel bounds
    _.each( model.barometers, function( barometer ) {
      barometer.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX + 50, sensorPanel.visibleBounds.centerY - 15 ) );
      barometer.reset();
      this.addChild( new BarometerNode( model, mvt, barometer, sensorPanel.visibleBounds, this.layoutBounds ) );
    }.bind( this ) );

    //Add speedometers within the sensor panel bounds
    _.each( model.speedometers, function( velocitySensor ) {
      velocitySensor.positionProperty.storeInitialValue( new Vector2( sensorPanel.visibleBounds.centerX - 70, sensorPanel.visibleBounds.centerY - 40 ) );
      velocitySensor.positionProperty.reset();
      this.addChild( new VelocitySensorNode( model, mvt, velocitySensor, sensorPanel.visibleBounds, this.layoutBounds ) );
    }.bind( this ) );

    this.addChild( new WaterTowerRuler( model.isRulerVisibleProperty, model.rulerPositionProperty, model.measureUnitsProperty, mvt, this.layoutBounds ) );
    this.addChild( new MeasuringTape( model, mvt, this.layoutBounds, {x: 10, y: 100} ) );

    var waterTowerView = new WaterTowerView( model.waterTower, { x: 0, y: 100} );
    this.addChild( waterTowerView );
    waterTowerView.moveToBack();

    this.addChild( new SluiceControl( model ) );

    // add background -- sky, earth
    var backgroundNode = new OutsideBackgroundNode( this.layoutBounds.centerX, this.layoutBounds.centerY + 100, this.layoutBounds.width * 3, this.layoutBounds.height, this.layoutBounds.height );
    this.addChild( backgroundNode );
    backgroundNode.moveToBack();

  }

  return inherit( ScreenView, WaterTowerScreenView );
} );