// Copyright 2002-2013, University of Colorado Boulder

// RequireJS configuration file for Under Pressure.
require.config(
  {
    deps: ['under-pressure-main'],

    paths: {

      // third party libs
      text: '../../sherpa/text',

      // plugins
      image: '../../chipper/requirejs-plugins/image',
      string: '../../chipper/requirejs-plugins/string',

      // PhET libs, uppercase names to identify them in require.js imports
      ASSERT: '../../assert/js',
      AXON: '../../axon/js',
      DOT: '../../dot/js',
      JOIST: '../../joist/js',
      KITE: '../../kite/js',
      PHETCOMMON: '../../phetcommon/js',
      PHET_CORE: '../../phet-core/js',
      SCENERY: '../../scenery/js',
      SCENERY_PHET: '../../scenery-phet/js',
      SHERPA: '../../sherpa',
      SUN: '../../sun/js',

      // this sim
      UNDER_PRESSURE: '.'
    },

    urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts

  } );
