import * as Blockly from 'blockly';

const TOPLEVEL_INIT = `import scipy.stats as stats
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
`;

const CORR_METHODS = [
  ['Pearson', 'pearson'],
  ['Spearman', 'spearman'],
  ['Kendall', 'kendall']
];

Blockly.defineBlocksWithJsonArray([
  {
    type: 'tidyblocks_stats_ttest_one',
    message0: 'one-sample t-test column %1 vs mean %2',
    args0: [
      { type: 'field_input', name: 'COLUMN', text: 'col1' },
      { type: 'field_number', name: 'MU', value: 0 }
    ],
    previousStatement: null,
    colour: '#BA93DB',
    tooltip: 'One-sample two-sided t-test against a hypothesized mean.'
  },
  {
    type: 'tidyblocks_stats_ttest_two',
    message0: 'two-sample t-test groups in %1 values in %2',
    args0: [
      { type: 'field_input', name: 'GROUP_COL', text: 'group' },
      { type: 'field_input', name: 'VALUE_COL', text: 'value' }
    ],
    previousStatement: null,
    colour: '#BA93DB',
    tooltip:
      'Two-sample two-sided t-test between two groups defined by a label column.'
  },
  {
    type: 'tidyblocks_stats_kmeans',
    message0: 'k-means x %1 y %2 k %3 label column %4',
    args0: [
      { type: 'field_input', name: 'X', text: 'x_col' },
      { type: 'field_input', name: 'Y', text: 'y_col' },
      { type: 'field_number', name: 'K', value: 3, min: 2, precision: 1 },
      { type: 'field_input', name: 'LABEL', text: 'cluster' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#BA93DB',
    tooltip: 'K-means clustering. Adds a label column with cluster assignments.'
  },
  {
    type: 'tidyblocks_stats_silhouette',
    message0: 'silhouette score x %1 y %2 labels %3 score column %4',
    args0: [
      { type: 'field_input', name: 'X', text: 'x_col' },
      { type: 'field_input', name: 'Y', text: 'y_col' },
      { type: 'field_input', name: 'LABEL', text: 'cluster' },
      { type: 'field_input', name: 'SCORE', text: 'silhouette' }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#BA93DB',
    tooltip: 'Compute silhouette coefficient for cluster quality.'
  },
  {
    type: 'tidyblocks_stats_correlation',
    message0: '%1 correlation of %2 and %3',
    args0: [
      { type: 'field_dropdown', name: 'METHOD', options: CORR_METHODS },
      { type: 'field_input', name: 'COL_A', text: 'col1' },
      { type: 'field_input', name: 'COL_B', text: 'col2' }
    ],
    previousStatement: null,
    colour: '#BA93DB',
    tooltip: 'Compute correlation between two columns.'
  },
  {
    type: 'tidyblocks_stats_describe',
    message0: 'describe',
    previousStatement: null,
    colour: '#BA93DB',
    tooltip: 'Print descriptive statistics for all numeric columns.'
  }
]);

const statsTypes = [
  'tidyblocks_stats_ttest_one',
  'tidyblocks_stats_ttest_two',
  'tidyblocks_stats_kmeans',
  'tidyblocks_stats_silhouette',
  'tidyblocks_stats_correlation',
  'tidyblocks_stats_describe'
];

for (const t of statsTypes) {
  Blockly.Blocks[t].toplevel_init = TOPLEVEL_INIT;
}
