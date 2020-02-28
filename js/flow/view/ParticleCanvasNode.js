// Copyright 2014-2020, University of Colorado Boulder

/**
 * A particle layer rendered on canvas
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class ParticleCanvasNode extends CanvasNode {

  /**
   * @param {ObservableArray<Particle>} particles that need to be rendered on the canvas
   * @param {ObservableArray<Particle>} gridParticles that need to be rendered on the canvas
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @param {Object} [options]
   */
  constructor( particles, gridParticles, modelViewTransform, options ) {

    super( options );

    this.particles = particles;
    this.gridParticles = gridParticles;
    this.modelViewTransform = modelViewTransform;

    this.invalidatePaint();
  }

  /**
   * Paints the particles on the canvas node.
   * @param {CanvasRenderingContext2D} context
   */
  paintCanvas( context ) {

    // paint the regular particles
    for ( let i = 0; i < this.particles.length; i++ ) {
      const particle = this.particles.get( i );
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc( this.modelViewTransform.modelToViewX( particle.xPosition ),
        this.modelViewTransform.modelToViewY( particle.getY() ),
        this.modelViewTransform.modelToViewDeltaX( particle.radius ), 0, 2 * Math.PI, true );
      context.fill();
    }

    // paint the grid particles
    for ( let i = 0; i < this.gridParticles.length; i++ ) {
      const particle = this.gridParticles.get( i );
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc( this.modelViewTransform.modelToViewX( particle.xPosition ),
        this.modelViewTransform.modelToViewY( particle.getY() ),
        this.modelViewTransform.modelToViewDeltaX( particle.radius ), 0, 2 * Math.PI, true );
      context.fill();
    }

  }

  step() {
    this.invalidatePaint();
  }
}

fluidPressureAndFlow.register( 'ParticleCanvasNode', ParticleCanvasNode );
export default ParticleCanvasNode;