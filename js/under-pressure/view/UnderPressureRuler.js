// Copyright 2013-2017, University of Colorado Boulder

/**
 * A simple ruler which shows units in english and metric units
 *
 * @author Shakhov Vasily (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const CloseButton = require( 'SCENERY_PHET/buttons/CloseButton' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RulerNode = require( 'SCENERY_PHET/RulerNode' );
  const Units = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Units' );

  // strings
  const ftString = require( 'string!FLUID_PRESSURE_AND_FLOW/ft' );
  const mString = require( 'string!FLUID_PRESSURE_AND_FLOW/m' );

  class UnderPressureRuler extends Node {
    /**
     * @param {UnderPressureModel} underPressureModel
     * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
     * @param {Bounds2} dragBounds to limit the ruler dragging
     */
    constructor( underPressureModel, modelViewTransform, dragBounds ) {

      super( { cursor: 'pointer' } );

      const scaleFont = new PhetFont( 12 );

      //close button
      const closeButton = new CloseButton( {
        iconLength: 6,
        listener: () => {
          underPressureModel.isRulerVisibleProperty.value = false;
        }
      } );
      this.addChild( closeButton );

      const rulerWidth = 50;

      // meter ruler
      // Note: make sure that major stick width and minor stick width are integers
      const meterRulerHeight = modelViewTransform.modelToViewX( 5 );
      const meterRulerMajorStickWidth = Math.floor( modelViewTransform.modelToViewX( 1 ) );
      const metersRuler = new RulerNode( meterRulerHeight, rulerWidth, meterRulerMajorStickWidth,
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
      const feetRulerHeight = modelViewTransform.modelToViewX( Units.feetToMeters( 10 ) );
      const feetRulerMajorStickWidth = modelViewTransform.modelToViewX( Units.feetToMeters( 1 ) );
      const feetRuler = new RulerNode( feetRulerHeight, rulerWidth, feetRulerMajorStickWidth,
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
      underPressureModel.measureUnitsProperty.link( measureUnits => {
        feetRuler.visible = ( measureUnits === 'english' );
        metersRuler.visible = ( measureUnits !== 'english' );
      } );

      underPressureModel.rulerPositionProperty.linkAttribute( metersRuler, 'translation' );
      underPressureModel.rulerPositionProperty.linkAttribute( feetRuler, 'translation' );

      underPressureModel.rulerPositionProperty.link( rulerPosition => {
        this.moveToFront();
        closeButton.setTranslation( rulerPosition.x - 50, rulerPosition.y - closeButton.height );
      } );

      // drag handlers
      metersRuler.addInputListener( new MovableDragHandler( underPressureModel.rulerPositionProperty, { dragBounds: dragBounds } ) );
      feetRuler.addInputListener( new MovableDragHandler( underPressureModel.rulerPositionProperty, { dragBounds: dragBounds } ) );
    }
  }

  return fluidPressureAndFlow.register( 'UnderPressureRuler', UnderPressureRuler );
} );
