//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Control Panel' node.
 *
 * @author Siddhartha Chinthapally (ActualConcepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Panel = require( 'SUN/Panel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Image = require( 'SCENERY/nodes/Image' );

  // strings
  var measuringTapeString = require( 'string!FLUID_PRESSURE_AND_FLOW/measuringTape' );
  var rulerString = require( 'string!FLUID_PRESSURE_AND_FLOW/ruler' );
  var hoseString = require( 'string!FLUID_PRESSURE_AND_FLOW/hose' );

  // images
  //image
  var nozzleImg = require( 'image!FLUID_PRESSURE_AND_FLOW/nozzle.png' );
  var measuringTapeImg = require( 'image!FLUID_PRESSURE_AND_FLOW/measuringTape.png' );


  function ControlPanel( model, options ) {

    options = _.extend( {
      xMargin: 10,
      yMargin: 10,
      fill: '#f2fa6a ',
      stroke: 'gray',
      lineWidth: 1,
      resize: false,
      scale: 0.9
    }, options );

    var textOptions = {font: new PhetFont( 14 )};

    var measuringTape = [new Text( measuringTapeString, textOptions ), new Rectangle( 0, 0, 10, 20 ), this.createMeasuringTapeIcon()];

    //align ruler icon right
    var ruler = [new Text( rulerString, textOptions ), new Rectangle( 0, 0, 65, 20 ), this.createRulerIcon()];
    var hose = [new Text( hoseString, textOptions ), new Rectangle( 0, 0, 40, 20 ), this.createHoseIcon()];
    var checkBoxOptions = {
      boxWidth: 18,
      spacing: 5
    };

    var checkBoxChildren = [
      new CheckBox( new HBox( {children: ruler} ), model.isRulerVisibleProperty, checkBoxOptions ),
      new CheckBox( new HBox( {children: measuringTape} ), model.isMeasuringTapeVisibleProperty, checkBoxOptions ),
      new CheckBox( new HBox( {children: hose} ), model.isHoseVisibleProperty, checkBoxOptions )
    ];
    var checkBoxes = new VBox( {align: 'left', spacing: 10, children: checkBoxChildren} );

    var content = new VBox( {
      spacing: 10,
      children: [checkBoxes],
      align: 'left'
    } );

    Panel.call( this, content, options );
  }

  return inherit( Panel, ControlPanel, {

    //Create an icon for the ruler check box
    createRulerIcon: function() {
      return new RulerNode( 30, 20, 15, ['0', '1', '2'], '', {
        insetsWidth: 7,
        minorTicksPerMajorTick: 4,
        majorTickFont: new PhetFont( 12 ),
        clipArea: Shape.rect( -1, -1, 44, 22 )
      } );
    },
    createHoseIcon: function() {
      var icon = new Path( new Shape().moveTo( 0, 0 ).arc( -15, 8, 10, 180, 90, true ).lineTo( 10, 16 ).lineTo( 10, 0 ).lineTo( 0, 0 ), {stroke: 'grey', lineWidth: 1, fill: '#00FF99'} );
      icon.addChild( new Image( nozzleImg, { cursor: 'pointer', rotation: Math.PI / 2, scale: 0.8, left: icon.right, bottom: icon.bottom + 1} ) );
      return icon;
    },
    createMeasuringTapeIcon: function() {
      var icon = new Image( measuringTapeImg, { cursor: 'pointer', scale: 0.6} );
      var size = 5;
      icon.addChild( new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ), {stroke: '#E05F20', lineWidth: 2, left: icon.right + 12, top: icon.bottom + 12} ) );
      return icon;
    }
  } );
} );