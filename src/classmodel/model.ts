import { EModel } from '../dsl-model-editor/Model';

export const classModel: EModel = {
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
      id: '0197a602-a759-712e-81ab-9a326d8244d4',
      eClass: 'classmodel:ClassModel',
      data: {
        localizedName: [
          {
            id: '0197a602-a75a-77cf-b827-1b98385eea26',
            eClass: 'ecore:EStringToStringMapEntry',
            data: {
              key: 'ru-RU',
              value: 'модель данных интернет-магазина',
            },
          },
        ],
        name: 'OnlineStore',
        classes: [
          {
            id: '0197a602-a75a-77cf-b827-1dc877acbbc0',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '0197a602-a75a-77cf-b827-200df3134f70',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'пользователь',
                  },
                },
              ],
              kind: 'Regular',
              name: 'User',
              properties: [
                {
                  id: '0197a602-a75a-77cf-b827-274919b36035',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-286e22f7416f',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'имя',
                        },
                      },
                    ],
                    name: 'firstName',
                    dataType: '0197a602-a75a-77cf-b827-bee806621ae6',
                    lower: 0,
                    upper: 1,
                  },
                },
                {
                  id: '0197a602-a75a-77cf-b827-2c7465fae9bb',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-331802d37383',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'фамилия',
                        },
                      },
                    ],
                    name: 'lastName',
                    dataType: '0197a602-a75a-77cf-b827-bee806621ae6',
                    lower: 0,
                    upper: 1,
                  },
                },
                {
                  id: '0197a602-a75a-77cf-b827-351cc71066fc',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-3b6372bb3b85',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'дата рождения',
                        },
                      },
                    ],
                    name: 'birthDate',
                    dataType: '0197a602-a75a-77cf-b827-cf261e9de448',
                    lower: 1,
                    upper: 1,
                  },
                },
                {
                  id: '0197a602-a75a-77cf-b827-3fefaf8a11a3',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-418235fedaa4',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'электронная почта',
                        },
                      },
                    ],
                    name: 'email',
                    dataType: '0197a602-a75a-77cf-b827-bee806621ae6',
                    lower: 1,
                    upper: 1,
                  },
                },
              ],
            },
          },
          {
            id: '0197a602-a75a-77cf-b827-4731a5270e0a',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '0197a602-a75a-77cf-b827-49116bc5ce56',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'заказ',
                  },
                },
              ],
              kind: 'Regular',
              name: 'Order',
              properties: [
                {
                  id: '0197a602-a75a-77cf-b827-4e4b319c5999',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-50aa29298525',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'адресс доставки',
                        },
                      },
                    ],
                    name: 'deliveryAddress',
                    dataType: '0197a602-a75a-77cf-b827-bee806621ae6',
                    lower: 1,
                    upper: 1,
                  },
                },
                {
                  id: '0197a602-a75a-77cf-b827-54fb3068a38f',
                  eClass: 'classmodel:Reference',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-58f2cba07d02',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'пользователь',
                        },
                      },
                    ],
                    name: 'user',
                    target: '0197a602-a75a-77cf-b827-1dc877acbbc0',
                    lower: 1,
                    upper: 1,
                  },
                },
                {
                  id: '0197a602-a75a-77cf-b827-5e64dbef4264',
                  eClass: 'classmodel:Reference',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-60040fb7f00d',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'элементы заказа',
                        },
                      },
                    ],
                    name: 'items',
                    target: '0197a602-a75a-77cf-b827-649b969f3f0a',
                    lower: 1,
                    upper: -1,
                  },
                },
              ],
            },
          },
          {
            id: '0197a602-a75a-77cf-b827-649b969f3f0a',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '0197a602-a75a-77cf-b827-6865ad45df0b',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'элемент заказа',
                  },
                },
              ],
              kind: 'Regular',
              name: 'OrderItem',
              properties: [
                {
                  id: '0197a602-a75a-77cf-b827-6de8b40b1c2b',
                  eClass: 'classmodel:Reference',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-721b9a1ca207',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'заказ',
                        },
                      },
                    ],
                    name: 'order',
                    target: '0197a602-a75a-77cf-b827-4731a5270e0a',
                    opposite: '0197a602-a75a-77cf-b827-5e64dbef4264',
                    lower: 1,
                    upper: 1,
                  },
                },
                {
                  id: '0197a602-a75a-77cf-b827-75d6c6e7389b',
                  eClass: 'classmodel:Reference',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-7b23a5c58c9a',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'продукт',
                        },
                      },
                    ],
                    name: 'product',
                    target: '0197a602-a75a-77cf-b827-8e37dea56e11',
                    lower: 1,
                    upper: 1,
                  },
                },
                {
                  id: '0197a602-a75a-77cf-b827-7c4b5cf71e63',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-80c9c2fe5d35',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'количество',
                        },
                      },
                    ],
                    name: 'quantity',
                    dataType: '0197a602-a75a-77cf-b827-c6185e0d31b5',
                    lower: 1,
                    upper: 1,
                  },
                },
                {
                  id: '0197a602-a75a-77cf-b827-87b405c86907',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-8a98b0b3acc1',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'стоимость',
                        },
                      },
                    ],
                    name: 'price',
                    dataType: '0197a602-a75a-77cf-b827-d44df6bf991f',
                    lower: 1,
                    upper: 1,
                  },
                },
              ],
            },
          },
          {
            id: '0197a602-a75a-77cf-b827-8e37dea56e11',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '0197a602-a75a-77cf-b827-9054848f407d',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'продукт',
                  },
                },
              ],
              kind: 'Abstract',
              name: 'Product',
              properties: [
                {
                  id: '0197a602-a75a-77cf-b827-9750a20d6ee3',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-98036dc68348',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'название',
                        },
                      },
                    ],
                    name: 'name',
                    dataType: '0197a602-a75a-77cf-b827-bee806621ae6',
                    lower: 1,
                    upper: 1,
                  },
                },
              ],
            },
          },
          {
            id: '0197a602-a75a-77cf-b827-9d16ed97ba0b',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '0197a602-a75a-77cf-b827-a06a1cf45470',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'книга',
                  },
                },
              ],
              kind: 'Regular',
              name: 'Book',
              generals: ['0197a602-a75a-77cf-b827-8e37dea56e11'],
              properties: [
                {
                  id: '0197a602-a75a-77cf-b827-a4c616309e48',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-abb57ff3df5c',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'автор',
                        },
                      },
                    ],
                    name: 'author',
                    dataType: '0197a602-a75a-77cf-b827-bee806621ae6',
                    lower: 1,
                    upper: 1,
                  },
                },
              ],
            },
          },
          {
            id: '0197a602-a75a-77cf-b827-ada46e212bfc',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '0197a602-a75a-77cf-b827-b28d32313fe3',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'ручка',
                  },
                },
              ],
              kind: 'Regular',
              name: 'Pen',
              generals: ['0197a602-a75a-77cf-b827-8e37dea56e11'],
              properties: [
                {
                  id: '0197a602-a75a-77cf-b827-b7c80415bf45',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-babfea557e53',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'цвет',
                        },
                      },
                    ],
                    name: 'color',
                    dataType: '0197a602-a75a-77cf-b827-df8f49641d6b',
                    lower: 1,
                    upper: 1,
                  },
                },
              ],
            },
          },
        ],
        dataTypes: [
          {
            id: '0197a602-a75a-77cf-b827-bee806621ae6',
            eClass: 'classmodel:StringType',
            data: {
              localizedName: [
                {
                  id: '0197a602-a75a-77cf-b827-c08761980d5f',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'строка',
                  },
                },
              ],
              name: 'String',
            },
          },
          {
            id: '0197a602-a75a-77cf-b827-c6185e0d31b5',
            eClass: 'classmodel:NumericType',
            data: {
              localizedName: [
                {
                  id: '0197a602-a75a-77cf-b827-cac8ab9c7235',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'целое беззнаковое число',
                  },
                },
              ],
              name: 'UnsignedInt',
              fractionDigits: 0,
              minInclusive: 0,
            },
          },
          {
            id: '0197a602-a75a-77cf-b827-cf261e9de448',
            eClass: 'classmodel:TimeType',
            data: {
              localizedName: [
                {
                  id: '0197a602-a75a-77cf-b827-d0670fd93d79',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'дата',
                  },
                },
              ],
              name: 'Date',
              instantUnits: ['Year', 'Month', 'Day'],
            },
          },
          {
            id: '0197a602-a75a-77cf-b827-d44df6bf991f',
            eClass: 'classmodel:NumericType',
            data: {
              localizedName: [
                {
                  id: '0197a602-a75a-77cf-b827-d96478c128ee',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'денежный тип',
                  },
                },
              ],
              name: 'Money',
              totalDigits: 19,
              fractionDigits: 4,
              minInclusive: 0,
            },
          },
          {
            id: '0197a602-a75a-77cf-b827-df8f49641d6b',
            eClass: 'classmodel:EnumeratedType',
            data: {
              localizedName: [
                {
                  id: '0197a602-a75a-77cf-b827-e334b650a95c',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'цвет',
                  },
                },
              ],
              name: 'Color',
              literals: [
                {
                  id: '0197a602-a75a-77cf-b827-e7822e72724d',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-e83390032187',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'красный',
                        },
                      },
                    ],
                    name: 'Red',
                  },
                },
                {
                  id: '0197a602-a75a-77cf-b827-ede7525c8d56',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-f29f9089da1a',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'зелёный',
                        },
                      },
                    ],
                    name: 'Green',
                  },
                },
                {
                  id: '0197a602-a75a-77cf-b827-f6e09dbc97c4',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b827-fb8a9f2b258e',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'синий',
                        },
                      },
                    ],
                    name: 'Blue',
                  },
                },
                {
                  id: '0197a602-a75a-77cf-b827-ffb17096ce58',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    localizedName: [
                      {
                        id: '0197a602-a75a-77cf-b828-03940730fda0',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'чёрный',
                        },
                      },
                    ],
                    name: 'Black',
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
