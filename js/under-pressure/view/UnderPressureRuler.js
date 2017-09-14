// Copyright 2013-2015, University of Colorado Boulder

/**
 * A simple ruler which shows units in english and metric units
 * @author Shakhov Vasily (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var CloseButton = require( 'SCENERY_PHET/buttons/CloseButton' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var Units = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Units' );

  // strings
  var ftString = require( 'string!FLUID_PRESSURE_AND_FLOW/ft' );
  var mString = require( 'string!FLUID_PRESSURE_AND_FLOW/m' );

  /**
   * Constructor for the under pressure ruler.
   * @param {UnderPressureModel} underPressureModel
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   * @param {Bounds2} dragBounds to limit the ruler dragging
   * @constructor
   */
  function UnderPressureRuler( underPressureModel, modelViewTransform, dragBounds ) {

    var self = this;
    Node.call( this, { cursor: 'pointer' } );

    var scaleFont = new PhetFont( 12 );

    //close button
    var closeButton = new CloseButton( {
      iconLength: 6,
      listener: function() {
        underPressureModel.isRulerVisibleProperty.value = false;
      }
    } );
    this.addChild( closeButton );

    var rulerWidth = 50;

    // meter ruler
    // Note: make sure that major stick width and minor stick width are integers
    var meterRulerHeight = modelViewTransform.modelToViewX( 5 );
    var meterRulerMajorStickWidth = Math.floor( modelViewTransform.modelToViewX( 1 ) );
    var metersRuler = new RulerNode( meterRulerHeight, rulerWidth, meterRulerMajorStickWidth,
      [ '0', '1', '2', '3', '4', '5' ],
      mString, {
        minorTicksPerMajorTick: 4,
        unitsSpacing: 4,
        unitsFont: scaleFont,
        majorTickFont: scaleFont,
        rotation: Math.PI / 2
      }
    );
    this.addChild( metersRuler );

    // feet ruler
    // Note: make sure that major stick width and minor stick width are integers
    var feetRulerHeight = modelViewTransform.modelToViewX( Units.feetToMeters( 10 ) );
    var feetRulerMajorStickWidth = modelViewTransform.modelToViewX( Units.feetToMeters( 1 ) );
    var feetRuler = new RulerNode( feetRulerHeight, rulerWidth, feetRulerMajorStickWidth,
      [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ], ftString, {
        minorTicksPerMajorTick: 2,
        unitsSpacing: 4,
        unitsFont: scaleFont,
        majorTickFont: scaleFont,
        rotation: Math.PI / 2
      }
    );
    this.addChild( feetRuler );

    //closeButton.translation = new Vector2( -this.width + closeButton.width, -closeButton.height );

    underPressureModel.isRulerVisibleProperty.linkAttribute( this, 'visible' );

    // show feetRuler for 'english' and metersRuler for 'metric' and 'atmosphere'
    underPressureModel.measureUnitsProperty.link( function( measureUnits ) {
      feetRuler.visible = (measureUnits === 'english');
      metersRuler.visible = (measureUnits !== 'english');
    } );

    underPressureModel.rulerPositionProperty.linkAttribute( metersRuler, 'translation' );
    underPressureModel.rulerPositionProperty.linkAttribute( feetRuler, 'translation' );

    underPressureModel.rulerPositionProperty.link( function( rulerPosition ) {
      self.moveToFront();
      closeButton.setTranslation( rulerPosition.x - 50, rulerPosition.y - closeButton.height );
    } );

    // drag handlers
    metersRuler.addInputListener( new MovableDragHandler( underPressureModel.rulerPositionProperty, { dragBounds: dragBounds } ) );
    feetRuler.addInputListener( new MovableDragHandler( underPressureModel.rulerPositionProperty, { dragBounds: dragBounds } ) );
  }

  fluidPressureAndFlow.register( 'UnderPressureRuler', UnderPressureRuler );

  return inherit( Node, UnderPressureRuler );
} );
