// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view of the sim.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var BackgroundNode = require( 'UNDER_PRESSURE/common/view/BackgroundNode' );
  var ScreenView = require( 'JOIST/ScreenView' );

  var UnderPressureRuler = require( 'UNDER_PRESSURE/common/view/UnderPressureRuler' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ControlPanel = require( 'UNDER_PRESSURE/common/view/ControlPanel' );
  var UnitsControlPanel = require( 'UNDER_PRESSURE/common/view/UnitsControlPanel' );
  var ControlSlider = require( 'UNDER_PRESSURE/common/view/ControlSlider' );
  var SceneChoiceNode = require( 'UNDER_PRESSURE/common/view/SceneChoiceNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var BarometerNode = require( 'UNDER_PRESSURE/common/view/BarometerNode' );

  var fluidDensityString = require( 'string!UNDER_PRESSURE/fluidDensity' );
  var gravityString = require( 'string!UNDER_PRESSURE/gravity' );
  var EarthString = require( 'string!UNDER_PRESSURE/earth' );
  var MarsString = require( 'string!UNDER_PRESSURE/mars' );
  var JupiterString = require( 'string!UNDER_PRESSURE/jupiter' );
  var GasolineString = require( 'string!UNDER_PRESSURE/gasoline' );
  var WaterString = require( 'string!UNDER_PRESSURE/water' );
  var HoneyString = require( 'string!UNDER_PRESSURE/honey' );

  var SceneView = {
    SquarePoolView: require( 'UNDER_PRESSURE/square-pool/view/SquarePoolView' ),
    TrapezoidPoolView: require( 'UNDER_PRESSURE/trapezoid-pool/view/TrapezoidPoolView' ),
    ChamberPoolView: require( 'UNDER_PRESSURE/chamber-pool/view/ChamberPoolView' ),
    MysteryPoolView: require( 'UNDER_PRESSURE/mystery-pool/view/MysteryPoolView' )
  };

  //View layout related constants
  var inset = 10;

  function UnderPressureView( underPressureModel ) {
    var self = this;
    ScreenView.call( this, { renderer: 'svg', layoutBounds: new Bounds2( 0, 0, underPressureModel.width, underPressureModel.height )} );

    var modelViewTransform = ModelViewTransform2.createSinglePointScaleMapping(
      Vector2.ZERO,
      Vector2.ZERO,
      70 ); //1m = 70px, (0,0) - top left corner

    //sky, earth and controls
    var backgroundNode = new BackgroundNode( underPressureModel, modelViewTransform );
    this.addChild( backgroundNode );
    backgroundNode.moveToBack();

    var scenes = {};
    underPressureModel.scenes.forEach( function( name ) {
      scenes[name] = new SceneView[name + 'PoolView']( underPressureModel.sceneModels[name], modelViewTransform, self.layoutBounds );
      scenes[name].visible = false;
      self.addChild( scenes[name] );
    } );

    // add reset button
    this.resetAllButton = new ResetAllButton( {
      listener: function() {
        underPressureModel.reset();
      },
      scale: 0.66,
      right: this.layoutBounds.right - inset,
      bottom: this.layoutBounds.bottom - inset
    } );
    this.addChild( this.resetAllButton );


    //control panel
    this.controlPanel = new ControlPanel( underPressureModel, { right: this.resetAllButton.right, top: inset} );
    this.addChild( this.controlPanel );


    this.unitsControlPanel = new UnitsControlPanel( underPressureModel.measureUnitsProperty, this.controlPanel.width, { right: this.resetAllButton.right, top: this.controlPanel.bottom + 5} );
    this.addChild( this.unitsControlPanel );

    // gravity slider
    this.gravitySlider = new ControlSlider( underPressureModel.measureUnitsProperty, underPressureModel.gravityProperty, underPressureModel.getGravityString.bind( underPressureModel ), underPressureModel.gravityRange, underPressureModel.gravityControlExpandedProperty, {

      right: this.resetAllButton.right,
      bottom: this.resetAllButton.top - 5,

      title: gravityString,
      decimals: 1,
      ticks: [
        {
          title: EarthString,
          value: 9.8
        },
        {
          title: MarsString,
          value: underPressureModel.gravityRange.min
        },
        {
          title: JupiterString,
          value: underPressureModel.gravityRange.max
        }
      ]
    } );
    this.addChild( this.gravitySlider );

    // fluid density slider
    this.fluidDensitySlider = new ControlSlider( underPressureModel.measureUnitsProperty, underPressureModel.fluidDensityProperty, underPressureModel.getFluidDensityString.bind( underPressureModel ), underPressureModel.fluidDensityRange, underPressureModel.fluidDensityControlExpandedProperty, {

      right: this.resetAllButton.right,
      bottom: this.gravitySlider.top - 5,

      title: fluidDensityString,
      ticks: [
        {
          title: WaterString,
          value: 1000
        },
        {
          title: GasolineString,
          value: underPressureModel.fluidDensityRange.min
        },
        {
          title: HoneyString,
          value: underPressureModel.fluidDensityRange.max
        }
      ]
    } );
    this.addChild( this.fluidDensitySlider );

    underPressureModel.mysteryChoiceProperty.link( function( choice, oldChoice ) {
      if ( underPressureModel.currentScene === 'Mystery' ) {
        self[choice + 'Slider'].disable();
        if ( oldChoice ) {
          self[oldChoice + 'Slider'].enable();
        }
      }
    } );

    underPressureModel.currentSceneProperty.link( function( currentScene ) {
      if ( currentScene === 'Mystery' ) {
        self[underPressureModel.mysteryChoice + 'Slider'].disable();
      }
      else {
        self.gravitySlider.enable();
        self.fluidDensitySlider.enable();
      }
    } );


    this.addChild( new SceneChoiceNode( underPressureModel, 0, 260 ) );

    //resize control panels
    // todo: fix this maxWidth calculation
    var panels = [this.controlPanel, scenes.Mystery.mysteryPoolControls.choicePanel],
      maxWidth = 0;
    panels.forEach( function( panel ) {
      maxWidth = Math.max( maxWidth, panel.width / panel.transform.matrix.scaleVector.x );
    } );
    scenes.Mystery.mysteryPoolControls.choicePanel.resizeWidth( maxWidth );

    panels.forEach( function( panel ) {
      panel.right = self.gravitySlider.right;
    } );


    underPressureModel.currentSceneProperty.link( function( value, oldValue ) {
      scenes[value].visible = true;
      if ( oldValue ) {
        scenes[oldValue].visible = false;
      }
    } );

    this.addChild( new UnderPressureRuler( underPressureModel, modelViewTransform, self.layoutBounds ) );

    // add the sensors panel
    var sensorPanel = new Rectangle( 0, 0, 100, 130, 10, 10, {stroke: 'gray', lineWidth: 1, fill: '#f2fa6a', right: this.controlPanel.left - 20, top: this.controlPanel.top} );
    this.addChild( sensorPanel );

    // add barometers within the sensor panel bounds
    _.each( underPressureModel.barometers, function( barometer ) {
      barometer.position.storeInitialValue( new Vector2( sensorPanel.centerX, sensorPanel.centerY - 15 ) );
      barometer.position.reset();
      self.addChild( new BarometerNode( underPressureModel, modelViewTransform, barometer.value, barometer.position, sensorPanel.visibleBounds, self.layoutBounds ) );
    } );

  }

  return inherit( ScreenView, UnderPressureView );
} );