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
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ControlPanel = require( "common/view/ControlPanel" );
  var ControlSlider = require( "common/view/ControlSlider" );
  var BarometersContainer = require( "common/view/BarometersContainer" );

  var fluidDensityString = require( 'string!UNDER_PRESSURE/fluidDensity' );
  var gravityString = require( 'string!UNDER_PRESSURE/gravity' );

  function CommonNode( model ) {
    var self = this;

    Node.call( this );

    //sky
    var sky = new Rectangle( -1000, 0, 3000, model.skyGroundBoundY * model.pxToMetersRatio );

    this.addChild( sky );

    model.isAtmosphereProperty.link( function( isAtmosphere ) {
      if ( isAtmosphere ) {
        sky.fill = new LinearGradient( 0, 0, 0, model.skyGroundBoundY * model.pxToMetersRatio )
          .addColorStop( 0, "#c4e6f5" )
          .addColorStop( 1, "#daedfa" )
      }
      else {
        sky.fill = "black";
      }
    } );


    //earth
    this.addChild( new Rectangle( 0, model.skyGroundBoundY * model.pxToMetersRatio, model.width, model.height - model.skyGroundBoundY * model.pxToMetersRatio, {
      fill: "#93774c"
    } ) );

    //control panel
    this.addChild( new ControlPanel( model, 625, 5 ) );

    //control sliders
    this.addChild( new ControlSlider( model.gravityProperty, model.gravityRange, {
      x: 575,
      y: 215,
      title: gravityString
    } ) );
    this.addChild( new ControlSlider( model.fluidDensityProperty, model.fluidDensityRange, {
      x: 575,
      y: 340,
      title: fluidDensityString
    } ) );

    // add reset button
    this.addChild( new ResetAllButton( function() { model.reset(); }, { scale: 0.5, x: 730, y: model.height - 25} ) );

    this.addChild( new BarometersContainer( model, 520, 5 ) );

  }

  return inherit( Node, CommonNode, {} );
} );