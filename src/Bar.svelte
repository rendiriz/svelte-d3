<svelte:options tag="rendikit-d3-bar" />

<script lang="typescript">
  import { onMount } from 'svelte'

  import cssVars from 'svelte-css-vars'
  import { Color } from 'rendikit-theme'

  import * as d3 from 'd3'

  $: styleMain = {
    white: Color.Normal('white'),
    'blue-600': Color.Normal('B600')
  }

  let el: any
  const data = [30, 86, 168, 281, 303, 365]

  onMount(() => {
    d3.select(el)
      .selectAll('div')
      .data(data)
      .enter()
      .append('div')
      .style('width', function (d) {
        return d + 'px'
      })
      .text(function (d) {
        return d
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
    @apply relative p-1;

    .chart {
      div {
        @apply text-xs text-right;
        padding: 3px;
        margin: 3px;
        background-color: var(--blue-600);
        color: var(--white);
      }
    }
  }
</style>
