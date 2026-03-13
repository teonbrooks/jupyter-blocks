import * as Blockly from 'blockly';

const TOPLEVEL_INIT = `import plotly.express as px
`;

Blockly.defineBlocksWithJsonArray([
  {
    type: 'tidyblocks_plot_bar',
    message0: 'bar chart x %1 y %2',
    args0: [
      { type: 'field_input', name: 'X', text: 'x_col' },
      { type: 'field_input', name: 'Y', text: 'y_col' }
    ],
    previousStatement: null,
    colour: '#A4C588',
    tooltip: 'Bar chart.'
  },
  {
    type: 'tidyblocks_plot_box',
    message0: 'box plot x %1 y %2',
    args0: [
      { type: 'field_input', name: 'X', text: 'x_col' },
      { type: 'field_input', name: 'Y', text: 'y_col' }
    ],
    previousStatement: null,
    colour: '#A4C588',
    tooltip: 'Box plot.'
  },
  {
    type: 'tidyblocks_plot_dot',
    message0: 'dot plot x %1',
    args0: [{ type: 'field_input', name: 'X', text: 'x_col' }],
    previousStatement: null,
    colour: '#A4C588',
    tooltip: 'Dot/strip plot.'
  },
  {
    type: 'tidyblocks_plot_histogram',
    message0: 'histogram of %1 bins %2',
    args0: [
      { type: 'field_input', name: 'X', text: 'x_col' },
      { type: 'field_number', name: 'NBINS', value: 20, min: 1, precision: 1 }
    ],
    previousStatement: null,
    colour: '#A4C588',
    tooltip: 'Histogram.'
  },
  {
    type: 'tidyblocks_plot_scatter',
    message0: 'scatter plot x %1 y %2 color %3 trendline %4',
    args0: [
      { type: 'field_input', name: 'X', text: 'x_col' },
      { type: 'field_input', name: 'Y', text: 'y_col' },
      { type: 'field_input', name: 'COLOR', text: '' },
      {
        type: 'field_checkbox',
        name: 'TRENDLINE',
        checked: false
      }
    ],
    previousStatement: null,
    colour: '#A4C588',
    tooltip: 'Scatter plot with optional color grouping and trendline.'
  },
  {
    type: 'tidyblocks_plot_line',
    message0: 'line chart x %1 y %2 color %3',
    args0: [
      { type: 'field_input', name: 'X', text: 'x_col' },
      { type: 'field_input', name: 'Y', text: 'y_col' },
      { type: 'field_input', name: 'COLOR', text: '' }
    ],
    previousStatement: null,
    colour: '#A4C588',
    tooltip: 'Line chart.'
  },
  {
    type: 'tidyblocks_plot_violin',
    message0: 'violin plot x %1 y %2',
    args0: [
      { type: 'field_input', name: 'X', text: 'x_col' },
      { type: 'field_input', name: 'Y', text: 'y_col' }
    ],
    previousStatement: null,
    colour: '#A4C588',
    tooltip: 'Violin plot.'
  },
  {
    type: 'tidyblocks_plot_heatmap',
    message0: 'correlation heatmap',
    previousStatement: null,
    colour: '#A4C588',
    tooltip: 'Heatmap of pairwise column correlations.'
  }
]);

const plotTypes = [
  'tidyblocks_plot_bar',
  'tidyblocks_plot_box',
  'tidyblocks_plot_dot',
  'tidyblocks_plot_histogram',
  'tidyblocks_plot_scatter',
  'tidyblocks_plot_line',
  'tidyblocks_plot_violin',
  'tidyblocks_plot_heatmap'
];

for (const t of plotTypes) {
  Blockly.Blocks[t].toplevel_init = TOPLEVEL_INIT;
}
