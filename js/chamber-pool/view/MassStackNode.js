// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for mass
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Vector2 = require( 'DOT/Vector2' );


  function MassStackNode( model ) {
    var self = this;
    Node.call( this, {
      x: model.pxToMetersRatio * model.poolDimensions.leftOpening.x1
    } );


    var totalHeight = 0; //height of all masses

    var placementRectWidth = (model.poolDimensions.leftOpening.x2 - model.poolDimensions.leftOpening.x1) * model.pxToMetersRatio;

    var placementRect = new Rectangle( 0, 0, placementRectWidth, 0 );
    var placementRectBorder = new Path( new Shape(),
      {
        stroke: '#000',
        lineWidth: 2,
        lineDash: [ 10, 5 ],
        fill: "#ffdcf0"
      } );


    this.addChild( placementRect );
    this.addChild( placementRectBorder );

    var controlMassStackPosition = function() {
      var dy = 0;
      model.stack.forEach( function( massModel ) {
        massModel.position = new Vector2( model.poolDimensions.leftOpening.x1, (model.poolDimensions.leftOpening.y2 - model.LEFT_WATER_HEIGHT + model.globalModel.leftDisplacement) - dy - massModel.height );
        dy += massModel.height;
      } );
    };

    var changeMassStack = function() {
      var totHeight = 0;
      model.stack.forEach( function( massModel ) {
        if ( massModel ) {
          totHeight += massModel.height;
        }
      } );
      totalHeight = totHeight;
      controlMassStackPosition();
    };

    model.globalModel.leftDisplacementProperty.link( function( displacement ) {
      self.bottom = (model.poolDimensions.leftOpening.y2 - model.LEFT_WATER_HEIGHT + displacement) * model.pxToMetersRatio;
    } );

    model.masses.forEach( function( massModel ) {
      massModel.isDraggingProperty.link( function( isDragging ) {
        if ( isDragging ) {
          var placementrectHeight = massModel.height * model.pxToMetersRatio;
          var placementrectY1 = -placementrectHeight - totalHeight * model.pxToMetersRatio;
          var newBorder = new Shape().moveTo( 0, placementrectY1 )
            .lineTo( 0, placementrectY1 + placementrectHeight )
            .lineTo( placementRectWidth, placementrectY1 + placementrectHeight )
            .lineTo( placementRectWidth, placementrectY1 )
            .lineTo( 0, placementrectY1 );
          placementRectBorder.shape = newBorder;
          placementRectBorder.visible = true;
        }
        else {
          placementRectBorder.visible = false;
        }
      } );
    } );


    model.stack.addListeners( function() {
      changeMassStack();
    }, function() {
      changeMassStack();
    } );

  }

  return inherit( Node, MassStackNode );
} )
;