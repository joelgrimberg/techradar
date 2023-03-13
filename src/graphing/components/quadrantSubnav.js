const d3 = require('d3')
const { selectRadarQuadrant, mouseoverQuadrant, mouseoutQuadrant, removeScrollListener } = require('./quadrants')
const { getRingIdString } = require('../../util/util')

function addListItem(quadrantList, name, callback, order) {
  quadrantList
    .append('li')
    .attr('id', `subnav-item-${getRingIdString(name)}`)
    .classed('quadrant-subnav__list-item', true)
    .append('button')
    .classed('quadrant-subnav__list-item__button', true)
    .attr('role', 'tab')
    .text(name)
    .on('click', function (e) {
      removeScrollListener()

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })

      d3.select('span.quadrant-subnav__dropdown-selector').text(e.target.innerText)

      const subnavArrow = d3.select('.quadrant-subnav__dropdown-arrow')
      subnavArrow.classed('rotate', !d3.select('span.quadrant-subnav__dropdown-arrow').classed('rotate'))
      quadrantList.classed('show', !d3.select('ul.quadrant-subnav__list').classed('show'))

      const subnavDropdown = d3.select('.quadrant-subnav__dropdown')
      subnavDropdown.attr('aria-expanded', subnavDropdown.attr('aria-expanded') === 'false' ? 'true' : 'false')

      if (callback) {
        callback()
      }
    })
    .on('mouseover', () => mouseoverQuadrant(order))
    .on('mouseout', () => mouseoutQuadrant(order))
}

function renderQuadrantSubnav(radarHeader, quadrants, renderFullRadar) {
  const subnavContainer = radarHeader.append('nav').classed('quadrant-subnav', true)

  const subnavDropdown = subnavContainer
    .append('div')
    .classed('quadrant-subnav__dropdown', true)
    .attr('aria-expanded', 'false')
  subnavDropdown.append('span').classed('quadrant-subnav__dropdown-selector', true).text('All quadrants')
  const subnavArrow = subnavDropdown.append('span').classed('quadrant-subnav__dropdown-arrow', true)

  const quadrantList = subnavContainer.append('ul').classed('quadrant-subnav__list', true)
  addListItem(quadrantList, 'All quadrants', renderFullRadar)
  d3.select('li.quadrant-subnav__list-item').classed('active-item', true).select('button').attr('aria-selected', 'true')

  subnavDropdown.on('click', function () {
    subnavArrow.classed('rotate', !d3.select('span.quadrant-subnav__dropdown-arrow').classed('rotate'))
    quadrantList.classed('show', !d3.select('ul.quadrant-subnav__list').classed('show'))

    subnavDropdown.attr('aria-expanded', subnavDropdown.attr('aria-expanded') === 'false' ? 'true' : 'false')
  })

  quadrants.forEach(function (quadrant) {
    addListItem(
      quadrantList,
      quadrant.quadrant.name(),
      () => selectRadarQuadrant(quadrant.order, quadrant.startAngle, quadrant.quadrant.name()),
      quadrant.order,
    )
  })

  const subnavOffset = window.innerWidth < 1024 ? 380 : 280

  window.addEventListener('scroll', function () {
    if (subnavOffset <= window.scrollY) {
      d3.select('.quadrant-subnav').classed('sticky', true)
      d3.select('.search-container').classed('sticky-offset', true)
    } else {
      d3.select('.quadrant-subnav').classed('sticky', false)
      d3.select('.search-container').classed('sticky-offset', false)
    }
  })
}

module.exports = {
  renderQuadrantSubnav,
}
