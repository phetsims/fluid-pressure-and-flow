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
   * @param {FluidColorModel} fluidColorModel to change the color basedon density
   * @param {ModelViewTransform2} modelViewTransform transform to convert between waterTower and view values
   * @param options
   * @constructor
   */
  function WaterTowerView( waterTower, fluidColorModel, modelViewTransform, options ) {
    var waterTowerView = this;
    options = _.extend( {
      towerFrameColor: 'black'
    }, options );

    Node.call( this );

    //Todo: fix this
    this.groundY = 220;//modelViewTransform.modelToViewY( waterTower.TANK_HEIGHT ) * 2.15;

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

    this.waterTankFrame = new Path( modelTankShape, { top: 20, stroke: options.towerFrameColor} );
    this.addChild( this.waterTankFrame );

    //add water
    var waterShape = new Shape()
      .moveTo( modelViewTransform.modelToViewX( 0 ) + 2, modelViewTransform.modelToViewY( 0 ) )
      .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ) - 2, modelViewTransform.modelToViewY( 0 ) )
      .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ) - 2, modelViewTransform.modelToViewY( waterTower.fluidLevel ) + 2 )
      .lineTo( modelViewTransform.modelToViewX( 0 ) + 2, modelViewTransform.modelToViewY( waterTower.fluidLevel ) + 2 ).close();
    this.waterShapeNode = new Path( waterShape, { bottom: this.waterTankFrame.bottom - 1, fill: fluidColorModel.color} );
    this.addChild( this.waterShapeNode );

    //add the legs
    var waterTowerLegsInitialHeight = 120;
    this.waterTowerLegs = new WaterTowerLegsNode( this.waterTankFrame.width, waterTowerLegsInitialHeight, {top: this.waterTankFrame.bottom} );
    this.addChild( this.waterTowerLegs );

    //add the handle
    var handleNode = new Image( handleImage, { cursor: 'pointer', scale: 0.3, top: this.waterTankFrame.bottom, centerX: this.waterTankFrame.centerX} );
    this.addChild( handleNode );

    //add the wheel and rope
    var wheelNode = new Image( wheelImage, { cursor: 'pointer', scale: 0.4, bottom: this.waterTankFrame.top, right: this.waterTankFrame.right + 3} );
    this.addChild( wheelNode );
    this.addChild( new Path( Shape.lineSegment( 0, this.waterTankFrame.height - 20, 0, 0 ), { right: wheelNode.right, top: wheelNode.bottom, lineWidth: 1, stroke: 'black'} ) );

    //add the gate at the end of the rope
    var sluiceGate = new Rectangle( 0, 0, 5, 20, {
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
    this.addChild( sluiceGate );

    // water tank fill button
    this.addChild( new TextPushButton( fillString, {
      font: new Font( '16px Arial' ),
      baseColor: 'yellow',
      listener: function() {
        waterTower.fill();
      },
      xMargin: 15,
      right: this.waterTankFrame.left - 20,
      top: this.waterTankFrame.centerY - 15
    } ) );

    var clickYOffset;
    handleNode.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        clickYOffset = waterTowerView.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
      },
      drag: function( e ) {
        var y = waterTowerView.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        console.log( y );
        //restrict the node movement between 80 and 180
        y = (y < 80) ? 80 : (y > 180) ? 180 : y;
        waterTowerView.setTranslation( waterTowerView.x, y );
        waterTowerView.updateWaterTowerLegs( y );
      }
    } ) );

    waterTower.fluidVolumeProperty.link( function() {
      var waterShape = new Shape()
        .moveTo( modelViewTransform.modelToViewX( 0 ) + 2, modelViewTransform.modelToViewY( 0 ) )
        .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ) - 2, modelViewTransform.modelToViewY( 0 ) )
        .lineTo( modelViewTransform.modelToViewX( 2 * waterTower.TANK_RADIUS ) - 2, modelViewTransform.modelToViewY( waterTower.fluidLevel ) + 2 )
        .lineTo( modelViewTransform.modelToViewX( 0 ) + 2, modelViewTransform.modelToViewY( waterTower.fluidLevel ) + 2 ).close();
      waterTowerView.waterShapeNode.setShape( waterShape );
    } );

    fluidColorModel.colorProperty.linkAttribute( waterTowerView.waterShapeNode, "fill" );

    this.mutate( options );
  }

  return inherit( Node, WaterTowerView, {
    updateWaterTowerLegs: function( y ) {
      this.waterTowerLegs.waterTowerHeight = this.groundY - y;
      this.waterTowerLegs.updateShape();
      this.waterTowerLegs.top = this.waterTankFrame.bottom;
    }
  } );

} );