// Copyright 2014-2020, University of Colorado Boulder

/**
 * The Flow screen, which appears as the second screen in the "Fluid Pressure and Flow" sim.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import flowScreenIcon from '../../images/flow-mockup_png.js';
import fluidPressureAndFlowStrings from '../fluidPressureAndFlowStrings.js';
import fluidPressureAndFlow from '../fluidPressureAndFlow.js';
import FlowModel from './model/FlowModel.js';
import FlowScreenView from './view/FlowScreenView.js';

const flowScreenTitleString = fluidPressureAndFlowStrings.flowScreenTitle;

class FlowScreen extends Screen {

  constructor() {

    const options = {
      name: flowScreenTitleString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new ScreenIcon( new Image( flowScreenIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    };

    super(
      () => new FlowModel(),
      model => new FlowScreenView( model ),
      options
    );
  }
}

fluidPressureAndFlow.register( 'FlowScreen', FlowScreen );
export default FlowScreen;