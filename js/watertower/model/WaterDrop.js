// Copyright 2014-2020, University of Colorado Boulder

/**
 * Water drop model
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Constants from '../../common/Constants.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class WaterDrop {
  /**
   * @param {Vector2} position of the water drop
   * @param {Vector2} velocity of the water drop
   * @param {number} volume of the water drop in m3
   */
  constructor( position, velocity, volume ) {

    this.positionProperty = new Property( position );
    this.velocityProperty = new Property( velocity );
    this.volumeProperty = new Property( volume );

    // node holds a reference to the waterdrop node. This is used to remove the view element when the water drop is no longer necessary.
    // This is a shortcut to prevent having removal listeners for individual drops.
    this.node = null;

    this.radiusProperty = new DerivedProperty( [ this.volumeProperty ], volume => {
      return Utils.cubeRoot( ( 3 * volume ) / ( 4 * Math.PI ) );
    } );
  }

  /**
   * @public
   */
  step( dt ) {

    //Math is done component-wise to avoid too many allocations, see https://github.com/phetsims/fluid-pressure-and-flow/issues/46
    // v_f = v_i + a * dt
    const accelerationY = -Constants.EARTH_GRAVITY;

    const initialVelocityX = this.velocityProperty.value.x;
    const initialVelocityY = this.velocityProperty.value.y;

    this.velocityProperty.value.setY( this.velocityProperty.value.y + accelerationY * dt );
    this.velocityProperty._notifyListeners(); // TODO: don't call this private method

    // d = (v_f + v_i) * dt/2; assuming constant acceleration
    const displacementX = ( this.velocityProperty.value.x + initialVelocityX ) * dt / 2;
    const displacementY = ( this.velocityProperty.value.y + initialVelocityY ) * dt / 2;

    this.positionProperty.value.setXY( this.positionProperty.value.x + displacementX, this.positionProperty.value.y + displacementY );
    this.positionProperty._notifyListeners(); // TODO: don't call this private method
  }

  /**
   * Checks if the given point is within this water point.
   * @param {Vector2} point
   * @public
   */
  contains( point ) {
    return point.distanceXY( this.positionProperty.value.x, this.positionProperty.value.y ) < this.radius;
  }
}

fluidPressureAndFlow.register( 'WaterDrop', WaterDrop );
export default WaterDrop;