import * as Blockly from 'blockly';

const JOIN_TYPES = [
  ['inner join', 'inner'],
  ['left join', 'left'],
  ['right join', 'right'],
  ['outer join', 'outer']
];

Blockly.defineBlocksWithJsonArray([
  {
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
    type: 'tidyblocks_combine_glue',
    message0: 'glue with %1 label column %2',
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
    type: 'tidyblocks_combine_cross_join',
    message0: 'cross join with %1',
    args0: [{ type: 'field_input', name: 'RIGHT_DF', text: 'other_df' }],
    previousStatement: null,
    nextStatement: null,
    colour: '#808080',
    tooltip: 'Cartesian product of the current DataFrame with another.'
  }
]);
