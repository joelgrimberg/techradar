require('./common')
require('./images/logo.png')
require('./images/radar_legend.png')
require('./analytics.js')

const Factory = require('./util/factory')

document.addEventListener('DOMContentLoaded', function () {
  const factory = new Factory()
  factory.build()
})
