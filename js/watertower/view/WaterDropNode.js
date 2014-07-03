// Copyright (c) 2002 - 2014. University of Colorado Boulder

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
   * @param options
   * @constructor
   */
  function WaterDropNode( waterDrop, fluidColorModel, modelViewTransform, options ) {

    var waterDropNode = this;
    Circle.call( this, modelViewTransform.modelToViewDeltaX( waterDrop.radius ), {fill: fluidColorModel.color} );

    waterDrop.positionProperty.link( function( position ) {

      waterDropNode.x = modelViewTransform.modelToViewX( position.x );
      waterDropNode.y = modelViewTransform.modelToViewY( position.y );

    } );

    this.mutate( options );
  }

  return inherit( Circle, WaterDropNode );
} );