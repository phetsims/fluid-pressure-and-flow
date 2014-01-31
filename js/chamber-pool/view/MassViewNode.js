// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for single mass
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Text = require( 'SCENERY/nodes/Text' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  var massImg = require( 'image!UNDER_PRESSURE/images/mass.png' );
  var massLabelPattern = require( 'string!UNDER_PRESSURE/massLabelPattern' );

  function MassViewNode( massModel, model, mvt ) {
    var self = this;

    Node.call( this, {
      cursor: 'pointer'
    } );

    var width = mvt.modelToViewX( massModel.width ),
      height = mvt.modelToViewY( massModel.height );

    this.addChild( new Image( massImg, {
      clipArea: Shape.rect( 0, 0, width, height )
    } ) );

    //image border
    this.addChild( new Rectangle( 0, 0, width, height, {
      stroke: '#918e8e',
      lineWidth: 1
    } ) );

    this.addChild( new Text( StringUtils.format( massLabelPattern, massModel.mass ), { centerY: height / 2, centerX: width / 2, font: new PhetFont( 9 ), fill: 'black', pickable: false, 'fontWeight': 'bold'} ) );

    var massDragHandler = new SimpleDragHandler( {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      start: function() {
        self.moveToFront();
        massModel.isDragging = true;
      },
      end: function() {
        var newPosition = self.translation;
        newPosition.x = mvt.viewToModelX( newPosition.x );
        newPosition.y = mvt.viewToModelX( newPosition.y );
        massModel.position = newPosition;
        massModel.isDragging = false;
      },
      //Translate on drag events
      translate: function( args ) {
        self.translation = args.position;
      }
    } );

    this.addInputListener( massDragHandler );

    massModel.positionProperty.link( function( position ) {
      if ( !model.isDragging ) {
        self.translation = new Vector2( mvt.modelToViewX( position.x ), mvt.modelToViewY( position.y ) );
      }
    } );
  }

  return inherit( Node, MassViewNode );
} );