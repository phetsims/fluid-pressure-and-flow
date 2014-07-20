// Copyright 2002-2013, University of Colorado Boulder

/**
 * Ruler Node. Supports english and metric views of the ruler.
 * @author Shakhov Vasily (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // strings
  var units_metersString = require( 'string!FLUID_PRESSURE_AND_FLOW/m' );
  var units_feetString = require( 'string!FLUID_PRESSURE_AND_FLOW/ft' );

  /**
   * Main constructor
   * @param {Property<Boolean>} isRulerVisibleProperty controls the ruler visibility
   * @param {Property<Vector2>} rulerPositionProperty controls the ruler position
   * @param {Property<String>} measureUnitsProperty controls the ruler view -- english/metric
   * @param {ModelViewTransform2} modelViewTransform to convert model units to view units
   * @param {Bounds2} dragBounds for the area where the ruler can be dragged
   * @param options
   * @constructor
   */
  function WaterTowerRuler( isRulerVisibleProperty, rulerPositionProperty, measureUnitsProperty, modelViewTransform, dragBounds, options ) {
    Node.call( this, {cursor: 'pointer'} );
    var closeIconRadius = 4;
    var rulerWidth = 40;
    var rulerHeight = modelViewTransform.modelToViewX( 30 );
    var meterMajorStickWidth = modelViewTransform.modelToViewX( 5 );
    var feetMajorStickWidth = modelViewTransform.modelToViewX( 3 );
    var scaleFont = new PhetFont( 12 );
    var xIcon = new Path( new Shape()
      .moveTo( -closeIconRadius, -closeIconRadius )
      .lineTo( closeIconRadius, closeIconRadius )
      .moveTo( closeIconRadius, -closeIconRadius )
      .lineTo( -closeIconRadius, closeIconRadius ), {stroke: 'white', lineWidth: 2} );
    //close button
    var closeButton = new RectangularPushButton( {
      baseColor: 'red',
      content: xIcon,
      // click to toggle
      listener: function() {
        isRulerVisibleProperty.value = false;
      }
    } );
    this.addChild( closeButton );

    // ruler in meters
    var metersRuler = new RulerNode( rulerHeight, rulerWidth, meterMajorStickWidth, ['0', '5', '10', '15', '20', '25', '30'], units_metersString, {minorTicksPerMajorTick: 4, unitsFont: scaleFont, majorTickFont: scaleFont, unitsSpacing: 50, rotation: -Math.PI / 2, insetsWidth: 0} );
    this.addChild( metersRuler );

    // ruler in feet
    var feetRuler = new RulerNode( rulerHeight, rulerWidth, feetMajorStickWidth, ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'], units_feetString, {minorTicksPerMajorTick: 4, unitsSpacing: 34, unitsFont: scaleFont, majorTickFont: scaleFont, insetsWidth: 0, rotation: -Math.PI / 2} );
    this.addChild( feetRuler );

    isRulerVisibleProperty.linkAttribute( this, 'visible' );

    measureUnitsProperty.valueEquals( 'english' ).linkAttribute( feetRuler, 'visible' );
    measureUnitsProperty.valueEquals( 'metric' ).linkAttribute( metersRuler, 'visible' );

    rulerPositionProperty.linkAttribute( metersRuler, 'translation' );
    rulerPositionProperty.linkAttribute( feetRuler, 'translation' );
    rulerPositionProperty.link( function( rulerPosition ) {
      closeButton.setTranslation( rulerPosition.x, rulerPosition.y - closeButton.height - rulerHeight );
    } );

    // ruler drag handlers
    metersRuler.addInputListener( new MovableDragHandler( {locationProperty: rulerPositionProperty, dragBounds: dragBounds},
      ModelViewTransform2.createIdentity() ) );
    feetRuler.addInputListener( new MovableDragHandler( {locationProperty: rulerPositionProperty, dragBounds: dragBounds},
      ModelViewTransform2.createIdentity() ) );

    this.mutate( options );

  }

  return inherit( Node, WaterTowerRuler );
} );