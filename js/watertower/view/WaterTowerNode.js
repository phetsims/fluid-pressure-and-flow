// Copyright 2014-2015, University of Colorado Boulder

/**
 * Node for the 'Water Tower' includes the tower, water, stand/legs, hose and the wheel.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Vector2 = require( 'DOT/Vector2' );

  var Image = require( 'SCENERY/nodes/Image' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var WaterTowerLegsNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerLegsNode' );

  //images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle.png' );
  var wheelImage = require( 'image!FLUID_PRESSURE_AND_FLOW/wheel.png' );

  // strings
  var fillString = require( 'string!FLUID_PRESSURE_AND_FLOW/fill' );

  /**
   * @param {WaterTower} waterTower model
   * @param {FluidColorModel} fluidColorModel to change the color based on density
   * @param {ModelViewTransform2} modelViewTransform transform to convert between waterTower and view values
   * @param {HoseNode} hoseNode
   * @param {Object} [options]
   * @constructor
   */
  function WaterTowerNode( waterTower, fluidColorModel, modelViewTransform, hoseNode, options ) {
    var self = this;
    options = _.extend( {
      towerFrameColor: 'black'
    }, options );

    Node.call( this );

    this.waterTower = waterTower;
    this.modelViewTransform = modelViewTransform;
    //add the frame
    var modelTankShape = new Shape()
      .moveTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( 0 ) )
      .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ), modelViewTransform.modelToViewY( 0 ) )
      .moveTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ), modelViewTransform.modelToViewY( waterTower.HOLE_SIZE ) )
      .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ), modelViewTransform.modelToViewY( waterTower.TANK_HEIGHT ) )
      .lineTo( modelViewTransform.modelToViewX( waterTower.HOLE_SIZE + 0.4 + waterTower.INLET_X_OFFSET ), modelViewTransform.modelToViewY( waterTower.TANK_HEIGHT ) )
      .moveTo( modelViewTransform.modelToViewX( waterTower.INLET_X_OFFSET ), modelViewTransform.modelToViewY( waterTower.TANK_HEIGHT ) )
      .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( waterTower.TANK_HEIGHT ) )
      .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( 0 ) );
    this.waterTankFrame = new Path( modelTankShape, { top: 20, stroke: options.towerFrameColor, lineWidth: 2 } );

    //added tank background shape
    var tankBackgroundShape = new Shape()
      .moveTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( 0 ) - 1 )
      .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ) - 1, modelViewTransform.modelToViewY( 0 ) - 1 )
      .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ) - 1, modelViewTransform.modelToViewY( waterTower.TANK_HEIGHT ) )
      .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( waterTower.TANK_HEIGHT ) ).close();
    this.addChild( new Path( tankBackgroundShape, { bottom: this.waterTankFrame.bottom - 1, fill: '#808080' } ) );

    //add water
    var waterShape = new Shape()
      .moveTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( 0 ) )
      .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ), modelViewTransform.modelToViewY( 0 ) )
      .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ), modelViewTransform.modelToViewY( waterTower.fluidLevelProperty.value ) )
      .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( waterTower.fluidLevelProperty.value ) ).close();
    this.waterShapeNode = new Path( waterShape, {
      bottom: this.waterTankFrame.bottom - 2,
      fill: fluidColorModel.colorProperty.value
    } );
    this.addChild( this.waterShapeNode );

    this.addChild( this.waterTankFrame );
    //add the legs
    this.waterTowerLegs = new WaterTowerLegsNode( this.waterTankFrame.width, waterTower.tankPositionProperty, modelViewTransform, { top: this.waterTankFrame.bottom } );
    this.addChild( this.waterTowerLegs );

    //add the handle
    var handleNode = new Image( handleImage, {
      cursor: 'pointer',
      scale: 0.3,
      top: this.waterTankFrame.bottom,
      centerX: this.waterTankFrame.centerX
    } );
    this.addChild( handleNode );
    handleNode.touchArea = handleNode.localBounds.dilatedXY( 20, 20 );

    //add the wheel and rope
    var wheelNode = new Image( wheelImage, {
      cursor: 'pointer',
      scale: 0.4,
      bottom: this.waterTankFrame.top,
      right: this.waterTankFrame.right + 3
    } );
    this.addChild( wheelNode );
    this.addChild( new Path( Shape.lineSegment( 0, this.waterTankFrame.height - modelViewTransform.modelToViewDeltaX( waterTower.HOLE_SIZE * 1.5 ), 0, 0 ), {
      right: wheelNode.right,
      top: wheelNode.bottom,
      lineWidth: 1,
      stroke: 'black'
    } ) );

    //add the gate at the end of the rope
    this.sluiceGate = new Rectangle( 0, 0, 5, modelViewTransform.modelToViewDeltaX( waterTower.HOLE_SIZE * 2.5 ), {
      fill: new LinearGradient( 0, 0, 5, 0 )
        .addColorStop( 0, '#656570' )
        .addColorStop( 0.5, '#dee6f5' )
        .addColorStop( 0.7, '#bdc3cf' )
        .addColorStop( 1, '#656570' ),
      bottom: this.waterTankFrame.bottom,
      left: this.waterTankFrame.right,
      stroke: 'black',
      lineWidth: 0.5
    } );
    this.addChild( this.sluiceGate );

    // water tank fill button
    var fillButtonFont = new PhetFont( 14 );
    var xMargin = 7;
    if ( fillString.length > 8 ) {
      fillButtonFont = new PhetFont( 10 );
      xMargin = 2;
    }
    this.fillButton = new TextPushButton( fillString, {
      font: fillButtonFont,
      baseColor: 'yellow',
      listener: function() {
        waterTower.fill();
      },
      xMargin: xMargin,
      right: this.waterTankFrame.left - 10,
      top: this.waterTankFrame.centerY - 15
    } );
    this.addChild( this.fillButton );

    var clickYOffset;
    var initialY;
    var initialHeight;
    handleNode.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        clickYOffset = self.globalToParentPoint( e.pointer.point ).y;
        initialY = waterTower.tankPositionProperty.value.y;
        initialHeight = hoseNode.hose.heightProperty.value;
      },
      drag: function( e ) {
        var deltaY = self.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        deltaY = modelViewTransform.viewToModelDeltaY( deltaY );
        var newY = initialY + deltaY;
        newY = newY > 13 ? 13 : newY < 0 ? 0 : newY;
        deltaY = newY - initialY;
        self.waterTower.tankPositionProperty.value = new Vector2( self.waterTower.tankPositionProperty.value.x, newY );

        hoseNode.hose.heightProperty.value = initialHeight + deltaY;
        hoseNode.setY( modelViewTransform.modelToViewY( self.waterTower.tankPositionProperty.value.y ) - 117 );
      }
    } ) );

    waterTower.tankPositionProperty.link( function( tankPosition ) {
      self.bottom = ( tankPosition.y > 1.6 ) ? modelViewTransform.modelToViewY( 0 ) : modelViewTransform.modelToViewY( tankPosition.y - 1.6 );
    } );

    waterTower.fluidVolumeProperty.link( function() {
      var waterShape = new Shape()
        .moveTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( 0 ) )
        .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ), modelViewTransform.modelToViewY( 0 ) )
        .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ), modelViewTransform.modelToViewY( waterTower.fluidLevelProperty.value ) )
        .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( waterTower.fluidLevelProperty.value ) ).close();
      self.waterShapeNode.setShape( waterShape );
    } );


    fluidColorModel.colorProperty.linkAttribute( self.waterShapeNode, 'fill' );

    this.setTranslation( modelViewTransform.modelToViewDeltaX( waterTower.tankPositionProperty.value.x ), -modelViewTransform.modelToViewDeltaY( waterTower.tankPositionProperty.value.y ) );

    this.mutate( options );
  }

  fluidPressureAndFlow.register( 'WaterTowerNode', WaterTowerNode );

  return inherit( Node, WaterTowerNode );

} );