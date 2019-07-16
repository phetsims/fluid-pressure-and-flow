// Copyright 2014-2018, University of Colorado Boulder

/**
 * Control panel that contains various tools (ruler, flux meter).
 *
 * @author Siddhartha Chinthapally (ActualConcepts)
 */
define( function( require ) {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Checkbox = require( 'SUN/Checkbox' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RulerNode = require( 'SCENERY_PHET/RulerNode' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const dotsString = require( 'string!FLUID_PRESSURE_AND_FLOW/dots' );
  const fluxMeterString = require( 'string!FLUID_PRESSURE_AND_FLOW/fluxMeter' );
  const frictionString = require( 'string!FLUID_PRESSURE_AND_FLOW/friction' );
  const rulerString = require( 'string!FLUID_PRESSURE_AND_FLOW/ruler' );

  /**
   *
   * @param {FlowModel} flowModel of the simulation
   * @param {Object} [options] for various panel display properties
   * @constructor
   */
  function FlowToolsControlPanel( flowModel, options ) {

    options = _.extend( {
      xMargin: 10,
      yMargin: 7,
      fill: '#f2fa6a ',
      stroke: 'gray',
      lineWidth: 1
    }, options );

    var textOptions = { font: new PhetFont( 10 ) };

    // itemSpec describes the pieces that make up an item in the control panel,
    // conforms to the contract: { label: {Node}, icon: {Node} (optional) }
    var rulerSpec = { label: new Text( rulerString, textOptions ), icon: createRulerIcon() };
    var frictionSpec = { label: new Text( frictionString, textOptions ) };
    var fluxMeterSpec = { label: new Text( fluxMeterString, textOptions ) };
    var dotsSpec = { label: new Text( dotsString, textOptions ), icon: createDotsIcon() };

    // compute the maximum item width
    var widestItemSpec = _.maxBy( [ rulerSpec, frictionSpec, fluxMeterSpec, dotsSpec ], function( item ) {
      return item.label.width + ((item.icon) ? item.icon.width : 0);
    } );
    var maxWidth = widestItemSpec.label.width + ((widestItemSpec.icon) ? widestItemSpec.icon.width : 0);

    // pad inserts a spacing node (HStrut) so that the text, space and image together occupy a certain fixed width.
    var createItem = function( itemSpec ) {
      if ( itemSpec.icon ) {
        var strutWidth = maxWidth - itemSpec.label.width - itemSpec.icon.width + 17;
        return new HBox( { children: [ itemSpec.label, new HStrut( strutWidth ), itemSpec.icon ] } );
      }
      else {
        return new HBox( { children: [ itemSpec.label ] } );
      }
    };

    var checkboxOptions = {
      boxWidth: 15,
      spacing: 2
    };

    var rulerCheckbox = new Checkbox( createItem( rulerSpec ), flowModel.isRulerVisibleProperty, checkboxOptions );
    var frictionCheckbox = new Checkbox( createItem( frictionSpec ), flowModel.pipe.frictionProperty, checkboxOptions );
    var fluxMeterCheckbox = new Checkbox( createItem( fluxMeterSpec ), flowModel.isFluxMeterVisibleProperty,
      checkboxOptions );
    var dotsCheckbox = new Checkbox( createItem( dotsSpec ), flowModel.isDotsVisibleProperty, checkboxOptions );

    var maxCheckboxWidth = _.maxBy( [ rulerCheckbox, frictionCheckbox, fluxMeterCheckbox, dotsCheckbox ],
        function( item ) {
          return item.width;
        } ).width + 5;

    //touch Areas
    rulerCheckbox.touchArea = new Bounds2( rulerCheckbox.localBounds.minX - 5, rulerCheckbox.localBounds.minY,
      rulerCheckbox.localBounds.minX + maxCheckboxWidth, rulerCheckbox.localBounds.maxY );
    frictionCheckbox.touchArea = new Bounds2( frictionCheckbox.localBounds.minX - 5, frictionCheckbox.localBounds.minY,
      frictionCheckbox.localBounds.minX + maxCheckboxWidth, frictionCheckbox.localBounds.maxY );
    fluxMeterCheckbox.touchArea = new Bounds2( fluxMeterCheckbox.localBounds.minX - 5,
      fluxMeterCheckbox.localBounds.minY,
      fluxMeterCheckbox.localBounds.minX + maxCheckboxWidth, fluxMeterCheckbox.localBounds.maxY );
    dotsCheckbox.touchArea = new Bounds2( dotsCheckbox.localBounds.minX - 5, dotsCheckbox.localBounds.minY,
      dotsCheckbox.localBounds.minX + maxCheckboxWidth, dotsCheckbox.localBounds.maxY );

    // pad all the rows so the text nodes are left aligned and the icons is right aligned

    var checkboxes = new VBox( {
      align: 'left', spacing: 4,
      children: [ rulerCheckbox, frictionCheckbox, fluxMeterCheckbox, dotsCheckbox ]
    } );

    Panel.call( this, checkboxes, options );
  }

  //Create an icon for the ruler checkbox
  var createRulerIcon = function() {
    return new RulerNode( 13, 10, 12, [ '0', '1' ], '', {
      insetsWidth: 5,
      minorTicksPerMajorTick: 4,
      majorTickFont: new PhetFont( 5 ),
      clipArea: Shape.rect( -1, -1, 44, 22 ),
      backgroundLineWidth: 0.5
    } );
  };

  //Create an icon for the dots checkbox
  var createDotsIcon = function() {
    var dot1 = new Circle( 3, { fill: 'red' } );
    var dot2 = new Circle( 3, { fill: 'red', left: dot1.right + 4 } );
    return new Node( { children: [ dot1, dot2 ] } );
  };

  fluidPressureAndFlow.register( 'FlowToolsControlPanel', FlowToolsControlPanel );

  return inherit( Panel, FlowToolsControlPanel );
} );