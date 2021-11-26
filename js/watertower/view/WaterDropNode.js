// Copyright 2014-2021, University of Colorado Boulder

/**
 * WaterDropNode
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/26/2014.
 */

import { Circle } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class WaterDropNode extends Circle {

  /**
   * @param {WaterDrop} waterDrop for the water drop node
   * @param {FluidColorModel} fluidColorModel for the "water" drop
   * @param {ModelViewTransform2} modelViewTransform to transform between model and view values
   * @param {Object} [options]
   */
  constructor( waterDrop, fluidColorModel, modelViewTransform, options ) {

    super( modelViewTransform.modelToViewDeltaX( waterDrop.radius ), {
      fill: fluidColorModel.colorProperty.value
    } );

    waterDrop.positionProperty.link( position => {
      this.setTranslation( modelViewTransform.modelToViewX( position.x ), modelViewTransform.modelToViewY( position.y ) );
    } );

    fluidColorModel.colorProperty.linkAttribute( this, 'fill' );

    this.mutate( options );
  }
}

fluidPressureAndFlow.register( 'WaterDropNode', WaterDropNode );
export default WaterDropNode;