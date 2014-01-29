// Copyright 2002-2013, University of Colorado Boulder

/**
 * Node for sliders, reset button and scene chooser
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
  var EarthString = require( "string!UNDER_PRESSURE/earth" );
  var MarsString = require( "string!UNDER_PRESSURE/mars" );
  var JupiterString = require( "string!UNDER_PRESSURE/jupiter" );
  var GasolineString = require( "string!UNDER_PRESSURE/gasoline" );
  var WaterString = require( "string!UNDER_PRESSURE/water" );
  var HoneyString = require( "string!UNDER_PRESSURE/honey" );

  function ControlsNode( model ) {
    var self = this;

    Node.call( this );

    //control panel
    this.controlPanel = new ControlPanel( model, 625, 5 );
    this.addChild( this.controlPanel );

    //control sliders

    this.gravitySlider = new ControlSlider( model, model.gravityProperty, model.units.getGravityString, model.gravityRange, {
      x: 599,
      y: 360,
      title: gravityString,
      decimals: 1,
      ticks: [
        {
          title: EarthString,
          value: 9.8
        },
        {
          title: MarsString,
          value: model.gravityRange.min
        },
        {
          title: JupiterString,
          value: model.gravityRange.max
        }
      ]
    } );
    this.addChild( this.gravitySlider );

    this.fluidDensitySlider = new ControlSlider( model, model.fluidDensityProperty, model.units.getFluidDensityString, model.fluidDensityRange, {
      x: 599,
      y: 260,
      title: fluidDensityString,
      ticks: [
        {
          title: WaterString,
          value: 1000
        },
        {
          title: GasolineString,
          value: model.fluidDensityRange.min
        },
        {
          title: HoneyString,
          value: model.fluidDensityRange.max
        }
      ]
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
        self.gravitySlider.enable();
        self.fluidDensitySlider.enable();
      }
    } );


    // add reset button
    this.addChild( new ResetAllButton( function() { model.reset(); }, { scale: 0.5, x: 730, y: model.height - 25} ) );

    this.barometersContainer = new Rectangle( 0, 0, 100, 130, 10, 10, {stroke: "black", lineWidth: 1, fill: "#f2fa6a", x: 520, y: 5} );
    this.addChild( this.barometersContainer );

    this.addChild( new SceneChoiceNode( model, 10, 260 ) );


  }

  return inherit( Node, ControlsNode, {} );
} );