import { pythonGenerator, Order } from 'blockly/python';

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

pythonGenerator.forBlock['tidyblocks_combine_glue'] = block => {
  const otherDf = block.getFieldValue('OTHER_DF');
  const labelCol = block.getFieldValue('LABEL_COL');
  return (
    `_df = pd.concat(\n` +
    `    [_df.assign(**{'${labelCol}': 'left'}),\n` +
    `     ${otherDf}.assign(**{'${labelCol}': 'right'})]\n` +
    `).reset_index(drop=True)\n`
  );
};

pythonGenerator.forBlock['tidyblocks_combine_cross_join'] = block => {
  const rightDf = block.getFieldValue('RIGHT_DF');
  return `_df = _df.merge(${rightDf}, how='cross')\n`;
};

export { Order };
