// Copyright 2013-2015, University of Colorado Boulder

/**
 * View for mystery pool which is based on square pool.
 * Mystery pool has one of gravity/fluidDensity controls with a question mark and a random gravity/fluidDensity is used
 * for the hidden control. The objective is to figure out the hidden value.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var ComboBox = require( 'SUN/ComboBox' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SquarePoolView = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/SquarePoolView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var mysteryFluidString = require( 'string!FLUID_PRESSURE_AND_FLOW/mysteryFluid' );
  var mysteryPlanetString = require( 'string!FLUID_PRESSURE_AND_FLOW/mysteryPlanet' );
  var planetAString = require( 'string!FLUID_PRESSURE_AND_FLOW/planetA' );
  var planetBString = require( 'string!FLUID_PRESSURE_AND_FLOW/planetB' );
  var planetCString = require( 'string!FLUID_PRESSURE_AND_FLOW/planetC' );
  var fluidAString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidA' );
  var fluidBString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidB' );
  var fluidCString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidC' );

  // constants
  var RADIO_BUTTON_TOUCH_DILATION_Y = 2; // empirically determined

  /**
   * @param mysteryPoolModel
   * @param modelViewTransform
   * @param bounds
   * @param bottom
   * @param left
   * @param fluidDensityTop
   * @param fluidDensityLeft
   * @param width
   * @constructor
   */
  function MysteryPoolView( mysteryPoolModel, modelViewTransform, bounds, bottom, left, fluidDensityTop, fluidDensityLeft, width ) {

    SquarePoolView.call( this, mysteryPoolModel, modelViewTransform );
    //this.mysteryPoolControls = new MysteryPoolControls( mysteryPoolModel, bottom );
    //this.addChild( this.mysteryPoolControls );

    var mysteryPoolControls = this;
    //Node.call( this );
    //choice for mystery scene
    var textOptions = {
      font: new PhetFont( 12 ),
      maxWidth: width * 0.8
    };

    var mysteryFluidRadio = new AquaRadioButton( mysteryPoolModel.underPressureModel.mysteryChoiceProperty,
      'fluidDensity', new Text( mysteryFluidString, textOptions ), { radius: 6 } );
    var mysteryPlanetRadio = new AquaRadioButton( mysteryPoolModel.underPressureModel.mysteryChoiceProperty, 'gravity',
      new Text( mysteryPlanetString, textOptions ), { radius: 6 } );

    //touch areas
    mysteryFluidRadio.touchArea = mysteryFluidRadio.bounds.dilatedY( RADIO_BUTTON_TOUCH_DILATION_Y );
    mysteryPlanetRadio.touchArea = mysteryPlanetRadio.bounds.dilatedY( RADIO_BUTTON_TOUCH_DILATION_Y );

    var content = new VBox( {
      children: [ mysteryFluidRadio, mysteryPlanetRadio ],
      spacing: 5,
      align: 'left',
      resize: false
    } );

    var choicePanel = new Panel( content, {
      xMargin: 7,
      yMargin: 6,
      stroke: 'gray',
      lineWidth: 1,
      fill: '#f2fa6a',
      resize: false,
      align: 'left',
      cornerRadius: 7,
      minWidth: width,
      maxWidth: width
    } );
    //var background = new Rectangle( 0, 0, 0, 1, { stroke: 'gray', lineWidth: 1, fill: '#f2fa6a', pickable: false } );
    //this.choicePanel.addChild( background );
    //this.choicePanel.addChild( content );
    choicePanel.top = bottom + 5;
    choicePanel.left = left;
    this.addChild( choicePanel );

    // items
    this.fluidDensityComboBox = new ComboBox( [
      ComboBox.createItem( new Text( fluidAString, textOptions ), 0 ),
      ComboBox.createItem( new Text( fluidBString, textOptions ), 1 ),
      ComboBox.createItem( new Text( fluidCString, textOptions ), 2 )
    ], mysteryPoolModel.customFluidDensityProperty, mysteryPoolControls, {
      itemHighlightFill: 'rgb(218,255,255)',
      visible: false
    } );

    this.fluidDensityComboBox.touchArea = this.fluidDensityComboBox.localBounds.dilatedXY( 0, 0 );
    this.fluidDensityComboBox.top = fluidDensityTop;
    this.fluidDensityComboBox.right = fluidDensityLeft - 10;
    this.addChild( this.fluidDensityComboBox );

    this.gravityComboBox = new ComboBox( [
      ComboBox.createItem( new Text( planetAString, textOptions ), 0 ),
      ComboBox.createItem( new Text( planetBString, textOptions ), 1 ),
      ComboBox.createItem( new Text( planetCString, textOptions ), 2 )
    ], mysteryPoolModel.customGravityProperty, mysteryPoolControls, {
      itemHighlightFill: 'rgb(218,255,255)',
      visible: false
    } );

    this.gravityComboBox.touchArea = this.gravityComboBox.localBounds.dilatedXY( 0, 0 );
    this.gravityComboBox.right = this.fluidDensityComboBox.right;
    this.gravityComboBox.top = this.fluidDensityComboBox.top;
    this.addChild( this.gravityComboBox );

    //this.choicePanel.resizeWidth = function( width ) {
    //  background.setRect( 0, 0, width, content.height + 6, 5, 5 );
    //  content.centerX = background.centerX - 4;
    //  content.centerY = background.centerY;
    //};
    //this.choicePanel.resizeWidth( content.width + 10 );

    new DerivedProperty( [ mysteryPoolModel.underPressureModel.mysteryChoiceProperty ],
      function( mysteryChoice ) {
        return mysteryChoice === 'fluidDensity';
      } ).linkAttribute( mysteryPoolControls.fluidDensityComboBox, 'visible' );

    new DerivedProperty( [ mysteryPoolModel.underPressureModel.mysteryChoiceProperty ],
      function( mysteryChoice ) {
        return mysteryChoice === 'gravity';
      } ).linkAttribute( mysteryPoolControls.gravityComboBox, 'visible' );

  }

  fluidPressureAndFlow.register( 'MysteryPoolView', MysteryPoolView );

  return inherit( SquarePoolView, MysteryPoolView );
} );