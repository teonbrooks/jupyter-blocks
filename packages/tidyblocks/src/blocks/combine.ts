import * as Blockly from 'blockly';

const JOIN_TYPES = [
  ['inner join', 'inner'],
  ['left join', 'left'],
  ['right join', 'right'],
  ['outer join', 'outer']
];

Blockly.defineBlocksWithJsonArray([
  {
    // dplyr: inner_join / left_join / right_join / full_join
    type: 'tidyblocks_combine_join',
    message0: '%1 join %2 on left %3 = right %4',
    args0: [
      {
        type: 'field_dropdown',
        name: 'HOW',
        options: JOIN_TYPES
      },
      { type: 'field_input', name: 'RIGHT_DF', text: 'other_df' },
      { type: 'field_input', name: 'LEFT_ON', text: 'id' },
      { type: 'field_input', name: 'RIGHT_ON', text: 'id' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#808080',
    tooltip:
      'Join the current DataFrame with a named DataFrame on matching columns.'
  },
  {
    // dplyr: bind_rows() — vertically stack two DataFrames
    type: 'tidyblocks_combine_bind_rows',
    message0: 'bind_rows with %1 label column %2',
    args0: [
      { type: 'field_input', name: 'OTHER_DF', text: 'other_df' },
      { type: 'field_input', name: 'LABEL_COL', text: 'source' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#808080',
    tooltip:
      'Vertically stack the current DataFrame with another, adding a label column.'
  },
  {
    // dplyr: cross_join() — Cartesian product
    type: 'tidyblocks_combine_cross_join',
    message0: 'cross join with %1',
    args0: [{ type: 'field_input', name: 'RIGHT_DF', text: 'other_df' }],
    previousStatement: null,
    nextStatement: null,
    colour: '#808080',
    tooltip: 'Cartesian product of the current DataFrame with another.'
  },
  {
    // dplyr: semi_join() — keep rows in _df that have a match in other_df
    // (no columns from other_df are added)
    type: 'tidyblocks_combine_semi_join',
    message0: 'semi join %1 on left %2 = right %3',
    args0: [
      { type: 'field_input', name: 'RIGHT_DF', text: 'other_df' },
      { type: 'field_input', name: 'LEFT_ON', text: 'id' },
      { type: 'field_input', name: 'RIGHT_ON', text: 'id' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#808080',
    tooltip:
      'Keep only rows from the current DataFrame that have a match in the other DataFrame. No columns from the other DataFrame are added.'
  },
  {
    // dplyr: anti_join() — keep rows in _df that have NO match in other_df
    type: 'tidyblocks_combine_anti_join',
    message0: 'anti join %1 on left %2 = right %3',
    args0: [
      { type: 'field_input', name: 'RIGHT_DF', text: 'other_df' },
      { type: 'field_input', name: 'LEFT_ON', text: 'id' },
      { type: 'field_input', name: 'RIGHT_ON', text: 'id' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#808080',
    tooltip:
      'Keep only rows from the current DataFrame that have no match in the other DataFrame.'
  },
  {
    // dplyr: bind_cols() — horizontally bind two DataFrames by column position
    type: 'tidyblocks_combine_bind_cols',
    message0: 'bind_cols with %1',
    args0: [{ type: 'field_input', name: 'OTHER_DF', text: 'other_df' }],
    previousStatement: null,
    nextStatement: null,
    colour: '#808080',
    tooltip:
      'Horizontally bind the current DataFrame with another by column position. Both must have the same number of rows.'
  }
]);
