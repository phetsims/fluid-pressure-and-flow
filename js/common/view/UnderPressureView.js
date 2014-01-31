// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view of the sim.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var CommonNode = require( 'UNDER_PRESSURE/common/view/CommonNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var BarometersContainer = require( 'UNDER_PRESSURE/common/view/BarometersContainer' );
  var UnderPressureRuler = require( 'UNDER_PRESSURE/common/view/UnderPressureRuler' );
  var ControlsNode = require( 'UNDER_PRESSURE/common/view/ControlsNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );

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
    var commonNode = new CommonNode( model, mvt );
    this.addChild( commonNode );
    commonNode.moveToBack();

    var scenes = {};
    model.scenes.forEach( function( name ) {
      scenes[name] = new SceneView[name + 'PoolView']( model.sceneModels[name], mvt );
      scenes[name].visible = false;
      self.addChild( scenes[name] );
    } );

    this.controlsNode = new ControlsNode( model );
    this.addChild( this.controlsNode );

    //resize Mystery choice
    scenes.Mystery.resizeChoicePanel( this.controlsNode.controlPanel.width / this.controlsNode.controlPanel.transform.matrix.scaleVector.x );

    model.currentSceneProperty.link( function( value, oldValue ) {
      scenes[value].visible = true;
      if ( oldValue ) {
        scenes[oldValue].visible = false;
      }
    } );

    this.addChild( new UnderPressureRuler( model, mvt ) );

    //barometers
    this.addChild( new BarometersContainer( model, mvt, this.controlsNode.barometersContainer.visibleBounds ) );
  }

  return inherit( ScreenView, UnderPressureView );
} );