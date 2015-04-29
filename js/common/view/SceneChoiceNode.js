// Copyright 2002-2015, University of Colorado Boulder

/**
 * View for the scene chooser containing 4 image radio buttons
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  // images
  var squarePoolImage = require( 'image!UNDER_PRESSURE/square-pool-icon.png' );
  var trapezoidPoolImage = require( 'image!UNDER_PRESSURE/trapezoid-pool-icon.png' );
  var chamberPoolImage = require( 'image!UNDER_PRESSURE/chamber-pool-icon.png' );
  var mysteryPoolImage = require( 'image!UNDER_PRESSURE/mystery-pool-icon.png' );

  var ICON_SCALE = 0.12; //TODO this is an excessive scale, image files should be scaled down

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

  return inherit( RadioButtonGroup, SceneChoiceNode );
} );