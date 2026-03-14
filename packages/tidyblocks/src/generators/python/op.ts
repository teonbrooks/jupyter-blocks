import { pythonGenerator, Order } from 'blockly/python';

const ARITH_MAP: Record<string, [string, Order]> = {
  ADD: ['+', Order.ADDITIVE],
  SUB: ['-', Order.ADDITIVE],
  MUL: ['*', Order.MULTIPLICATIVE],
  DIV: ['/', Order.MULTIPLICATIVE],
  MOD: ['%', Order.MULTIPLICATIVE],
  POW: ['**', Order.EXPONENTIATION]
};

const CMP_MAP: Record<string, [string, Order]> = {
  EQ: ['==', Order.RELATIONAL],
  NEQ: ['!=', Order.RELATIONAL],
  LT: ['<', Order.RELATIONAL],
  LTE: ['<=', Order.RELATIONAL],
  GT: ['>', Order.RELATIONAL],
  GTE: ['>=', Order.RELATIONAL]
};

pythonGenerator.forBlock['tidyblocks_op_arithmetic'] = (block, generator) => {
  const op = block.getFieldValue('OP');
  const [sym, ord] = ARITH_MAP[op];
  const left = generator.valueToCode(block, 'LEFT', ord) || '0';
  const right = generator.valueToCode(block, 'RIGHT', ord) || '0';
  return [`(${left} ${sym} ${right})`, ord];
};

pythonGenerator.forBlock['tidyblocks_op_compare'] = (block, generator) => {
  const op = block.getFieldValue('OP');
  const [sym, ord] = CMP_MAP[op];
  const left = generator.valueToCode(block, 'LEFT', Order.RELATIONAL) || '0';
  const right = generator.valueToCode(block, 'RIGHT', Order.RELATIONAL) || '0';
  return [`(${left} ${sym} ${right})`, ord];
};

pythonGenerator.forBlock['tidyblocks_op_logic'] = (block, generator) => {
  const op = block.getFieldValue('OP');
  const sym = op === 'AND' ? '&' : '|';
  const left =
    generator.valueToCode(block, 'LEFT', Order.BITWISE_AND) || 'True';
  const right =
    generator.valueToCode(block, 'RIGHT', Order.BITWISE_AND) || 'True';
  return [`(${left} ${sym} ${right})`, Order.BITWISE_AND];
};

pythonGenerator.forBlock['tidyblocks_op_not'] = (block, generator) => {
  const val = generator.valueToCode(block, 'VALUE', Order.NONE) || 'True';
  return [`~(${val})`, Order.NONE];
};

pythonGenerator.forBlock['tidyblocks_op_ifelse'] = (block, generator) => {
  const cond = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'True';
  const ifTrue = generator.valueToCode(block, 'IF_TRUE', Order.NONE) || 'None';
  const ifFalse =
    generator.valueToCode(block, 'IF_FALSE', Order.NONE) || 'None';
  return [`np.where(${cond}, ${ifTrue}, ${ifFalse})`, Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['tidyblocks_op_typecheck'] = (block, generator) => {
  const check = block.getFieldValue('CHECK');
  const val =
    generator.valueToCode(block, 'VALUE', Order.NONE) || '_df.iloc[:, 0]';
  const code: Record<string, string> = {
    IS_MISSING: `(${val}).isna()`,
    IS_NUMBER: `(${val}).apply(lambda v: isinstance(v, (int, float)))`,
    IS_TEXT: `(${val}).apply(lambda v: isinstance(v, str))`,
    IS_DATE: `pd.to_datetime(${val}, errors='coerce').notna()`,
    IS_BOOL: `(${val}).apply(lambda v: isinstance(v, bool))`
  };
  return [code[check] ?? 'False', Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['tidyblocks_op_convert'] = (block, generator) => {
  const to = block.getFieldValue('TO');
  const val =
    generator.valueToCode(block, 'VALUE', Order.NONE) || '_df.iloc[:, 0]';
  const code: Record<string, string> = {
    NUMBER: `pd.to_numeric(${val}, errors='coerce')`,
    TEXT: `(${val}).astype(str)`,
    BOOL: `(${val}).astype(bool)`,
    DATETIME: `pd.to_datetime(${val}, errors='coerce')`
  };
  return [code[to] ?? val, Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['tidyblocks_op_datetime'] = (block, generator) => {
  const part = block.getFieldValue('PART');
  const val =
    generator.valueToCode(block, 'VALUE', Order.MEMBER) || '_df.iloc[:, 0]';
  return [`(${val}).dt.${part}`, Order.MEMBER];
};

pythonGenerator.forBlock['tidyblocks_op_shift'] = (block, generator) => {
  const periods = block.getFieldValue('PERIODS');
  const val =
    generator.valueToCode(block, 'VALUE', Order.MEMBER) || '_df.iloc[:, 0]';
  return [`(${val}).shift(${periods})`, Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['tidyblocks_op_math'] = (block, generator) => {
  const fun = block.getFieldValue('FUN');
  const val = generator.valueToCode(block, 'VALUE', Order.NONE) || '0';
  const npFuns = ['sqrt', 'log', 'exp'];
  const pdFuns: Record<string, string> = {
    abs: `(${val}).abs()`,
    round: `(${val}).round()`,
    floor: `np.floor(${val})`,
    ceil: `np.ceil(${val})`
  };
  if (npFuns.includes(fun)) {
    return [`np.${fun}(${val})`, Order.FUNCTION_CALL];
  }
  return [pdFuns[fun] ?? `(${val})`, Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['tidyblocks_op_string'] = (block, generator) => {
  const op = block.getFieldValue('OP');
  const val =
    generator.valueToCode(block, 'VALUE', Order.MEMBER) || '_df.iloc[:, 0]';
  if (op === 'len') {
    return [`(${val}).str.len()`, Order.FUNCTION_CALL];
  }
  return [`(${val}).str.${op}()`, Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['tidyblocks_op_str_contains'] = (block, generator) => {
  const pattern = block.getFieldValue('PATTERN').replace(/'/g, "\\'");
  const val =
    generator.valueToCode(block, 'VALUE', Order.MEMBER) || '_df.iloc[:, 0]';
  return [`(${val}).str.contains('${pattern}', na=False)`, Order.FUNCTION_CALL];
};

// dplyr: between(x, left, right) — inclusive range check
pythonGenerator.forBlock['tidyblocks_op_between'] = (block, generator) => {
  const val =
    generator.valueToCode(block, 'VALUE', Order.NONE) || '_df.iloc[:, 0]';
  const left = block.getFieldValue('LEFT');
  const right = block.getFieldValue('RIGHT');
  return [`(${val}).between(${left}, ${right})`, Order.FUNCTION_CALL];
};

// dplyr: coalesce(x, y) — first non-missing value
pythonGenerator.forBlock['tidyblocks_op_coalesce'] = (block, generator) => {
  const val =
    generator.valueToCode(block, 'VALUE', Order.NONE) || '_df.iloc[:, 0]';
  const replacement =
    generator.valueToCode(block, 'REPLACEMENT', Order.NONE) || 'None';
  return [`(${val}).fillna(${replacement})`, Order.FUNCTION_CALL];
};

// dplyr: n_distinct(x) — count unique values
pythonGenerator.forBlock['tidyblocks_op_n_distinct'] = (block, generator) => {
  const val =
    generator.valueToCode(block, 'VALUE', Order.NONE) || '_df.iloc[:, 0]';
  return [`(${val}).nunique()`, Order.FUNCTION_CALL];
};

export { Order };
