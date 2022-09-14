// Copyright 2014-2022, University of Colorado Boulder

/**
 * The 'Water Tower' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import waterTowerMockup_png from '../../images/waterTowerMockup_png.js';
import fluidPressureAndFlow from '../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../FluidPressureAndFlowStrings.js';
import WaterTowerModel from './model/WaterTowerModel.js';
import WaterTowerScreenView from './view/WaterTowerScreenView.js';


class WaterTowerScreen extends Screen {

  constructor() {

    const options = {
      name: FluidPressureAndFlowStrings.waterTowerScreenTitleStringProperty,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new ScreenIcon( new Image( waterTowerMockup_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    };

    super(
      () => new WaterTowerModel(),
      model => new WaterTowerScreenView( model ),
      options
    );
  }
}

fluidPressureAndFlow.register( 'WaterTowerScreen', WaterTowerScreen );
export default WaterTowerScreen;