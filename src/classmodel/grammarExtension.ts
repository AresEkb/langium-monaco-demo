export const classModelGrammarExtension = `{
  Attribute: {
    lower: {
      normalize(node) {
        return node.lower !== undefined ? node.lower : 1;
      },
      denormalize(node) {
        return node.lower !== node.upper ? node.lower : node.lower !== 1 ? node.lower : undefined;
      },
    },
    upper: {
      normalize(node) {
        return node.upper !== undefined ? node.upper : node.lower !== undefined ? node.lower : 1;
      },
      denormalize(node) {
        return node.upper !== node.lower ? node.upper : undefined;
      },
    },
  },
  Reference: {
    lower: {
      normalize(node) {
        return node.lower !== undefined ? node.lower : 1;
      },
      denormalize(node) {
        return node.lower !== node.upper ? node.lower : node.lower !== 1 ? node.lower : undefined;
      },
    },
    upper: {
      normalize(node) {
        return node.upper !== undefined ? node.upper : node.lower !== undefined ? node.lower : 1;
      },
      denormalize(node) {
        return node.upper !== node.lower ? node.upper : undefined;
      },
    },
    opposite: {
      scopes(node) {
        return node.target.ref.properties.filter((prop) => prop.$type === 'Reference' && prop.target.ref === node.$container);
      },
    },
  },
  UnlimitedNatural: {
    value: {
      parse(value) {
        return value === '*' ? -1 : parseInt(value);
      },
      print(value) {
        return value === -1 ? '*' : value.toString();
      },
    },
  },
}
`;
