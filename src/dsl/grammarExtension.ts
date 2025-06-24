export const dslGrammarExtension = `{
  Attribute: {
    upper: {
      normalize(node) {
        return node.upper !== undefined ? node.upper : node.lower;
      },
      denormalize(node) {
        return node.upper !== node.lower ? node.upper : undefined;
      },
    },
  },
  Reference: {
    upper: {
      normalize(node) {
        return node.upper !== undefined ? node.upper : node.lower;
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
}`;
