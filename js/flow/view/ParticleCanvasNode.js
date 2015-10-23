// Copyright 2002-2014, University of Colorado Boulder

/**
 * A particle layer rendered on canvas
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );

  /**
   * A particle layer rendered on canvas
   * @param {ObservableArray<Particle>} particles that need to be rendered on the canvas
   * @param {ObservableArray<Particle>} gridParticles that need to be rendered on the canvas
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @param {Object} [options] that can be passed on to the underlying node
   * @constructor
   */
  function ParticleCanvasNode( particles, gridParticles, modelViewTransform, options ) {

    this.particles = particles;
    this.gridParticles = gridParticles;
    this.modelViewTransform = modelViewTransform;
    CanvasNode.call( this, options );
    this.invalidatePaint();
  }

  return inherit( CanvasNode, ParticleCanvasNode, {

    /**
     * Paints the particles on the canvas node.
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {
      var particle;
      var i;

      // paint the regular particles
      for ( i = 0; i < this.particles.length; i++ ) {
        particle = this.particles.get( i );
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc( this.modelViewTransform.modelToViewX( particle.xPosition ),
          this.modelViewTransform.modelToViewY( particle.getY() ),
          this.modelViewTransform.modelToViewDeltaX( particle.radius ), 0, 2 * Math.PI, true );
        context.fill();
      }

      // paint the grid particles
      for ( i = 0; i < this.gridParticles.length; i++ ) {
        particle = this.gridParticles.get( i );
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc( this.modelViewTransform.modelToViewX( particle.xPosition ),
          this.modelViewTransform.modelToViewY( particle.getY() ),
          this.modelViewTransform.modelToViewDeltaX( particle.radius ), 0, 2 * Math.PI, true );
        context.fill();
      }

    },

    step: function() {
      this.invalidatePaint();
    }

  } );
} );