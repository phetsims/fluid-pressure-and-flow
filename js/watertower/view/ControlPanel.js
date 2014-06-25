//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Control Panel' node.
 *
 * @author Siddhartha Chinthapally (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Panel = require( 'SUN/Panel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );

  // strings
  var measuringTapeString = require( 'string!FLUID_PRESSURE_AND_FLOW/measuringTape' );
  var rulerString = require( 'string!FLUID_PRESSURE_AND_FLOW/ruler' );
  var hoseString = require( 'string!FLUID_PRESSURE_AND_FLOW/hose' );

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

    var measuringTape = [new Text( measuringTapeString, textOptions )];

    //align ruler icon right
    var ruler = [new Text( rulerString, textOptions ), new Rectangle( 0, 0, 50, 20 ), this.createRulerIcon()];
    var hose = [new Text( hoseString, textOptions )];
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

  return inherit( Node, ControlPanel, {

    //Create an icon for the ruler check box
    createRulerIcon: function() {
      return new RulerNode( 30, 20, 15, ['0', '1', '2'], '', {
        insetsWidth: 7,
        minorTicksPerMajorTick: 4,
        majorTickFont: new PhetFont( 12 ),
        clipArea: Shape.rect( -1, -1, 44, 22 )
      } );
    }
  } );
} );