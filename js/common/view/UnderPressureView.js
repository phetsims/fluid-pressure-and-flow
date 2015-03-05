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
  var UnderPressureConstants = require( 'UNDER_PRESSURE/common/UnderPressureConstants' );
  var SquarePoolView = require( 'UNDER_PRESSURE/square-pool/view/SquarePoolView' );
  var TrapezoidPoolView = require( 'UNDER_PRESSURE/trapezoid-pool/view/TrapezoidPoolView' );
  var ChamberPoolView = require( 'UNDER_PRESSURE/chamber-pool/view/ChamberPoolView' );
  var MysteryPoolView = require( 'UNDER_PRESSURE/mystery-pool/view/MysteryPoolView' );
  var Node = require( 'SCENERY/nodes/Node' );

  // strings
  var fluidDensityString = require( 'string!UNDER_PRESSURE/fluidDensity' );
  var gravityString = require( 'string!UNDER_PRESSURE/gravity' );
  var EarthString = require( 'string!UNDER_PRESSURE/earth' );
  var MarsString = require( 'string!UNDER_PRESSURE/mars' );
  var JupiterString = require( 'string!UNDER_PRESSURE/jupiter' );
  var GasolineString = require( 'string!UNDER_PRESSURE/gasoline' );
  var WaterString = require( 'string!UNDER_PRESSURE/water' );
  var HoneyString = require( 'string!UNDER_PRESSURE/honey' );

  //View layout related constants
  var inset = 15;

  /**
   * @param {UnderPressureModel} underPressureModel of the sim
   * @constructor
   */
  function UnderPressureView( underPressureModel ) {

    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, underPressureModel.width, underPressureModel.height ) } );

    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, 245 ),
      70 );  //1m = 70px, (0,0) - top left corner

    //sky, earth and controls
    this.addChild( new BackgroundNode( underPressureModel, modelViewTransform ) );

    // add reset button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        underPressureModel.reset();
      },
      scale: 0.6,
      right:  this.layoutBounds.right - inset,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( resetAllButton );

    //control panel
    var controlPanel = new ControlPanel( underPressureModel, { right: resetAllButton.right, top: 5, cornerRadius: 7 } );
    this.addChild( controlPanel );

    // all the movable tools are added to this layer
    var toolsLayer = new Node();
    this.addChild( toolsLayer );

    // units panel
    var unitsControlPanel = new UnitsControlPanel( underPressureModel.measureUnitsProperty, controlPanel.width, {
      yMargin: 2,
      right: resetAllButton.right,
      top: controlPanel.bottom + 6,
      cornerRadius: 7
    } );
    this.addChild( unitsControlPanel );

    // gravity slider
    var gravitySlider = new ControlSlider(
      underPressureModel.measureUnitsProperty,
      underPressureModel.gravityProperty,
      underPressureModel.getGravityString.bind( underPressureModel ),
      underPressureModel.gravityRange,
      underPressureModel.gravityControlExpandedProperty, {
        right: resetAllButton.right,
        bottom: resetAllButton.top - 5,
        title: gravityString,
        decimals: 1,
        ticks: [
          {
            title: EarthString,
            value: UnderPressureConstants.EARTH_GRAVITY
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
      }
    );
    this.addChild( gravitySlider );

    // fluid density slider
    var fluidDensitySlider = new ControlSlider(
      underPressureModel.measureUnitsProperty,
      underPressureModel.fluidDensityProperty,
      underPressureModel.getFluidDensityString.bind( underPressureModel ),
      underPressureModel.fluidDensityRange,
      underPressureModel.fluidDensityControlExpandedProperty, {
        right: resetAllButton.right,
        bottom: gravitySlider.top - 8,

        title: fluidDensityString,
        ticks: [
          {
            title: WaterString,
            value: UnderPressureConstants.WATER_DENSITY
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
    this.addChild( fluidDensitySlider );

    // add the sensors panel
    var sensorPanel = new Rectangle( 0, 0, 100, 130, 10, 10, {
      stroke: 'gray',
      lineWidth: 1,
      fill: '#f2fa6a',
      right: controlPanel.left - 20,
      top: controlPanel.top
    } );
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
          pressureReadOffset: 51, // empirically determined distance between center and reading tip of the barometer
          minPressure: UnderPressureConstants.MIN_PRESSURE
        } );
      toolsLayer.addChild( barometerNode );
    }.bind( this ) );

    var scenes = {};

    // adding square pool view
    var squarePoolView = new SquarePoolView( underPressureModel.sceneModels.square, modelViewTransform,
      this.layoutBounds );
    squarePoolView.visible = false;
    scenes.square = squarePoolView;
    this.addChild( squarePoolView );

    // adding trapezoid pool view
    var trapezoidPoolView = new TrapezoidPoolView( underPressureModel.sceneModels.trapezoid, modelViewTransform,
      this.layoutBounds );
    trapezoidPoolView.visible = false;
    scenes.trapezoid = trapezoidPoolView;
    this.addChild( trapezoidPoolView );

    // adding chamber pool view
    var chamberPoolView = new ChamberPoolView( underPressureModel.sceneModels.chamber, modelViewTransform,
      this.layoutBounds );
    chamberPoolView.visible = false;
    scenes.chamber = chamberPoolView;
    this.addChild( chamberPoolView );

    // adding mystery pool view
    var mysteryPoolView = new MysteryPoolView( underPressureModel.sceneModels.mystery, modelViewTransform,
      this.layoutBounds );
    mysteryPoolView.visible = false;
    scenes.mystery = mysteryPoolView;
    this.addChild( mysteryPoolView );

    underPressureModel.mysteryChoiceProperty.link( function( choice ) {
      if ( underPressureModel.currentScene === 'mystery' ) {
        if ( choice === 'gravity' ) {
          gravitySlider.disable();
          fluidDensitySlider.enable();
        }
        else {
          gravitySlider.enable();
          fluidDensitySlider.disable();
        }
      }
    } );

    underPressureModel.currentSceneProperty.link( function( currentScene ) {
      if ( currentScene === 'mystery' ) {
        if ( underPressureModel.mysteryChoice === 'gravity' ) {
          gravitySlider.disable();
        }
        else {
          fluidDensitySlider.disable();
        }
      }
      else {
        gravitySlider.enable();
        fluidDensitySlider.enable();
      }
    } );

    this.addChild( new SceneChoiceNode( underPressureModel, { x: 5, y: 260 } ) );

    //resize mystery control panel
    mysteryPoolView.mysteryPoolControls.choicePanel.resizeWidth( controlPanel.width );
    mysteryPoolView.mysteryPoolControls.choicePanel.right = gravitySlider.right;

    underPressureModel.currentSceneProperty.link( function( currentScene, previousScene ) {
      scenes[ currentScene ].visible = true;
      if ( previousScene ) {
        scenes[ previousScene ].visible = false;
      }
    } );

    toolsLayer.addChild( new UnderPressureRuler( underPressureModel, modelViewTransform, this.layoutBounds ) );
    toolsLayer.moveToFront();
  }

  return inherit( ScreenView, UnderPressureView );
} );