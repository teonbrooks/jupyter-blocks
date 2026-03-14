import { pythonGenerator, Order } from 'blockly/python';

// Helper: split a comma-separated field into a Python list literal.
function toCols(raw: string): string {
  const cols = raw
    .split(',')
    .map(c => `'${c.trim()}'`)
    .join(', ');
  return `[${cols}]`;
}

pythonGenerator.forBlock['tidyblocks_transform_filter'] = (
  block,
  generator
) => {
  const condition =
    generator.valueToCode(block, 'CONDITION', Order.NONE) || 'True';
  return `_df = _df[${condition}]\n`;
};

pythonGenerator.forBlock['tidyblocks_transform_select'] = block => {
  const cols = toCols(block.getFieldValue('COLUMNS'));
  return `_df = _df[${cols}]\n`;
};

pythonGenerator.forBlock['tidyblocks_transform_drop'] = block => {
  const cols = toCols(block.getFieldValue('COLUMNS'));
  return `_df = _df.drop(columns=${cols})\n`;
};

// dplyr: mutate() — create or overwrite a column
pythonGenerator.forBlock['tidyblocks_transform_mutate'] = (
  block,
  generator
) => {
  const col = block.getFieldValue('COLUMN');
  const expr = generator.valueToCode(block, 'EXPRESSION', Order.NONE) || 'None';
  return `_df = _df.assign(**{'${col}': ${expr}})\n`;
};

// dplyr: rename() — rename new_name = old_name
pythonGenerator.forBlock['tidyblocks_transform_rename'] = block => {
  const oldName = block.getFieldValue('OLD_NAME');
  const newName = block.getFieldValue('NEW_NAME');
  return `_df = _df.rename(columns={'${oldName}': '${newName}'})\n`;
};

// dplyr: arrange() — order rows by column values
pythonGenerator.forBlock['tidyblocks_transform_arrange'] = block => {
  const cols = toCols(block.getFieldValue('COLUMNS'));
  const asc = block.getFieldValue('ORDER');
  return `_df = _df.sort_values(by=${cols}, ascending=${asc})\n`;
};

// dplyr: distinct() — keep unique rows
pythonGenerator.forBlock['tidyblocks_transform_distinct'] = block => {
  const cols = toCols(block.getFieldValue('COLUMNS'));
  return `_df = _df.drop_duplicates(subset=${cols})\n`;
};

pythonGenerator.forBlock['tidyblocks_transform_groupby'] = block => {
  const cols = toCols(block.getFieldValue('COLUMNS'));
  return `_df = _df.groupby(${cols}, as_index=False)\n`;
};

pythonGenerator.forBlock['tidyblocks_transform_ungroup'] = () => {
  return `_df = _df.reset_index(drop=True)\n`;
};

pythonGenerator.forBlock['tidyblocks_transform_summarize'] = block => {
  const fn = block.getFieldValue('FUNCTION');
  const col = block.getFieldValue('COLUMN');
  const result = block.getFieldValue('RESULT');
  return `_df = _df.agg(**{'${result}': ('${col}', '${fn}')}).reset_index()\n`;
};

pythonGenerator.forBlock['tidyblocks_transform_running'] = block => {
  const fn = block.getFieldValue('FUNCTION');
  const col = block.getFieldValue('COLUMN');
  const result = block.getFieldValue('RESULT');
  if (fn === 'cumcount') {
    return `_df = _df.assign(**{'${result}': range(len(_df))})\n`;
  }
  if (fn === 'cummean') {
    return `_df = _df.assign(**{'${result}': _df['${col}'].expanding().mean()})\n`;
  }
  return `_df = _df.assign(**{'${result}': _df['${col}'].${fn}()})\n`;
};

pythonGenerator.forBlock['tidyblocks_transform_bin'] = block => {
  const col = block.getFieldValue('COLUMN');
  const bins = block.getFieldValue('BINS');
  const result = block.getFieldValue('RESULT');
  return `_df = _df.assign(**{'${result}': pd.cut(_df['${col}'], bins=${bins}).astype(str)})\n`;
};

pythonGenerator.forBlock['tidyblocks_transform_saveas'] = block => {
  const name = block.getFieldValue('NAME');
  return `${name} = _df.copy()\n`;
};

pythonGenerator.forBlock['tidyblocks_transform_fillna'] = (
  block,
  generator
) => {
  const col = block.getFieldValue('COLUMN');
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || 'None';
  return `_df = _df.assign(**{'${col}': _df['${col}'].fillna(${value})})\n`;
};

pythonGenerator.forBlock['tidyblocks_transform_dropna'] = block => {
  const cols = toCols(block.getFieldValue('COLUMNS'));
  return `_df = _df.dropna(subset=${cols})\n`;
};

// dplyr: slice_sample() — random N rows
pythonGenerator.forBlock['tidyblocks_transform_slice_sample'] = block => {
  const n = block.getFieldValue('N');
  return `_df = _df.sample(n=${n})\n`;
};

// dplyr: slice_head() — first N rows
pythonGenerator.forBlock['tidyblocks_transform_slice_head'] = block => {
  const n = block.getFieldValue('N');
  return `_df = _df.head(${n})\n`;
};

// dplyr: slice_tail() — last N rows
pythonGenerator.forBlock['tidyblocks_transform_slice_tail'] = block => {
  const n = block.getFieldValue('N');
  return `_df = _df.tail(${n})\n`;
};

// dplyr: slice_min() — N rows with smallest values in a column
pythonGenerator.forBlock['tidyblocks_transform_slice_min'] = block => {
  const n = block.getFieldValue('N');
  const col = block.getFieldValue('COLUMN');
  return `_df = _df.nsmallest(${n}, '${col}')\n`;
};

// dplyr: slice_max() — N rows with largest values in a column
pythonGenerator.forBlock['tidyblocks_transform_slice_max'] = block => {
  const n = block.getFieldValue('N');
  const col = block.getFieldValue('COLUMN');
  return `_df = _df.nlargest(${n}, '${col}')\n`;
};

// dplyr: count() — count rows per combination of columns
pythonGenerator.forBlock['tidyblocks_transform_count'] = block => {
  const cols = toCols(block.getFieldValue('COLUMNS'));
  return `_df = _df.groupby(${cols}, as_index=False).size().rename(columns={'size': 'n'})\n`;
};

// dplyr: relocate() — move columns before or after a reference column
pythonGenerator.forBlock['tidyblocks_transform_relocate'] = block => {
  const cols = block
    .getFieldValue('COLUMNS')
    .split(',')
    .map((c: string) => c.trim());
  const position = block.getFieldValue('POSITION');
  const anchor = block.getFieldValue('ANCHOR');
  // Build the new column order by inserting cols before/after anchor.
  return (
    `_tmp_cols = [c for c in _df.columns if c not in ${JSON.stringify(cols)}]\n` +
    `_anchor_idx = _tmp_cols.index('${anchor}')\n` +
    `_insert_at = _anchor_idx + ${position === 'after' ? 1 : 0}\n` +
    `_df = _df[_tmp_cols[:_insert_at] + ${JSON.stringify(cols)} + _tmp_cols[_insert_at:]]\n`
  );
};

pythonGenerator.forBlock['tidyblocks_transform_display'] = _block => {
  return `display(_df)\n`;
};

export { Order };
