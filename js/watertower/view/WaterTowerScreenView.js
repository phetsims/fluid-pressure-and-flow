//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Water Tower' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var OutsideBackgroundNode = require( 'SCENERY_PHET/OutsideBackgroundNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PlayPauseButton = require( 'SCENERY_PHET/PlayPauseButton' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );

  var BarometersContainer = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/BarometersContainer' );
  var ControlSlider = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/ControlSlider' );
  var ControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/ControlPanel' );
  var MeasuringTape = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/MeasuringTape' );
  var UnitsControlPanel = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/UnitsControlPanel' );
  var WaterTowerRuler = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerRuler' );
  var WaterTowerView = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerView' );

  var VelocitySensorsContainer = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/VelocitySensorsContainer' );

  //strings
  var fluidDensityString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidDensity' );
  var gasolineString = require( 'string!FLUID_PRESSURE_AND_FLOW/gasoline' );
  var waterString = require( 'string!FLUID_PRESSURE_AND_FLOW/water' );
  var honeyString = require( 'string!FLUID_PRESSURE_AND_FLOW/honey' );
  var normalString = require( 'string!FLUID_PRESSURE_AND_FLOW/normal' );
  var slowMotionString = require( 'string!FLUID_PRESSURE_AND_FLOW/slowMotion' );

  /**
   * @param {WaterTowerModel} model
   * @constructor
   */
  function WaterTowerScreenView( model ) {
    ScreenView.call( this );

    // Please note that this is to help line up elements in the play area, and some user interface components from the Sun repo will
    // be much bigger to make the sims usable on tablets.
    // Also note, the sky and ground should extend to the sides of the browser window.  Please use OutsideBackgroundNode for this.

    var textOptions = {font: new PhetFont( 14 )};
    var mvt = ModelViewTransform2.createSinglePointScaleMapping(
      Vector2.ZERO,
      Vector2.ZERO,
      70 ); //1m = 70px, (0,0) - top left corner

    this.addChild( new FaucetNode(1, model.faucetFlowRateProperty, model.isFaucetEnabledProperty, {
      horizontalPipeLength: 1000,
      x: 0,
      y: 100,
      scale: 0.4 //size of the faucet
    }));
    //control panel
    this.controlPanel = new ControlPanel( model, 600, 50 );
    this.addChild( this.controlPanel );
    this.addChild( new UnitsControlPanel( model, 600, 150) );

    //control slider
    this.addChild( new ControlSlider( model, model.fluidDensityProperty, model.units.getFluidDensityString, model.fluidDensityRange, {
      x: 495,
      y: 400,
      title: fluidDensityString,
      ticks: [
        {
          title: waterString,
          value: 1000
        },
        {
          title: gasolineString,
          value: model.fluidDensityRange.min
        },
        {
          title: honeyString,
          value: model.fluidDensityRange.max
        }
      ]
    } ) );

    model.isPlayProperty.link( function( data ) {
      // TODO;
    } );

    this.addChild( new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      scale: 0.66, x: 705, y: 450
    } ) );

    //adding radio button and play pause button at bottom of the page
    this.addChild( new AquaRadioButton( model.waterSpeedProperty, slowMotionString, new Text( slowMotionString, textOptions ), {radius: 8, x: 250, y: 430} ) );
    this.addChild( new AquaRadioButton( model.waterSpeedProperty, normalString, new Text( normalString, textOptions ), {radius: 8, x: 250, y: 450} ) );
    this.addChild( new PlayPauseButton( model.isPlayProperty, {radius: 20, stroke: 'black', fill: '#005566', x: 400, y: 440} ) );

    //barometers
    this.barometersContainer = new Rectangle( 0, 0, 180, 90, 10, 10, {stroke: 'gray', lineWidth: 1, fill: '#f2fa6a', y: 50} );
    this.addChild( this.barometersContainer );
    this.barometersContainer.x = this.controlPanel.x - 5 - this.barometersContainer.width;
    this.addChild( new BarometersContainer( model, mvt, this.barometersContainer.visibleBounds, this.layoutBounds ) );
    this.addChild( new VelocitySensorsContainer( model, mvt,  this.barometersContainer.visibleBounds, this.layoutBounds ) );

    this.addChild( new WaterTowerRuler( model, mvt, this.layoutBounds ) );
    this.addChild( new MeasuringTape( model, mvt, this.layoutBounds ) );

    var waterTowerView = new WaterTowerView ( model.waterTower , { x: 0, y: 100});
    this.addChild( waterTowerView);
    waterTowerView.moveToBack();

    // add background -- sky, earth
    var backgroundNode = new OutsideBackgroundNode( this.layoutBounds.centerX, this.layoutBounds.centerY + 100, this.layoutBounds.width * 3, this.layoutBounds.height, this.layoutBounds.height );
    this.addChild( backgroundNode );
    backgroundNode.moveToBack();

  }

  return inherit( ScreenView, WaterTowerScreenView );

} );