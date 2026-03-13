/**
 * Blockly toolbox definition for all jupyter-tidyblocks tidy-data blocks.
 * Color palette matches the original tidyblocks project by Greg Wilson.
 */
export const TIDYBLOCKS_TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Data',
      colour: '#FEBE4C',
      contents: [
        { kind: 'block', type: 'tidyblocks_data_penguins' },
        { kind: 'block', type: 'tidyblocks_data_colors' },
        { kind: 'block', type: 'tidyblocks_data_earthquakes' },
        {
          kind: 'block',
          type: 'tidyblocks_data_sequence',
          fields: { N: 10, COLUMN: 'index' }
        },
        {
          kind: 'block',
          type: 'tidyblocks_data_user',
          fields: { NAME: 'my_df' }
        },
        {
          kind: 'block',
          type: 'tidyblocks_data_csv',
          fields: { PATH: 'data.csv' }
        }
      ]
    },
    {
      kind: 'category',
      name: 'Transform',
      colour: '#76AADB',
      contents: [
        { kind: 'block', type: 'tidyblocks_transform_filter' },
        { kind: 'block', type: 'tidyblocks_transform_select' },
        { kind: 'block', type: 'tidyblocks_transform_drop' },
        { kind: 'block', type: 'tidyblocks_transform_create' },
        { kind: 'block', type: 'tidyblocks_transform_rename' },
        { kind: 'block', type: 'tidyblocks_transform_sort' },
        { kind: 'block', type: 'tidyblocks_transform_unique' },
        { kind: 'block', type: 'tidyblocks_transform_groupby' },
        { kind: 'block', type: 'tidyblocks_transform_ungroup' },
        { kind: 'block', type: 'tidyblocks_transform_summarize' },
        { kind: 'block', type: 'tidyblocks_transform_running' },
        { kind: 'block', type: 'tidyblocks_transform_bin' },
        { kind: 'block', type: 'tidyblocks_transform_saveas' },
        { kind: 'block', type: 'tidyblocks_transform_fillna' },
        { kind: 'block', type: 'tidyblocks_transform_dropna' },
        { kind: 'block', type: 'tidyblocks_transform_sample' },
        { kind: 'block', type: 'tidyblocks_transform_head' },
        { kind: 'block', type: 'tidyblocks_transform_tail' },
        { kind: 'block', type: 'tidyblocks_transform_display' }
      ]
    },
    {
      kind: 'category',
      name: 'Combine',
      colour: '#808080',
      contents: [
        { kind: 'block', type: 'tidyblocks_combine_join' },
        { kind: 'block', type: 'tidyblocks_combine_glue' },
        { kind: 'block', type: 'tidyblocks_combine_cross_join' }
      ]
    },
    {
      kind: 'category',
      name: 'Plot',
      colour: '#A4C588',
      contents: [
        { kind: 'block', type: 'tidyblocks_plot_bar' },
        { kind: 'block', type: 'tidyblocks_plot_box' },
        { kind: 'block', type: 'tidyblocks_plot_dot' },
        { kind: 'block', type: 'tidyblocks_plot_histogram' },
        { kind: 'block', type: 'tidyblocks_plot_scatter' },
        { kind: 'block', type: 'tidyblocks_plot_line' },
        { kind: 'block', type: 'tidyblocks_plot_violin' },
        { kind: 'block', type: 'tidyblocks_plot_heatmap' }
      ]
    },
    {
      kind: 'category',
      name: 'Stats',
      colour: '#BA93DB',
      contents: [
        { kind: 'block', type: 'tidyblocks_stats_ttest_one' },
        { kind: 'block', type: 'tidyblocks_stats_ttest_two' },
        { kind: 'block', type: 'tidyblocks_stats_kmeans' },
        { kind: 'block', type: 'tidyblocks_stats_silhouette' },
        { kind: 'block', type: 'tidyblocks_stats_correlation' },
        { kind: 'block', type: 'tidyblocks_stats_describe' }
      ]
    },
    {
      kind: 'category',
      name: 'Values',
      colour: '#E7553C',
      contents: [
        { kind: 'block', type: 'tidyblocks_value_column' },
        { kind: 'block', type: 'tidyblocks_value_number' },
        { kind: 'block', type: 'tidyblocks_value_text' },
        { kind: 'block', type: 'tidyblocks_value_logical' },
        { kind: 'block', type: 'tidyblocks_value_datetime' },
        { kind: 'block', type: 'tidyblocks_value_missing' },
        { kind: 'block', type: 'tidyblocks_value_normal' },
        { kind: 'block', type: 'tidyblocks_value_uniform' },
        { kind: 'block', type: 'tidyblocks_value_exponential' }
      ]
    },
    {
      kind: 'category',
      name: 'Operations',
      colour: '#F9B5B2',
      contents: [
        { kind: 'block', type: 'tidyblocks_op_arithmetic' },
        { kind: 'block', type: 'tidyblocks_op_compare' },
        { kind: 'block', type: 'tidyblocks_op_logic' },
        { kind: 'block', type: 'tidyblocks_op_not' },
        { kind: 'block', type: 'tidyblocks_op_ifelse' },
        { kind: 'block', type: 'tidyblocks_op_typecheck' },
        { kind: 'block', type: 'tidyblocks_op_convert' },
        { kind: 'block', type: 'tidyblocks_op_datetime' },
        { kind: 'block', type: 'tidyblocks_op_shift' },
        { kind: 'block', type: 'tidyblocks_op_math' },
        { kind: 'block', type: 'tidyblocks_op_string' },
        { kind: 'block', type: 'tidyblocks_op_str_contains' }
      ]
    }
  ]
};
