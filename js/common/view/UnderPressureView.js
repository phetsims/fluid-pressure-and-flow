// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view of the sim.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var BackgroundNode = require( 'UNDER_PRESSURE/common/view/BackgroundNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var BarometersContainer = require( 'UNDER_PRESSURE/common/view/BarometersContainer' );
  var UnderPressureRuler = require( 'UNDER_PRESSURE/common/view/UnderPressureRuler' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var ControlPanel = require( 'UNDER_PRESSURE/common/view/ControlPanel' );
  var ControlSlider = require( 'UNDER_PRESSURE/common/view/ControlSlider' );
  var SceneChoiceNode = require( 'UNDER_PRESSURE/common/view/SceneChoiceNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  var fluidDensityString = require( 'string!UNDER_PRESSURE/fluidDensity' );
  var gravityString = require( 'string!UNDER_PRESSURE/gravity' );
  var EarthString = require( 'string!UNDER_PRESSURE/earth' );
  var MarsString = require( 'string!UNDER_PRESSURE/mars' );
  var JupiterString = require( 'string!UNDER_PRESSURE/jupiter' );
  var GasolineString = require( 'string!UNDER_PRESSURE/gasoline' );
  var WaterString = require( 'string!UNDER_PRESSURE/water' );
  var HoneyString = require( 'string!UNDER_PRESSURE/honey' );

  var SceneView = {
    SquarePoolView: require( 'UNDER_PRESSURE/square-pool/view/SquarePoolView' ),
    TrapezoidPoolView: require( 'UNDER_PRESSURE/trapezoid-pool/view/TrapezoidPoolView' ),
    ChamberPoolView: require( 'UNDER_PRESSURE/chamber-pool/view/ChamberPoolView' ),
    MysteryPoolView: require( 'UNDER_PRESSURE/mystery-pool/view/MysteryPoolView' )
  };

  function UnderPressureView( model ) {
    var self = this;
    ScreenView.call( this, { renderer: 'svg' } );

    var mvt = ModelViewTransform2.createSinglePointScaleMapping(
      Vector2.ZERO,
      Vector2.ZERO,
      70 ); //1m = 70px, (0,0) - top left corner

    //sky, earth and controls
    var backgroundNode = new BackgroundNode( model, mvt );
    this.addChild( backgroundNode );
    backgroundNode.moveToBack();

    var scenes = {};
    model.scenes.forEach( function( name ) {
      scenes[name] = new SceneView[name + 'PoolView']( model.sceneModels[name], mvt );
      scenes[name].visible = false;
      self.addChild( scenes[name] );
    } );


    //control panel
    this.controlPanel = new ControlPanel( model, 625, 5 );
    this.addChild( this.controlPanel );

    //control sliders
    this.fluidDensitySlider = new ControlSlider( model, model.fluidDensityProperty, model.units.getFluidDensityString, model.fluidDensityRange, {
      x: 585,
      y: 250,
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

    this.gravitySlider = new ControlSlider( model, model.gravityProperty, model.units.getGravityString, model.gravityRange, {
      x: 585,
      y: this.fluidDensitySlider.bottom + 10,
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

    model.mysteryChoiceProperty.link( function( choice, oldChoice ) {
      self[choice + 'Slider'].disable();
      if ( oldChoice ) {
        self[oldChoice + 'Slider'].enable();
      }
    } );

    model.currentSceneProperty.link( function( currentScene ) {
      if ( currentScene === 'Mystery' ) {
        self[model.mysteryChoice + 'Slider'].disable();
      }
      else {
        self.gravitySlider.enable();
        self.fluidDensitySlider.enable();
      }
    } );

    // add reset button
    this.addChild( new ResetAllButton( function() { model.reset(); }, { scale: 0.5, x: 745, y: model.height - 25} ) );

    this.barometersContainer = new Rectangle( 0, 0, 100, 130, 10, 10, {stroke: 'gray', lineWidth: 1, fill: '#f2fa6a', x: 520, y: 5} );
    this.addChild( this.barometersContainer );

    this.addChild( new SceneChoiceNode( model, 10, 260 ) );

    //resize control panels
    var panels = [this.controlPanel, scenes.Mystery.mysteryPoolControls.choicePanel],
      maxWidth = 0;
    panels.forEach( function( panel ) {
      maxWidth = Math.max( maxWidth, panel.width / panel.transform.matrix.scaleVector.x );
    } );
    scenes.Mystery.mysteryPoolControls.choicePanel.resizeWidth( maxWidth );
    panels.forEach( function( panel ) {
      panel.centerX = self.gravitySlider.centerX;
    } );
    this.barometersContainer.x = this.controlPanel.x - 10 - this.barometersContainer.width;


    model.currentSceneProperty.link( function( value, oldValue ) {
      scenes[value].visible = true;
      if ( oldValue ) {
        scenes[oldValue].visible = false;
      }
    } );

    this.addChild( new UnderPressureRuler( model, mvt ) );

    //barometers
    this.addChild( new BarometersContainer( model, mvt, this.barometersContainer.visibleBounds ) );
  }

  return inherit( ScreenView, UnderPressureView );
} );