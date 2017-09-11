// Copyright 2013-2015, University of Colorado Boulder

/**
 * View for the scene chooser containing 4 image radio buttons
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  // images
  var chamberPoolImage = require( 'image!FLUID_PRESSURE_AND_FLOW/chamber-pool-icon.png' );
  var mysteryPoolImage = require( 'image!FLUID_PRESSURE_AND_FLOW/mystery-pool-icon.png' );
  var squarePoolImage = require( 'image!FLUID_PRESSURE_AND_FLOW/square-pool-icon.png' );
  var trapezoidPoolImage = require( 'image!FLUID_PRESSURE_AND_FLOW/trapezoid-pool-icon.png' );

  var ICON_SCALE = 0.5;

  /**
   * @param {UnderPressureModel} underPressureModel of the simulation
   * @param {Object} [options] that can be passed to the underlying node
   * @constructor
   */
  function SceneChoiceNode( underPressureModel, options ) {

    options = _.extend( {
      orientation: 'vertical',
      baseColor: 'white',
      cornerRadius: 10
    }, options );

    RadioButtonGroup.call( this, underPressureModel.currentSceneProperty, [
      { value: 'square', node: new Image( squarePoolImage, { scale: ICON_SCALE } ) },
      { value: 'trapezoid', node: new Image( trapezoidPoolImage, { scale: ICON_SCALE } ) },
      { value: 'chamber', node: new Image( chamberPoolImage, { scale: ICON_SCALE } ) },
      { value: 'mystery', node: new Image( mysteryPoolImage, { scale: ICON_SCALE } ) }
    ], options );
  }

  fluidPressureAndFlow.register( 'SceneChoiceNode', SceneChoiceNode );

  return inherit( RadioButtonGroup, SceneChoiceNode );
} );