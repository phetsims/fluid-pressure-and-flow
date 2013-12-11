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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );

  function SingleChoiceNode( property, value, icon, options ) {

    var self = this;

    options = _.extend( {
      cursor: "pointer",
      shadowOffset: 4,
      x:0,
      y:0
    }, options );

    Node.call( this, options );


    var shadow = new Rectangle( options.shadowOffset, options.shadowOffset, icon.width, icon.height, 5, 5, {fill: "black"} );
    var border = new Rectangle( 0, 0, icon.width, icon.height, 3, 3, {stroke: "white", lineWidth: 4} );

    this.addChild( shadow );
    this.addChild( border );
    this.addChild( icon );

    property.link( function( newValue ) {
      if ( newValue !== value ) {
        self.translation = new Vector2(options.x,options.y);
        shadow.visible = true;
      }
      else {
        self.translation = new Vector2(options.x+options.shadowOffset/2,options.y+options.shadowOffset/2);
        shadow.visible = false;
      }
    } );

    // set property value on fire
    this.addInputListener( new ButtonListener( {
      fire: function() {
        property.set( value );
      }
    } ) );


  }

  return inherit( Node, SingleChoiceNode );
} );