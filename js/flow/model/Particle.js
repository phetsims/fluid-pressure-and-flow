// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model for a simple spherical particle (Modified from watertower's WaterDrop). The red dots and black grid dots
 * in flow sim are modelled as Particles. Model contains properties for radius, color, position etc.
 *
 * Since so many particles are moving in every frame, it is too much overhead to model them using Property.link,
 * and they are rendered in a CanvasNode.  Hence the values are modeled directly as attributes (without axon Properties).
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class Particle {

  /**
   * @param {number} xPosition of the particle in meters
   * @param {number} fractionUpPipe represents the fractional position w.r.t to the cross section height. Takes a value between (0,1).
   * @param {Pipe} container holding the particle
   * @param {number} radius of the particle
   * @param {string} color of the particle
   */
  constructor( xPosition, fractionUpPipe, container, radius, color ) {

    // position along the pipe's horizontal axis.
    this.xPosition = xPosition;

    // how far up the pipe, 0 = bottom, 1 = top
    this.fractionUpPipe = fractionUpPipe;

    // the pipe within which the particle travels
    this.container = container;

    this.radius = radius; // in meters
    this.color = color;
  }

  /**
   * get particle x position
   * @public
   */
  getX() {
    return this.xPosition;
  }

  /**
   * get particle Y position
   * @public
   */
  getY() {
    return this.container.fractionToPosition( this.xPosition, this.fractionUpPipe );
  }

  /**
   * Set the particle x position
   * @param {number} x position in meters
   * @public
   */
  setX( x ) {
    this.xPosition = x;
  }
}

fluidPressureAndFlow.register( 'Particle', Particle );
export default Particle;