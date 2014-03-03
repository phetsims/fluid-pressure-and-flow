// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model Ruler Node.
 * @author Shakhov Vasily (Mlearner)
 */

define( function( require ) {
  'use strict';

  // Imports
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // Resources
  var units_metersString = require( 'string!UNDER_PRESSURE/m' );
  var units_feetString = require( 'string!UNDER_PRESSURE/ft' );

  function UnderPressureRuler( model, mvt, view ) {
    var self = this;
    Node.call( this, { cursor: 'pointer', renderer: 'svg', cssTransform: true } );

    //close button
    var closeButton = new Node( {cursor: 'pointer'} );

    // configure the button shape
    var buttonShape = new Path( Shape.roundRectangle( 0, 0, 15, 15, 1.5, 1.5 ), { fill: 'rgb(255, 85, 0 )', stroke: 'black', lineWidth: 0.5 } );
    closeButton.addChild( buttonShape );
    var thisButton = new Path( new Shape()
      .moveTo( -4, -4 )
      .lineTo( 4, 4 )
      .moveTo( 4, -4 )
      .lineTo( -4, 4 ), {stroke: 'white', centerX: closeButton.centerX, centerY: closeButton.centerY, lineWidth: 2} );
    // click to toggle

    closeButton.addChild( thisButton );
    closeButton.addInputListener( new ButtonListener( {
      fire: function() {
        model.isRulerVisible = false;
      }
    } ) );
    this.addChild( closeButton );

    var MetersRuler = new RulerNode( mvt.modelToViewX( 5 ), 50, mvt.modelToViewX( 1 ), ['0', '1', '2', '3', '4', '5'], units_metersString, {minorTicksPerMajorTick: 4, unitsFont: '12px Arial', rotation: Math.PI / 2 } );
    this.addChild( MetersRuler );

    var FeetRuler = new RulerNode( mvt.modelToViewX( model.units.feetToMeters( 10 ) ), 50, mvt.modelToViewX( model.units.feetToMeters( 1 ) ), ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], units_feetString, {minorTicksPerMajorTick: 4, unitsFont: '12px Arial', rotation: Math.PI / 2 } );
    this.addChild( FeetRuler );

    closeButton.translation = new Vector2( -this.width + closeButton.width, -closeButton.height );

    model.isRulerVisibleProperty.link( function( isVisible ) {
      self.visible = isVisible;
    } );

    model.measureUnitsProperty.link( function( unit ) {
      if ( unit === 'english' ) {
        MetersRuler.visible = false;
        FeetRuler.visible = true;
      }
      else {
        MetersRuler.visible = true;
        FeetRuler.visible = false;
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
          var x = Math.min( view.viewBounds.maxX + self.width / 2, Math.max( self.globalToParentPoint( event.pointer.point ).x - rulerClickOffset.x, view.viewBounds.minX + self.width / 2 ) ),
            y = Math.min( view.viewBounds.maxY - self.height / 2, Math.max( self.globalToParentPoint( event.pointer.point ).y - rulerClickOffset.y, view.viewBounds.minY - self.height / 2 ) );
          model.rulerPosition = new Vector2( x, y );
        }
      } ) );
  }

  return inherit( Node, UnderPressureRuler );
} );
