// Copyright 2014-2017, University of Colorado Boulder

/**
 * WaterDropNode
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/26/2014.
 */

define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @param {WaterDrop} waterDrop for the water drop node
   * @param {FluidColorModel} fluidColorModel for the "water" drop
   * @param {ModelViewTransform2} modelViewTransform to transform between model and view values
   * @param {Object} [options]
   * @constructor
   */
  function WaterDropNode( waterDrop, fluidColorModel, modelViewTransform, options ) {

    var self = this;
    Circle.call( this, modelViewTransform.modelToViewDeltaX( waterDrop.radius ), { fill: fluidColorModel.colorProperty.value } );

    waterDrop.positionProperty.link( function( position ) {
      self.setTranslation( modelViewTransform.modelToViewX( position.x ), modelViewTransform.modelToViewY( position.y ) );
    } );

    fluidColorModel.colorProperty.linkAttribute( self, 'fill' );

    this.mutate( options );
  }

  fluidPressureAndFlow.register( 'WaterDropNode', WaterDropNode );

  return inherit( Circle, WaterDropNode );
} );