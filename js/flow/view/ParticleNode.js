// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * ParticleNode. Modified from WaterDropNode
 * @author Siddhartha Chinthapally (Actual Concepts) on 8/7/2014.
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  /**
   *
   * @param {Particle} particle model for the particle node
   * @param {ModelViewTransform2} modelViewTransform to transform between model and view values
   * @param options
   * @constructor
   */
  function ParticleNode( particle, modelViewTransform, options ) {

    var particleNode = this;
    Circle.call( this, modelViewTransform.modelToViewDeltaX( particle.radius ), {fill: 'red'} );

    particle.positionProperty.link( function( position ) {
      particleNode.setTranslation( modelViewTransform.modelToViewX( position.x ), modelViewTransform.modelToViewY( position.y ) );
    } );

    this.mutate( options );
  }

  return inherit( Circle, ParticleNode );
} );