// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * View for the sluice state (open/close) switcher
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/23/2014.
 */
define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Vector2 = require( 'DOT/Vector2' );
    var ABSwitch = require( 'SUN/ABSwitch' );
    var Text = require( 'SCENERY/nodes/Text' );

    /**
     * Constructor for the sluice controller
     * @param model
     * @param options
     * @constructor
     */
    function SluiceControl( model, options ) {

      Node.call( this );
      this.addChild( new ABSwitch(model.isSluiceOpenProperty, false, new Text("Close"), true, new Text("Open"), {x: 0, y: 400}));

      this.mutate(options);
    }

    return inherit( Node, SluiceControl );
  }
);