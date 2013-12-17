// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model Ruler Node.
 * @author Shakhov Vasily (Mlearner)
 */

define( function( require ) {
  "use strict";

  // Imports
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  // Resources
  var units_metersString = require( 'string!UNDER_PRESSURE/m' );
  var units_feetsString = require( 'string!UNDER_PRESSURE/ft' );

  /**
   * @param model
   * @constructor
   */
  function UnderPressureRuler( model, mvt ) {
    var self = this;
    Node.call( this, { cursor: "pointer", renderer: 'svg', cssTransform: true } );
    var MetersRuler = new RulerNode( mvt.modelToViewX( 5 ), 50, mvt.modelToViewX( 1 ), ["0", "1", "2", "3", "4", "5"], units_metersString, {minorTicksPerMajorTick: 4, unitsFont: '12px Arial', rotation: Math.PI / 2 } );
    this.addChild( MetersRuler );

    var FeetsRuler = new RulerNode( mvt.modelToViewX( model.units.feetToMeters( 10 ) ), 50, mvt.modelToViewX( model.units.feetToMeters( 1 ) ), ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], units_feetsString, {minorTicksPerMajorTick: 4, unitsFont: '12px Arial', rotation: Math.PI / 2 } );
    this.addChild( FeetsRuler );

    model.isRulerVisibleProperty.link( function( isVisible ) {
      self.visible = isVisible;
    } );

    model.measureUnitsProperty.link( function( unit ) {
      if ( unit === "english" ) {
        MetersRuler.visible = false;
        FeetsRuler.visible = true;
      }
      else {
        MetersRuler.visible = true;
        FeetsRuler.visible = false;
      }
    } );

    model.rulerPositionProperty.link( function updateRulerLocation( value ) {
      self.translation = value;
    } );

    var rulerClickOffset = {x: 0, y: 0};
    self.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          rulerClickOffset.x = self.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
          rulerClickOffset.y = self.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
        },
        drag: function( event ) {
          var x = self.globalToParentPoint( event.pointer.point ).x - rulerClickOffset.x,
            y = self.globalToParentPoint( event.pointer.point ).y - rulerClickOffset.y;
          model.rulerPosition = new Vector2( x, y );
        }
      } ) );
  }

  inherit( Node, UnderPressureRuler );
  return UnderPressureRuler;
} );
