// Copyright 2014-2021, University of Colorado Boulder

/**
 * A canvas node to render a set of water drops.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import { CanvasNode } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class WaterDropsCanvasNode extends CanvasNode {

  /**
   * @param {ObservableArrayDef.<WaterDrop>} waterDrops that need to be rendered
   * @param {FluidColorModel} fluidColorModel that defines the color of the drops
   * @param {ModelViewTransform2} modelViewTransform to convert between view and model values
   * @param {Object} [options]
   */
  constructor( waterDrops, fluidColorModel, modelViewTransform, options ) {

    super( options );

    this.waterDrops = waterDrops;
    this.fluidColorModel = fluidColorModel;
    this.modelViewTransform = modelViewTransform;
    this.options = options;

    this.invalidatePaint();
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @public
   */
  paintCanvas( context ) {

    //If the showBounds flag is enabled, it will show the bounds of the canvas
    if ( this.options.showBounds ) {
      context.fillStyle = 'rgba(50,50,50,0.5)';
      context.fillRect( this.options.canvasBounds.minX, this.options.canvasBounds.minY, this.options.canvasBounds.maxX, this.options.canvasBounds.maxY );
    }

    context.fillStyle = this.fluidColorModel.colorProperty.value.toCSS();
    for ( let i = 0; i < this.waterDrops.length; i++ ) {
      const drop = this.waterDrops.get( i );
      context.beginPath();
      context.arc( this.modelViewTransform.modelToViewX( drop.positionProperty.value.x ), this.modelViewTransform.modelToViewY( drop.positionProperty.value.y ), this.modelViewTransform.modelToViewDeltaX( drop.radiusProperty.value ), 0, 2 * Math.PI, true );
      context.fill();
    }
  }

  /**
   * @public
   */
  step( dt ) {
    this.invalidatePaint();
  }
}

fluidPressureAndFlow.register( 'WaterDropsCanvasNode', WaterDropsCanvasNode );
export default WaterDropsCanvasNode;