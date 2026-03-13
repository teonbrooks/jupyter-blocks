import { pythonGenerator, Order } from 'blockly/python';

pythonGenerator.forBlock['tidyblocks_stats_ttest_one'] = block => {
  const col = block.getFieldValue('COLUMN');
  const mu = block.getFieldValue('MU');
  return (
    `_result = stats.ttest_1samp(_df['${col}'].dropna(), popmean=${mu})\n` +
    `print(f"t-statistic: {_result.statistic:.4f}, p-value: {_result.pvalue:.4f}")\n`
  );
};

pythonGenerator.forBlock['tidyblocks_stats_ttest_two'] = block => {
  const groupCol = block.getFieldValue('GROUP_COL');
  const valueCol = block.getFieldValue('VALUE_COL');
  return (
    `_groups = [g['${valueCol}'].dropna().values for _, g in _df.groupby('${groupCol}')]\n` +
    `_result = stats.ttest_ind(*_groups[:2])\n` +
    `print(f"t-statistic: {_result.statistic:.4f}, p-value: {_result.pvalue:.4f}")\n`
  );
};

pythonGenerator.forBlock['tidyblocks_stats_kmeans'] = block => {
  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  const k = block.getFieldValue('K');
  const label = block.getFieldValue('LABEL');
  return (
    `_km = KMeans(n_clusters=${k}, random_state=0, n_init='auto')\n` +
    `_df = _df.assign(**{'${label}': _km.fit_predict(_df[['${x}', '${y}']]).astype(str)})\n`
  );
};

pythonGenerator.forBlock['tidyblocks_stats_silhouette'] = block => {
  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  const label = block.getFieldValue('LABEL');
  const score = block.getFieldValue('SCORE');
  return (
    `_score = silhouette_score(_df[['${x}', '${y}']], _df['${label}'])\n` +
    `_df = _df.assign(**{'${score}': _score})\n` +
    `print(f"Silhouette score: {_score:.4f}")\n`
  );
};

pythonGenerator.forBlock['tidyblocks_stats_correlation'] = block => {
  const method = block.getFieldValue('METHOD');
  const colA = block.getFieldValue('COL_A');
  const colB = block.getFieldValue('COL_B');
  return (
    `_corr = _df[['${colA}', '${colB}']].corr(method='${method}').iloc[0, 1]\n` +
    `print(f"${method.charAt(0).toUpperCase() + method.slice(1)} correlation (${colA}, ${colB}): {_corr:.4f}")\n`
  );
};

pythonGenerator.forBlock['tidyblocks_stats_describe'] = () => {
  return `display(_df.describe())\n`;
};

export { Order };
