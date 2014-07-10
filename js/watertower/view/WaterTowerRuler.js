// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model Ruler Node. Supports english and metric views of the ruler.
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
  var Units = require( 'FLUID_PRESSURE_AND_FLOW/watertower/model/Units' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

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

    // configure the button shape
    var closeIconRadius = 4;
    var rulerWidth = 50;
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

    //Maintain two different rules internally and link their visibility to the measureUnits property
    var metersRuler = new RulerNode( modelViewTransform.modelToViewX( 3 ), rulerWidth, modelViewTransform.modelToViewX( 1 ), ['0', '1', '2', '3'], units_metersString, {minorTicksPerMajorTick: 4, unitsFont: '12px Arial', rotation: Math.PI / 2} );
    this.addChild( metersRuler );

    var feetRuler = new RulerNode( modelViewTransform.modelToViewX( 3 ), rulerWidth, modelViewTransform.modelToViewX( Units.feetToMeters( 1 ) ), ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], units_feetString, {minorTicksPerMajorTick: 4, unitsFont: '12px Arial', rotation: Math.PI / 2} );
    this.addChild( feetRuler );

    isRulerVisibleProperty.linkAttribute( this, 'visible' );

    measureUnitsProperty.valueEquals( 'english' ).linkAttribute( feetRuler, 'visible' );
    measureUnitsProperty.valueEquals( 'metric' ).linkAttribute( metersRuler, 'visible' );

    rulerPositionProperty.linkAttribute( metersRuler, 'translation' );
    rulerPositionProperty.linkAttribute( feetRuler, 'translation' );
    rulerPositionProperty.link( function( rulerPosition ) {
      closeButton.setTranslation( rulerPosition.x - rulerWidth, rulerPosition.y - closeButton.height );
    } );

    //handlers
    metersRuler.addInputListener( new MovableDragHandler( {locationProperty: rulerPositionProperty, dragBounds: dragBounds.shifted( this.width / 2, -this.height / 2 )},
      ModelViewTransform2.createIdentity() ) );
    feetRuler.addInputListener( new MovableDragHandler( {locationProperty: rulerPositionProperty, dragBounds: dragBounds.shifted( this.width / 2, -this.height / 2 )},
      ModelViewTransform2.createIdentity() ) );

    this.mutate( options );

  }

  return inherit( Node, WaterTowerRuler );
} );