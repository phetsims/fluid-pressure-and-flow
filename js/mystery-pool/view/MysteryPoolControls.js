// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main view for the mystery pool. Based on square pool view.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ComboBox = require( 'SUN/ComboBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );

  var mysteryFluid = require( 'string!UNDER_PRESSURE/mysteryFluid' );
  var mysteryPlanet = require( 'string!UNDER_PRESSURE/mysteryPlanet' );
  var planetA = require( 'string!UNDER_PRESSURE/planetA' );
  var planetB = require( 'string!UNDER_PRESSURE/planetB' );
  var planetC = require( 'string!UNDER_PRESSURE/planetC' );
  var fluidA = require( 'string!UNDER_PRESSURE/fluidA' );
  var fluidB = require( 'string!UNDER_PRESSURE/fluidB' );
  var fluidC = require( 'string!UNDER_PRESSURE/fluidC' );

  function MysteryPoolControls( model ) {
    var self = this;
    Node.call( this );

    //choice for mystery scene
    var textOptions = {font: new PhetFont( 14 )};
    var choicePanel = new Node( {x: 625, y: 192, scale: 0.8} );
    var background = new Rectangle( 0, 0, 1, 1, {stroke: 'gray', lineWidth: 1, fill: '#f2fa6a', pickable: 'false'} );
    var content = new VBox( {
      children: [
        new AquaRadioButton( model.globalModel.mysteryChoiceProperty, 'fluidDensity', new Text( mysteryFluid, textOptions ), {radius: 8} ),
        new AquaRadioButton( model.globalModel.mysteryChoiceProperty, 'gravity', new Text( mysteryPlanet, textOptions ), {radius: 8} )
      ],
      spacing: 5,
      align: 'left'
    } );

    choicePanel.addChild( background );
    choicePanel.addChild( content );

    this.addChild( choicePanel );

    this.resizeWidth = function( width ) {
      background.setRect( 0, 0, width, content.height + 10, 5, 5 );
      content.centerX = background.centerX;
      content.centerY = background.centerY;
    };
    this.resizeWidth( content.width + 10 );

    // items
    this.fluidDensityComboBox = new ComboBox( [
      ComboBox.createItem( new Text( fluidA, textOptions ), 0 ),
      ComboBox.createItem( new Text( fluidB, textOptions ), 1 ),
      ComboBox.createItem( new Text( fluidC, textOptions ), 2 )
    ], model.fluidDensityCustom, self, {
      itemHighlightFill: 'rgb(218,255,255)',
      y: 260,
      x: 450,
      visible: false
    } );
    this.addChild( this.fluidDensityComboBox );

    this.gravityComboBox = new ComboBox( [
      ComboBox.createItem( new Text( planetA, textOptions ), 0 ),
      ComboBox.createItem( new Text( planetB, textOptions ), 1 ),
      ComboBox.createItem( new Text( planetC, textOptions ), 2 )
    ], model.gravityCustom, self, {
      itemHighlightFill: 'rgb(218,255,255)',
      y: 260,
      x: 450,
      visible: false
    } );
    this.addChild( this.gravityComboBox );

    model.globalModel.mysteryChoiceProperty.link( function( value, oldValue ) {
      self[value + 'ComboBox'].visible = true;
      if ( oldValue ) {
        self[oldValue + 'ComboBox'].visible = false;
      }
    } );
  }

  return inherit( Node, MysteryPoolControls );
} );