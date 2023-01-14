// Copyright 2013-2023, University of Colorado Boulder

/**
 * View for the scene chooser containing 4 image radio buttons
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Image } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import chamberPoolIcon_png from '../../../images/chamberPoolIcon_png.js';
import mysteryPoolIcon_png from '../../../images/mysteryPoolIcon_png.js';
import squarePoolIcon_png from '../../../images/squarePoolIcon_png.js';
import trapezoidPoolIcon_png from '../../../images/trapezoidPoolIcon_png.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

// constants
const ICON_SCALE = 0.5;

class SceneChoiceNode extends RectangularRadioButtonGroup {

  /**
   * @param {UnderPressureModel} underPressureModel
   * @param {Object} [options] that can be passed to the underlying node
   */
  constructor( underPressureModel, options ) {

    options = merge( {
      orientation: 'vertical',
      radioButtonOptions: {
        baseColor: 'white',
        cornerRadius: 10
      }
    }, options );

    super( underPressureModel.currentSceneProperty, [
      { value: 'square', createNode: () => new Image( squarePoolIcon_png, { scale: ICON_SCALE } ) },
      { value: 'trapezoid', createNode: () => new Image( trapezoidPoolIcon_png, { scale: ICON_SCALE } ) },
      { value: 'chamber', createNode: () => new Image( chamberPoolIcon_png, { scale: ICON_SCALE } ) },
      { value: 'mystery', createNode: () => new Image( mysteryPoolIcon_png, { scale: ICON_SCALE } ) }
    ], options );
  }
}

fluidPressureAndFlow.register( 'SceneChoiceNode', SceneChoiceNode );
export default SceneChoiceNode;