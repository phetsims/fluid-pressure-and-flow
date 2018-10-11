// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model for the Chamber Pool screen of Under Pressure sim.
 * Models the chamber shape and stack of masses that can be dropped in the chamber.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MassModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/MassModel' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );

  // constants
  // empirically determined to match the visual appearance from design document

  //The size of the passage between the chambers
  var PASSAGE_SIZE = 0.5;

  //Width of the right opening to the air
  var RIGHT_OPENING_WIDTH = 2.3;

  //Width of the left opening to the air
  var LEFT_OPENING_WIDTH = 0.5;

  //Height of each chamber, physics not working properly to vary these independently
  var CHAMBER_HEIGHT = 1.3;

  //left chamber start x
  var LEFT_CHAMBER_X = 1.55;
  var LEFT_CHAMBER_WIDTH = 2.8;

  //right(bottom) chamber start x
  var RIGHT_CHAMBER_X = 6.27;
  var RIGHT_CHAMBER_WIDTH = 1.1;

  var MASS_OFFSET = 1.35; // start x-coordinate of first mass
  var SEPARATION = 0.03; //separation between masses

  var DEFAULT_HEIGHT = 2.3; //meters, without load

  //The entire apparatus is this tall
  var MAX_HEIGHT = Constants.MAX_POOL_HEIGHT; // meters

  /**
   * @param {UnderPressureModel} underPressureModel -- model for the sim.
   * @constructor
   */
  function ChamberPoolModel( underPressureModel ) {

    var self = this;
    this.leftDisplacementProperty = new Property( 0 ); //displacement from default height
    this.stackMassProperty = new Property( 0 );

    // @public (read-only)
    this.volumeProperty = new Property( 1 );// TODO: what should this number be?  Does it even matter?  I don't think it has any bearing on the model.

    this.underPressureModel = underPressureModel;

    //Use the length ratio instead of area ratio because the quadratic factor makes it too hard to see the
    // water move on the right, and decreases the pressure effect too much to see it
    this.lengthRatio = RIGHT_OPENING_WIDTH / LEFT_OPENING_WIDTH; // @public

    //default left opening water height
    this.leftWaterHeight = DEFAULT_HEIGHT - CHAMBER_HEIGHT; // @public

    //masses can't have y-coord more that this, sky height - grass height
    this.maxY = 0.05; // @public

    // @public
    this.poolDimensions = {
      leftChamber: {
        x1: LEFT_CHAMBER_X,
        y1: -( MAX_HEIGHT - CHAMBER_HEIGHT ),
        x2: LEFT_CHAMBER_X + LEFT_CHAMBER_WIDTH,
        y2: -( MAX_HEIGHT )
      },
      rightChamber: {
        x1: RIGHT_CHAMBER_X,
        y1: -( MAX_HEIGHT - CHAMBER_HEIGHT ),
        x2: RIGHT_CHAMBER_X + RIGHT_CHAMBER_WIDTH,
        y2: -( MAX_HEIGHT )
      },
      horizontalPassage: {
        x1: LEFT_CHAMBER_X + LEFT_CHAMBER_WIDTH,
        y1: -( MAX_HEIGHT - PASSAGE_SIZE * 3 / 2),
        x2: RIGHT_CHAMBER_X,
        y2: -( MAX_HEIGHT - PASSAGE_SIZE / 2 )
      },
      leftOpening: {
        x1: LEFT_CHAMBER_X + LEFT_CHAMBER_WIDTH / 2 - LEFT_OPENING_WIDTH / 2,
        y1: 0,
        x2: LEFT_CHAMBER_X + LEFT_CHAMBER_WIDTH / 2 + LEFT_OPENING_WIDTH / 2,
        y2: -( MAX_HEIGHT - CHAMBER_HEIGHT )
      },
      rightOpening: {
        x1: RIGHT_CHAMBER_X + RIGHT_CHAMBER_WIDTH / 2 - RIGHT_OPENING_WIDTH / 2,
        y1: 0,
        x2: RIGHT_CHAMBER_X + RIGHT_CHAMBER_WIDTH / 2 + RIGHT_OPENING_WIDTH / 2,
        y2: -( MAX_HEIGHT - CHAMBER_HEIGHT )
      }
    };

    //List of masses that are currently stacked
    this.stack = new ObservableArray(); // @public

    // @public
    //List of all available masses
    this.masses = [
      new MassModel( self, 500, MASS_OFFSET, self.maxY + PASSAGE_SIZE / 2, PASSAGE_SIZE,
        PASSAGE_SIZE ),
      new MassModel( self, 250, MASS_OFFSET + PASSAGE_SIZE + SEPARATION,
        self.maxY + PASSAGE_SIZE / 4, PASSAGE_SIZE, PASSAGE_SIZE / 2 ),
      new MassModel( self, 250, MASS_OFFSET + 2 * PASSAGE_SIZE + 2 * SEPARATION,
        self.maxY + PASSAGE_SIZE / 4, PASSAGE_SIZE, PASSAGE_SIZE / 2 )
    ];

    //When an item is added to the stack, update the total mass and equalize the mass velocities
    this.stack.addItemAddedListener( function( massModel ) {
      self.stackMassProperty.value = self.stackMassProperty.value + massModel.mass;

      var maxVelocity = 0;
      //must equalize velocity of each mass
      self.stack.forEach( function( mass ) {
        maxVelocity = Math.max( mass.velocity, maxVelocity );
      } );
      self.stack.forEach( function( mass ) {
        mass.velocity = maxVelocity;
      } );
    } );

    //When an item is removed from the stack, update the total mass.
    this.stack.addItemRemovedListener( function( massModel ) {
      self.stackMassProperty.value = self.stackMassProperty.value - massModel.mass;
    } );

    this.leftDisplacementProperty.link( function() {
      // update all barometers
      _.each( underPressureModel.barometers, function( barometer ) {
        barometer.updateEmitter.emit();
      } );
    } );
  }

  fluidPressureAndFlow.register( 'ChamberPoolModel', ChamberPoolModel );

  return inherit( Object, ChamberPoolModel, {

    // @public
    reset: function() {
      this.stack.clear();
      this.leftDisplacementProperty.reset();
      this.stackMassProperty.reset();
      this.masses.forEach( function( mass ) {
        mass.reset();
      } );
    },

    /**
     * @public
     * Steps the chamber pool dimensions forward in time by dt seconds
     * @param {number} dt -- time in seconds
     */
    step: function( dt ) {
      var self = this;
      var nominalDt = 1 / 60;

      dt = Math.min( dt, nominalDt * 3 ); // Handling large dt so that masses doesn't float upward, empirically determined

      // Update each of the masses
      var steps = 15; // these steps are oly used for masses inside the pool to make sure they reach equilibrium state on iPad
      this.masses.forEach( function( mass ) {
        if ( self.stack.contains( mass ) ) {
          for ( var i = 0; i < steps; i++ ) {
            mass.step( dt / steps );
          }
        }
        else {
          mass.step( dt );
        }
      } );

      // If there are any masses stacked, update the water height
      if ( this.stackMassProperty.value ) {
        var minY = 0; // some max value
        this.stack.forEach( function( massModel ) {
          minY = Math.min( massModel.positionProperty.value.y - massModel.height / 2, minY );
        } );
        this.leftDisplacementProperty.value = Math.max( this.poolDimensions.leftOpening.y2 + this.leftWaterHeight - minY, 0 );
      }
      else {
        //no masses, water must get to equilibrium
        //move back toward zero displacement.  Note, this does not use correct newtonian dynamics, just a simple heuristic
        if ( this.leftDisplacementProperty.value >= 0 ) {
          this.leftDisplacementProperty.value -= this.leftDisplacementProperty.value / 10;
        }
        else {
          this.leftDisplacementProperty.value = 0;
        }
      }
    },

    /**
     * @public
     * Returns height of the water above the given position
     * @param {number} x - position in meters
     * @param {number} y - position in meters
     * @returns {number} height of the water above the y
     */
    getWaterHeightAboveY: function( x, y ) {
      if ( this.poolDimensions.leftOpening.x1 < x && x < this.poolDimensions.leftOpening.x2 &&
           y > this.poolDimensions.leftChamber.y2 + DEFAULT_HEIGHT - this.leftDisplacementProperty.value ) {
        return 0;
      }
      else {
        return this.poolDimensions.leftChamber.y2 + DEFAULT_HEIGHT + this.leftDisplacementProperty.value / this.lengthRatio - y;
      }
    },

    /**
     * @public
     * Returns true if the given point is inside the chamber pool, false otherwise.
     * @param {number} x - position in meters
     * @param {number} y - position in meters
     * @returns {boolean}
     */
    isPointInsidePool: function( x, y ) {
      var keys = _.keys( this.poolDimensions );
      for ( var i = 0; i < keys.length; i++ ) {
        var dimension = this.poolDimensions[ keys[ i ] ];
        if ( x > dimension.x1 && x < dimension.x2 && y < dimension.y1 && y > dimension.y2 ) {
          return true;
        }
      }
      return false;
    }
  } );
} );