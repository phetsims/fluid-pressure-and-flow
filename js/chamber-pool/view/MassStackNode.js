// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for mass stack on top of water. Masses don't stack on ground.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {ChamberPoolModel} chamberPoolModel
   * @param {ModelViewTransform2} modelViewTransform for transforming between model and view co-ordinates
   * @constructor
   */

  function MassStackNode( chamberPoolModel, modelViewTransform ) {
    var massStackNode = this;

    this.chamberPoolModel = chamberPoolModel;
    Node.call( this, {
      x: modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftOpening.x1 )
    } );

    this.totalHeight = 0; //height of all masses

    var placementRectWidth = modelViewTransform.modelToViewX( chamberPoolModel.poolDimensions.leftOpening.x2 -
                                                              chamberPoolModel.poolDimensions.leftOpening.x1 );

    var placementRect = new Rectangle( 0, 0, placementRectWidth, 0 );
    var placementRectBorder = new Path( new Shape(),
      {  stroke: '#000', lineWidth: 2, lineDash: [ 10, 5 ], fill: '#ffdcf0' } );

    this.addChild( placementRect );
    this.addChild( placementRectBorder );

    chamberPoolModel.underPressureModel.leftDisplacementProperty.link( function( displacement ) {
      massStackNode.bottom = modelViewTransform.modelToViewY( chamberPoolModel.poolDimensions.leftOpening.y2 -
                                                              chamberPoolModel.LEFT_WATER_HEIGHT + displacement );
    } );

    chamberPoolModel.masses.forEach( function( massModel ) {
      massModel.isDraggingProperty.link( function( isDragging ) {
        if ( isDragging ) {
          var placementRectHeight = modelViewTransform.modelToViewY( massModel.height );
          var placementRectY1 = -placementRectHeight - modelViewTransform.modelToViewY( massStackNode.totalHeight );

          placementRectBorder.shape = new Shape().moveTo( 0, placementRectY1 )
            .lineTo( 0, placementRectY1 + placementRectHeight )
            .lineTo( placementRectWidth, placementRectY1 + placementRectHeight )
            .lineTo( placementRectWidth, placementRectY1 )
            .lineTo( 0, placementRectY1 );

          placementRectBorder.visible = true;
        }
        else {
          placementRectBorder.visible = false;
        }
      } );
    } );

    chamberPoolModel.stack.addListeners( function() {
      massStackNode.updateMassStack();
    }, function() {
      massStackNode.updateMassStack();
    } );
  }

  return inherit( Node, MassStackNode, {

    updateMassPositions: function() {
      var dy = 0;
      var chamberPoolModel = this.chamberPoolModel;
      chamberPoolModel.stack.forEach( function( massModel ) {
        massModel.position = new Vector2( chamberPoolModel.poolDimensions.leftOpening.x1 + massModel.width / 2,
            ( chamberPoolModel.poolDimensions.leftOpening.y2 -
              chamberPoolModel.LEFT_WATER_HEIGHT +
              chamberPoolModel.underPressureModel.leftDisplacement) - dy -
            massModel.height / 2 );
        dy += massModel.height;
      } );
    },

    updateMassStack: function() {
      var totHeight = 0;

      this.chamberPoolModel.stack.forEach( function( massModel ) {
        if ( massModel ) {
          totHeight += massModel.height;
        }
      } );
      this.totalHeight = totHeight;
      this.updateMassPositions();
    }

  } );
} )
;