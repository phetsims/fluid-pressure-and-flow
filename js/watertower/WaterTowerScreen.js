// Copyright 2014-2020, University of Colorado Boulder

/**
 * The 'Water Tower' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import waterTowerScreenIcon from '../../images/water-tower-mockup_png.js';
import fluidPressureAndFlowStrings from '../fluidPressureAndFlowStrings.js';
import fluidPressureAndFlow from '../fluidPressureAndFlow.js';
import WaterTowerModel from './model/WaterTowerModel.js';
import WaterTowerScreenView from './view/WaterTowerScreenView.js';

const waterTowerScreenTitleString = fluidPressureAndFlowStrings.waterTowerScreenTitle;


class WaterTowerScreen extends Screen {

  constructor() {

    const options = {
      name: waterTowerScreenTitleString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new ScreenIcon( new Image( waterTowerScreenIcon ), {
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