// Copyright 2013-2015, University of Colorado Boulder

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
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MassModel = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/MassModel' );

  // constants

  //The size of the passage between the chambers
  var PASSAGE_SIZE = 0.5;

  //Width of the right opening to the air
  var RIGHT_OPENING_WIDTH = 2.3;

  //Width of the left opening to the air
  var LEFT_OPENING_WIDTH = 0.5;

  //Height of each chamber, physics not working properly to vary these independently
  var CHAMBER_HEIGHT = 1.3;

  //from mockup
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
  var MAX_HEIGHT = 3; // meters


  /**
   * @param {UnderPressureModel} underPressureModel -- model for the sim.
   * @constructor
   */
  function ChamberPoolModel( underPressureModel ) {

    var chamberPoolModel = this;
    PropertySet.call( this, {
      // @public
      leftDisplacement: 0, //displacement from default height
      stackMass: 0
    } );

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
      new MassModel( chamberPoolModel, 500, MASS_OFFSET, chamberPoolModel.maxY + PASSAGE_SIZE / 2, PASSAGE_SIZE,
        PASSAGE_SIZE ),
      new MassModel( chamberPoolModel, 250, MASS_OFFSET + PASSAGE_SIZE + SEPARATION,
        chamberPoolModel.maxY + PASSAGE_SIZE / 4, PASSAGE_SIZE, PASSAGE_SIZE / 2 ),
      new MassModel( chamberPoolModel, 250, MASS_OFFSET + 2 * PASSAGE_SIZE + 2 * SEPARATION,
        chamberPoolModel.maxY + PASSAGE_SIZE / 4, PASSAGE_SIZE, PASSAGE_SIZE / 2 )
    ];

    //When an item is added to the stack, update the total mass and equalize the mass velocities
    this.stack.addItemAddedListener( function( massModel ) {
      chamberPoolModel.stackMass = chamberPoolModel.stackMass + massModel.mass;

      var maxVelocity = 0;
      //must equalize velocity of each mass
      chamberPoolModel.stack.forEach( function( mass ) {
        maxVelocity = Math.max( mass.velocity, maxVelocity );
      } );
      chamberPoolModel.stack.forEach( function( mass ) {
        mass.velocity = maxVelocity;
      } );
    } );

    //When an item is removed from the stack, update the total mass.
    this.stack.addItemRemovedListener( function( massModel ) {
      chamberPoolModel.stackMass = chamberPoolModel.stackMass - massModel.mass;
    } );

    this.leftDisplacementProperty.link( function() {
      // trigger barometers update
      _.each( underPressureModel.barometers, function( barometer ) {
        barometer.trigger( 'update' );
      } );

    } );

  }

  fluidPressureAndFlow.register( 'ChamberPoolModel', ChamberPoolModel );

  return inherit( PropertySet, ChamberPoolModel, {

    // @public
    reset: function() {
      this.stack.clear();
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

      dt = Math.min( dt, nominalDt * 3 ); // Handling large dt so that masses doesn't float upward

      // Update each of the masses
      var steps = 15; // these steps are oly used for masses inside the pool to make sure they reach equilibrium state on iPad
      this.masses.forEach( function( mass ) {
        if ( self.stack.contains( mass ) ) {
          for ( var i = 0; i < steps; i++ ) {
            mass.step( dt / steps );
          }
        }
        else{
          mass.step( dt );
        }
      } );


      // If there are any masses stacked, update the water height
      if ( this.stackMass ) {
        var minY = 0; // some max value
        this.stack.forEach( function( massModel ) {
          minY = Math.min( massModel.position.y - massModel.height / 2, minY );
        } );
        this.leftDisplacement = Math.max( this.poolDimensions.leftOpening.y2 + this.leftWaterHeight - minY, 0 );
      }
      else {
        //no masses, water must get to equilibrium
        //move back toward zero displacement.  Note, this does not use correct newtonian dynamics, just a simple heuristic
        if ( this.leftDisplacement >= 0 ) {
          this.leftDisplacement -= this.leftDisplacement / 10;
        }
        else {
          this.leftDisplacement = 0;
        }
      }
    },

    /**
     * @public
     * Returns height of the water above the given position
     * @param {number} x position in meters
     * @param {number} y position in meters
     * @returns {number} height of the water above the y
     */
    getWaterHeightAboveY: function( x, y ) {
      if ( this.poolDimensions.leftOpening.x1 < x && x < this.poolDimensions.leftOpening.x2 &&
           y > this.poolDimensions.leftChamber.y2 + DEFAULT_HEIGHT - this.leftDisplacement ) {
        return 0;
      }
      else {
        return this.poolDimensions.leftChamber.y2 + DEFAULT_HEIGHT + this.leftDisplacement / this.lengthRatio - y;
      }
    },

    /**
     * @public
     * Returns true if the given point is inside the chamber pool, false otherwise.
     * @param {number} x position in meters
     * @param {number} y position in meters
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