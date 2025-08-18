export const classModelGrammarExtension = `{
  Class: {
    kind: {
      normalize(node) {
        return node.kind?.$type !== 'ClassKind__Regular' ? node.kind : undefined;
      },
      denormalize(node) {
        return node.kind ?? { '$type': 'ClassKind__Regular' };
      },
    },
  },
  Attribute: {
    lower: {
      normalize(node) {
        return node.lower ?? 1;
      },
      denormalize(node) {
        return node.lower !== node.upper ? node.lower : node.lower !== 1 ? node.lower : undefined;
      },
    },
    upper: {
      normalize(node) {
        return node.upper ?? node.lower ?? 1;
      },
      denormalize(node) {
        return node.lower !== node.upper ? node.upper : undefined;
      },
    },
  },
  Reference: {
    kind: {
      normalize(node) {
        return node.kind?.$type !== 'ReferenceKind__Association' ? node.kind : undefined;
      },
      denormalize(node) {
        return node.kind ?? { '$type': 'ReferenceKind__Association' };
      },
    },
    lower: {
      normalize(node) {
        return node.lower ?? 1;
      },
      denormalize(node) {
        return node.lower !== node.upper ? node.lower : node.lower !== 1 ? node.lower : undefined;
      },
    },
    upper: {
      normalize(node) {
        return node.upper ?? node.lower ?? 1;
      },
      denormalize(node) {
        return node.lower !== node.upper ? node.upper : undefined;
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
