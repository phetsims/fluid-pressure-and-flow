// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model for a draggable, rectangular "mass" object containing its mass, position, width, height, velocity etc.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

// constants
const frictionCoefficient = 0.98;

class MassModel {

  /**
   * @param {ChamberPoolModel} chamberPoolModel - of the simulation
   * @param {number} mass - of object in grams
   * @param {number} x - coordinate of the mass in meters
   * @param {number} y - coordinate of the mass in meters
   * @param {number} width - of the mass in meters
   * @param {number} height - of the mass in meters
   */
  constructor( chamberPoolModel, mass, x, y, width, height ) {

    this.chamberPoolModel = chamberPoolModel;
    this.mass = mass;

    // all coordinates in meters
    this.width = width; // @public
    this.height = height; // @public

    // @public
    // The position is the center of the block.
    this.positionProperty = new Vector2Property( new Vector2( x, y ) );

    this.isDraggingProperty = new Property( false );

    this.isFalling = false; // @private
    this.velocity = 0; // @private

    this.isDraggingProperty.link( isDragging => {

        // If the user dropped the mass, then let it fall.
        if ( !isDragging ) {
          if ( this.isInTargetDroppedArea() ) {
            chamberPoolModel.stack.push( this );
          }
          else if ( this.cannotFall() ) {
            this.reset();
          }
          else {
            this.isFalling = true;
          }
        }
        else {
          // The user grabbed the mass.  If it was in the stack, remove it.
          if ( chamberPoolModel.stack.includes( this ) ) {
            chamberPoolModel.stack.remove( this );
          }
        }
      }
    );
  }

  // @public
  step( dt ) {
    let acceleration;

    // move the masses only when the velocity is greater than than this, see #60 for under-pressure repo
    const epsilonVelocity = 0.05;

    if ( this.chamberPoolModel.stack.includes( this ) ) {

      //use newton’s laws to equalize pressure/force at interface
      const m = this.chamberPoolModel.stackMassProperty.value;
      const rho = this.chamberPoolModel.underPressureModel.fluidDensityProperty.value;
      const g = this.chamberPoolModel.underPressureModel.gravityProperty.value;

      //difference between water levels in left and right opening
      const h = this.chamberPoolModel.leftDisplacementProperty.value +
                this.chamberPoolModel.leftDisplacementProperty.value / this.chamberPoolModel.lengthRatio;
      const gravityForce = -m * g;
      const pressureForce = rho * h * g;
      const force = gravityForce + pressureForce;
      acceleration = force / m;
      this.velocity = ( this.velocity + acceleration * dt ) * frictionCoefficient;
      if ( Math.abs( this.velocity ) > epsilonVelocity ) {
        this.positionProperty.value.y += this.velocity * dt;
        this.positionProperty.notifyListenersStatic();
      }
    }
    else if ( this.isFalling && !this.isDraggingProperty.value ) {
      acceleration = -this.chamberPoolModel.underPressureModel.gravityProperty.value;
      this.velocity = this.velocity + acceleration * dt;
      if ( Math.abs( this.velocity ) > epsilonVelocity ) {
        this.positionProperty.value.y += this.velocity * dt;

        // If it landed, then stop the block.
        if ( this.positionProperty.value.y < this.chamberPoolModel.maxY + this.height / 2 ) {
          this.positionProperty.value.y = this.chamberPoolModel.maxY + this.height / 2;
          this.isFalling = false;
          this.velocity = 0;
        }
        this.positionProperty.notifyListenersStatic();
      }
    }
  }

  // @public -- checks if the mass intersects with the target drop area.
  isInTargetDroppedArea() {
    const waterLine = this.chamberPoolModel.poolDimensions.leftOpening.y2 + this.chamberPoolModel.leftWaterHeight -
                      this.chamberPoolModel.leftDisplacementProperty.value;
    const bottomLine = waterLine + this.chamberPoolModel.stack.reduce( ( a, b ) => a + b.height, 0 );
    const massBounds = new Bounds2(
      this.positionProperty.value.x - this.width / 2,
      this.positionProperty.value.y - this.height / 2,
      this.positionProperty.value.x + this.width,
      this.positionProperty.value.y + this.height
    );

    const dropAreaBounds = new Bounds2(
      this.chamberPoolModel.poolDimensions.leftOpening.x1,
      bottomLine,
      this.chamberPoolModel.poolDimensions.leftOpening.x2,
      ( bottomLine + this.height )
    );
    return massBounds.intersectsBounds( dropAreaBounds );
  }

  // @private - If the user drops the mass underground or above a pool opening, it will teleport back to its initial position.
  cannotFall() {
    return this.positionProperty.value.y < this.chamberPoolModel.maxY - this.height / 2 || this.isMassOverOpening();
  }

  /**
   * Restore the initial conditions
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.isDraggingProperty.reset();
  }

  // @private - checks if the mass is over the left or the right opening
  isMassOverOpening() {
    const left = this.positionProperty.value.x;
    const right = this.positionProperty.value.x + this.width / 2;
    const dimensions = this.chamberPoolModel.poolDimensions;
    return ( dimensions.leftOpening.x1 < left && left < dimensions.leftOpening.x2 ) ||
           ( dimensions.leftOpening.x1 < right && right < dimensions.leftOpening.x2 ) ||
           ( dimensions.rightOpening.x1 < left && left < dimensions.rightOpening.x2 ) ||
           ( dimensions.rightOpening.x1 < right && right < dimensions.rightOpening.x2 );
  }
}

fluidPressureAndFlow.register( 'MassModel', MassModel );
export default MassModel;