// Copyright 2014-2017, University of Colorado Boulder

/**
 * Ruler Node. Supports english and metric views of the ruler.
 * @author Shakhov Vasily (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts).
 */
define( function( require ) {
  'use strict';

  // modules
  var CloseButton = require( 'SCENERY_PHET/buttons/CloseButton' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );

  // strings
  var ftString = require( 'string!FLUID_PRESSURE_AND_FLOW/ft' );
  var mString = require( 'string!FLUID_PRESSURE_AND_FLOW/m' );

  /**
   * Main constructor
   * @param {Property.<boolean>} isRulerVisibleProperty controls the ruler visibility
   * @param {Property.<Vector2>} rulerPositionProperty controls the ruler position
   * @param {Property.<string>} measureUnitsProperty controls the ruler view -- english/metric
   * @param {ModelViewTransform2} modelViewTransform to convert model units to view units
   * @param {Bounds2} dragBounds for the area where the ruler can be dragged
   * @param {Object} [options] that can be passed on to the underlying node
   * @constructor
   */
  function FPAFRuler( isRulerVisibleProperty, rulerPositionProperty, measureUnitsProperty, modelViewTransform,
                      dragBounds, options ) {

    var self = this;

    Node.call( this, { cursor: 'pointer' } );

    options = _.extend( {
      rulerWidth: 40,
      rulerHeight: 5,
      meterMajorStickWidth: 1,
      feetMajorStickWidth: 0.3,
      scaleFont: 10,
      meterTicks: _.range( 0, 6, 1 ),
      feetTicks: _.range( 0, 17, 1 ),
      insetsWidth: 0
    }, options );

    var rulerWidth = options.rulerWidth;
    var rulerHeight = Math.abs( modelViewTransform.modelToViewDeltaY( options.rulerHeight ) );
    var meterMajorStickWidth = Math.abs( modelViewTransform.modelToViewDeltaY( options.meterMajorStickWidth ) );
    var feetMajorStickWidth = Math.abs( modelViewTransform.modelToViewDeltaY( options.feetMajorStickWidth ) );
    var scaleFont = new PhetFont( options.scaleFont );

    var closeButton = new CloseButton( {
      iconLength: 6,
      listener: function() {
        isRulerVisibleProperty.value = false;
      }
    } );
    this.addChild( closeButton );

    // ruler in meters
    var metersRuler = new RulerNode( rulerHeight, rulerWidth, meterMajorStickWidth, options.meterTicks,
      mString, {
        minorTicksPerMajorTick: 4,
        unitsFont: scaleFont,
        majorTickFont: scaleFont,
        unitsMajorTickIndex: 1,
        insetsWidth: options.insetsWidth,
        rotation: -Math.PI / 2
      } );
    this.addChild( metersRuler );

    // ruler in feet
    var feetRuler = new RulerNode( rulerHeight, rulerWidth, feetMajorStickWidth, options.feetTicks, ftString, {
      minorTicksPerMajorTick: 4,
      unitsFont: scaleFont,
      majorTickFont: scaleFont,
      unitsMajorTickIndex: 1,
      insetsWidth: options.insetsWidth,
      rotation: -Math.PI / 2
    } );
    this.addChild( feetRuler );

    isRulerVisibleProperty.linkAttribute( this, 'visible' );

    new DerivedProperty( [ measureUnitsProperty ], function( measureUnits ) { return measureUnits === 'english'; } )
      .linkAttribute( feetRuler, 'visible' );
    new DerivedProperty( [ measureUnitsProperty ], function( measureUnits ) { return measureUnits === 'metric'; } )
      .linkAttribute( metersRuler, 'visible' );

    rulerPositionProperty.linkAttribute( metersRuler, 'translation' );
    rulerPositionProperty.linkAttribute( feetRuler, 'translation' );
    rulerPositionProperty.link( function( rulerPosition ) {
      self.moveToFront();
      closeButton.setTranslation( rulerPosition.x, rulerPosition.y - closeButton.height - rulerHeight );
    } );
    var rulerDragBounds = dragBounds.withMaxX( dragBounds.maxX - options.rulerWidth );

    // ruler drag handlers
    metersRuler.addInputListener( new MovableDragHandler( rulerPositionProperty, { dragBounds: rulerDragBounds } ) );
    feetRuler.addInputListener( new MovableDragHandler( rulerPositionProperty, { dragBounds: rulerDragBounds } ) );

    this.mutate( options );
  }

  fluidPressureAndFlow.register( 'FPAFRuler', FPAFRuler );

  return inherit( Node, FPAFRuler );
} );