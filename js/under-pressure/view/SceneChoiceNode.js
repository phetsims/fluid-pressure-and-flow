// Copyright 2013-2019, University of Colorado Boulder

/**
 * View for the scene chooser containing 4 image radio buttons
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  // images
  const chamberPoolImage = require( 'image!FLUID_PRESSURE_AND_FLOW/chamber-pool-icon.png' );
  const mysteryPoolImage = require( 'image!FLUID_PRESSURE_AND_FLOW/mystery-pool-icon.png' );
  const squarePoolImage = require( 'image!FLUID_PRESSURE_AND_FLOW/square-pool-icon.png' );
  const trapezoidPoolImage = require( 'image!FLUID_PRESSURE_AND_FLOW/trapezoid-pool-icon.png' );

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

  return fluidPressureAndFlow.register( 'SceneChoiceNode', SceneChoiceNode );
} );