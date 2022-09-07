// Copyright 2013-2022, University of Colorado Boulder

/**
 * A simple ruler which shows units in english and metric units
 *
 * @author Shakhov Vasily (Mlearner)
 */

import CloseButton from '../../../../scenery-phet/js/buttons/CloseButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { DragListener, Node } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import Units from '../../common/model/Units.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';

const ftString = FluidPressureAndFlowStrings.ft;
const mString = FluidPressureAndFlowStrings.m;

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
      iconLength: 12,
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
    metersRuler.addInputListener( new DragListener( { positionProperty: underPressureModel.rulerPositionProperty, dragBoundsProperty: new Property( dragBounds ) } ) );
    feetRuler.addInputListener( new DragListener( { positionProperty: underPressureModel.rulerPositionProperty, dragBoundsProperty: new Property( dragBounds ) } ) );
  }
}

fluidPressureAndFlow.register( 'UnderPressureRuler', UnderPressureRuler );
export default UnderPressureRuler;