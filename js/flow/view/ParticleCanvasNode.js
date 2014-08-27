// Copyright (c) 2002 - 2014. University of Colorado Boulder

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
   * @param options
   * @constructor
   */
  function ParticleCanvasNode( particles, gridParticles, modelViewTransform, options ) {

    this.particles = particles;
    this.gridParticles = gridParticles;
    this.modelViewTransform = modelViewTransform;
    this.options = options;

    CanvasNode.call( this, options );
    this.invalidatePaint();
  }

  return inherit( CanvasNode, ParticleCanvasNode, {

    // @param {CanvasContextWrapper} wrapper
    paintCanvas: function( wrapper ) {
      var context = wrapper.context;
      var particle;
      for ( var i = 0; i < this.particles.length; i++ ) {
        particle = this.particles.get( i );
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc( this.modelViewTransform.modelToViewX( particle.position.x ), this.modelViewTransform.modelToViewY( particle.position.y ), this.modelViewTransform.modelToViewDeltaX( particle.radius ), 0, 2 * Math.PI, true );
        context.fill();
      }

      for ( i = 0; i < this.gridParticles.length; i++ ) {
        particle = this.gridParticles.get( i );
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc( this.modelViewTransform.modelToViewX( particle.position.x ), this.modelViewTransform.modelToViewY( particle.position.y ), this.modelViewTransform.modelToViewDeltaX( particle.radius ), 0, 2 * Math.PI, true );
        context.fill();
      }

    },

    step: function( dt ) {
      this.invalidatePaint();
    }

  } );
} );