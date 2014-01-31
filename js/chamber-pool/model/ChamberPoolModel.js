// Copyright 2002-2013, University of Colorado Boulder

/**
 * main Model container for chamber pool screen.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MassModel = require( 'chamber-pool/model/MassModel' );

  var lastDt = 0;//to filter dt in step.

  function ChamberPoolModel( globalModel ) {
    var self = this;

    this.globalModel = globalModel;

    //constants, from java model
    //The entire apparatus is this tall
    this.MAX_HEIGHT = 3; // meters

    this.DEFAULT_HEIGHT = 2.5; //meters, without load

    //The size of the passage between the chambers
    var PASSAGE_SIZE = 0.5;

    //Width of the right opening to the air
    var RIGHT_OPENING_WIDTH = 2.5;

    //Width of the left opening to the air
    var LEFT_OPENING_WIDTH = 0.5;

    //Use the length ratio instead of area ratio because the quadratic factor makes it too hard to see the water move on the right, and decreases the pressure effect too much to see it
    this.LENGTH_RATIO = RIGHT_OPENING_WIDTH / LEFT_OPENING_WIDTH;

    //Height of each chamber, physics not working properly to vary these independently
    var CHAMBER_HEIGHT = 1.25;

    //from mockup
    //left chamber start x
    var LEFT_CHAMBER_X = 1.5;
    var LEFT_CHAMBER_WIDTH = 3;

    //right(bottom) chamber start x
    var RIGHT_CHAMBER_X = 6.5;
    var RIGHT_CHAMBER_WIDTH = 1.25;

    //default left opening water height
    this.LEFT_WATER_HEIGHT = 1.0;

    //masses can't have y-coord more that this, sky height - grass height
    this.MAX_Y = self.globalModel.skyGroundBoundY - 0.05;

    var massOffset = 1.05; // start x-coordinate of first mass
    var separation = 0.03; //separation between masses

    this.poolDimensions = {
      leftChamber: {
        x1: LEFT_CHAMBER_X,
        y1: self.globalModel.skyGroundBoundY + self.MAX_HEIGHT - CHAMBER_HEIGHT,
        x2: LEFT_CHAMBER_X + LEFT_CHAMBER_WIDTH,
        y2: self.globalModel.skyGroundBoundY + self.MAX_HEIGHT
      },
      rightChamber: {
        x1: RIGHT_CHAMBER_X,
        y1: self.globalModel.skyGroundBoundY + self.MAX_HEIGHT - CHAMBER_HEIGHT,
        x2: RIGHT_CHAMBER_X + RIGHT_CHAMBER_WIDTH,
        y2: self.globalModel.skyGroundBoundY + self.MAX_HEIGHT
      },
      horizontalPassage: {
        x1: LEFT_CHAMBER_X + LEFT_CHAMBER_WIDTH,
        y1: self.globalModel.skyGroundBoundY + self.MAX_HEIGHT - PASSAGE_SIZE * 3 / 2,
        x2: RIGHT_CHAMBER_X,
        y2: self.globalModel.skyGroundBoundY + self.MAX_HEIGHT - PASSAGE_SIZE / 2
      },
      leftOpening: {
        x1: LEFT_CHAMBER_X + LEFT_CHAMBER_WIDTH / 2 - LEFT_OPENING_WIDTH / 2,
        y1: self.globalModel.skyGroundBoundY,
        x2: LEFT_CHAMBER_X + LEFT_CHAMBER_WIDTH / 2 + LEFT_OPENING_WIDTH / 2,
        y2: self.globalModel.skyGroundBoundY + self.MAX_HEIGHT - CHAMBER_HEIGHT
      },
      rightOpening: {
        x1: RIGHT_CHAMBER_X + RIGHT_CHAMBER_WIDTH / 2 - RIGHT_OPENING_WIDTH / 2,
        y1: self.globalModel.skyGroundBoundY,
        x2: RIGHT_CHAMBER_X + RIGHT_CHAMBER_WIDTH / 2 + RIGHT_OPENING_WIDTH / 2,
        y2: self.globalModel.skyGroundBoundY + self.MAX_HEIGHT - CHAMBER_HEIGHT
      }
    };

    //stack of masses
    this.stack = new ObservableArray();

    PropertySet.call( this, {stackMass: 0} ); //REVIEW: This is essentially the superconstructor call.  Any reason it's here and not at the top?

    this.masses = [
      new MassModel( self, 500, massOffset, self.MAX_Y - PASSAGE_SIZE, PASSAGE_SIZE, PASSAGE_SIZE ),
      new MassModel( self, 250, massOffset + PASSAGE_SIZE + separation, self.MAX_Y - PASSAGE_SIZE / 2, PASSAGE_SIZE, PASSAGE_SIZE / 2 ),
      new MassModel( self, 250, massOffset + 2 * PASSAGE_SIZE + 2 * separation, self.MAX_Y - PASSAGE_SIZE / 2, PASSAGE_SIZE, PASSAGE_SIZE / 2 )
    ];

    this.stack.addListeners(
      function( massModel ) {
        self.stackMass = self.stackMass + massModel.mass;
        var maxVelocity = 0;
        //must equalize velocity of each mass
        self.stack.forEach( function( mass ) {
          maxVelocity = Math.max( mass.velocity, maxVelocity );
        } );
        self.stack.forEach( function( mass ) {
          mass.velocity = maxVelocity;
        } );
      },
      function( massModel ) {
        self.stackMass = self.stackMass - massModel.mass;
      } );
  }

  return inherit( PropertySet, ChamberPoolModel, {
    reset: function() {
      this.stack.clear();
      this.masses.forEach( function( mass ) {
        mass.reset();
      } );
    },
    step: function( dt ) {
      if ( !lastDt ) {lastDt = dt;} // init lastDt value

      if ( Math.abs( lastDt - dt ) > lastDt * 0.3 ) {
        dt = lastDt;
      }
      else {
        lastDt = dt;
      }

      var steps = 10;
      this.masses.forEach( function( mass ) {
        for ( var i = 0; i < steps; i++ ) {
          mass.step( dt / steps );
        }
      } );
      if ( this.stackMass ) {
        var maxY = 0;
        this.stack.forEach( function( massModel ) {
          maxY = Math.max( massModel.position.y + massModel.height, maxY );
        } );
        this.globalModel.leftDisplacement = maxY - (this.poolDimensions.leftOpening.y2 - this.LEFT_WATER_HEIGHT);
      }
      else {
        //no masses, water must get to equilibrium
        //move back toward zero displacement.  Note, this does not use correct newtonian dynamics, just a simple heuristic
        if ( this.globalModel.leftDisplacement >= 0 ) {
          this.globalModel.leftDisplacement -= this.globalModel.leftDisplacement / 10;
        }
        else {
          this.globalModel.leftDisplacement = 0;
        }
      }
    },
    getPressureAtCoords: function( x, y ) {
      var pressure = "";

      if ( y < this.globalModel.skyGroundBoundY ) {
        pressure = this.globalModel.getAirPressure( y );
      }
      else if ( this.isPointInsidePool( x, y ) ) {
        //inside pool
        //if in left opening over masses, than air pressure
        if ( this.poolDimensions.leftOpening.x1 < x && x < this.poolDimensions.leftOpening.x2 && y < this.poolDimensions.leftChamber.y2 - this.DEFAULT_HEIGHT + this.globalModel.leftDisplacement ) {
          pressure = this.globalModel.getAirPressure( y );
        }
        else {
          //other case
          var waterHeight = y - (this.poolDimensions.leftChamber.y2 - this.DEFAULT_HEIGHT - this.globalModel.leftDisplacement / this.LENGTH_RATIO);// water height above barometer
          if ( waterHeight <= 0 ) {
            pressure = this.globalModel.getAirPressure( y );
          }
          else {
            pressure = this.globalModel.getAirPressure( y - waterHeight ) + this.globalModel.getWaterPressure( waterHeight );
          }
        }
      }

      return pressure;
    },
    isPointInsidePool: function( x, y ) {
      var self = this;
      var isInside = false;

      ["leftChamber", "rightChamber", "horizontalPassage", "leftOpening", "rightOpening"].forEach( function( name ) {
        if ( x > self.poolDimensions[name].x1 && x < self.poolDimensions[name].x2 && y > self.poolDimensions[name].y1 && y < self.poolDimensions[name].y2 ) {
          //inside bottom chamber
          isInside = true;
        }
      } );
      return isInside;
    }
  } );
} );