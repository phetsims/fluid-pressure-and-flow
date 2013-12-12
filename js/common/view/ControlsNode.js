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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ControlPanel = require( "UNDER_PRESSURE/common/view/ControlPanel" );
  var ControlSlider = require( "UNDER_PRESSURE/common/view/ControlSlider" );
  var SceneChoiceNode = require( "UNDER_PRESSURE/common/view/SceneChoiceNode" );

  var fluidDensityString = require( 'string!UNDER_PRESSURE/fluidDensity' );
  var gravityString = require( 'string!UNDER_PRESSURE/gravity' );

  function ControlsNode( model ) {
    var self = this;

    Node.call( this );

    //control panel
    this.addChild( new ControlPanel( model, 625, 5 ) );

    //control sliders

    this.gravitySlider = new ControlSlider( model.gravityProperty, model.gravityRange, {
      x: 599,
      y: 230,
      title: gravityString,
      decimals:1
    } );
    this.addChild( this.gravitySlider );

    this.fluidDensitySlider = new ControlSlider( model.fluidDensityProperty, model.fluidDensityRange, {
      x: 599,
      y: 350,
      title: fluidDensityString
    } );
    this.addChild( this.fluidDensitySlider );

    model.mysteryChoiceProperty.link( function( choice, oldChoice ) {
      self[choice + "Slider"].disable();
      if ( oldChoice ) {
        self[oldChoice + "Slider"].enable();
      }
    } );

    model.currentSceneProperty.link( function( currentScene ) {
      if ( currentScene === "Mystery" ) {
        self[model.mysteryChoice + "Slider"].disable();
      }
      else {
        self[model.mysteryChoice + "Slider"].enable();
      }
    } );


    // add reset button
    this.addChild( new ResetAllButton( function() { model.reset(); }, { scale: 0.5, x: 730, y: model.height - 25} ) );

    this.addChild( new Rectangle( 0, 0, 100, 130, 10, 10, {stroke: "black", lineWidth: 1, fill: "#f2fa6a", x: 520, y: 5} ) );

    this.addChild( new SceneChoiceNode( model, 10, 235 ) );


  }

  return inherit( Node, ControlsNode, {} );
} );