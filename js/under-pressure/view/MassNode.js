// Copyright 2013-2015, University of Colorado Boulder

/**
 * View for a single mass
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var massLabelPatternString = require( 'string!FLUID_PRESSURE_AND_FLOW/massLabelPattern' );

  /**
   * @param {MassModel} massModel of simulation
   * @param {ChamberPoolModel} chamberPoolModel
   * @param {ModelViewTransform2} modelViewTransform , Transform between model and view coordinate frames
   * @param {Bounds2} dragBounds - bounds that define where the node may be dragged
   * @constructor
   */
  function MassNode( massModel, chamberPoolModel, modelViewTransform, dragBounds ) {

    var self = this;
    Node.call( this, { cursor: 'pointer' } );

    var width = modelViewTransform.modelToViewDeltaX( massModel.width );
    var height = Math.abs( modelViewTransform.modelToViewDeltaY( massModel.height ) );

    // add mass rectangle
    var mass = new Rectangle( -width / 2, -height / 2, width, height, {
      fill: new LinearGradient( -width / 2, 0, width, 0 )
        .addColorStop( 0, '#8C8D8D' )
        .addColorStop( 0.3, '#C0C1C2' )
        .addColorStop( 0.5, '#F0F1F1' )
        .addColorStop( 0.6, '#F8F8F7' ),
      stroke: '#918e8e',
      lineWidth: 1
    } );
    this.addChild( mass );

    var massText = new Text( StringUtils.format( massLabelPatternString, massModel.mass ),
      {
        //x: mass.centerX - 15,
        //y: mass.centerY + 3,
        font: new PhetFont( 9 ),
        fill: 'black',
        pickable: false,
        fontWeight: 'bold',
        maxWidth: width - 5
      } );
    this.addChild( massText );

    var massClickOffset = { x: 0, y: 0 };

    // mass drag handler
    this.addInputListener( new SimpleDragHandler( {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      start: function( event ) {
        massClickOffset.x = self.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
        massClickOffset.y = self.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
        self.moveToFront();
        massModel.isDraggingProperty.value = true;
      },
      end: function() {
        massModel.positionProperty.value = modelViewTransform.viewToModelPosition( self.translation );
        massModel.isDraggingProperty.value = false;
      },
      //Translate on drag events
      drag: function( event ) {
        var point = self.globalToParentPoint( event.pointer.point ).subtract( massClickOffset );
        self.translation = dragBounds.getClosestPoint( point.x, point.y );
      }
    } ) );

    massModel.positionProperty.link( function( position ) {
      if ( !chamberPoolModel.isDragging ) {
        self.translation = new Vector2( modelViewTransform.modelToViewX( position.x ),
          modelViewTransform.modelToViewY( position.y ) );
        massText.centerX = mass.centerX;
        massText.centerY = mass.centerY;
      }
    } );
  }

  fluidPressureAndFlow.register( 'MassNode', MassNode );

  return inherit( Node, MassNode );
} );