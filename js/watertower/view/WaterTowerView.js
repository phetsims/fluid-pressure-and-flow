/**
 * View for the 'Water Tower' includes the tower, water, stand/legs, hose and the wheel.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Vector2 = require( 'DOT/Vector2' );

  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var WaterTowerLegsNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerLegsNode' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var Font = require( 'SCENERY/util/Font' );

  //images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle.png' );
  var wheelImage = require( 'image!FLUID_PRESSURE_AND_FLOW/wheel.png' );

  // strings
  var fillString = require( 'string!FLUID_PRESSURE_AND_FLOW/fill' );

  /**
   * @param {WaterTower} waterTower model
   * @param {FluidColorModel} fluidColorModel to change the color based on density
   * @param {ModelViewTransform2} modelViewTransform transform to convert between waterTower and view values
   * @param {HoseView} hoseView
   * @param options
   * @constructor
   */
  function WaterTowerView( waterTower, fluidColorModel, modelViewTransform, hoseView, options ) {
    var waterTowerView = this;
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
      .lineTo( modelViewTransform.modelToViewX( waterTower.HOLE_SIZE + waterTower.INLET_X_OFFSET ), modelViewTransform.modelToViewY( waterTower.TANK_HEIGHT ) )
      .moveTo( modelViewTransform.modelToViewX( waterTower.INLET_X_OFFSET ), modelViewTransform.modelToViewY( waterTower.TANK_HEIGHT ) )
      .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( waterTower.TANK_HEIGHT ) )
      .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( 0 ) );
    this.waterTankFrame = new Path( modelTankShape, { top: 20, stroke: options.towerFrameColor, lineWidth: 1} );

    //added tank background shape
    var tankBackgroundShape = new Shape()
      .moveTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( 0 ) - 1 )
      .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ) - 1, modelViewTransform.modelToViewY( 0 ) - 1 )
      .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ) - 1, modelViewTransform.modelToViewY( waterTower.TANK_HEIGHT ) )
      .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( waterTower.TANK_HEIGHT ) ).close();
    this.addChild( new Path( tankBackgroundShape, { bottom: this.waterTankFrame.bottom - 1, fill: '#808080'} ) );

    //add water
    var waterShape = new Shape()
      .moveTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( 0 ) )
      .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ), modelViewTransform.modelToViewY( 0 ) )
      .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ), modelViewTransform.modelToViewY( waterTower.fluidLevel ) )
      .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( waterTower.fluidLevel ) ).close();
    this.waterShapeNode = new Path( waterShape, { bottom: this.waterTankFrame.bottom - 1, fill: fluidColorModel.color} );
    this.addChild( this.waterShapeNode );

    this.addChild( this.waterTankFrame );
    //add the legs
    var waterTowerLegsInitialHeight = modelViewTransform.modelToViewDeltaX( waterTower.tankPosition.y );
    this.waterTowerLegs = new WaterTowerLegsNode( this.waterTankFrame.width, waterTowerLegsInitialHeight, {top: this.waterTankFrame.bottom} );
    this.addChild( this.waterTowerLegs );

    //add the handle
    var handleNode = new Image( handleImage, { cursor: 'pointer', scale: 0.3, top: this.waterTankFrame.bottom, centerX: this.waterTankFrame.centerX} );
    this.addChild( handleNode );

    //add the wheel and rope
    var wheelNode = new Image( wheelImage, { cursor: 'pointer', scale: 0.4, bottom: this.waterTankFrame.top, right: this.waterTankFrame.right + 3} );
    this.addChild( wheelNode );
    this.addChild( new Path( Shape.lineSegment( 0, this.waterTankFrame.height - modelViewTransform.modelToViewDeltaX( waterTower.HOLE_SIZE * 1.5 ), 0, 0 ), { right: wheelNode.right, top: wheelNode.bottom, lineWidth: 1, stroke: 'black'} ) );

    //add the gate at the end of the rope
    this.sluiceGate = new Rectangle( 0, 0, 5, modelViewTransform.modelToViewDeltaX( waterTower.HOLE_SIZE * 1.5 ), {
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
    var fillButtonFont = new Font( '14px Arial' );
    var xMargin = 7;
    if ( fillString.length > 8 ) {
      fillButtonFont = new Font( '10px Arial' );
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
        clickYOffset = waterTowerView.globalToParentPoint( e.pointer.point ).y;
        initialY = waterTower.tankPosition.y;
        initialHeight = hoseView.hose.height;
      },
      drag: function( e ) {
        var deltaY = waterTowerView.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        deltaY = modelViewTransform.viewToModelDeltaY( deltaY );
        var newY = initialY + deltaY;
        //restrict the tank bottom to be between 0.1 and 1.7 meters
        newY = newY > 1.7 ? 1.7 : newY < 0 ? 0 : newY;
        deltaY = newY - initialY;
        waterTowerView.waterTower.tankPosition = new Vector2( waterTowerView.waterTower.tankPosition.x, newY );

        hoseView.hose.height = initialHeight + deltaY;
        hoseView.setTranslation( modelViewTransform.modelToViewX( 2.6 ), modelViewTransform.modelToViewY( waterTowerView.waterTower.tankPosition.y ) - 130 );
      }
    } ) );

    waterTower.tankPositionProperty.link( function( tankPosition ) {
      waterTowerView.updateWaterTowerLegs();
      waterTowerView.bottom = ( tankPosition.y > 0.23 ) ? waterTowerView.bottom = modelViewTransform.modelToViewY( 0 ) - 6 : waterTowerView.bottom = modelViewTransform.modelToViewY( tankPosition.y ) + 10;
    } );

    waterTower.fluidVolumeProperty.link( function() {
      var waterShape = new Shape()
        .moveTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( 0 ) )
        .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ), modelViewTransform.modelToViewY( 0 ) )
        .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ), modelViewTransform.modelToViewY( waterTower.fluidLevel ) )
        .lineTo( modelViewTransform.modelToViewX( 0 ), modelViewTransform.modelToViewY( waterTower.fluidLevel ) ).close();
      waterTowerView.waterShapeNode.setShape( waterShape );
    } );


    fluidColorModel.colorProperty.linkAttribute( waterTowerView.waterShapeNode, 'fill' );

    this.setTranslation( modelViewTransform.modelToViewDeltaX( waterTower.tankPosition.x ), -modelViewTransform.modelToViewDeltaY( waterTower.tankPosition.y ) );

    this.mutate( options );
  }

  return inherit( Node, WaterTowerView, {
    updateWaterTowerLegs: function() {
      this.waterTowerLegs.waterTowerHeight = -this.modelViewTransform.modelToViewDeltaY( this.waterTower.tankPosition.y );
      this.waterTowerLegs.updateShape();
    }
  } );

} );