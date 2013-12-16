// Copyright 2002-2013, University of Colorado Boulder

/**
 * top background Node
 * contains atmosphere, earth and  controls
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SingleChoiceNode = require( "UNDER_PRESSURE/common/view/SingleChoiceNode" );

  var iconImages = {
    SquarePoolIcon: require( "image!UNDER_PRESSURE/square-pool-icon.png" ),
    TrapezoidPoolIcon: require( "image!UNDER_PRESSURE/trapezoid-pool-icon.png" ),
    ChamberPoolIcon: require( "image!UNDER_PRESSURE/chamber-pool-icon.png" ),
    MysteryPoolIcon: require( "image!UNDER_PRESSURE/mystery-pool-icon.png" )
  };


  function SceneChoiceNode( model, x, y ) {
    var self = this;
    Node.call( this, {x: x, y: y} );

    var dy = 60;

    model.scenes.forEach( function( name, index ) {
      self.addChild( new SingleChoiceNode( model.currentSceneProperty, name, new Image( iconImages[name + "PoolIcon"] ), {y: dy * index} ) );
    } );


  }

  return inherit( Node, SceneChoiceNode, {} );
} );