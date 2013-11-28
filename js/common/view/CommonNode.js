// Copyright 2002-2013, University of Colorado Boulder

/**
 * main ScreenView container.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ControlPanel = require( "common/view/ControlPanel" );

  function CommonNode( model ) {
    Node.call( this );


    //sky
    var sky = new Rectangle( -1000, 0, 3000, model.skyGroundBoundY );

    this.addChild( sky );

    model.isAtmosphereProperty.link( function( isAtmosphere ) {
      if ( isAtmosphere ) {
        sky.fill = new LinearGradient( 0, 0, 0, model.skyGroundBoundY )
          .addColorStop( 0, "#c4e6f5" )
          .addColorStop( 1, "#daedfa" )
      }
      else {
        sky.fill = "black";
      }
    } );


    //earth
    this.addChild( new Rectangle( 0, model.skyGroundBoundY, model.width, model.height, {
      fill: "#93774c"
    } ) );

    // add reset button
    this.addChild( new ResetAllButton( function() { model.reset(); }, { scale: 0.5, x: model.width * 0.94, y: model.height * 0.9} ) );

    //control panel
    this.addChild( new ControlPanel( model, 625, 25 ) );

  }

  return inherit( Node, CommonNode, {} );
} );