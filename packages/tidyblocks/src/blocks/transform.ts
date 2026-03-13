import * as Blockly from 'blockly';

const SUMMARIZE_OPS = [
  ['count', 'count'],
  ['sum', 'sum'],
  ['mean', 'mean'],
  ['median', 'median'],
  ['min', 'min'],
  ['max', 'max'],
  ['std dev', 'std'],
  ['variance', 'var'],
  ['n distinct', 'nunique'],
  ['any', 'any'],
  ['all', 'all']
];

const RUNNING_OPS = [
  ['cumulative sum', 'cumsum'],
  ['cumulative max', 'cummax'],
  ['cumulative min', 'cummin'],
  ['cumulative mean', 'cummean'],
  ['row index', 'cumcount']
];

Blockly.defineBlocksWithJsonArray([
  {
    type: 'tidyblocks_transform_filter',
    message0: 'filter where %1',
    args0: [{ type: 'input_value', name: 'CONDITION', check: 'Boolean' }],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Keep only rows matching a condition.'
  },
  {
    // dplyr: select() — keep named columns
    type: 'tidyblocks_transform_select',
    message0: 'select columns %1',
    args0: [{ type: 'field_input', name: 'COLUMNS', text: 'col1, col2' }],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Keep only the specified columns (comma-separated).'
  },
  {
    type: 'tidyblocks_transform_drop',
    message0: 'drop columns %1',
    args0: [{ type: 'field_input', name: 'COLUMNS', text: 'col1, col2' }],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Remove the specified columns (comma-separated).'
  },
  {
    // dplyr: mutate() — create or overwrite a column
    type: 'tidyblocks_transform_mutate',
    message0: 'mutate %1 = %2',
    args0: [
      { type: 'field_input', name: 'COLUMN', text: 'new_col' },
      { type: 'input_value', name: 'EXPRESSION' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Add or replace a column using an expression.'
  },
  {
    // dplyr: rename() — rename a single column
    type: 'tidyblocks_transform_rename',
    message0: 'rename %1 to %2',
    args0: [
      { type: 'field_input', name: 'OLD_NAME', text: 'old_col' },
      { type: 'field_input', name: 'NEW_NAME', text: 'new_col' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Rename a column.'
  },
  {
    // dplyr: arrange() — order rows by column values
    type: 'tidyblocks_transform_arrange',
    message0: 'arrange by %1 %2',
    args0: [
      { type: 'field_input', name: 'COLUMNS', text: 'col1' },
      {
        type: 'field_dropdown',
        name: 'ORDER',
        options: [
          ['ascending', 'True'],
          ['descending', 'False']
        ]
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Sort rows by one or more columns (comma-separated).'
  },
  {
    // dplyr: distinct() — keep unique rows
    type: 'tidyblocks_transform_distinct',
    message0: 'distinct by %1',
    args0: [{ type: 'field_input', name: 'COLUMNS', text: 'col1' }],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Keep only rows with distinct values in the specified columns.'
  },
  {
    // dplyr: group_by() — group rows by column values
    type: 'tidyblocks_transform_groupby',
    message0: 'group by %1',
    args0: [{ type: 'field_input', name: 'COLUMNS', text: 'col1' }],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Group rows by column values for subsequent summarize or running.'
  },
  {
    // dplyr: ungroup() — remove grouping
    type: 'tidyblocks_transform_ungroup',
    message0: 'ungroup',
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Remove grouping and reset the index.'
  },
  {
    // dplyr: summarize() — aggregate groups to one row each
    type: 'tidyblocks_transform_summarize',
    message0: 'summarize %1 of %2 as %3',
    args0: [
      {
        type: 'field_dropdown',
        name: 'FUNCTION',
        options: SUMMARIZE_OPS
      },
      { type: 'field_input', name: 'COLUMN', text: 'col1' },
      { type: 'field_input', name: 'RESULT', text: 'result' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Aggregate grouped (or all) rows using a summary function.'
  },
  {
    type: 'tidyblocks_transform_running',
    message0: 'running %1 of %2 as %3',
    args0: [
      {
        type: 'field_dropdown',
        name: 'FUNCTION',
        options: RUNNING_OPS
      },
      { type: 'field_input', name: 'COLUMN', text: 'col1' },
      { type: 'field_input', name: 'RESULT', text: 'running_result' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Compute a cumulative/window operation across rows.'
  },
  {
    type: 'tidyblocks_transform_bin',
    message0: 'bin %1 into %2 buckets as %3',
    args0: [
      { type: 'field_input', name: 'COLUMN', text: 'col1' },
      { type: 'field_number', name: 'BINS', value: 5, min: 2, precision: 1 },
      { type: 'field_input', name: 'RESULT', text: 'bin' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Discretize a numeric column into equal-width buckets.'
  },
  {
    type: 'tidyblocks_transform_saveas',
    message0: 'save as %1',
    args0: [{ type: 'field_input', name: 'NAME', text: 'my_df' }],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Persist the current DataFrame as a named Python variable.'
  },
  {
    type: 'tidyblocks_transform_fillna',
    message0: 'fill missing in %1 with %2',
    args0: [
      { type: 'field_input', name: 'COLUMN', text: 'col1' },
      { type: 'input_value', name: 'VALUE' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Fill missing values in a column.'
  },
  {
    type: 'tidyblocks_transform_dropna',
    message0: 'drop rows with missing in %1',
    args0: [{ type: 'field_input', name: 'COLUMNS', text: 'col1' }],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Drop rows that have missing values in the specified columns.'
  },
  {
    // dplyr: slice_sample() — random sample of N rows
    type: 'tidyblocks_transform_slice_sample',
    message0: 'slice_sample %1 rows',
    args0: [
      { type: 'field_number', name: 'N', value: 10, min: 1, precision: 1 }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Randomly sample N rows from the DataFrame.'
  },
  {
    // dplyr: slice_head() — first N rows
    type: 'tidyblocks_transform_slice_head',
    message0: 'slice_head %1 rows',
    args0: [
      { type: 'field_number', name: 'N', value: 10, min: 1, precision: 1 }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Keep only the first N rows.'
  },
  {
    // dplyr: slice_tail() — last N rows
    type: 'tidyblocks_transform_slice_tail',
    message0: 'slice_tail %1 rows',
    args0: [
      { type: 'field_number', name: 'N', value: 10, min: 1, precision: 1 }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Keep only the last N rows.'
  },
  {
    // dplyr: slice_min() — N rows with smallest values in a column
    type: 'tidyblocks_transform_slice_min',
    message0: 'slice_min %1 rows by %2',
    args0: [
      { type: 'field_number', name: 'N', value: 5, min: 1, precision: 1 },
      { type: 'field_input', name: 'COLUMN', text: 'col1' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Keep the N rows with the smallest values in a column.'
  },
  {
    // dplyr: slice_max() — N rows with largest values in a column
    type: 'tidyblocks_transform_slice_max',
    message0: 'slice_max %1 rows by %2',
    args0: [
      { type: 'field_number', name: 'N', value: 5, min: 1, precision: 1 },
      { type: 'field_input', name: 'COLUMN', text: 'col1' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Keep the N rows with the largest values in a column.'
  },
  {
    // dplyr: count() — count rows per group (or total if ungrouped)
    type: 'tidyblocks_transform_count',
    message0: 'count by %1',
    args0: [{ type: 'field_input', name: 'COLUMNS', text: 'col1' }],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Count rows for each combination of the specified columns.'
  },
  {
    // dplyr: relocate() — move column(s) to before or after another column
    type: 'tidyblocks_transform_relocate',
    message0: 'relocate %1 %2 %3',
    args0: [
      { type: 'field_input', name: 'COLUMNS', text: 'col1' },
      {
        type: 'field_dropdown',
        name: 'POSITION',
        options: [
          ['before', 'before'],
          ['after', 'after']
        ]
      },
      { type: 'field_input', name: 'ANCHOR', text: 'col2' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#76AADB',
    tooltip: 'Move one or more columns to before or after a reference column.'
  },
  {
    type: 'tidyblocks_transform_display',
    message0: 'display table',
    previousStatement: null,
    colour: '#76AADB',
    tooltip: 'Display the DataFrame as an HTML table.'
  }
]);
