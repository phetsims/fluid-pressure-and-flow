// Copyright 2002-2013, University of Colorado Boulder

/**
 * scene chooser, 4 image radio buttons
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var InOutRadioButton = require( 'SUN/InOutRadioButton' );
  var Dimension2 = require( 'DOT/Dimension2' );

  var ICON_SIZE = new Dimension2( 60, 40 );

  var iconImages = {
    SquarePoolIcon: require( 'image!UNDER_PRESSURE/square-pool-icon.png' ),
    TrapezoidPoolIcon: require( 'image!UNDER_PRESSURE/trapezoid-pool-icon.png' ),
    ChamberPoolIcon: require( 'image!UNDER_PRESSURE/chamber-pool-icon.png' ),
    MysteryPoolIcon: require( 'image!UNDER_PRESSURE/mystery-pool-icon.png' )
  };

  function SceneChoiceNode( model, x, y ) {
    var self = this;
    Node.call( this, {x: x, y: y} );

    var dy = 60;

    model.scenes.forEach( function( name, index ) {
      var iconImage = new Image( iconImages[name + 'PoolIcon'] );
      iconImage.scale( ICON_SIZE.width / iconImage.width, ICON_SIZE.height / iconImage.height );
      var iconButton = new InOutRadioButton( model.currentSceneProperty, name, iconImage, {cornerRadius:5} );
      iconButton.translate( 0, dy * index );
      self.addChild( iconButton );
    } );
  }

  return inherit( Node, SceneChoiceNode, {} );
} );