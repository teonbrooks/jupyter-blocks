import { pythonGenerator, Order } from 'blockly/python';

// dplyr: inner_join / left_join / right_join / full_join
pythonGenerator.forBlock['tidyblocks_combine_join'] = block => {
  const how = block.getFieldValue('HOW');
  const rightDf = block.getFieldValue('RIGHT_DF');
  const leftOn = block.getFieldValue('LEFT_ON');
  const rightOn = block.getFieldValue('RIGHT_ON');
  return (
    `_df = pd.merge(_df, ${rightDf}, ` +
    `left_on='${leftOn}', right_on='${rightOn}', how='${how}')\n`
  );
};

// dplyr: bind_rows() — vertically stack with a label column
pythonGenerator.forBlock['tidyblocks_combine_bind_rows'] = block => {
  const otherDf = block.getFieldValue('OTHER_DF');
  const labelCol = block.getFieldValue('LABEL_COL');
  return (
    `_df = pd.concat(\n` +
    `    [_df.assign(**{'${labelCol}': 'left'}),\n` +
    `     ${otherDf}.assign(**{'${labelCol}': 'right'})]\n` +
    `).reset_index(drop=True)\n`
  );
};

// dplyr: cross_join() — Cartesian product
pythonGenerator.forBlock['tidyblocks_combine_cross_join'] = block => {
  const rightDf = block.getFieldValue('RIGHT_DF');
  return `_df = _df.merge(${rightDf}, how='cross')\n`;
};

// dplyr: semi_join() — filtering join; keep rows that have a match
// pandas has no native semi_join, so we use merge + filtering
pythonGenerator.forBlock['tidyblocks_combine_semi_join'] = block => {
  const rightDf = block.getFieldValue('RIGHT_DF');
  const leftOn = block.getFieldValue('LEFT_ON');
  const rightOn = block.getFieldValue('RIGHT_ON');
  return `_df = _df[_df['${leftOn}'].isin(${rightDf}['${rightOn}'])]\n`;
};

// dplyr: anti_join() — filtering join; keep rows that have no match
pythonGenerator.forBlock['tidyblocks_combine_anti_join'] = block => {
  const rightDf = block.getFieldValue('RIGHT_DF');
  const leftOn = block.getFieldValue('LEFT_ON');
  const rightOn = block.getFieldValue('RIGHT_ON');
  return `_df = _df[~_df['${leftOn}'].isin(${rightDf}['${rightOn}'])]\n`;
};

// dplyr: bind_cols() — horizontally bind by column position
pythonGenerator.forBlock['tidyblocks_combine_bind_cols'] = block => {
  const otherDf = block.getFieldValue('OTHER_DF');
  return `_df = pd.concat([_df.reset_index(drop=True), ${otherDf}.reset_index(drop=True)], axis=1)\n`;
};

export { Order };
