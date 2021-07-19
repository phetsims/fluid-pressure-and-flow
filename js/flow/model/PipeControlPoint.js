// Copyright 2014-2021, University of Colorado Boulder

/**
 * Data structure for a control point that can be dragged around to change the shape of the pipe.
 * Modified from energy-skate-park/js/model/ControlPoint.js.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class PipeControlPoint {

  /**
   * @param {number} x - position of the control point
   * @param {number} y - position of the control point
   */
  constructor( x, y ) {
    this.positionProperty = new Vector2Property( new Vector2( x, y ) );
  }

  /**
   * @public
   */
  reset() {
    this.positionProperty.reset();
  }
}

fluidPressureAndFlow.register( 'PipeControlPoint', PipeControlPoint );
export default PipeControlPoint;