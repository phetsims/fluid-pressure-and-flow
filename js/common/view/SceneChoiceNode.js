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

  // images
  var SquarePoolImage = require( 'image!UNDER_PRESSURE/square-pool-icon.png' );
  var TrapezoidPoolImage = require( 'image!UNDER_PRESSURE/trapezoid-pool-icon.png' );
  var ChamberPoolImage = require( 'image!UNDER_PRESSURE/chamber-pool-icon.png' );
  var MysteryPoolImage = require( 'image!UNDER_PRESSURE/mystery-pool-icon.png' );

  var ICON_SIZE = new Dimension2( 52, 37 );

  /**
   * @param {UnderPressureModel} underPressureModel of the simulation
   * @param {Object} options that can be passed to the underlying node
   * @constructor
   */
  function SceneChoiceNode( underPressureModel, options ) {

    var sceneChoiceNode = this;
    Node.call( this );

    sceneChoiceNode.addChild( createButton( SquarePoolImage, underPressureModel.currentSceneProperty, 'square', 0 ) );
    sceneChoiceNode.addChild( createButton( TrapezoidPoolImage, underPressureModel.currentSceneProperty, 'trapezoid',
      1 ) );
    sceneChoiceNode.addChild( createButton( ChamberPoolImage, underPressureModel.currentSceneProperty, 'chamber', 2 ) );
    sceneChoiceNode.addChild( createButton( MysteryPoolImage, underPressureModel.currentSceneProperty, 'mystery', 3 ) );

    this.mutate( options );
  }

  // creates an InOutRadioButton with the given image as the icon
  //@private
  var createButton = function( image, controlProperty, value, index ) {
    var iconImg = new Image( image );
    var dy = 60;
    iconImg.scale( ICON_SIZE.width / iconImg.width, ICON_SIZE.height / iconImg.height );
    var iconButton = new InOutRadioButton( controlProperty, value, iconImg, { cornerRadius: 5 } );
    iconButton.touchArea = iconButton.localBounds.dilatedXY( 0, 0 );
    iconButton.translate( 0, dy * index );
    return iconButton;
  };

  return inherit( Node, SceneChoiceNode );
} );