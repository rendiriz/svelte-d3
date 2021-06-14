<svelte:options tag="rendikit-d3-bar" />

<script lang="typescript">
  import { onMount } from 'svelte'

  import cssVars from 'svelte-css-vars'
  import { Color } from 'rendikit-theme'

  import * as d3 from 'd3'

  $: styleMain = {
    white: Color.Normal('white')
  }

  let el: any

  onMount(() => {
    // Get Data ================================================================
    d3.json('assets/MOCK_DATA.json').then(function (data) {
      const margin = { top: 30, right: 30, bottom: 120, left: 60 }
      const width = el.clientWidth - margin.left - margin.right
      const height = 500 - margin.top - margin.bottom
      let activeBar = true

      const xScale = d3.scaleBand().range([0, width]).padding(0.3)

      const yScale = d3.scaleLinear().range([height, 0])

      const xAxis = d3.axisBottom(xScale)

      const yAxis = d3.axisLeft(yScale)

      const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'd3-tooltip')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('font-size', '12px')
        .style('visibility', 'hidden')
        .style('padding', '8px')
        .style('background', 'rgba(0,0,0,0.8)')
        .style('border-radius', '4px')
        .style('color', '#fff')
        .text('a simple tooltip')

      var svg = d3
        .select(el)
        .append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      xScale.domain(data.map(d => d.Country))
      yScale.domain([0, d3.max(data, d => d.Value)]).nice()

      // Add the y Axis
      svg.append('g').attr('class', 'y axis').call(yAxis)

      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left + 10)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Value')

      // Add the x Axis
      svg
        .append('g')
        .attr('class', 'x axis')
        .call(xAxis)
        .attr('transform', 'translate(0,' + height + ')')
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')

      // Add the x Axis Label
      svg
        .append('text')
        .attr('class', 'label-x')
        .attr(
          'transform',
          'translate(' + width / 2 + ' ,' + (height + margin.top + 35) + ')'
        )
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Country')

      // Add the x Axis Legend
      var legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr(
          'transform',
          'translate(' +
            (width / 2 - 40) +
            ' ,' +
            (height + margin.top + 55) +
            ')'
        )
        .on('mouseover', function () {
          d3.select(this).style('cursor', 'pointer')
        })
        .on('click', function () {
          var active = activeBar ? false : true

          let newOpacity
          if (active) {
            newOpacity = 1
            d3.select(this).style('opacity', 1)
          } else {
            newOpacity = 0
            d3.select(this).style('opacity', 0.5)
          }

          svg.selectAll('.bar').style('opacity', newOpacity)

          activeBar = active
        })

      legend
        .append('rect')
        .attr('class', 'legend-box')
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', Color.Normal('B600'))

      legend
        .append('text')
        .attr('class', 'legend-text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'start')
        .style('font-size', '14px')
        .text('Blue Bar')

      // Add bar
      svg
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('id', 'blueBar')
        .attr('width', xScale.bandwidth())
        .attr('x', d => xScale(d.Country))
        .attr('y', d => yScale(d.Value))
        .attr('height', function (d) {
          return height - yScale(d.Value)
        })
        .attr('fill', Color.Normal('B600'))
        .on('mouseover', function () {
          tooltip.style('visibility', 'visible')
          d3.select(this).transition().attr('fill', Color.Normal('B800'))
        })
        .on('mousemove', function (event, datum) {
          tooltip
            .html(
              `<div>Country: ${datum.Country}</div><div>Value: ${datum.Value}</div>`
            )
            .style('top', function () {
              const rectTooltip = d3
                .select('.d3-tooltip')
                .node()
                .getBoundingClientRect()

              var pos = positionTooltip(
                {
                  x: event.pageX,
                  y: event.pageY
                },
                {
                  width: width - margin.left - margin.right,
                  height: height - margin.top - margin.bottom
                },
                {
                  width: rectTooltip.width - 16,
                  height: rectTooltip.height - 16
                }
              )

              return pos.top - 10 + 'px'
            })
            .style('left', function () {
              const rectTooltip = d3
                .select('.d3-tooltip')
                .node()
                .getBoundingClientRect()

              var pos = positionTooltip(
                {
                  x: event.pageX,
                  y: event.pageY
                },
                {
                  width: width - margin.left - margin.right,
                  height: height - margin.top - margin.bottom
                },
                {
                  width: rectTooltip.width,
                  height: rectTooltip.height
                }
              )

              return pos.left + 10 + 'px'
            })
        })
        .on('mouseout', function () {
          tooltip.style('visibility', 'hidden')
          d3.select(this).transition().attr('fill', Color.Normal('B600'))
        })

      // Responsive ============================================================
      function resize() {
        const width =
          parseInt(d3.select(el).style('width')) - margin.left - margin.right
        const height =
          parseInt(d3.select(el).style('height')) - margin.top - margin.bottom

        xScale.rangeRound([0, width], 0.1)
        yScale.range([height, 0])

        svg.select('.y.axis').call(yAxis)

        svg
          .select('.x.axis')
          .call(xAxis)
          .attr('transform', 'translate(0,' + height + ')')
          .selectAll('text')
          .attr('transform', 'translate(-10,0)rotate(-45)')
          .style('text-anchor', 'end')

        svg
          .selectAll('.bar')
          .attr('width', xScale.bandwidth())
          .attr('x', d => xScale(d.Country))
          .attr('y', d => yScale(d.Value))
          .attr('height', d => height - yScale(d.Value))

        svg
          .select('.label-x')
          .attr(
            'transform',
            'translate(' + width / 2 + ' ,' + (height + margin.top + 35) + ')'
          )

        svg
          .select('.legend')
          .attr(
            'transform',
            'translate(' +
              (width / 2 - 40) +
              ' ,' +
              (height + margin.top + 55) +
              ')'
          )
      }

      d3.select(window).on('resize', resize)

      // Position Tooltip ======================================================
      function positionTooltip(mouse, scene, tooltip) {
        if (scene.width - (mouse.x + tooltip.width) < 20) {
          mouse.x = mouse.x - tooltip.width - 20
        }

        if (scene.height - (mouse.y + tooltip.height) < 20) {
          mouse.y = mouse.y - tooltip.height
        }

        return {
          top: mouse.y,
          left: mouse.x
        }
      }
    })
  })
</script>

<div use:cssVars={styleMain}>
  <div bind:this={el} class="chart" />
</div>

<style lang="scss">
  @import 'tailwindcss/base';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';

  div {
    @apply relative w-full h-auto overflow-hidden;
  }
</style>
