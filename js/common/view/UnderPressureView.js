// Copyright 2002-2013, University of Colorado Boulder

/**
 * main ScreenView container for square pool.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  "use strict";
  var inherit = require( "PHET_CORE/inherit" );
  var CommonNode = require( "UNDER_PRESSURE/common/view/CommonNode" );
  var ScreenView = require( "JOIST/ScreenView" );
  var SquarePoolBack = require( "square-pool/view/SquarePoolBack" );
  var FaucetFluidNode = require( "UNDER_PRESSURE/common/view/FaucetFluidNode" );
  var SquarePoolWaterNode = require( "square-pool/view/SquarePoolWaterNode" );
  var BarometersContainer = require( "UNDER_PRESSURE/common/view/BarometersContainer" );
  var UnderPressureRuler = require( "UNDER_PRESSURE/common/view/UnderPressureRuler" );
  var ControlsNode = require( "UNDER_PRESSURE/common/view/ControlsNode" );

  var SceneView = {
    SquarePoolView: require( "square-pool/view/SquarePoolView" ),
    TrapezoidPoolView: require( "trapezoid-pool/view/TrapezoidPoolView" ),
    ChamberPoolView: require( "chamber-pool/view/ChamberPoolView" ),
    MysteryPoolView: require( "mystery-pool/view/MysteryPoolView" )
  };


  function UnderPressureView( model ) {
    var self = this;
    ScreenView.call( this, { renderer: "svg" } );

    //sky, earth and controls
    this.addChild( new CommonNode( model ) );

    var scenes = {};
    model.scenes.forEach( function( name ) {
      scenes[name] = new SceneView[name + "PoolView"]( model.sceneModels[name] );
      scenes[name].visible = false;
      self.addChild( scenes[name] );
    } );

    this.addChild( new ControlsNode( model ) );

    model.currentSceneProperty.link( function( value, oldValue ) {
      scenes[value].visible = true;
      if ( oldValue ) {
        scenes[oldValue].visible = false;
      }
    } );


    this.addChild( new UnderPressureRuler( model ) );

    //barometers
    this.addChild( new BarometersContainer( model ) );

  }

  return inherit( ScreenView, UnderPressureView );
} );