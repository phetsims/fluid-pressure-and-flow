// Copyright 2014-2022, University of Colorado Boulder

/**
 * View for the GridInjectorNode that injects a particle grid into the pipe.
 * The injector looks like a red button with yellow extended background and a tapered funnel at the bottom.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Property from '../../../../axon/js/Property.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import RoundStickyToggleButton from '../../../../sun/js/buttons/RoundStickyToggleButton.js';
import injectorBulbCropped_png from '../../../images/injectorBulbCropped_png.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

const X_OFFSET = 50; //px
const Y_OFFSET = 150; //px

class GridInjectorNode extends Node {

  /**
   * @param {Property.<boolean>} isGridInjectorPressedProperty indicates whether the injector is pressed or not
   * @param {modelViewTransform} modelViewTransform , Transform between model and view coordinate frames
   * @param {Pipe} pipe model of the simulation
   * @param {Object} [options] that can be passed on to the underlying node
   */
  constructor( isGridInjectorPressedProperty, modelViewTransform, pipe, options ) {

    super();

    this.modelViewTransform = modelViewTransform;
    this.pipe = pipe;
    this.gridInjectorX = -6; // model value

    const injector = new Image( injectorBulbCropped_png, { scale: 0.35 } );

    const redButton = new RoundStickyToggleButton( isGridInjectorPressedProperty, false, true, {
      radius: 25,
      centerX: injector.centerX,
      top: injector.top + 31,
      baseColor: 'red',
      stroke: 'red',
      fill: 'red',
      touchAreaDilation: 10
    } );


    this.addChild( injector );
    this.addChild( redButton );

    this.updateGridInjector();

    const isGridInjectorNotPressedProperty = new Property( !isGridInjectorPressedProperty.value, { reentrant: true } );
    isGridInjectorPressedProperty.link( pressed => {
      isGridInjectorNotPressedProperty.value = !pressed;
    } );
    isGridInjectorNotPressedProperty.link( notPressed => {
      isGridInjectorPressedProperty.value = !notPressed;
    } );
    isGridInjectorNotPressedProperty.linkAttribute( redButton, 'enabled' );

    this.mutate( options );

  }

  /**
   * reposition the grid injector
   * @public
   */
  updateGridInjector() {
    this.setTranslation( this.modelViewTransform.modelToViewX( this.gridInjectorX ) - X_OFFSET,
      this.modelViewTransform.modelToViewY( this.pipe.getCrossSection( this.gridInjectorX ).yTop ) - Y_OFFSET );
  }
}

fluidPressureAndFlow.register( 'GridInjectorNode', GridInjectorNode );
export default GridInjectorNode;