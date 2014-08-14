//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'Water Tower' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Vector2 = require( 'DOT/Vector2' );
  var Units = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/Units' );
  var Barometer = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/Barometer' );
  var VelocitySensor = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/VelocitySensor' );
  var WaterTower = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/WaterTower' );
  var WaterDrop = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/WaterDrop' );
  var FluidColorModel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/FluidColorModel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/watertower/Constants' );
  var Property = require( 'AXON/Property' );
  var Hose = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/Hose' );
  var Util = require( 'DOT/Util' );

  // strings
  var densityUnitsEnglish = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsEnglish' );
  var densityUnitsMetric = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsMetric' );
  var valueWithUnitsPattern = require( 'string!FLUID_PRESSURE_AND_FLOW/valueWithUnitsPattern' );


  /**
   * Constructor for the sim model.
   * Origin is at the left bound on the ground. And y grows in the direction of sky from ground.
   * @constructor
   */
  function WaterTowerModel() {

    this.fluidDensityRange = new Range( Constants.GASOLINE_DENSITY, Constants.HONEY_DENSITY );

    PropertySet.call( this, {
        isRulerVisible: false,
        isMeasuringTapeVisible: false,
        isSpeedometerVisible: true,
        isHoseVisible: false,
        isPlay: true,//Whether the sim is paused or running
        faucetFlowRate: 0, // cubic meter/sec
        isFaucetEnabled: true,
        measureUnits: 'metric', //metric, english
        fluidDensity: Constants.WATER_DENSITY,
        rulerPosition: new Vector2( 300, 350 ), // px
        measuringTapePosition: new Vector2( 150, 351 ), // px
        waterFlow: 'water',
        isSluiceOpen: false,
        faucetMode: 'manual', //manual or matchLeakage
        scale: 1, // scale coefficient
        //speed of the model, either 'normal' or 'slow'
        speed: 'normal',
        // the number of seconds tank has been full for. This property is used to enable/disable the fill button.
        // Fill button is disabled only when the tank has been full for at least 1 sec
        tankFullLevelDuration: 0
      }
    );

    this.getStandardAirPressure = new LinearFunction( 0, 150, Constants.EARTH_AIR_PRESSURE, Constants.EARTH_AIR_PRESSURE_AT_500_FT );

    // position the tank frame at (1, 1.5). (0, 0) is the left most point on the ground.
    this.waterTower = new WaterTower( { tankPosition: new Vector2( 7, 11.1 ) } ); //INITIAL_Y is 15 in java

    this.hose = new Hose( 4, Math.PI / 2 );

    this.faucetPosition = new Vector2( 9.1, 26.6 ); //faucet right co-ordinates
    this.faucetDrops = new ObservableArray();
    this.waterTowerDrops = new ObservableArray();
    this.hoseDrops = new ObservableArray();
    this.fluidColorModel = new FluidColorModel( this );

    this.barometers = [];
    for ( var i = 0; i < 2; i++ ) {
      this.barometers.push( new Barometer( new Vector2( 0, 0 ), 101035 ) );
    }

    this.speedometers = [];
    for ( var j = 0; j < 2; j++ ) {
      this.speedometers.push( new VelocitySensor( new Vector2( 0, 0 ), new Vector2( 0, 0 ) ) );
    }

    Property.multilink( [this.waterTower.isFullProperty, this.faucetModeProperty], function( isFull, faucetMode ) {
      if ( faucetMode === 'manual' ) {
        this.isFaucetEnabled = !isFull;
        if ( isFull ) {
          this.faucetFlowRate = 0;
        }
      }
      else {
        this.isFaucetEnabled = false;
      }
    }.bind( this ) );

    // variables used in step function. Declaring here to avoid gc
    this.dropsToRemove = [];
    this.accumulatedDt = 0;
    this.accumulatedDtForSensors = 0;

    this.accumulatedDtForFlowRate = 0;
    this.accumulatedWaterExpelled = 0;
    this.leakageVolume = 0;
    this.newFaucetDrops = [];
    this.newWaterTowerDrops = [];
    this.newHoseDrops = [];
  }

  return inherit( PropertySet, WaterTowerModel, {

    // Resets all model elements
    reset: function() {
      PropertySet.prototype.reset.call( this );

      _.each( this.barometers, function( barometer ) {
        barometer.reset();
      } );

      _.each( this.speedometers, function( speedometer ) {
        speedometer.reset();
      } );
      this.waterTower.reset();
      this.faucetDrops.clear();
      this.waterTowerDrops.clear();
      this.hoseDrops.clear();
    },

    getAirPressure: function( height ) {
      return this.getStandardAirPressure( height );
    },

    getFluidPressure: function( height ) {
      return height * 9.8 * this.fluidDensity;
    },

    getPressureAtCoords: function( x, y ) {
      //
      if ( y < 0 ) {
        return 0;
      }

      var pressure = this.getAirPressure( y );

      //add the fluid pressure if the point is inside the fluid in the tank
      if ( this.isPointInWater( x, y ) ) {
        pressure = this.getAirPressure( this.waterTower.tankPosition.y + this.waterTower.fluidLevel ) +
                   this.getFluidPressure( this.waterTower.tankPosition.y + this.waterTower.fluidLevel - y );
      }

      return pressure;
    },

    isPointInWater: function( x, y ) {
      return (x > this.waterTower.tankPosition.x && x < this.waterTower.tankPosition.x + 2 * this.waterTower.TANK_RADIUS &&
              y > this.waterTower.tankPosition.y && y < this.waterTower.tankPosition.y + this.waterTower.fluidLevel);
    },

    // Called by the animation loop.
    step: function( dt ) {
      // prevent sudden dt bursts on slow devices or when the user comes back to the tab after a while
      dt = ( dt > 0.04 ) ? 0.04 : dt;
      if ( this.isPlay ) {
        if ( this.speed === 'normal' ) {
          this.stepInternal( dt );
        }
        else {
          this.stepInternal( 0.33 * dt );
        }
      }
    },

    stepInternal: function( dt ) {

      // Ensure that water flow looks ok even on very low frame rates
      this.accumulatedDt += dt;
      this.accumulatedDtForSensors += dt;
      this.accumulatedDtForFlowRate += dt;

      var newFaucetDrop;
      var newWaterDrop;
      var newHoseDrop;
      var remainingVolume;
      var waterVolumeExpelled;

      this.newFaucetDrops = [];
      this.newWaterTowerDrops = [];
      this.newHoseDrops = [];

      while ( this.accumulatedDt > 0.016 ) {
        this.accumulatedDt -= 0.016;
        if ( (this.faucetMode === 'manual' && this.isFaucetEnabled && this.faucetFlowRate > 0) || (this.faucetMode === 'matchLeakage' && this.isSluiceOpen && this.waterTower.fluidVolume > 0) ) {
          newFaucetDrop = new WaterDrop( this.faucetPosition.copy().plus( new Vector2( Math.random() * 0.2 - 0.1, 1.5 ) ), new Vector2( 0, 0 ), this.faucetMode === 'manual' ? this.faucetFlowRate * 0.016 : this.leakageVolume );
          this.faucetDrops.push( newFaucetDrop );
          this.newFaucetDrops.push( newFaucetDrop );
          newFaucetDrop.step( this.accumulatedDt );
        }

        // Add watertower drops if the tank is open and there is enough fluid in the tank to be visible on the tower
        // Note: If fluid volume is very low (the fluid level is less than 1px height) then sometimes it doesn't show on the tower, but is visible with a magnifier
        if ( this.isSluiceOpen && this.waterTower.fluidVolume > 0 && !this.isHoseVisible ) {

          this.velocityMagnitude = Math.sqrt( 2 * Constants.EARTH_GRAVITY * this.waterTower.fluidLevel );

          waterVolumeExpelled = this.velocityMagnitude * 2.8 * 0.016;

          remainingVolume = this.waterTower.fluidVolume;
          this.leakageVolume = remainingVolume > waterVolumeExpelled ? waterVolumeExpelled : remainingVolume;
          var dropVolume = this.leakageVolume;
          var radius = Util.cubeRoot( (3 * this.leakageVolume) / (4 * Math.PI) );

          // when the fluid level is less than the sluice hole, ensure that the water drops are not bigger than the fluid level
          if ( this.waterTower.fluidLevel < this.waterTower.HOLE_SIZE && radius > this.waterTower.fluidLevel / 2 ) {
            radius = this.waterTower.fluidLevel / 2;
            // ensure a minimum radius so that the water drop is visible on the screen
            if ( radius < 0.1 ) {
              radius = 0.1;
            }
            dropVolume = 4 * Math.PI * radius * radius * radius / 3;
          }

          newWaterDrop = new WaterDrop( this.waterTower.tankPosition.plus( new Vector2( 2 * this.waterTower.TANK_RADIUS, 0.25 + radius ) ), new Vector2( this.velocityMagnitude, 0 ), dropVolume );
          this.waterTowerDrops.push( newWaterDrop );
          newWaterDrop.step( this.accumulatedDt );
          this.newWaterTowerDrops.push( newWaterDrop );

          if ( this.faucetMode === 'manual' ) {
            this.waterTower.fluidVolume = this.waterTower.fluidVolume - this.leakageVolume;
          }
          this.accumulatedWaterExpelled += this.leakageVolume;
        }

        // Add hose drops if the tank is open and there is fluid in the tank to be visible on the tower and the hose is visible
        // Note: If fluid volume is very low (the fluid level is less than 1px height) then sometimes it doesn't show on the tower, but is visible with a magnifier
        if ( this.isSluiceOpen && this.waterTower.fluidVolume > 0 && this.isHoseVisible ) {
          this.leakageVolume = 0;
          var y = this.hose.rotationPivotY + this.waterTower.tankPosition.y + 0.1;
          if ( y < this.waterTower.fluidLevel + this.waterTower.tankPosition.y ) {
            this.velocityMagnitude = Math.sqrt( 2 * Constants.EARTH_GRAVITY * (this.waterTower.tankPosition.y + this.waterTower.fluidLevel - y) );
            waterVolumeExpelled = this.velocityMagnitude * 2.8 * 0.016;
            remainingVolume = this.waterTower.fluidVolume;
            this.leakageVolume = remainingVolume > waterVolumeExpelled ? waterVolumeExpelled : remainingVolume;

            newHoseDrop = new WaterDrop( new Vector2( this.hose.rotationPivotX + this.waterTower.tankPosition.x + 2 * this.waterTower.TANK_RADIUS - 0.1 + Math.random() * 0.2 - 0.1,
                  y + Math.random() * 0.2 - 0.1 ),
              new Vector2( this.velocityMagnitude * Math.cos( this.hose.angle ), this.velocityMagnitude * Math.sin( this.hose.angle ) ), this.leakageVolume );

            this.hoseDrops.push( newHoseDrop );
            newHoseDrop.step( this.accumulatedDt );
            this.newHoseDrops.push( newHoseDrop );
            if ( this.faucetMode === 'manual' ) {
              this.waterTower.fluidVolume = this.waterTower.fluidVolume - this.leakageVolume;
            }
          }
          this.accumulatedWaterExpelled += this.leakageVolume;
        }

      }

      for ( var i = 0, numberOfDrops = this.faucetDrops.length; i < numberOfDrops; i++ ) {
        // step only the 'old' drops
        if ( this.newFaucetDrops.indexOf( this.faucetDrops.get( i ) ) === -1 ) {
          this.faucetDrops.get( i ).step( dt );
        }

        // check if the faucetDrops hit the fluidLevel
        if ( this.faucetDrops.get( i ).position.y < this.waterTower.tankPosition.y + ((this.waterTower.fluidLevel > this.faucetDrops.get( i ).radius) ? this.waterTower.fluidLevel + this.faucetDrops.get( i ).radius : 0.3 + this.faucetDrops.get( i ).radius) ) {
          this.dropsToRemove.push( this.faucetDrops.get( i ) );

          if ( this.waterTower.fluidVolume < this.waterTower.TANK_VOLUME && this.faucetMode === 'manual' ) {
            this.waterTower.fluidVolume = this.waterTower.fluidVolume + this.faucetDrops.get( i ).volume;
          }

          if ( this.waterTower.fluidVolume > this.waterTower.TANK_VOLUME ) {
            this.waterTower.fluidVolume = this.waterTower.TANK_VOLUME;
          }
        }
      }

      // Update the value only when it is less than 1. We are only interested in the 1 sec boundary.
      // Otherwise it will trigger too many updates.
      if ( this.waterTower.fluidVolume >= this.waterTower.TANK_VOLUME ) {
        if ( this.tankFullLevelDuration < 1 ) {
          this.tankFullLevelDuration += dt;
        }
      }
      else {
        this.tankFullLevelDuration = 0;
      }

      // update the faucet flow rate every 2 seconds
      if ( this.accumulatedDtForFlowRate > 2 ) {
        if ( this.faucetMode === 'matchLeakage' ) {
          this.faucetFlowRate = (this.isSluiceOpen) ? this.accumulatedWaterExpelled / 0.1 : 0;
        }
        this.accumulatedWaterExpelled = 0;
        this.accumulatedDtForFlowRate = 0;
      }

      if ( this.dropsToRemove.length > 0 ) {
        this.faucetDrops.removeAll( this.dropsToRemove );
      }

      this.dropsToRemove = [];
      for ( i = 0, numberOfDrops = this.waterTowerDrops.length; i < numberOfDrops; i++ ) {
        //step only the 'old' drops
        if ( this.newWaterTowerDrops.indexOf( this.waterTowerDrops.get( i ) ) === -1 ) {
          this.waterTowerDrops.get( i ).step( dt );
        }

        //remove them as soon as they go below the ground
        if ( this.waterTowerDrops.get( i ).position.y < 0 ) {
          this.dropsToRemove.push( this.waterTowerDrops.get( i ) );
        }
      }

      if ( this.dropsToRemove.length > 0 ) {
        this.waterTowerDrops.removeAll( this.dropsToRemove );
      }

      //hose
      this.dropsToRemove = [];

      for ( i = 0, numberOfDrops = this.hoseDrops.length; i < numberOfDrops; i++ ) {
        //step only the 'old' drops
        if ( this.newHoseDrops.indexOf( this.hoseDrops.get( i ) ) === -1 ) {
          this.hoseDrops.get( i ).step( dt );
        }
        //remove them as soon as they hit the ground
        if ( this.hoseDrops.get( i ).position.y < 0 ) {
          this.dropsToRemove.push( this.hoseDrops.get( i ) );
        }
      }

      if ( this.dropsToRemove.length > 0 ) {
        this.hoseDrops.removeAll( this.dropsToRemove );
      }

      // update sensor values only about 10 times per sec
      // update the sensor values only when water is flowing
      if ( this.accumulatedDtForSensors > 0.1 && (this.hoseDrops.length > 0 || this.waterTowerDrops.length > 0 || this.faucetDrops.length > 0)) {
        this.accumulatedDtForSensors -= 0.1;
        for ( var k = 0; k < this.speedometers.length; k++ ) {
          this.speedometers[k].value = this.getWaterDropVelocityAt( this.modelViewTransform.viewToModelX( this.speedometers[k].position.x + 50 ), this.modelViewTransform.viewToModelY( this.speedometers[k].position.y + 72 ) );
        }

        for ( k = 0; k < this.barometers.length; k++ ) {
          this.barometers[k].value = this.getPressureAtCoords( this.modelViewTransform.viewToModelX( this.barometers[k].position.x ), this.modelViewTransform.viewToModelY( this.barometers[k].position.y + (62) ) );
        }
      }
    },

    getFluidDensityString: function() {
      if ( this.measureUnits === 'english' ) {
        return StringUtils.format( valueWithUnitsPattern, (Units.FLUID_DENSITY_ENGLISH_PER_METRIC * this.fluidDensity).toFixed( 2 ), densityUnitsEnglish );
      }
      else {
        return StringUtils.format( valueWithUnitsPattern, Math.round( this.fluidDensity ), densityUnitsMetric );
      }
    },

    getWaterDropVelocityAt: function( x, y ) {
      var waterDrops = this.waterTowerDrops;

      // There might be waterdrops under the ground that are not yet removed.
      // Report (0,0) velocity for all those drops.
      if ( y < 0 ) {
        return Vector2.ZERO;
      }

      for ( var i = 0, j = waterDrops.length; i < j; i++ ) {
        if ( waterDrops.get( i ).contains( new Vector2( x, y ) ) ) {
          return waterDrops.get( i ).velocity;
        }
      }

      waterDrops = this.hoseDrops;
      for ( i = 0, j = waterDrops.length; i < j; i++ ) {
        if ( waterDrops.get( i ).contains( new Vector2( x, y ) ) ) {
          return waterDrops.get( i ).velocity;
        }
      }

      return Vector2.ZERO;
    }

  } );
} );