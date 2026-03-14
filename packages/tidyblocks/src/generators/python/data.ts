import { pythonGenerator, Order } from 'blockly/python';

pythonGenerator.forBlock['tidyblocks_data_colors'] = () => {
  return (
    '_df = pd.DataFrame({\n' +
    "    'name': ['red','orange','yellow','green','blue','indigo','violet','white','black','gray','brown'],\n" +
    "    'red':  [255,255,255,  0,  0,  75,238,255,  0,128, 165],\n" +
    "    'green':[  0,165,255,128,  0,  0,130,255,  0,128, 42],\n" +
    "    'blue': [  0,  0,  0,  0,255,130,238,255,  0,128, 42]\n" +
    '})\n'
  );
};

pythonGenerator.forBlock['tidyblocks_data_earthquakes'] = () => {
  return "_df = pd.read_csv('https://raw.githubusercontent.com/gvwilson/tidyblocks/master/data/earthquakes.csv')\n";
};

pythonGenerator.forBlock['tidyblocks_data_penguins'] = () => {
  return "_df = sns.load_dataset('penguins')\n";
};

pythonGenerator.forBlock['tidyblocks_data_sequence'] = block => {
  const n = block.getFieldValue('N');
  const col = block.getFieldValue('COLUMN');
  return `_df = pd.DataFrame({'${col}': range(1, ${n} + 1)})\n`;
};

pythonGenerator.forBlock['tidyblocks_data_user'] = block => {
  const name = block.getFieldValue('NAME');
  return `_df = ${name}.copy()\n`;
};

pythonGenerator.forBlock['tidyblocks_data_iris'] = () => {
  return "_df = sns.load_dataset('iris')\n";
};

pythonGenerator.forBlock['tidyblocks_data_titanic'] = () => {
  return "_df = sns.load_dataset('titanic')\n";
};

pythonGenerator.forBlock['tidyblocks_data_gapminder'] = () => {
  return '_df = px.data.gapminder()\n';
};

pythonGenerator.forBlock['tidyblocks_data_csv'] = block => {
  const path = block.getFieldValue('PATH');
  return `_df = pd.read_csv('${path}')\n`;
};

// Suppress unused-import warning — Order is re-exported for consumers
export { Order };
