// Copyright 2013-2022, University of Colorado Boulder

/**
 *  Main view for the under-pressure screen. The view contains 4 scenes: square pool, chamber pool, trapezoid and a
 *  mystery pool. There is a scene selector to switch between the views. There are panels to control the fluid density
 *  and gravity and tools to measure pressure and length. Supports viewing values in english, metric or atmosphere units.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { Node, Rectangle } from '../../../../scenery/js/imports.js';
import Constants from '../../common/Constants.js';
import BarometerNode from '../../common/view/BarometerNode.js';
import ControlSlider from '../../common/view/ControlSlider.js';
import UnitsControlPanel from '../../common/view/UnitsControlPanel.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';
import BackgroundNode from './BackgroundNode.js';
import ChamberPoolView from './ChamberPoolView.js';
import ControlPanel from './ControlPanel.js';
import MysteryPoolView from './MysteryPoolView.js';
import SceneChoiceNode from './SceneChoiceNode.js';
import SquarePoolView from './SquarePoolView.js';
import TrapezoidPoolView from './TrapezoidPoolView.js';
import UnderPressureRuler from './UnderPressureRuler.js';

const earthString = FluidPressureAndFlowStrings.earth;
const fluidDensityString = FluidPressureAndFlowStrings.fluidDensity;
const gasolineString = FluidPressureAndFlowStrings.gasoline;
const gravityString = FluidPressureAndFlowStrings.gravity;
const honeyString = FluidPressureAndFlowStrings.honey;
const jupiterString = FluidPressureAndFlowStrings.jupiter;
const marsString = FluidPressureAndFlowStrings.mars;
const waterString = FluidPressureAndFlowStrings.water;

// constants
const INSET = 15;
const CONTROL_PANEL_WIDTH = 140; // empirically determined to look good and leave some space for translation
const CONTROL_PANEL_CORNER_RADIUS = 7;
const CONTROL_PANEL_X_MARGIN = 7;

class UnderPressureScreenView extends ScreenView {

  /**
   * @param {UnderPressureModel} underPressureModel
   */
  constructor( underPressureModel ) {

    super( Constants.SCREEN_VIEW_OPTIONS );

    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, 245 ),
      70 );  //1m = 70px, (0,0) - top left corner

    //sky, earth and controls
    this.addChild( new BackgroundNode( underPressureModel, modelViewTransform ) );

    // add reset button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        underPressureModel.reset();
        this.reset();
      },
      radius: 18,
      right: this.layoutBounds.right - INSET,
      bottom: this.layoutBounds.bottom - 5
    } );
    this.addChild( resetAllButton );

    //control panel
    const controlPanel = new ControlPanel( underPressureModel, {
      right: resetAllButton.right,
      top: 5,
      cornerRadius: CONTROL_PANEL_CORNER_RADIUS,
      xMargin: CONTROL_PANEL_X_MARGIN,
      minWidth: CONTROL_PANEL_WIDTH,
      maxWidth: CONTROL_PANEL_WIDTH
    } );
    this.addChild( controlPanel );

    // all the movable tools are added to this layer
    const toolsLayer = new Node();
    this.addChild( toolsLayer );

    // units panel
    const unitsControlPanel = new UnitsControlPanel( underPressureModel.measureUnitsProperty, {
      right: resetAllButton.right,
      top: controlPanel.bottom + 6,
      cornerRadius: CONTROL_PANEL_CORNER_RADIUS,
      xMargin: CONTROL_PANEL_X_MARGIN,
      minWidth: CONTROL_PANEL_WIDTH,
      maxWidth: CONTROL_PANEL_WIDTH
    } );
    this.addChild( unitsControlPanel );

    // gravity slider
    const gravitySlider = new ControlSlider(
      underPressureModel.measureUnitsProperty,
      underPressureModel.gravityProperty,
      underPressureModel.getGravityString.bind( underPressureModel ),
      underPressureModel.gravityRange,
      underPressureModel.gravityControlExpandedProperty, {
        right: resetAllButton.right,
        bottom: resetAllButton.top - 5,
        title: gravityString,
        decimals: 1,
        labelMaxWidth: 30,
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
    const fluidDensitySlider = new ControlSlider(
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
    const sensorPanel = new Rectangle( 0, 0, 100, 130, 10, 10, {
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
    _.each( underPressureModel.barometers, barometer => {
      const barometerLinkedProperties = [
        underPressureModel.currentSceneProperty,
        underPressureModel.gravityProperty,
        underPressureModel.fluidDensityProperty,
        underPressureModel.isAtmosphereProperty,
        underPressureModel.currentVolumeProperty
      ];
      const barometerNode = new BarometerNode(
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
    } );

    const scenes = {};

    // adding square pool view
    const squarePoolView = new SquarePoolView( underPressureModel.sceneModels.square, modelViewTransform,
      this.layoutBounds );
    squarePoolView.visible = false;
    scenes.square = squarePoolView;
    this.addChild( squarePoolView );

    // adding trapezoid pool view
    const trapezoidPoolView = new TrapezoidPoolView( underPressureModel.sceneModels.trapezoid, modelViewTransform,
      this.layoutBounds );
    trapezoidPoolView.visible = false;
    scenes.trapezoid = trapezoidPoolView;
    this.addChild( trapezoidPoolView );

    // adding chamber pool view
    const chamberPoolView = new ChamberPoolView( underPressureModel.sceneModels.chamber, modelViewTransform,
      this.layoutBounds );
    chamberPoolView.visible = false;
    scenes.chamber = chamberPoolView;
    this.addChild( chamberPoolView );

    // adding mystery pool view
    const mysteryPoolView = new MysteryPoolView( underPressureModel.sceneModels.mystery, modelViewTransform,
      this.layoutBounds, unitsControlPanel.bottom, unitsControlPanel.left, fluidDensitySlider.top,
      fluidDensitySlider.left, unitsControlPanel.width );
    mysteryPoolView.visible = false;
    scenes.mystery = mysteryPoolView;
    this.addChild( mysteryPoolView );

    underPressureModel.mysteryChoiceProperty.link( choice => {
      if ( underPressureModel.currentSceneProperty.value === 'mystery' ) {
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

    underPressureModel.currentSceneProperty.link( currentScene => {
      if ( currentScene === 'mystery' ) {
        if ( underPressureModel.mysteryChoiceProperty.value === 'gravity' ) {
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

    underPressureModel.currentSceneProperty.link( ( currentScene, previousScene ) => {
      scenes[ currentScene ].visible = true;
      if ( previousScene ) {
        scenes[ previousScene ].visible = false;
      }
    } );

    toolsLayer.addChild( new UnderPressureRuler( underPressureModel, modelViewTransform, this.layoutBounds ) );
    toolsLayer.moveToFront();
  }

  /**
   * @public
   */
  reset() {
    for ( let i = 0; i < this.resetActions.length; i++ ) {
      this.resetActions[ i ]();
    }
  }
}

fluidPressureAndFlow.register( 'UnderPressureScreenView', UnderPressureScreenView );
export default UnderPressureScreenView;