import { pythonGenerator, Order } from 'blockly/python';

pythonGenerator.forBlock['tidyblocks_plot_bar'] = block => {
  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  return `px.bar(_df, x='${x}', y='${y}').show()\n`;
};

pythonGenerator.forBlock['tidyblocks_plot_box'] = block => {
  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  return `px.box(_df, x='${x}', y='${y}').show()\n`;
};

pythonGenerator.forBlock['tidyblocks_plot_dot'] = block => {
  const x = block.getFieldValue('X');
  return `px.strip(_df, x='${x}').show()\n`;
};

pythonGenerator.forBlock['tidyblocks_plot_histogram'] = block => {
  const x = block.getFieldValue('X');
  const nbins = block.getFieldValue('NBINS');
  return `px.histogram(_df, x='${x}', nbins=${nbins}).show()\n`;
};

pythonGenerator.forBlock['tidyblocks_plot_scatter'] = block => {
  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  const color = block.getFieldValue('COLOR').trim();
  const trendline = block.getFieldValue('TRENDLINE') === 'TRUE';

  const colorArg = color ? `, color='${color}'` : '';
  const trendArg = trendline ? ", trendline='ols'" : '';
  return `px.scatter(_df, x='${x}', y='${y}'${colorArg}${trendArg}).show()\n`;
};

pythonGenerator.forBlock['tidyblocks_plot_line'] = block => {
  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  const color = block.getFieldValue('COLOR').trim();
  const colorArg = color ? `, color='${color}'` : '';
  return `px.line(_df, x='${x}', y='${y}'${colorArg}).show()\n`;
};

pythonGenerator.forBlock['tidyblocks_plot_violin'] = block => {
  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  return `px.violin(_df, x='${x}', y='${y}').show()\n`;
};

pythonGenerator.forBlock['tidyblocks_plot_heatmap'] = () => {
  return `px.imshow(_df.select_dtypes('number').corr(), text_auto=True).show()\n`;
};

export { Order };
