// Copyright 2013-2020, University of Colorado Boulder

/**
 * View for the scene chooser containing 4 image radio buttons
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import chamberPoolImage from '../../../images/chamber-pool-icon_png.js';
import mysteryPoolImage from '../../../images/mystery-pool-icon_png.js';
import squarePoolImage from '../../../images/square-pool-icon_png.js';
import trapezoidPoolImage from '../../../images/trapezoid-pool-icon_png.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

// constants
const ICON_SCALE = 0.5;

class SceneChoiceNode extends RadioButtonGroup {

  /**
   * @param {UnderPressureModel} underPressureModel
   * @param {Object} [options] that can be passed to the underlying node
   */
  constructor( underPressureModel, options ) {

    options = merge( {
      orientation: 'vertical',
      baseColor: 'white',
      cornerRadius: 10
    }, options );

    super( underPressureModel.currentSceneProperty, [
      { value: 'square', node: new Image( squarePoolImage, { scale: ICON_SCALE } ) },
      { value: 'trapezoid', node: new Image( trapezoidPoolImage, { scale: ICON_SCALE } ) },
      { value: 'chamber', node: new Image( chamberPoolImage, { scale: ICON_SCALE } ) },
      { value: 'mystery', node: new Image( mysteryPoolImage, { scale: ICON_SCALE } ) }
    ], options );
  }
}

fluidPressureAndFlow.register( 'SceneChoiceNode', SceneChoiceNode );
export default SceneChoiceNode;