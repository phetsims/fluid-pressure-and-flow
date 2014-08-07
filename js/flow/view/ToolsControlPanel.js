// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * Control panel that contains various tools (ruler, flux meter).
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
  var HStrut = require( 'SUN/HStrut' );
  var Panel = require( 'SUN/Panel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );

  // strings
  var rulerString = require( 'string!FLUID_PRESSURE_AND_FLOW/ruler' );

  /**
   *
   * @param {FlowModel} flowModel of the simulation
   * @param options
   * @constructor
   */
  function ToolsControlPanel( flowModel, options ) {

    options = _.extend( {
      xMargin: 10,
      yMargin: 10,
      fill: '#f2fa6a ',
      stroke: 'gray',
      lineWidth: 1
    }, options );

    var textOptions = {font: new PhetFont( 14 )};

    //TODO: Remove the width calculation
    // itemSpec describes the pieces that make up an item in the control panel, conforms to the contract: { label: {Node}, icon: {Node} }
    var ruler = { label: new Text( rulerString, textOptions ), icon: createRulerIcon() };


    // compute the maximum item width
    var widestItemSpec = _.max( [ ruler], function( item ) { return item.label.width + item.icon.width; } );
    var maxWidth = widestItemSpec.label.width + widestItemSpec.icon.width;

    // pad inserts a spacing node (HStrut) so that the text, space and image together occupy a certain fixed width.
    var createItem = function( itemSpec ) {
      var strutWidth = maxWidth - itemSpec.label.width - itemSpec.icon.width + 5;
      return new HBox( { children: [ itemSpec.label, new HStrut( strutWidth ), itemSpec.icon ] } );
    };

    var checkBoxOptions = {
      boxWidth: 18,
      spacing: 5
    };

    // pad all the rows so the text nodes are left aligned and the icons is right aligned
    var checkBoxChildren = [
      new CheckBox( createItem( ruler ), flowModel.isRulerVisibleProperty, checkBoxOptions )

    ];
    var checkBoxes = new VBox( {align: 'left', spacing: 10, children: checkBoxChildren} );

    var content = new VBox( {
      spacing: 10,
      children: [checkBoxes],
      align: 'left'
    } );

    Panel.call( this, content, options );
  }

  //Create an icon for the ruler check box
  var createRulerIcon = function() {
    return new RulerNode( 30, 20, 15, ['0', '1', '2'], '', {
      insetsWidth: 7,
      minorTicksPerMajorTick: 4,
      majorTickFont: new PhetFont( 12 ),
      clipArea: Shape.rect( -1, -1, 44, 22 )
    } );
  };


  return inherit( Panel, ToolsControlPanel );
} );