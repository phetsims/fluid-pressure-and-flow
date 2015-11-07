// Copyright 2014-2015, University of Colorado Boulder

/**
 * WaterDropNode
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/26/2014.
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  /**
   *
   * @param {WaterDrop} waterDrop for the water drop node
   * @param {FluidColorModel} fluidColorModel for the "water" drop
   * @param {ModelViewTransform2} modelViewTransform to transform between model and view values
   * @param {Object} [options]
   * @constructor
   */
  function WaterDropNode( waterDrop, fluidColorModel, modelViewTransform, options ) {

    var waterDropNode = this;
    Circle.call( this, modelViewTransform.modelToViewDeltaX( waterDrop.radius ), { fill: fluidColorModel.color } );

    waterDrop.positionProperty.link( function( position ) {
      waterDropNode.setTranslation( modelViewTransform.modelToViewX( position.x ), modelViewTransform.modelToViewY( position.y ) );
    } );

    fluidColorModel.colorProperty.linkAttribute( waterDropNode, 'fill' );

    this.mutate( options );
  }

  return inherit( Circle, WaterDropNode );
} );