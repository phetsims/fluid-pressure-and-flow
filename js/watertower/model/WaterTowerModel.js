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
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Hose = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/Hose' );

  // strings
  var densityUnitsEnglish = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsEnglish' );
  var densityUnitsMetric = require( 'string!FLUID_PRESSURE_AND_FLOW/densityUnitsMetric' );
  var valueWithUnitsPattern = require( 'string!FLUID_PRESSURE_AND_FLOW/valueWithUnitsPattern' );


  function WaterTowerModel() {
    this.GASOLINE_DENSITY = 700;
    this.HONEY_DENSITY = 1420;
    this.WATER_DENSITY = 1000;

    //Constants for air pressure in Pascals, Pascals is SI, see http://en.wikipedia.org/wiki/Atmospheric_pressure
    this.EARTH_AIR_PRESSURE = 101325;
    this.EARTH_AIR_PRESSURE_AT_500_FT = 99490;

    this.fluidDensityRange = new Range( this.GASOLINE_DENSITY, this.HONEY_DENSITY );

    PropertySet.call( this, {
        isRulerVisible: false,
        isMeasuringTapeVisible: false,
        isSpeedometerVisible: true,
        isHoseVisible: false,
        isPlay: true,//Whether the sim is paused or running
        faucetFlowRate: 0, // cubic meter/sec
        isFaucetEnabled: true,
        measureUnits: 'metric', //metric, english
        fluidDensity: this.WATER_DENSITY,
        rulerPosition: new Vector2( 300, 100 ), // px
        waterFlow: 'water',

        isSluiceOpen: false,
        faucetMode: 'manual', //manual or matchLeakage
        scale: 1, // scale coefficient

        //speed of the model, either 'normal' or 'slow'
        speed: 'normal'

      }
    );

    this.getStandardAirPressure = new LinearFunction( 0, 150, this.EARTH_AIR_PRESSURE, this.EARTH_AIR_PRESSURE_AT_500_FT );

    this.units = new Units();

    this.waterTower = new WaterTower();

    this.hose = new Hose( 2.5, 90 );

    this.faucetPosition = new Vector2( 1.3, 3.8 ); //faucet right co-ordinates
    this.faucetDrops = new ObservableArray();
    this.waterTowerDrops = new ObservableArray();
    this.hoseDrops = new ObservableArray();
    this.fluidColorModel = new FluidColorModel( this );

    this.barometers = [];
    for ( var i = 0; i < 4; i++ ) {
      this.barometers.push( new Barometer( new Vector2( 0, 0 ), 0 ) );
    }

    this.speedometers = [];
    for ( var j = 0; j < 4; j++ ) {
      this.speedometers.push( new VelocitySensor( new Vector2( 0, 0 ), new Vector2( 0, 0 ) ) );
    }

    DerivedProperty.multilink( [this.waterTower.isFullProperty, this.faucetModeProperty], function( isFull, faucetMode ) {
      if ( faucetMode === "manual" ) {
        this.isFaucetEnabled = !isFull;
        if ( isFull ) {
          this.faucetFlowRate = 0;
        }
      }
      else {
        this.isFaucetEnabled = false;
      }
    }.bind( this ) );

    //
    this.dropsToRemove = [];
    this.accumulatedDt = 0;
    this.accumulatedDtForSensors = 0;
    this.leakageVolume = 0;
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

      //add the fluid pressure if the point is in the water tank
      if ( x > this.waterTower.tankPosition.x && x < this.waterTower.tankPosition.x + 2 * this.waterTower.TANK_RADIUS &&
           y > this.waterTower.tankPosition.y && y < this.waterTower.tankPosition.y + this.waterTower.fluidLevel ) {
        pressure = this.getAirPressure( this.waterTower.tankPosition.y + this.waterTower.fluidLevel ) +
                   this.getFluidPressure( this.waterTower.tankPosition.y + this.waterTower.fluidLevel - y );
      }

      return pressure;
    },

    // Called by the animation loop.
    step: function( dt ) {
      if ( this.isPlay ) {
        if ( this.speed === "normal" ) {
          this.stepInternal( dt );
        }
        else {
          this.stepInternal( 0.25 * dt );
        }
      }
    },

    stepInternal: function( dt ) {

      //prevent sudden dt bursts when the user comes back to the page after a while
      dt = ( dt > 1 ) ? 1 : dt;

      // Ensure that water flow looks ok even on very low frame rates
      this.accumulatedDt += dt;
      this.accumulatedDtForSensors += dt;
      var newFaucetDrops = [];
      var newWaterTowerDrops = [];
      var newHoseDrops = [];
      var newFaucetDrop;
      var newWaterDrop;
      var newHoseDrop;

      while ( this.accumulatedDt > 0.016 ) {
        this.accumulatedDt -= 0.016;
        if ( (this.faucetMode === "manual" && this.isFaucetEnabled ) || (this.faucetMode === "matchLeakage" && this.isSluiceOpen && this.waterTower.fluidVolume > 0) ) {
          newFaucetDrop = new WaterDrop( this.faucetPosition.copy().plus( new Vector2( Math.random() * 0.04 - 0.02, 0 ) ), new Vector2( 0, 0 ), this.faucetMode === "manual" ? this.faucetFlowRate * 0.016 : this.leakageVolume );

          this.faucetDrops.push( newFaucetDrop );
          newFaucetDrops.push( newFaucetDrop );
          newFaucetDrop.step( this.accumulatedDt );
        }
        else {
          this.faucetDrops.clear();
        }

        //Add watertower drops if the tank is open and there is fluid in the tank
        if ( this.isSluiceOpen && this.waterTower.fluidVolume > 0 && !this.isHoseVisible ) {
          var radius = this.waterTower.HOLE_SIZE / 2 * 0.9;

          // ensure that the waterdrops are smaller than the fluid level
          if ( 2 * radius > this.waterTower.fluidLevel ) {
            radius = this.waterTower.fluidLevel / 2;
          }

          // ensure that the water drop is not too small
          radius = radius < 0.05 ? 0.05 : radius;
          this.leakageVolume = 4 * Math.PI * radius * radius * radius / 3;
          newWaterDrop = new WaterDrop( this.waterTower.tankPosition.plus( new Vector2( 2 * this.waterTower.TANK_RADIUS + Math.random() * 0.03, 2 * radius + Math.random() * 0.06 - 0.03 ) ), new Vector2( Math.sqrt( 2 * Constants.EARTH_GRAVITY * this.waterTower.fluidLevel ), 0 ), this.leakageVolume );
          this.waterTowerDrops.push( newWaterDrop );
          newWaterDrop.step( this.accumulatedDt );
          newWaterTowerDrops.push( newWaterDrop );
          this.waterTower.fluidVolume = this.waterTower.fluidVolume - this.leakageVolume;
        }

        //Add hose waterDrops if the tank is open and there fluid in the tank and hose visible
        if ( this.isSluiceOpen && this.waterTower.fluidVolume > 0 && this.isHoseVisible ) {
          this.leakageVolume = 0;
          var y = this.waterTower.tankPosition.y - 1.5 + this.hose.nozzleY + 0.3 * Math.sin( this.hose.angle * Math.PI / 180 ) - 0.25 * Math.cos( this.hose.angle * Math.PI / 180 );
          if ( y < this.waterTower.fluidLevel + this.waterTower.tankPosition.y ) {
            this.leakageVolume = 0.004;
            var velocityMagnitude = Math.sqrt( 2 * Constants.EARTH_GRAVITY * (this.waterTower.tankPosition.y + this.waterTower.fluidLevel - y) );
            newHoseDrop = new WaterDrop( new Vector2( this.hose.nozzleX + this.waterTower.tankPosition.x + 2 * this.waterTower.TANK_RADIUS - 0.7 * Math.sin( this.hose.angle * Math.PI / 180 ) + 0.1 * Math.cos( this.hose.angle * Math.PI / 180 ) + Math.random() * 0.04 - 0.02,
                  this.waterTower.tankPosition.y - 1.5 + this.hose.nozzleY + 0.3 * Math.sin( this.hose.angle * Math.PI / 180 ) - 0.25 * Math.cos( this.hose.angle * Math.PI / 180 ) + Math.random() * 0.04 - 0.02 ),
              new Vector2( velocityMagnitude * Math.cos( this.hose.angle * Math.PI / 180 ), velocityMagnitude * Math.sin( this.hose.angle * Math.PI / 180 ) ), this.leakageVolume );

            this.hoseDrops.push( newHoseDrop );
            newHoseDrop.step( this.accumulatedDt );
            newHoseDrops.push( newHoseDrop );
            this.waterTower.fluidVolume = this.waterTower.fluidVolume - this.leakageVolume;
          }
        }

      }

      for ( var i = 0, numberOfDrops = this.faucetDrops.length; i < numberOfDrops; i++ ) {
        //step only the 'old' drops
        if ( newFaucetDrops.indexOf( this.faucetDrops.get( i ) ) === -1 ) {
          this.faucetDrops.get( i ).step( dt );
        }

        //check if the faucetDrops hit the fluidLevel
        if ( this.faucetDrops.get( i ).position.y < 0.03 + this.waterTower.tankPosition.y + this.waterTower.fluidLevel + this.faucetDrops.get( i ).radius ) {
          this.dropsToRemove.push( this.faucetDrops.get( i ) );
          if ( this.waterTower.fluidVolume <= this.waterTower.TANK_VOLUME - this.faucetDrops.get( i ).volume ) {
            this.waterTower.fluidVolume = this.waterTower.fluidVolume + this.faucetDrops.get( i ).volume;
          }
        }
      }

      this.faucetDrops.removeAll( this.dropsToRemove );

      this.dropsToRemove = [];
      for ( i = 0, numberOfDrops = this.waterTowerDrops.length; i < numberOfDrops; i++ ) {
        //step only the 'old' drops
        if ( newWaterTowerDrops.indexOf( this.waterTowerDrops.get( i ) ) === -1 ) {
          this.waterTowerDrops.get( i ).step( dt );
        }

        //remove them as soon as they hit the ground
        if ( this.waterTowerDrops.get( i ).position.y < this.waterTowerDrops.get( i ).radius ) {
          this.dropsToRemove.push( this.waterTowerDrops.get( i ) );
        }
      }
      this.waterTowerDrops.removeAll( this.dropsToRemove );


      //hose

      this.dropsToRemove = [];

      for ( i = 0, numberOfDrops = this.hoseDrops.length; i < numberOfDrops; i++ ) {
        //step only the 'old' drops
        if ( newHoseDrops.indexOf( this.hoseDrops.get( i ) ) === -1 ) {
          this.hoseDrops.get( i ).step( dt );
        }
        //remove them as soon as they hit the ground
        if ( this.hoseDrops.get( i ).position.y < this.hoseDrops.get( i ).radius ) {
          this.dropsToRemove.push( this.hoseDrops.get( i ) );
        }
      }
      this.hoseDrops.removeAll( this.dropsToRemove );

      // update sensor values only about 4 times per sec
      if ( this.accumulatedDtForSensors > 0.25 ) {
        this.accumulatedDtForSensors -= 0.25;
        for ( var k = 0; k < this.speedometers.length; k++ ) {
          this.speedometers[k].value = this.waterDropVelocityAt( this.modelViewTransform.viewToModelX( this.speedometers[k].position.x + 50 ), this.modelViewTransform.viewToModelY( this.speedometers[k].position.y + 75 ) );
        }

        for ( k = 0; k < this.barometers.length; k++ ) {
          this.barometers[k].value = this.getPressureAtCoords( this.modelViewTransform.viewToModelX( this.barometers[k].position.x ), this.modelViewTransform.viewToModelY( this.barometers[k].position.y + (60) ) );
        }
      }
    },

    getFluidDensityString: function() {
      if ( this.measureUnits === 'english' ) {
        return StringUtils.format( valueWithUnitsPattern, Math.round( Units.FLUID_DENSITY_ENGLISH_PER_METRIC * this.fluidDensity ), densityUnitsEnglish );
      }
      else {
        return StringUtils.format( valueWithUnitsPattern, Math.round( this.fluidDensity ), densityUnitsMetric );
      }
    },

    waterDropVelocityAt: function( x, y ) {
      var waterDrops = (this.isHoseVisible) ? this.hoseDrops : this.waterTowerDrops;

      for ( var i = 0, j = waterDrops.length; i < j; i++ ) {
        if ( waterDrops.get( i ).contains( new Vector2( x, y ) ) ) {
          return waterDrops.get( i ).velocity;
        }
      }
      return Vector2.ZERO;
    }

  } );
} );