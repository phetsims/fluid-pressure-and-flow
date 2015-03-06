// Copyright 2002-2013, University of Colorado Boulder

/**
 * A simple ruler which shows units in english and metric units
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
  var Vector2 = require( 'DOT/Vector2' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Units = require( 'UNDER_PRESSURE/common/model/Units' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  // strings
  var units_metersString = require( 'string!UNDER_PRESSURE/m' );
  var units_feetString = require( 'string!UNDER_PRESSURE/ft' );

  /**
   * Constructor for the under pressure ruler.
   * @param {UnderPressureModel} underPressureModel
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   * @param {Bounds2} dragBounds to limit the ruler dragging
   * @constructor
   */
  function UnderPressureRuler( underPressureModel, modelViewTransform, dragBounds ) {

    var underPressureRuler = this;
    Node.call( this, { cursor: 'pointer', cssTransform: true } );

    var closeIconRadius = 4;
    var scaleFont = new PhetFont( 12 );

    var xIcon = new Path( new Shape()
      .moveTo( -closeIconRadius, -closeIconRadius )
      .lineTo( closeIconRadius, closeIconRadius )
      .moveTo( closeIconRadius, -closeIconRadius )
      .lineTo( -closeIconRadius, closeIconRadius ), { stroke: 'white', lineWidth: 2 } );

    //close button
    var closeButton = new RectangularPushButton( {
      baseColor: PhetColorScheme.RED_COLORBLIND,
      content: xIcon,
      // click to toggle
      listener: function() {
        underPressureModel.isRulerVisible = false;
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
      units_metersString, {
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
    var feetRulerMajorStickWidth = Math.floor( modelViewTransform.modelToViewX( Units.feetToMeters( 1 ) ) );
    var feetRuler = new RulerNode( feetRulerHeight, rulerWidth, feetRulerMajorStickWidth,
      [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ], units_feetString, {
        minorTicksPerMajorTick: 2,
        unitsSpacing: 4,
        unitsFont: scaleFont,
        majorTickFont: scaleFont,
        rotation: Math.PI / 2
      }
    );
    this.addChild( feetRuler );

    closeButton.translation = new Vector2( -this.width + closeButton.width, -closeButton.height );

    underPressureModel.isRulerVisibleProperty.linkAttribute( this, 'visible' );

    // show feetRuler for 'english' and metersRuler for 'metric' and 'atmosphere'
    underPressureModel.measureUnitsProperty.link( function( measureUnits ) {
      feetRuler.visible = (measureUnits === 'english');
      metersRuler.visible = (measureUnits !== 'english');
    } );

    underPressureModel.rulerPositionProperty.linkAttribute( metersRuler, 'translation' );
    underPressureModel.rulerPositionProperty.linkAttribute( feetRuler, 'translation' );

    underPressureModel.rulerPositionProperty.link( function( rulerPosition ) {
      underPressureRuler.moveToFront();
      closeButton.setTranslation( rulerPosition.x - 50, rulerPosition.y - closeButton.height );
    } );

    // drag handlers
    metersRuler.addInputListener( new MovableDragHandler( underPressureModel.rulerPositionProperty, { dragBounds: dragBounds } ) );
    feetRuler.addInputListener( new MovableDragHandler( underPressureModel.rulerPositionProperty, { dragBounds: dragBounds } ) );
  }

  return inherit( Node, UnderPressureRuler );
} );
