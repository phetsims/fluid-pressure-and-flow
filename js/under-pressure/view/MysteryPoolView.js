// Copyright 2013-2019, University of Colorado Boulder

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
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const SquarePoolView = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/SquarePoolView' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const fluidAString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidA' );
  const fluidBString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidB' );
  const fluidCString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluidC' );
  const mysteryFluidString = require( 'string!FLUID_PRESSURE_AND_FLOW/mysteryFluid' );
  const mysteryPlanetString = require( 'string!FLUID_PRESSURE_AND_FLOW/mysteryPlanet' );
  const planetAString = require( 'string!FLUID_PRESSURE_AND_FLOW/planetA' );
  const planetBString = require( 'string!FLUID_PRESSURE_AND_FLOW/planetB' );
  const planetCString = require( 'string!FLUID_PRESSURE_AND_FLOW/planetC' );

  // constants
  const RADIO_BUTTON_TOUCH_DILATION_Y = 2; // empirically determined

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

    var self = this;
    var radioButtonTextOptions = {
      font: new PhetFont( 12 ),
      maxWidth: width * 0.8
    };

    var comboBoxTextOptions = {
      font: new PhetFont( 12 ),
      maxWidth: width * 0.5
    };

    var mysteryFluidRadio = new AquaRadioButton( mysteryPoolModel.underPressureModel.mysteryChoiceProperty,
      'fluidDensity', new Text( mysteryFluidString, radioButtonTextOptions ), { radius: 6 } );
    var mysteryPlanetRadio = new AquaRadioButton( mysteryPoolModel.underPressureModel.mysteryChoiceProperty, 'gravity',
      new Text( mysteryPlanetString, radioButtonTextOptions ), { radius: 6 } );

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
    choicePanel.top = bottom + 5;
    choicePanel.left = left;
    this.addChild( choicePanel );

    // items
    this.fluidDensityComboBox = new ComboBox( [
      new ComboBoxItem( new Text( fluidAString, comboBoxTextOptions ), 0 ),
      new ComboBoxItem( new Text( fluidBString, comboBoxTextOptions ), 1 ),
      new ComboBoxItem( new Text( fluidCString, comboBoxTextOptions ), 2 )
    ], mysteryPoolModel.customFluidDensityProperty, self, {
      highlightFill: 'rgb(218,255,255)',
      visible: false
    } );

    this.fluidDensityComboBox.touchArea = this.fluidDensityComboBox.localBounds.dilatedXY( 0, 0 );
    this.fluidDensityComboBox.top = fluidDensityTop;
    this.fluidDensityComboBox.right = fluidDensityLeft - 10;
    this.addChild( this.fluidDensityComboBox );

    this.gravityComboBox = new ComboBox( [
      new ComboBoxItem( new Text( planetAString, comboBoxTextOptions ), 0 ),
      new ComboBoxItem( new Text( planetBString, comboBoxTextOptions ), 1 ),
      new ComboBoxItem( new Text( planetCString, comboBoxTextOptions ), 2 )
    ], mysteryPoolModel.customGravityProperty, self, {
      cornerRadius: 8,
      highlightFill: 'rgb(218,255,255)',
      visible: false
    } );

    this.gravityComboBox.touchArea = this.gravityComboBox.localBounds.dilatedXY( 0, 0 );
    this.gravityComboBox.right = this.fluidDensityComboBox.right;
    this.gravityComboBox.top = this.fluidDensityComboBox.top;
    this.addChild( this.gravityComboBox );

    new DerivedProperty( [ mysteryPoolModel.underPressureModel.mysteryChoiceProperty ],
      function( mysteryChoice ) {
        return mysteryChoice === 'fluidDensity';
      } ).linkAttribute( self.fluidDensityComboBox, 'visible' );

    new DerivedProperty( [ mysteryPoolModel.underPressureModel.mysteryChoiceProperty ],
      function( mysteryChoice ) {
        return mysteryChoice === 'gravity';
      } ).linkAttribute( self.gravityComboBox, 'visible' );
  }

  fluidPressureAndFlow.register( 'MysteryPoolView', MysteryPoolView );

  return inherit( SquarePoolView, MysteryPoolView );
} );