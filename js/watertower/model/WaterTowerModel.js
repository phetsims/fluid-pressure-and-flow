// Copyright 2014-2022, University of Colorado Boulder

/**
 * Model for the 'Water Tower' screen.
 * Origin is at the left bound on the ground. And y grows in the direction of sky from ground.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Constants from '../../common/Constants.js';
import FluidColorModel from '../../common/model/FluidColorModel.js';
import getStandardAirPressure from '../../common/model/getStandardAirPressure.js';
import Sensor from '../../common/model/Sensor.js';
import Units from '../../common/model/Units.js';
import VelocitySensor from '../../common/model/VelocitySensor.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';
import Hose from './Hose.js';
import WaterDrop from './WaterDrop.js';
import WaterTower from './WaterTower.js';

const densityUnitsEnglishString = FluidPressureAndFlowStrings.densityUnitsEnglish;
const densityUnitsMetricString = FluidPressureAndFlowStrings.densityUnitsMetric;
const valueWithUnitsPatternString = FluidPressureAndFlowStrings.valueWithUnitsPattern;

class WaterTowerModel {

  constructor() {

    this.fluidDensityRange = new Range( Constants.GASOLINE_DENSITY, Constants.HONEY_DENSITY );

    this.isRulerVisibleProperty = new Property( false );
    this.isMeasuringTapeVisibleProperty = new Property( false );
    this.isSpeedometerVisibleProperty = new Property( true );
    this.isHoseVisibleProperty = new Property( false );
    this.isPlayingProperty = new Property( true );//Whether the sim is paused or running
    this.faucetFlowRateProperty = new Property( 0 );// cubic meter/sec
    this.isFaucetEnabledProperty = new Property( true );
    this.measureUnitsProperty = new Property( 'metric' );//metric, english
    this.fluidDensityProperty = new Property( Constants.WATER_DENSITY );
    this.fluidDensityControlExpandedProperty = new Property( false );
    this.rulerPositionProperty = new Vector2Property( new Vector2( 300, 350 ) ); // px
    this.measuringTapeBasePositionProperty = new Vector2Property( new Vector2( 10, 0 ) ); // initial position (of crosshair near the base) of tape in model coordinates
    this.measuringTapeTipPositionProperty = new Vector2Property( new Vector2( 17, 0 ) ); // initial position (of crosshair  at the tip) of tape in model coordinates
    this.waterFlowProperty = new Property( 'water' );
    this.isSluiceOpenProperty = new BooleanProperty( false );
    this.faucetModeProperty = new Property( 'manual' ); //manual or matchLeakage
    this.scaleProperty = new Property( 1 ); // scale coefficient
    this.speedProperty = new Property( 'normal' ); //speed of the model, either 'normal' or 'slow'
    this.tankFullLevelDurationProperty = new Property( 0 );// the number of seconds tank has been full for. This property is used to enable/disable the fill button. // Fill button is disabled only when the tank has been full for at least 1 sec

    // position the tank frame at (1, 1.5). (0, 0) is the left most point on the ground.
    this.waterTower = new WaterTower( { tankPosition: new Vector2( 7, 11.1 ) } ); //INITIAL_Y is 15 in java

    this.hose = new Hose( 4, Math.PI / 2 );

    this.faucetPosition = new Vector2( 9.1, 26.6 ); //faucet right co-ordinates
    this.faucetDrops = createObservableArray();
    this.waterTowerDrops = createObservableArray();
    this.hoseDrops = createObservableArray();
    this.fluidColorModel = new FluidColorModel( this.fluidDensityProperty, this.fluidDensityRange );

    this.barometers = [];
    for ( let i = 0; i < 2; i++ ) {
      this.barometers.push( new Sensor( new Vector2( 0, 0 ), 0 ) );
    }

    this.speedometers = [];
    for ( let j = 0; j < 2; j++ ) {
      this.speedometers.push( new VelocitySensor( new Vector2( 0, 0 ), new Vector2( 0, 0 ) ) );
    }

    Multilink.multilink( [ this.waterTower.isFullProperty, this.faucetModeProperty ], ( isFull, faucetMode ) => {
      if ( faucetMode === 'manual' ) {
        this.isFaucetEnabledProperty.value = !isFull;
        if ( isFull ) {
          this.faucetFlowRateProperty.value = 0;
        }
      }
      else {
        this.isFaucetEnabledProperty.value = false;
      }
    } );

    // variables used in step function. Declaring here to avoid gc
    this.dropsToRemove = [];
    this.accumulatedDt = 0;
    this.accumulatedDtForSensors = 0;

    this.leakageVolume = 0;
    this.newFaucetDrops = [];
    this.newWaterTowerDrops = [];
    this.newHoseDrops = [];
  }

  /**
   * Resets all model elements
   * @public
   */
  reset() {
    this.isRulerVisibleProperty.reset();
    this.isMeasuringTapeVisibleProperty.reset();
    this.isSpeedometerVisibleProperty.reset();
    this.isHoseVisibleProperty.reset();
    this.isPlayingProperty.reset();
    this.faucetFlowRateProperty.reset();
    this.isFaucetEnabledProperty.reset();
    this.measureUnitsProperty.reset();
    this.fluidDensityProperty.reset();
    this.fluidDensityControlExpandedProperty.reset();
    this.rulerPositionProperty.reset();
    this.measuringTapeBasePositionProperty.reset();
    this.measuringTapeTipPositionProperty.reset();
    this.waterFlowProperty.reset();
    this.isSluiceOpenProperty.reset();
    this.faucetModeProperty.reset();
    this.scaleProperty.reset();
    this.speedProperty.reset();
    this.tankFullLevelDurationProperty.reset();

    _.each( this.barometers, barometer => {
      barometer.reset();
    } );

    _.each( this.speedometers, speedometer => {
      speedometer.reset();
    } );

    this.waterTower.reset();
    this.faucetDrops.clear();
    this.waterTowerDrops.clear();
    this.hoseDrops.clear();
  }

  /**
   * @private
   */
  getFluidPressure( height ) {
    return height * 9.8 * this.fluidDensityProperty.value;
  }

  /**
   * @public
   */
  getPressureAtCoords( x, y ) {
    //
    if ( y < 0 ) {
      return 0;
    }

    let pressure = getStandardAirPressure( y );

    //add the fluid pressure if the point is inside the fluid in the tank
    if ( this.isPointInWater( x, y ) ) {
      pressure = getStandardAirPressure( this.waterTower.tankPositionProperty.value.y + this.waterTower.fluidLevelProperty.value ) +
                 this.getFluidPressure( this.waterTower.tankPositionProperty.value.y + this.waterTower.fluidLevelProperty.value - y );
    }

    return pressure;
  }

  /**
   * @public
   */
  getPressureString( pressure, units, x, y ) {
    return Units.getPressureString( pressure, units, this.isPointInWater( x, y ) );
  }

  /**
   * @private
   */
  isPointInWater( x, y ) {
    return ( x > this.waterTower.tankPositionProperty.value.x &&
             x < this.waterTower.tankPositionProperty.value.x + 2 * this.waterTower.TANK_RADIUS &&
             y > this.waterTower.tankPositionProperty.value.y && y < this.waterTower.tankPositionProperty.value.y + this.waterTower.fluidLevelProperty.value );
  }

  /**
   * Called by the animation loop.
   * @public
   */
  step( dt ) {
    // prevent sudden dt bursts on slow devices or when the user comes back to the tab after a while
    dt = ( dt > 0.04 ) ? 0.04 : dt;
    if ( this.isPlayingProperty.value ) {
      if ( this.speedProperty.value === 'normal' ) {
        this.stepInternal( dt );
      }
      else {
        this.stepInternal( 0.33 * dt );
      }
    }
  }

  /**
   * @private
   */
  stepInternal( dt ) {

    // Ensure that water flow looks ok even on very low frame rates
    this.accumulatedDt += dt;
    this.accumulatedDtForSensors += dt;

    let newFaucetDrop;
    let newWaterDrop;
    let newHoseDrop;
    let remainingVolume;
    let waterVolumeExpelled;

    this.newFaucetDrops = [];
    this.newWaterTowerDrops = [];
    this.newHoseDrops = [];

    while ( this.accumulatedDt > 0.016 ) {
      this.accumulatedDt -= 0.016;
      if ( ( this.faucetModeProperty.value === 'manual' && this.isFaucetEnabledProperty.value && this.faucetFlowRateProperty.value > 0 ) ||
           ( this.faucetModeProperty.value === 'matchLeakage' && this.isSluiceOpenProperty.value && this.waterTower.fluidVolumeProperty.value > 0 ) ) {
        newFaucetDrop = new WaterDrop( this.faucetPosition.copy().plus( new Vector2( dotRandom.nextDouble() * 0.2 - 0.1,
          1.5 ) ), new Vector2( 0, 0 ),
          this.faucetModeProperty.value === 'manual' ? this.faucetFlowRateProperty.value * 0.016 : this.leakageVolume );
        this.faucetDrops.push( newFaucetDrop );
        this.newFaucetDrops.push( newFaucetDrop );
        newFaucetDrop.step( this.accumulatedDt );
      }

      // Add watertower drops if the tank is open and there is enough fluid in the tank to be visible on the tower
      // Note: If fluid volume is very low (the fluid level is less than 1px height) then sometimes it doesn't show on the tower, but is visible with a magnifier
      if ( this.isSluiceOpenProperty.value && this.waterTower.fluidVolumeProperty.value > 0 && !this.isHoseVisibleProperty.value ) {

        this.velocityMagnitude = Math.sqrt( 2 * Constants.EARTH_GRAVITY * this.waterTower.fluidLevelProperty.value );

        waterVolumeExpelled = this.velocityMagnitude * 2.8 * 0.016;

        remainingVolume = this.waterTower.fluidVolumeProperty.value;
        this.leakageVolume = remainingVolume > waterVolumeExpelled ? waterVolumeExpelled : remainingVolume;
        let dropVolume = this.leakageVolume;
        let radius = Utils.cubeRoot( ( 3 * this.leakageVolume ) / ( 4 * Math.PI ) );

        // when the fluid level is less than the sluice hole, ensure that the water drops are not bigger than the fluid level
        if ( this.waterTower.fluidLevelProperty.value < this.waterTower.HOLE_SIZE && radius > this.waterTower.fluidLevelProperty.value / 2 ) {
          radius = this.waterTower.fluidLevelProperty.value / 2;
          // ensure a minimum radius so that the water drop is visible on the screen
          if ( radius < 0.1 ) {
            radius = 0.1;
          }
          dropVolume = 4 * Math.PI * radius * radius * radius / 3;
        }

        newWaterDrop = new WaterDrop( this.waterTower.tankPositionProperty.value.plus( new Vector2( 2 * this.waterTower.TANK_RADIUS,
          0.25 + radius ) ), new Vector2( this.velocityMagnitude, 0 ), dropVolume );
        this.waterTowerDrops.push( newWaterDrop );
        newWaterDrop.step( this.accumulatedDt );
        this.newWaterTowerDrops.push( newWaterDrop );

        this.waterTower.fluidVolumeProperty.value = this.waterTower.fluidVolumeProperty.value - this.leakageVolume;

      }

      // Add hose drops if the tank is open and there is fluid in the tank to be visible on the tower and the hose is visible
      // Note: If fluid volume is very low (the fluid level is less than 1px height) then sometimes it doesn't show on the tower, but is visible with a magnifier
      if ( this.isSluiceOpenProperty.value && this.waterTower.fluidVolumeProperty.value > 0 && this.isHoseVisibleProperty.value ) {
        this.leakageVolume = 0;
        const y = this.hose.rotationPivotY + this.waterTower.tankPositionProperty.value.y + 0.1;
        if ( y < this.waterTower.fluidLevelProperty.value + this.waterTower.tankPositionProperty.value.y ) {
          this.velocityMagnitude = Math.sqrt( 2 * Constants.EARTH_GRAVITY *
                                              ( this.waterTower.tankPositionProperty.value.y + this.waterTower.fluidLevelProperty.value - y ) );
          waterVolumeExpelled = this.velocityMagnitude * 2.8 * 0.016;
          remainingVolume = this.waterTower.fluidVolumeProperty.value;
          this.leakageVolume = remainingVolume > waterVolumeExpelled ? waterVolumeExpelled : remainingVolume;

          newHoseDrop = new WaterDrop( new Vector2( this.hose.rotationPivotX + this.waterTower.tankPositionProperty.value.x +
                                                    2 * this.waterTower.TANK_RADIUS - 0.1 + dotRandom.nextDouble() * 0.2 - 0.1,
            y + dotRandom.nextDouble() * 0.2 - 0.1 ),
            new Vector2( this.velocityMagnitude * Math.cos( this.hose.angleProperty.value ),
              this.velocityMagnitude * Math.sin( this.hose.angleProperty.value ) ), this.leakageVolume );

          this.hoseDrops.push( newHoseDrop );
          newHoseDrop.step( this.accumulatedDt );
          this.newHoseDrops.push( newHoseDrop );
          this.waterTower.fluidVolumeProperty.value = this.waterTower.fluidVolumeProperty.value - this.leakageVolume;

        }
      }

    }

    for ( let i = 0, numberOfDrops = this.faucetDrops.length; i < numberOfDrops; i++ ) {
      // step only the 'old' drops
      if ( this.newFaucetDrops.indexOf( this.faucetDrops.get( i ) ) === -1 ) {
        this.faucetDrops.get( i ).step( dt );
      }

      // check if the faucetDrops hit the fluidLevel
      if ( this.faucetDrops.get( i ).positionProperty.value.y < this.waterTower.tankPositionProperty.value.y +
           ( ( this.waterTower.fluidLevelProperty.value > this.faucetDrops.get( i ).radius ) ?
             this.waterTower.fluidLevelProperty.value + this.faucetDrops.get( i ).radius :
             0.3 + this.faucetDrops.get( i ).radius ) ) {
        this.dropsToRemove.push( this.faucetDrops.get( i ) );

        if ( this.waterTower.fluidVolumeProperty.value < this.waterTower.TANK_VOLUME ) {
          this.waterTower.fluidVolumeProperty.value = this.waterTower.fluidVolumeProperty.value + this.faucetDrops.get( i ).volumeProperty.value;
        }

        if ( this.waterTower.fluidVolumeProperty.value > this.waterTower.TANK_VOLUME ) {
          this.waterTower.fluidVolumeProperty.value = this.waterTower.TANK_VOLUME;
        }
      }
    }

    // Update the value only when it is less than 1. We are only interested in the 1 sec boundary.
    // Otherwise it will emit too many updates.
    if ( this.waterTower.fluidVolumeProperty.value >= 0.995 * this.waterTower.TANK_VOLUME ) {
      if ( this.tankFullLevelDurationProperty.value < 0.2 ) {
        this.tankFullLevelDurationProperty.value += dt;
      }
    }
    else {
      this.tankFullLevelDurationProperty.value = 0;
    }

    if ( this.dropsToRemove.length > 0 ) {
      this.faucetDrops.removeAll( this.dropsToRemove.filter( drop => this.faucetDrops.includes( drop ) ) );
    }

    this.dropsToRemove = [];
    for ( let i = 0, numberOfDrops = this.waterTowerDrops.length; i < numberOfDrops; i++ ) {
      //step only the 'old' drops
      if ( this.newWaterTowerDrops.indexOf( this.waterTowerDrops.get( i ) ) === -1 ) {
        this.waterTowerDrops.get( i ).step( dt );
      }

      //remove them as soon as they go below the ground
      if ( this.waterTowerDrops.get( i ).positionProperty.value.y < 0 ) {
        this.dropsToRemove.push( this.waterTowerDrops.get( i ) );
      }
    }

    if ( this.dropsToRemove.length > 0 ) {
      this.waterTowerDrops.removeAll( this.dropsToRemove.filter( drop => this.waterTowerDrops.includes( drop ) ) );
    }

    //hose
    this.dropsToRemove = [];

    for ( let i = 0, numberOfDrops = this.hoseDrops.length; i < numberOfDrops; i++ ) {
      //step only the 'old' drops
      if ( this.newHoseDrops.indexOf( this.hoseDrops.get( i ) ) === -1 ) {
        this.hoseDrops.get( i ).step( dt );
      }
      //remove them as soon as they hit the ground
      if ( this.hoseDrops.get( i ).positionProperty.value.y < 0 ) {
        this.dropsToRemove.push( this.hoseDrops.get( i ) );
      }
    }

    if ( this.dropsToRemove.length > 0 ) {
      this.hoseDrops.removeAll( this.dropsToRemove.filter( drop => this.hoseDrops.includes( drop ) ) );
    }

    // update sensor values only about 10 times per sec
    // update the sensor values only when water is flowing
    if ( this.accumulatedDtForSensors > 0.1 &&
         ( this.hoseDrops.length > 0 || this.waterTowerDrops.length > 0 || this.faucetDrops.length > 0 ) ) {
      this.accumulatedDtForSensors -= 0.1;
      for ( let k = 0; k < this.speedometers.length; k++ ) {
        this.speedometers[ k ].valueProperty.value = this.getWaterDropVelocityAt( this.modelViewTransform.viewToModelX( this.speedometers[ k ].positionProperty.value.x +
                                                                                                                        50 ),
          this.modelViewTransform.viewToModelY( this.speedometers[ k ].positionProperty.value.y + 72 ) );
      }
    }
  }

  /**
   * @public
   */
  getFluidDensityString() {
    if ( this.measureUnitsProperty.value === 'english' ) {
      return StringUtils.format( valueWithUnitsPatternString,
        Utils.toFixed( Units.FLUID_DENSITY_ENGLISH_PER_METRIC * this.fluidDensityProperty.value, 2 ), densityUnitsEnglishString );
    }
    else {
      return StringUtils.format( valueWithUnitsPatternString, Utils.roundSymmetric( this.fluidDensityProperty.value ), densityUnitsMetricString );
    }
  }

  /**
   * @public
   */
  getWaterDropVelocityAt( x, y ) {

    // There might be waterdrops under the ground that are not yet removed.
    // Report (0,0) velocity for all those drops.
    if ( y < 0 ) {
      return Vector2.ZERO;
    }

    let waterDrops = this.waterTowerDrops;
    for ( let i = 0, j = waterDrops.length; i < j; i++ ) {
      if ( waterDrops.get( i ).contains( new Vector2( x, y ) ) ) {
        return waterDrops.get( i ).velocityProperty.value;
      }
    }

    waterDrops = this.hoseDrops;
    for ( let i = 0, j = waterDrops.length; i < j; i++ ) {
      if ( waterDrops.get( i ).contains( new Vector2( x, y ) ) ) {
        return waterDrops.get( i ).velocityProperty.value;
      }
    }

    return Vector2.ZERO;
  }
}

fluidPressureAndFlow.register( 'WaterTowerModel', WaterTowerModel );
export default WaterTowerModel;