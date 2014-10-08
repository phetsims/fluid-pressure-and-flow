// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the scene chooser containing 4 image radio buttons
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';
  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var InOutRadioButton = require( 'SUN/InOutRadioButton' );
  var Dimension2 = require( 'DOT/Dimension2' );

  var ICON_SIZE = new Dimension2( 52, 37 );

  var iconImages = {
    Square: require( 'image!UNDER_PRESSURE/square-pool-icon.png' ),
    Trapezoid: require( 'image!UNDER_PRESSURE/trapezoid-pool-icon.png' ),
    Chamber: require( 'image!UNDER_PRESSURE/chamber-pool-icon.png' ),
    Mystery: require( 'image!UNDER_PRESSURE/mystery-pool-icon.png' )
  };

  /**
   * @param {UnderPressureModel} underPressureModel of the simulation
   * @param {Object} options that can be passed to the underlying node
   * @constructor
   */
  function SceneChoiceNode( underPressureModel, options ) {

    var sceneChoiceNode = this;
    Node.call( this );

    var dy = 60;
    underPressureModel.scenes.forEach( function( name, index ) {
      var iconImage = new Image( iconImages[ name ] );
      iconImage.scale( ICON_SIZE.width / iconImage.width, ICON_SIZE.height / iconImage.height );
      var iconButton = new InOutRadioButton( underPressureModel.currentSceneProperty, name, iconImage,
        { cornerRadius: 5 } );
      iconButton.touchArea = iconButton.localBounds.dilatedXY( 0, 0 );
      iconButton.translate( 0, dy * index );
      sceneChoiceNode.addChild( iconButton );
    } );

    this.mutate( options );
  }

  return inherit( Node, SceneChoiceNode, {} );
} );