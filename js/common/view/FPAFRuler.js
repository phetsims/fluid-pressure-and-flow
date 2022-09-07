// Copyright 2014-2022, University of Colorado Boulder

/**
 * Ruler Node. Supports english and metric views of the ruler.
 *
 * @author Shakhov Vasily (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts).
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import CloseButton from '../../../../scenery-phet/js/buttons/CloseButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { DragListener, Node } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../../FluidPressureAndFlowStrings.js';

const ftString = FluidPressureAndFlowStrings.ft;
const mString = FluidPressureAndFlowStrings.m;

class FPAFRuler extends Node {

  /**
   * @param {Property.<boolean>} isRulerVisibleProperty controls the ruler visibility
   * @param {Property.<Vector2>} rulerPositionProperty controls the ruler position
   * @param {Property.<string>} measureUnitsProperty controls the ruler view -- english/metric
   * @param {ModelViewTransform2} modelViewTransform to convert model units to view units
   * @param {Bounds2} dragBounds for the area where the ruler can be dragged
   * @param {Object} [options] that can be passed on to the underlying node
   */
  constructor( isRulerVisibleProperty, rulerPositionProperty, measureUnitsProperty, modelViewTransform,
               dragBounds, options ) {

    super( { cursor: 'pointer' } );

    options = merge( {
      rulerWidth: 40,
      rulerHeight: 5,
      meterMajorStickWidth: 1,
      feetMajorStickWidth: 0.3,
      scaleFont: 10,
      meterTicks: _.range( 0, 6, 1 ),
      feetTicks: _.range( 0, 17, 1 ),
      insetsWidth: 0
    }, options );

    const rulerWidth = options.rulerWidth;
    const rulerHeight = Math.abs( modelViewTransform.modelToViewDeltaY( options.rulerHeight ) );
    const meterMajorStickWidth = Math.abs( modelViewTransform.modelToViewDeltaY( options.meterMajorStickWidth ) );
    const feetMajorStickWidth = Math.abs( modelViewTransform.modelToViewDeltaY( options.feetMajorStickWidth ) );
    const scaleFont = new PhetFont( options.scaleFont );

    const closeButton = new CloseButton( {
      iconLength: 12,
      listener: () => {
        isRulerVisibleProperty.value = false;
      }
    } );
    this.addChild( closeButton );

    // ruler in meters
    const metersRuler = new RulerNode( rulerHeight, rulerWidth, meterMajorStickWidth, options.meterTicks,
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
    const feetRuler = new RulerNode( rulerHeight, rulerWidth, feetMajorStickWidth, options.feetTicks, ftString, {
      minorTicksPerMajorTick: 4,
      unitsFont: scaleFont,
      majorTickFont: scaleFont,
      unitsMajorTickIndex: 1,
      insetsWidth: options.insetsWidth,
      rotation: -Math.PI / 2
    } );
    this.addChild( feetRuler );

    isRulerVisibleProperty.linkAttribute( this, 'visible' );

    //TODO replace 2 DerivedProperties with 1 measureUnitsProperty listener
    new DerivedProperty( [ measureUnitsProperty ], measureUnits => measureUnits === 'english' )
      .linkAttribute( feetRuler, 'visible' );
    new DerivedProperty( [ measureUnitsProperty ], measureUnits => measureUnits === 'metric' )
      .linkAttribute( metersRuler, 'visible' );

    rulerPositionProperty.linkAttribute( metersRuler, 'translation' );
    rulerPositionProperty.linkAttribute( feetRuler, 'translation' );
    rulerPositionProperty.link( rulerPosition => {
      this.moveToFront();
      closeButton.setTranslation( rulerPosition.x, rulerPosition.y - closeButton.height - rulerHeight );
    } );
    const rulerDragBounds = dragBounds.withMaxX( dragBounds.maxX - options.rulerWidth );

    // ruler drag handlers
    metersRuler.addInputListener( new DragListener( { positionProperty: rulerPositionProperty, dragBoundsProperty: new Property( rulerDragBounds ) } ) );
    feetRuler.addInputListener( new DragListener( { positionProperty: rulerPositionProperty, dragBoundsProperty: new Property( rulerDragBounds ) } ) );

    this.mutate( options );
  }
}

fluidPressureAndFlow.register( 'FPAFRuler', FPAFRuler );
export default FPAFRuler;