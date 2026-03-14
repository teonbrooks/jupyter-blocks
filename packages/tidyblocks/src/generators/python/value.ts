import { pythonGenerator, Order } from 'blockly/python';

pythonGenerator.forBlock['tidyblocks_value_column'] = block => {
  const col = block.getFieldValue('COLUMN');
  return [`_df['${col}']`, Order.MEMBER];
};

pythonGenerator.forBlock['tidyblocks_value_number'] = block => {
  const val = block.getFieldValue('VALUE');
  return [String(val), Order.ATOMIC];
};

pythonGenerator.forBlock['tidyblocks_value_text'] = block => {
  const val = block.getFieldValue('VALUE').replace(/'/g, "\\'");
  return [`'${val}'`, Order.ATOMIC];
};

pythonGenerator.forBlock['tidyblocks_value_logical'] = block => {
  const val = block.getFieldValue('VALUE');
  return [val, Order.ATOMIC];
};

pythonGenerator.forBlock['tidyblocks_value_datetime'] = block => {
  const val = block.getFieldValue('VALUE');
  return [`pd.Timestamp('${val}')`, Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['tidyblocks_value_missing'] = () => {
  return ['float("nan")', Order.ATOMIC];
};

pythonGenerator.forBlock['tidyblocks_value_normal'] = block => {
  const mean = block.getFieldValue('MEAN');
  const std = block.getFieldValue('STD');
  return [`np.random.normal(${mean}, ${std}, len(_df))`, Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['tidyblocks_value_uniform'] = block => {
  const low = block.getFieldValue('LOW');
  const high = block.getFieldValue('HIGH');
  return [`np.random.uniform(${low}, ${high}, len(_df))`, Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['tidyblocks_value_exponential'] = block => {
  const lam = block.getFieldValue('LAMBDA');
  return [`np.random.exponential(1.0 / ${lam}, len(_df))`, Order.FUNCTION_CALL];
};

export { Order };
