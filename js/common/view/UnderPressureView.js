// Copyright 2002-2013, University of Colorado Boulder

/**
 *  Main view for the under-pressure sim. The view contains 4 scenes: square pool, chamber pool, trapezoid and a
 *  mystery pool. There is a scene selector to switch between the views. There are panels to control the fluid density
 *  and gravity and tools to measure pressure and length. Supports viewing values in english, metric or atmosphere units.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts).
 */
define( function( require ) {
  'use strict';

  // modules
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
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var BarometerNode = require( 'UNDER_PRESSURE/common/view/BarometerNode' );
  var Constants = require( 'UNDER_PRESSURE/common/Constants' );
  var SquarePoolView = require( 'UNDER_PRESSURE/square-pool/view/SquarePoolView' );
  var TrapezoidPoolView = require( 'UNDER_PRESSURE/trapezoid-pool/view/TrapezoidPoolView' );
  var ChamberPoolView = require( 'UNDER_PRESSURE/chamber-pool/view/ChamberPoolView' );
  var MysteryPoolView = require( 'UNDER_PRESSURE/mystery-pool/view/MysteryPoolView' );

  // strings
  var fluidDensityString = require( 'string!UNDER_PRESSURE/fluidDensity' );
  var gravityString = require( 'string!UNDER_PRESSURE/gravity' );
  var EarthString = require( 'string!UNDER_PRESSURE/earth' );
  var MarsString = require( 'string!UNDER_PRESSURE/mars' );
  var JupiterString = require( 'string!UNDER_PRESSURE/jupiter' );
  var GasolineString = require( 'string!UNDER_PRESSURE/gasoline' );
  var WaterString = require( 'string!UNDER_PRESSURE/water' );
  var HoneyString = require( 'string!UNDER_PRESSURE/honey' );

  var SceneView = {
    Square: SquarePoolView,
    Trapezoid: TrapezoidPoolView,
    Chamber: ChamberPoolView,
    Mystery: MysteryPoolView
  };

  //View layout related constants
  var inset = 15;

  /**
   * @param {UnderPressureModel} underPressureModel of the sim
   * @constructor
   */
  function UnderPressureView( underPressureModel ) {

    var underPressureView = this;
    ScreenView.call( this, { renderer: 'svg', layoutBounds: new Bounds2( 0, 0, underPressureModel.width,
      underPressureModel.height )} );

    var modelViewTransform = ModelViewTransform2.createSinglePointScaleMapping(
      Vector2.ZERO,
      Vector2.ZERO,
      70 ); //1m = 70px, (0,0) - top left corner

    //sky, earth and controls
    var backgroundNode = new BackgroundNode( underPressureModel, modelViewTransform );
    this.addChild( backgroundNode );
    backgroundNode.moveToBack();

    // add reset button
    this.resetAllButton = new ResetAllButton( {
      listener: function() {
        underPressureModel.reset();
      },
      scale: 0.6,
      right: this.layoutBounds.right - inset,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( this.resetAllButton );

    //control panel
    this.controlPanel =
    new ControlPanel( underPressureModel, { right: this.resetAllButton.right, top: 5, cornerRadius: 7 } );
    this.addChild( this.controlPanel );

    // units panel
    this.unitsControlPanel = new UnitsControlPanel( underPressureModel.measureUnitsProperty, this.controlPanel.width,
      {  yMargin: 2, right: this.resetAllButton.right, top: this.controlPanel.bottom +
                                                            6, cornerRadius: 7 } );
    this.addChild( this.unitsControlPanel );

    // gravity slider
    this.gravitySlider = new ControlSlider(
      underPressureModel.measureUnitsProperty,
      underPressureModel.gravityProperty,
      underPressureModel.getGravityString.bind( underPressureModel ),
      underPressureModel.gravityRange,
      underPressureModel.gravityControlExpandedProperty,
      {
        right: this.resetAllButton.right,
        bottom: this.resetAllButton.top - 5,
        scale: 0.95,
        title: gravityString,
        decimals: 1,
        ticks: [
          {
            title: EarthString,
            value: Constants.EARTH_GRAVITY
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
    this.fluidDensitySlider = new ControlSlider(
      underPressureModel.measureUnitsProperty,
      underPressureModel.fluidDensityProperty,
      underPressureModel.getFluidDensityString.bind( underPressureModel ),
      underPressureModel.fluidDensityRange,
      underPressureModel.fluidDensityControlExpandedProperty,
      {
        right: this.resetAllButton.right,
        bottom: this.gravitySlider.top - 8,
        scale: 0.95,

        title: fluidDensityString,
        ticks: [
          {
            title: WaterString,
            value: Constants.WATER_DENSITY
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

    // add the sensors panel
    var sensorPanel = new Rectangle( 0, 0, 100, 130, 10, 10, { stroke: 'gray', lineWidth: 1, fill: '#f2fa6a',
      right: this.controlPanel.left - 20, top: this.controlPanel.top } );
    this.addChild( sensorPanel );

    // add barometers within the sensor panel bounds
    _.each( underPressureModel.barometers, function( barometer ) {
      barometer.positionProperty.storeInitialValue( new Vector2( sensorPanel.centerX, sensorPanel.centerY - 15 ) );
      barometer.reset();

      var barometerLinkedProperties = [
        underPressureModel.currentSceneProperty,
        underPressureModel.gravityProperty,
        underPressureModel.fluidDensityProperty,
        underPressureModel.isAtmosphereProperty,
        underPressureModel.currentVolumeProperty
      ];
      var barometerNode = new BarometerNode(
        modelViewTransform,
        barometer,
        underPressureModel.measureUnitsProperty,
        barometerLinkedProperties,
        underPressureModel.getPressureAtCoords.bind( underPressureModel ),
        underPressureModel.getPressureString.bind( underPressureModel ),
        sensorPanel.visibleBounds,
        this.layoutBounds,
        {
          scale: 1.5,
          pressureReadOffset: 51,
          minPressure: Constants.MIN_PRESSURE
        } );
      this.addChild( barometerNode );
    }.bind( this ) );

    var scenes = {};
    underPressureModel.scenes.forEach( function( name ) {
      scenes[ name ] = new SceneView[ name ]( underPressureModel.sceneModels[ name ], modelViewTransform,
        underPressureView.layoutBounds );
      scenes[ name ].visible = false;
      underPressureView.addChild( scenes[ name ] );
    } );

    underPressureModel.mysteryChoiceProperty.link( function( choice ) {
      if ( underPressureModel.currentScene === 'Mystery' ) {
        if ( choice === 'gravity' ) {
          underPressureView.gravitySlider.disable();
          underPressureView.fluidDensitySlider.enable();
        }
        else {
          underPressureView.gravitySlider.enable();
          underPressureView.fluidDensitySlider.disable();
        }
      }
    } );

    underPressureModel.currentSceneProperty.link( function( currentScene ) {
      if ( currentScene === 'Mystery' ) {
        if ( underPressureModel.mysteryChoice === 'gravity' ) {
          underPressureView.gravitySlider.disable();
        }
        else {
          underPressureView.fluidDensitySlider.disable();
        }
      }

      else {
        underPressureView.gravitySlider.enable();
        underPressureView.fluidDensitySlider.enable();
      }
    } );

    this.addChild( new SceneChoiceNode( underPressureModel, { x: 5, y: 260 } ) );

    //resize mystery control panel
    scenes.Mystery.mysteryPoolControls.choicePanel.resizeWidth( this.controlPanel.width );
    scenes.Mystery.mysteryPoolControls.choicePanel.right = underPressureView.gravitySlider.right;

    underPressureModel.currentSceneProperty.link( function( currentScene, previousScene ) {
      scenes[currentScene].visible = true;
      if ( previousScene ) {
        scenes[previousScene].visible = false;
      }
    } );

    this.addChild( new UnderPressureRuler( underPressureModel, modelViewTransform, underPressureView.layoutBounds ) );
  }

  return inherit( ScreenView, UnderPressureView );
} );