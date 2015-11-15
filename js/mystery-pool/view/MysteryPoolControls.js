// Copyright 2013-2015, University of Colorado Boulder

/**
 * View for the mystery pool controls including a radio selection for mystery planet/fluid and a drop down for selecting
 * one of three planets/fluids.
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ComboBox = require( 'SUN/ComboBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );

  // strings
  var mysteryFluidString = require( 'string!UNDER_PRESSURE/mysteryFluid' );
  var mysteryPlanetString = require( 'string!UNDER_PRESSURE/mysteryPlanet' );
  var planetAString = require( 'string!UNDER_PRESSURE/planetA' );
  var planetBString = require( 'string!UNDER_PRESSURE/planetB' );
  var planetCString = require( 'string!UNDER_PRESSURE/planetC' );
  var fluidAString = require( 'string!UNDER_PRESSURE/fluidA' );
  var fluidBString = require( 'string!UNDER_PRESSURE/fluidB' );
  var fluidCString = require( 'string!UNDER_PRESSURE/fluidC' );

  /**
   * @param {MysteryPoolModel} mysteryPoolModel
   * @constructor
   */
  function MysteryPoolControls( mysteryPoolModel ) {

    var mysteryPoolControls = this;
    Node.call( this );
    //choice for mystery scene
    var textOptions = { font: new PhetFont( 12 ) };
    this.choicePanel = new Node( { x: 625, y: 197 } );
    var background = new Rectangle( 0, 0, 0, 1, { stroke: 'gray', lineWidth: 1, fill: '#f2fa6a', pickable: false } );

    var mysteryFluidRadio = new AquaRadioButton( mysteryPoolModel.underPressureModel.mysteryChoiceProperty,
      'fluidDensity', new Text( mysteryFluidString, textOptions ), { radius: 6 } );
    var mysteryPlanetRadio = new AquaRadioButton( mysteryPoolModel.underPressureModel.mysteryChoiceProperty, 'gravity',
      new Text( mysteryPlanetString, textOptions ), { radius: 6 } );
    var touchExpansion = 4;
    var maxRadioButtonWidth = _.max( [ mysteryFluidRadio, mysteryPlanetRadio ], function( item ) {
        return item.width;
      } ).width + 5;

    //touch areas
    mysteryFluidRadio.touchArea = new Bounds2(
      mysteryFluidRadio.localBounds.minX - touchExpansion,
      mysteryFluidRadio.localBounds.minY,
      mysteryFluidRadio.localBounds.minX + maxRadioButtonWidth,
      mysteryFluidRadio.localBounds.maxY
    );

    mysteryPlanetRadio.touchArea = new Bounds2(
      mysteryPlanetRadio.localBounds.minX - touchExpansion,
      mysteryPlanetRadio.localBounds.minY,
      mysteryPlanetRadio.localBounds.minX + maxRadioButtonWidth,
      mysteryPlanetRadio.localBounds.maxY
    );

    var content = new VBox( {
      children: [ mysteryFluidRadio, mysteryPlanetRadio ],
      spacing: 4,
      align: 'left'
    } );
    this.choicePanel.addChild( background );
    this.choicePanel.addChild( content );
    this.addChild( this.choicePanel );

    // items
    this.fluidDensityComboBox = new ComboBox( [
      ComboBox.createItem( new Text( fluidAString, textOptions ), 0 ),
      ComboBox.createItem( new Text( fluidBString, textOptions ), 1 ),
      ComboBox.createItem( new Text( fluidCString, textOptions ), 2 )
    ], mysteryPoolModel.customFluidDensityProperty, mysteryPoolControls, {
      itemHighlightFill: 'rgb(218,255,255)',
      y: 253,
      x: 457,
      visible: false
    } );

    this.fluidDensityComboBox.touchArea = this.fluidDensityComboBox.localBounds.dilatedXY( 0, 0 );
    this.addChild( this.fluidDensityComboBox );

    this.gravityComboBox = new ComboBox( [
      ComboBox.createItem( new Text( planetAString, textOptions ), 0 ),
      ComboBox.createItem( new Text( planetBString, textOptions ), 1 ),
      ComboBox.createItem( new Text( planetCString, textOptions ), 2 )
    ], mysteryPoolModel.customGravityProperty, mysteryPoolControls, {
      itemHighlightFill: 'rgb(218,255,255)',
      y: this.fluidDensityComboBox.y,
      x: this.fluidDensityComboBox.x,
      visible: false
    } );

    this.gravityComboBox.touchArea = this.gravityComboBox.localBounds.dilatedXY( 0, 0 );
    this.addChild( this.gravityComboBox );

    this.choicePanel.resizeWidth = function( width ) {
      background.setRect( 0, 0, width, content.height + 6, 5, 5 );
      content.centerX = background.centerX - 4;
      content.centerY = background.centerY;
    };
    this.choicePanel.resizeWidth( content.width + 10 );

    new DerivedProperty( [ mysteryPoolModel.underPressureModel.mysteryChoiceProperty ],
      function( mysteryChoice ) {
        return mysteryChoice === 'fluidDensity';
      } ).linkAttribute( mysteryPoolControls.fluidDensityComboBox, 'visible' );

    new DerivedProperty( [ mysteryPoolModel.underPressureModel.mysteryChoiceProperty ],
      function( mysteryChoice ) {
        return mysteryChoice === 'gravity';
      } ).linkAttribute( mysteryPoolControls.gravityComboBox, 'visible' );
  }

  return inherit( Node, MysteryPoolControls );
} );