import { EModel } from '../langium/Model';

export const dslModel: EModel = {
  json: {
    version: '1.0',
    encoding: 'utf-8',
  },
  ns: {
    classmodel: 'https://example.com/class-model',
    ecore: 'http://www.eclipse.org/emf/2002/Ecore',
  },
  content: [
    {
      id: '01977522-4f1d-7001-bd21-58316f012208',
      eClass: 'classmodel:ClassModel',
      data: {
        name: 'model1',
        classes: [
          {
            id: '01977522-53b4-7133-88b4-43b01dd76590',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '01977522-53b4-7133-88b4-4543b55c3bef',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'тест',
                  },
                },
                {
                  id: '01977522-53b4-7133-88b4-4bcebf764da5',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'fr-FR',
                    value: 'french',
                  },
                },
              ],
              localizedDescription: [
                {
                  id: '01977522-53b4-7133-88b4-4ecf7b819c04',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'описание',
                  },
                },
              ],
              kind: 'Regular',
              name: 'Cls',
              generals: [
                '01977522-53b4-7133-88b4-656c2dab1f0f',
                '01977522-53b4-7133-88b4-6a42d3c27494',
                '01977522-53b4-7133-88b4-73337216610c',
              ],
              properties: [
                {
                  id: '01977522-53b4-7133-88b4-53367dfdae44',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '01977522-53b4-7133-88b4-5496f8a69f70',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'атрибут',
                        },
                      },
                    ],
                    name: 'a1',
                    dataType: '01977522-53b4-7133-88b4-7590aef8a6d5',
                  },
                },
                {
                  id: '01977522-53b4-7133-88b4-5bd3de0ec379',
                  eClass: 'classmodel:Reference',
                  data: {
                    localizedName: [
                      {
                        id: '01977522-53b4-7133-88b4-5ca2dec3c106',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'ссылка',
                        },
                      },
                    ],
                    name: 'r1',
                    target: '01977522-53b4-7133-88b4-43b01dd76590',
                    localizedDescription: [],
                  },
                },
                {
                  id: '01977522-53b4-7133-88b4-6291aef99619',
                  eClass: 'classmodel:Attribute',
                  data: {
                    name: 'a2',
                    dataType: '01977522-53b4-7133-88b4-7dbbb745fe33',
                  },
                },
              ],
            },
          },
          {
            id: '01977522-53b4-7133-88b4-656c2dab1f0f',
            eClass: 'classmodel:Class',
            data: {
              kind: 'Abstract',
              name: 'Qwe',
            },
          },
          {
            id: '01977522-53b4-7133-88b4-6a42d3c27494',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '01977522-53b4-7133-88b4-6ee45c328a16',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'интерфейс',
                  },
                },
              ],
              kind: 'Interface',
              name: 'Zxc',
            },
          },
          {
            id: '01977522-53b4-7133-88b4-73337216610c',
            eClass: 'classmodel:Class',
            data: {
              kind: 'Interface',
              name: 'Rty',
            },
          },
        ],
        dataTypes: [
          {
            id: '01977522-53b4-7133-88b4-7590aef8a6d5',
            eClass: 'classmodel:StringType',
            data: {
              localizedName: [
                {
                  id: '01977522-53b4-7133-88b4-7953e1184d6b',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'строка',
                  },
                },
              ],
              name: 'String100',
              length: 100,
              pattern: 'q\\we\'c\n"c',
            },
          },
          {
            id: '01977522-53b4-7133-88b4-7dbbb745fe33',
            eClass: 'classmodel:NumericType',
            data: {
              localizedName: [
                {
                  id: '01977522-53b4-7133-88b4-81e21d07084e',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'целое',
                  },
                },
              ],
              name: 'Int',
              fractionDigits: 0,
            },
          },
          {
            id: '01977522-53b4-7133-88b4-8538d900deaf',
            eClass: 'classmodel:TimeType',
            data: {
              name: 'Date',
              instantUnits: ['Year', 'Month', 'Day'],
            },
          },
          {
            id: '01977522-53b4-7133-88b4-8bfc30ac6e14',
            eClass: 'classmodel:EnumeratedType',
            data: {
              name: 'Enum',
              literals: [
                {
                  id: '01977522-53b4-7133-88b4-8f8ddee10c9f',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    name: 'literal1',
                  },
                },
                {
                  id: '01977522-53b4-7133-88b4-9366d6fc9d3b',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    localizedName: [
                      {
                        id: '01977522-53b4-7133-88b4-9404d10b3c3f',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'литерал2',
                        },
                      },
                    ],
                    name: 'literal2',
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
