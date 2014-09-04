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
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // strings
  var rulerString = require( 'string!FLUID_PRESSURE_AND_FLOW/ruler' );
  var frictionString = require( 'string!FLUID_PRESSURE_AND_FLOW/friction' );
  var fluxMeterString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluxMeter' );
  var dotString = require( 'string!FLUID_PRESSURE_AND_FLOW/dots' );

  /**
   *
   * @param {FlowModel} flowModel of the simulation
   * @param options
   * @constructor
   */
  function ToolsControlPanel( flowModel, options ) {

    options = _.extend( {
      xMargin: 10,
      yMargin: 7,
      fill: '#f2fa6a ',
      stroke: 'gray',
      lineWidth: 1
    }, options );

    var textOptions = {font: new PhetFont( 10 )};

    // itemSpec describes the pieces that make up an item in the control panel, conforms to the contract: { label: {Node}, icon: {Node} }
    var ruler = { label: new Text( rulerString, textOptions ), icon: createRulerIcon() };
    var friction = [new Text( frictionString, textOptions )];
    var fluxMeter = [new Text( fluxMeterString, textOptions )];
    var dots = { label: new Text( dotString, textOptions ), icon: createDotsIcon()};


    // compute the maximum item width
    var widestItemSpec = _.max( [ ruler], function( item ) {
      return item.label.width + item.icon.width;
    } );
    var maxWidth = widestItemSpec.label.width + widestItemSpec.icon.width;

    // pad inserts a spacing node (HStrut) so that the text, space and image together occupy a certain fixed width.
    var createItem = function( itemSpec ) {
      var strutWidth = maxWidth - itemSpec.label.width - itemSpec.icon.width + 5;
      return new HBox( { children: [ itemSpec.label, new HStrut( strutWidth ), new HStrut( 12 ), itemSpec.icon ] } );
    };

    var checkBoxOptions = {
      boxWidth: 15,
      spacing: 2
    };

    var rulerCheckBox = new CheckBox( createItem( ruler ), flowModel.isRulerVisibleProperty, checkBoxOptions );
    var frictionCheckBox = new CheckBox( new HBox( {children: ( friction )} ), flowModel.pipe.frictionProperty, checkBoxOptions );
    var fluxMeterCheckBox = new CheckBox( new HBox( {children: ( fluxMeter )} ), flowModel.isFluxMeterVisibleProperty, checkBoxOptions );
    var dotsCheckBox = new CheckBox( createItem( dots ), flowModel.isDotsVisibleProperty, checkBoxOptions );

    //touch Areas
    rulerCheckBox.touchArea = new Bounds2( rulerCheckBox.localBounds.minX - 5, rulerCheckBox.localBounds.minY, rulerCheckBox.localBounds.maxX + 8, rulerCheckBox.localBounds.maxY );
    frictionCheckBox.touchArea = new Bounds2( frictionCheckBox.localBounds.minX - 5, frictionCheckBox.localBounds.minY, frictionCheckBox.localBounds.maxX + 43, frictionCheckBox.localBounds.maxY );
    fluxMeterCheckBox.touchArea = new Bounds2( fluxMeterCheckBox.localBounds.minX - 5, fluxMeterCheckBox.localBounds.minY, fluxMeterCheckBox.localBounds.maxX + 29, fluxMeterCheckBox.localBounds.maxY );
    dotsCheckBox.touchArea = new Bounds2( dotsCheckBox.localBounds.minX - 5, dotsCheckBox.localBounds.minY, dotsCheckBox.localBounds.maxX + 8, dotsCheckBox.localBounds.maxY );

    // pad all the rows so the text nodes are left aligned and the icons is right aligned
    var checkBoxChildren = [ rulerCheckBox , frictionCheckBox, fluxMeterCheckBox , dotsCheckBox ];

    var checkBoxes = new VBox( {align: 'left', spacing: 4, children: checkBoxChildren} );

    var content = new VBox( {
      spacing: 1,
      children: [checkBoxes],
      align: 'left'
    } );

    Panel.call( this, content, options );
  }

  //Create an icon for the ruler check box
  var createRulerIcon = function() {
    return new RulerNode( 13, 8, 12, ['0', '1'], '', {
      insetsWidth: 7,
      minorTicksPerMajorTick: 4,
      majorTickFont: new PhetFont( 5 ),
      clipArea: Shape.rect( -1, -1, 44, 22 )
    } );
  };

  //Create an icon for the dots check box
  var createDotsIcon = function() {
    var dot1 = new Circle( 3, {fill: 'red' } );
    var dot2 = new Circle( 3, {fill: 'red', left: dot1.right + 4 } );
    return new Node( {children: [dot1, dot2]} );
  };

  return inherit( Panel, ToolsControlPanel );
} );