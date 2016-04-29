// Copyright 2013-2015, University of Colorado Boulder

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
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BackgroundNode = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/BackgroundNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var UnderPressureRuler = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/UnderPressureRuler' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var ControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/ControlPanel' );
  var UnitsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/common/view/UnitsControlPanel' );
  var ControlSlider = require( 'FLUID_PRESSURE_AND_FLOW/common/view/ControlSlider' );
  var SceneChoiceNode = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/SceneChoiceNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var BarometerNode = require( 'FLUID_PRESSURE_AND_FLOW/common/view/BarometerNode' );
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  var SquarePoolView = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/SquarePoolView' );
  var TrapezoidPoolView = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/TrapezoidPoolView' );
  var ChamberPoolView = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/ChamberPoolView' );
  var MysteryPoolView = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/MysteryPoolView' );
  var Node = require( 'SCENERY/nodes/Node' );

  // strings
  var fluidDensityString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidDensity' );
  var gravityString = require( 'string!FLUID_PRESSURE_AND_FLOW/gravity' );
  var earthString = require( 'string!FLUID_PRESSURE_AND_FLOW/earth' );
  var marsString = require( 'string!FLUID_PRESSURE_AND_FLOW/mars' );
  var jupiterString = require( 'string!FLUID_PRESSURE_AND_FLOW/jupiter' );
  var gasolineString = require( 'string!FLUID_PRESSURE_AND_FLOW/gasoline' );
  var waterString = require( 'string!FLUID_PRESSURE_AND_FLOW/water' );
  var honeyString = require( 'string!FLUID_PRESSURE_AND_FLOW/honey' );

  // constants
  var INSET = 15;
  var CONTROL_PANEL_WIDTH = 140; // empirically determined to look good and leave some space for translation
  var CONTROL_PANEL_CORNER_RADIUS = 7;
  var CONTROL_PANEL_X_MARGIN = 7;

  /**
   * @param {UnderPressureModel} underPressureModel of the sim
   * @constructor
   */
  function UnderPressureView( underPressureModel ) {
    var self = this;
    ScreenView.call( this, Constants.SCREEN_VIEW_OPTIONS );

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
        self.reset();
      },
      radius: 18,
      touchAreaDilation: 5,
      right: this.layoutBounds.right - INSET,
      bottom: this.layoutBounds.bottom - 5
    } );
    this.addChild( resetAllButton );

    //control panel
    var controlPanel = new ControlPanel( underPressureModel, {
      right: resetAllButton.right,
      top: 5,
      cornerRadius: CONTROL_PANEL_CORNER_RADIUS,
      xMargin: CONTROL_PANEL_X_MARGIN,
      minWidth: CONTROL_PANEL_WIDTH,
      maxWidth: CONTROL_PANEL_WIDTH
    } );
    this.addChild( controlPanel );

    // all the movable tools are added to this layer
    var toolsLayer = new Node();
    this.addChild( toolsLayer );

    // units panel
    var unitsControlPanel = new UnitsControlPanel( underPressureModel.measureUnitsProperty, {
      right: resetAllButton.right,
      top: controlPanel.bottom + 6,
      cornerRadius: CONTROL_PANEL_CORNER_RADIUS,
      xMargin: CONTROL_PANEL_X_MARGIN,
      minWidth: CONTROL_PANEL_WIDTH,
      maxWidth: CONTROL_PANEL_WIDTH
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
            title: earthString,
            value: Constants.EARTH_GRAVITY
          },
          {
            title: marsString,
            value: underPressureModel.gravityRange.min
          },
          {
            title: jupiterString,
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
        bottom: gravitySlider.top - 5,

        title: fluidDensityString,
        ticks: [
          {
            title: waterString,
            value: Constants.WATER_DENSITY
          },
          {
            title: gasolineString,
            value: underPressureModel.fluidDensityRange.min
          },
          {
            title: honeyString,
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
      cornerRadius: CONTROL_PANEL_CORNER_RADIUS,
      right: controlPanel.left - 20,
      top: controlPanel.top
    } );
    this.addChild( sensorPanel );

    this.resetActions = [];
    // add barometers within the sensor panel bounds
    _.each( underPressureModel.barometers, function( barometer ) {
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
          minPressure: Constants.MIN_PRESSURE
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
      this.layoutBounds, unitsControlPanel.bottom, unitsControlPanel.left, fluidDensitySlider.top,
      fluidDensitySlider.left, unitsControlPanel.width );
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

    this.addChild( new SceneChoiceNode( underPressureModel, { x: 10, y: 260 } ) );

    //resize mystery control panel
    //mysteryPoolView.mysteryPoolControls.choicePanel.resizeWidth( controlPanel.width );
    //mysteryPoolView.mysteryPoolControls.choicePanel.right = gravitySlider.right;

    underPressureModel.currentSceneProperty.link( function( currentScene, previousScene ) {
      scenes[ currentScene ].visible = true;
      if ( previousScene ) {
        scenes[ previousScene ].visible = false;
      }
    } );

    toolsLayer.addChild( new UnderPressureRuler( underPressureModel, modelViewTransform, this.layoutBounds ) );
    toolsLayer.moveToFront();
  }

  fluidPressureAndFlow.register( 'UnderPressureView', UnderPressureView );

  return inherit( ScreenView, UnderPressureView, {
    reset: function() {
      for ( var i = 0; i < this.resetActions.length; i++ ) {
        this.resetActions[ i ]();
      }
    }
  } );
} );