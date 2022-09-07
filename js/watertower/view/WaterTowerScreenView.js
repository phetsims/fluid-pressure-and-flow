// Copyright 2014-2022, University of Colorado Boulder

/**
 * View for the 'Water Tower' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PlayPauseButton from '../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import StepForwardButton from '../../../../scenery-phet/js/buttons/StepForwardButton.js';
import FaucetNode from '../../../../scenery-phet/js/FaucetNode.js';
import GroundNode from '../../../../scenery-phet/js/GroundNode.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import SkyNode from '../../../../scenery-phet/js/SkyNode.js';
import { Node, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import Constants from '../../common/Constants.js';
import BarometerNode from '../../common/view/BarometerNode.js';
import ControlSlider from '../../common/view/ControlSlider.js';
import FPAFRuler from '../../common/view/FPAFRuler.js';
import UnitsControlPanel from '../../common/view/UnitsControlPanel.js';
import VelocitySensorNode from '../../common/view/VelocitySensorNode.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';
import FaucetControlPanel from './FaucetControlPanel.js';
import HoseNode from './HoseNode.js';
import SluiceControlPanel from './SluiceControlPanel.js';
import ToolsControlPanel from './ToolsControlPanel.js';
import WaterDropsCanvasNode from './WaterDropsCanvasNode.js';
import WaterTowerNode from './WaterTowerNode.js';

//  strings
const feetString = FluidPressureAndFlowStrings.feet;
const fluidDensityString = FluidPressureAndFlowStrings.fluidDensity;
const gasolineString = FluidPressureAndFlowStrings.gasoline;
const honeyString = FluidPressureAndFlowStrings.honey;
const metersString = FluidPressureAndFlowStrings.meters;
const normalString = FluidPressureAndFlowStrings.normal;
const slowMotionString = FluidPressureAndFlowStrings.slowMotion;
const waterString = FluidPressureAndFlowStrings.water;

// constants
const INSET = 10;

class WaterTowerScreenView extends ScreenView {

  /**
   * @param {WaterTowerModel} waterTowerModel
   */
  constructor( waterTowerModel ) {

    super( Constants.SCREEN_VIEW_OPTIONS );

    const textOptions = { font: new PhetFont( 14 ) };

    // Invert the y-axis, so that y grows up.
    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, 350 ),
      10 ); //1m = 10px, (0,0) - top left corner

    const groundY = modelViewTransform.modelToViewY( 0 );

    // TODO: find a way to not do this
    waterTowerModel.modelViewTransform = modelViewTransform;

    // This is a workaround, see See https://github.com/phetsims/fluid-pressure-and-flow/issues/87
    // add background -- sky
    // rectangle with uniform sky color for y < groundY - 200
    this.addChild( new Rectangle( -5000, -1000, 10000, 1000 + groundY - 198, {
      stroke: '#01ACE4',
      fill: '#01ACE4'
    } ) );
    // gradient background skynode between y = groundY - 200 and y = groundY
    this.addChild( new SkyNode( -5000, groundY - 200, 10000, 200, groundY ) );

    this.hoseDropsLayer = new WaterDropsCanvasNode( waterTowerModel.hoseDrops, waterTowerModel.fluidColorModel, waterTowerModel.modelViewTransform, {
      canvasBounds: new Bounds2( 0, 0, 850, 350 )
    } );

    this.addChild( this.hoseDropsLayer );

    this.waterTowerDropsLayer = new WaterDropsCanvasNode( waterTowerModel.waterTowerDrops, waterTowerModel.fluidColorModel, waterTowerModel.modelViewTransform, {
      canvasBounds: new Bounds2( 0, 0, 500, 350 )
    } );
    this.addChild( this.waterTowerDropsLayer );

    // add background -- earth
    this.addChild( new GroundNode( -5000, groundY, 10000, 10000, groundY + 50 ) );

    // add the hose
    this.hoseNode = new HoseNode( waterTowerModel.hose, waterTowerModel.waterTower.tankPositionProperty, modelViewTransform, waterTowerModel.isHoseVisibleProperty );
    this.addChild( this.hoseNode );

    const waterTowerNode = new WaterTowerNode( waterTowerModel.waterTower, waterTowerModel.fluidColorModel, modelViewTransform, this.hoseNode );
    waterTowerNode.bottom = modelViewTransform.modelToViewY( 0 );
    this.addChild( waterTowerNode );

    this.faucetDropsLayer = new WaterDropsCanvasNode( waterTowerModel.faucetDrops, waterTowerModel.fluidColorModel, waterTowerModel.modelViewTransform, {
      canvasBounds: new Bounds2( 50, 0, 150, 350 )
    } );
    this.addChild( this.faucetDropsLayer );

    const faucetNode = new FaucetNode( 30, waterTowerModel.faucetFlowRateProperty, waterTowerModel.isFaucetEnabledProperty, {
      horizontalPipeLength: 1500,
      right: modelViewTransform.modelToViewX( waterTowerModel.faucetPosition.x ) + 20,
      top: this.layoutBounds.top + INSET,
      scale: 0.3, // size of the faucet,
      closeOnRelease: false,

      // Faucet is interactive in manual mode, non-interactive in 'matchLeakage' mode, see #132
      interactiveProperty: new DerivedProperty( [ waterTowerModel.faucetModeProperty ],
        faucetMode => faucetMode === 'manual' ),
      shooterOptions: {
        touchAreaXDilation: 37,
        touchAreaYDilation: 60
      }
    } );
    this.addChild( faucetNode );

    this.addChild( new FaucetControlPanel( waterTowerModel.faucetModeProperty, {
      left: faucetNode.right + INSET,
      bottom: faucetNode.bottom,
      fill: 'green'
    } ) );

    // tools control panel
    this.toolsControlPanel = new ToolsControlPanel( waterTowerModel, {
      right: this.layoutBounds.right - INSET,
      top: INSET
    } );
    this.addChild( this.toolsControlPanel );
    this.addChild( new UnitsControlPanel( waterTowerModel.measureUnitsProperty, {
      left: this.toolsControlPanel.left, xMargin: 10, yMargin: 10, fontSize: 14,
      top: this.toolsControlPanel.bottom + INSET
    } ) );

    // all the movable tools are added to this layer
    const toolsLayer = new Node();
    this.addChild( toolsLayer );

    const unitsProperty = new DerivedProperty( [ waterTowerModel.measureUnitsProperty ],
      measureUnits => {
        let units = {};
        if ( measureUnits === 'metric' ) {
          units = { name: metersString, multiplier: 1 };
        }
        else {
          // then it must be english
          units = { name: feetString, multiplier: 3.28 };
        }
        return units;
      } );

    const measuringTapeNode = new MeasuringTapeNode( unitsProperty, {
      visibleProperty: waterTowerModel.isMeasuringTapeVisibleProperty,
      basePositionProperty: waterTowerModel.measuringTapeBasePositionProperty,
      tipPositionProperty: waterTowerModel.measuringTapeTipPositionProperty,
      modelViewTransform: modelViewTransform,
      significantFigures: 2,
      lineColor: 'black', // color of the tapeline itself
      tipCircleColor: 'black', // color of the circle at the tip
      tipCircleRadius: 8, // radius of the circle on the tip
      isBaseCrosshairRotating: false, // do crosshairs rotate around their own axis to line up with the tapeline
      isTipCrosshairRotating: false, // do crosshairs rotate around their own axis to line up with the tapeline
      dragBounds: modelViewTransform.viewToModelBounds( this.layoutBounds.eroded( 10 ) )
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        waterTowerModel.reset();
        this.hoseNode.reset();
        measuringTapeNode.reset();
        waterTowerNode.fillButton.enabled = true;
      },
      right: this.layoutBounds.right - INSET,
      bottom: this.layoutBounds.bottom - INSET
    } );
    this.addChild( resetAllButton );

    // add the fluid density control slider
    const fluidDensityControlSlider = new ControlSlider(
      waterTowerModel.measureUnitsProperty,
      waterTowerModel.fluidDensityProperty,
      waterTowerModel.getFluidDensityString.bind( waterTowerModel ),
      waterTowerModel.fluidDensityRange,
      waterTowerModel.fluidDensityControlExpandedProperty, {
        right: resetAllButton.left - 4 * INSET,
        bottom: this.layoutBounds.bottom - INSET,
        title: fluidDensityString,
        ticks: [
          {
            title: waterString,
            value: waterTowerModel.fluidDensityProperty.value
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
    const sluiceControlPanel = new SluiceControlPanel( waterTowerModel.isSluiceOpenProperty, {
      xMargin: 10,
      yMargin: 15,
      fill: '#1F5EFF',
      right: waterTowerNode.right + 36,
      bottom: this.layoutBounds.bottom - 70
    } );
    this.addChild( sluiceControlPanel );

    // add play pause button and step button
    const stepButton = new StepForwardButton( {
      enabledProperty: DerivedProperty.not( waterTowerModel.isPlayingProperty ),
      listener: () => { waterTowerModel.stepInternal( 0.016 ); },
      stroke: 'black',
      fill: '#005566',
      right: fluidDensityControlSlider.left - INSET,
      bottom: fluidDensityControlSlider.bottom - INSET
    } );

    this.addChild( stepButton );

    const playPauseButton = new PlayPauseButton( waterTowerModel.isPlayingProperty,
      { stroke: 'black', fill: '#005566', y: stepButton.centerY, right: stepButton.left - INSET } );
    this.addChild( playPauseButton );

    const speedControl = new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        new AquaRadioButton( waterTowerModel.speedProperty, 'slow', new Text( slowMotionString, textOptions ), { radius: 6 } ),
        new AquaRadioButton( waterTowerModel.speedProperty, 'normal', new Text( normalString, textOptions ), { radius: 6 } )
      ]
    } );

    this.addChild( speedControl.mutate( { right: playPauseButton.left - INSET, bottom: playPauseButton.bottom } ) );

    // add the sensors panel
    const sensorPanel = new Rectangle( 0, 0, 190, 105, 10, 10, {
      stroke: 'gray',
      lineWidth: 1,
      fill: '#f2fa6a',
      right: this.toolsControlPanel.left - INSET,
      top: this.toolsControlPanel.top
    } );
    this.addChild( sensorPanel );

    // add barometers within the sensor panel bounds
    _.each( waterTowerModel.barometers, barometer => {
      barometer.reset();
      toolsLayer.addChild( new BarometerNode(
        modelViewTransform,
        barometer,
        waterTowerModel.measureUnitsProperty,
        [ waterTowerModel.fluidDensityProperty, waterTowerModel.waterTower.tankPositionProperty, waterTowerModel.waterTower.fluidLevelProperty ],
        waterTowerModel.getPressureAtCoords.bind( waterTowerModel ),
        waterTowerModel.getPressureString.bind( waterTowerModel ),
        sensorPanel.visibleBounds,
        this.layoutBounds.withMaxY( this.layoutBounds.maxY - 62 ), {
          minPressure: Constants.MIN_PRESSURE,
          maxPressure: Constants.MAX_PRESSURE
        } ) );
    } );

    // add speedometers within the sensor panel bounds
    _.each( waterTowerModel.speedometers, velocitySensor => {
      velocitySensor.positionProperty.reset();
      toolsLayer.addChild( new VelocitySensorNode( modelViewTransform, velocitySensor,
        waterTowerModel.measureUnitsProperty, [], waterTowerModel.getWaterDropVelocityAt.bind( waterTowerModel ),
        sensorPanel.visibleBounds, this.layoutBounds.withMaxY( this.layoutBounds.maxY - 72 ) ) );
    } );

    toolsLayer.addChild( new FPAFRuler( waterTowerModel.isRulerVisibleProperty, waterTowerModel.rulerPositionProperty,
      waterTowerModel.measureUnitsProperty, modelViewTransform, this.layoutBounds, {
        rulerWidth: 40,
        rulerHeight: 30,
        meterMajorStickWidth: 5,
        feetMajorStickWidth: 3,
        scaleFont: 12,
        meterTicks: _.range( 0, 31, 5 ),
        feetTicks: _.range( 0, 101, 10 ),
        insetsWidth: 0
      } ) );
    toolsLayer.addChild( measuringTapeNode );


    waterTowerModel.isSluiceOpenProperty.link( isSluiceOpen => {
      if ( isSluiceOpen ) {
        waterTowerNode.sluiceGate.bottom = waterTowerNode.waterTankFrame.bottom + modelViewTransform.modelToViewDeltaY( waterTowerNode.waterTower.HOLE_SIZE ) - 5;
      }
      else {
        waterTowerNode.sluiceGate.bottom = waterTowerNode.waterTankFrame.bottom;
      }
    } );

    waterTowerModel.tankFullLevelDurationProperty.link( tankFullLevelDuration => {
      waterTowerNode.fillButton.enabled = ( tankFullLevelDuration < 0.2 );
      waterTowerModel.isFaucetEnabledProperty.value = ( tankFullLevelDuration < 0.2 );
    } );

    // if the sim is paused, disable the fill button as soon as the tank is filled
    //TODO this is unnecessarily complicated
    new DerivedProperty( [ waterTowerModel.waterTower.fluidVolumeProperty ], fluidVolume => {
      return fluidVolume === waterTowerModel.waterTower.TANK_VOLUME;
    } ).link( () => {
      if ( !waterTowerModel.isPlayingProperty.value ) {
        waterTowerNode.fillButton.enabled = false;
        waterTowerModel.tankFullLevelDurationProperty.value = 1;
      }
    } );

    // Handles the case when switching from play to pause or viceversa
    //TODO this is unnecessarily complicated
    waterTowerModel.isPlayingProperty.link( isPlaying => {
      if ( waterTowerModel.waterTower.fluidVolumeProperty.value >= waterTowerModel.waterTower.TANK_VOLUME ) {
        waterTowerModel.tankFullLevelDurationProperty.value = 1;
        if ( !isPlaying ) {
          // disable the fill button if the tank is full and switching from play to pause
          waterTowerNode.fillButton.enabled = false;
        }
      }
    } );
    toolsLayer.moveToFront();
  }

  /**
   * @public
   */
  step( dt ) {
    this.waterTowerDropsLayer.step( dt );
    this.hoseDropsLayer.step( dt );
    this.faucetDropsLayer.step( dt );
  }
}

fluidPressureAndFlow.register( 'WaterTowerScreenView', WaterTowerScreenView );
export default WaterTowerScreenView;