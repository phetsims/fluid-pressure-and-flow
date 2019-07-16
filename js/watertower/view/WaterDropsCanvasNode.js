// Copyright 2014-2017, University of Colorado Boulder

/**
 * WaterDropsCanvasNode
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

define( function( require ) {
  'use strict';

  // modules
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * A canvas node to render a set of water drops.
   * @param {ObservableArray<WaterDrop>} waterDrops that need to be rendered
   * @param {FluidColorModel} fluidColorModel that defines the color of the drops
   * @param {ModelViewTransform2} modelViewTransform to convert between view and model values
   * @param {Object} [options]
   * @constructor
   */
  function WaterDropsCanvasNode( waterDrops, fluidColorModel, modelViewTransform, options ) {
    this.waterDrops = waterDrops;
    this.fluidColorModel = fluidColorModel;
    this.modelViewTransform = modelViewTransform;
    this.options = options;

    CanvasNode.call( this, options );
    this.invalidatePaint();
  }

  fluidPressureAndFlow.register( 'WaterDropsCanvasNode', WaterDropsCanvasNode );

  return inherit( CanvasNode, WaterDropsCanvasNode, {

    // @param {CanvasRenderingContext2D} context
    paintCanvas: function( context ) {

      //If the showBounds flag is enabled, it will show the bounds of the canvas
      if ( this.options.showBounds ) {
        context.fillStyle = 'rgba(50,50,50,0.5)';
        context.fillRect( this.options.canvasBounds.minX, this.options.canvasBounds.minY, this.options.canvasBounds.maxX, this.options.canvasBounds.maxY );
      }

      context.fillStyle = this.fluidColorModel.colorProperty.value.toCSS();
      var drop;
      for ( var i = 0; i < this.waterDrops.length; i++ ) {
        drop = this.waterDrops.get( i );
        context.beginPath();
        context.arc( this.modelViewTransform.modelToViewX( drop.positionProperty.value.x ), this.modelViewTransform.modelToViewY( drop.positionProperty.value.y ), this.modelViewTransform.modelToViewDeltaX( drop.radiusProperty.value ), 0, 2 * Math.PI, true );
        context.fill();
      }
    },

    step: function( dt ) {
      this.invalidatePaint();
    }

  } );
} );