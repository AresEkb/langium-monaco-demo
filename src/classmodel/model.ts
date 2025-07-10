import type { EModel } from '../dsl-model-editor/Model';

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
      id: '0197f429-e5e0-743b-9330-d755229cecbb',
      eClass: 'classmodel:ClassModel',
      data: {
        localizedName: [
          {
            id: '0197f429-e5e0-743b-9330-db1f4b92def2',
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
            id: '0197f429-e5e0-743b-9330-dfccbe50ea8a',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '0197f429-e5e0-743b-9330-e355d52c727d',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'пользователь',
                  },
                },
              ],
              localizedDescription: [
                {
                  id: '0197f429-ed3a-7275-bd07-216ec2ea7190',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'пользователь системы, который может делать заказы',
                  },
                },
              ],
              kind: 'Regular',
              name: 'User',
              properties: [
                {
                  id: '0197f429-e5e1-777f-9508-9562d8686ac3',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-e5e1-777f-9508-9940a4401452',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'имя',
                        },
                      },
                      {
                        id: '0197f429-ed3a-7275-bd07-1cb37b2a7462',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'fr-FR',
                          value: 'prénom',
                        },
                      },
                    ],
                    name: 'firstName',
                    dataType: '0197f429-e5e1-777f-9508-fecb083bb4df',
                    lower: 0,
                    upper: 1,
                  },
                },
                {
                  id: '0197f429-e5e1-777f-9508-9e16d8090911',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-e5e1-777f-9508-a153db85075e',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'фамилия',
                        },
                      },
                    ],
                    name: 'lastName',
                    dataType: '0197f429-e5e1-777f-9508-fecb083bb4df',
                    lower: 0,
                    upper: 1,
                  },
                },
                {
                  id: '0197f429-e5e1-777f-9508-a6e22e7a4ea1',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-e5e1-777f-9508-abc83e024132',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'дата рождения',
                        },
                      },
                    ],
                    name: 'birthDate',
                    dataType: '0197f429-e5e1-777f-9509-0f287fff11bb',
                    lower: 0,
                    upper: 1,
                  },
                },
                {
                  id: '0197f429-e5e1-777f-9508-ade439a6d52c',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-e5e1-777f-9508-b1086feb5763',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'электронная почта',
                        },
                      },
                    ],
                    name: 'email',
                    dataType: '0197f429-e5e1-777f-9508-fecb083bb4df',

                    lower: 1,
                    upper: 1,
                  },
                },
              ],
            },
          },
          {
            id: '0197f429-e5e1-777f-9508-b641ee62a5f5',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '0197f429-e5e1-777f-9508-b881ccf9eb30',
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
                  id: '0197f429-e5e1-777f-9508-be89e6339edf',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-e5e1-777f-9508-c31e3d82b8f2',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'адресс доставки',
                        },
                      },
                    ],
                    name: 'deliveryAddress',
                    dataType: '0197f429-e5e1-777f-9508-fecb083bb4df',

                    lower: 1,
                    upper: 1,
                  },
                },
                {
                  id: '0197f429-ed3a-7275-bd07-2784344924c7',
                  eClass: 'classmodel:Reference',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-ed3a-7275-bd07-29b065d892dc',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'пользователь',
                        },
                      },
                    ],
                    kind: 'Association',
                    name: 'user',
                    target: '0197f429-e5e0-743b-9330-dfccbe50ea8a',

                    lower: 1,
                    upper: 1,
                  },
                },
                {
                  id: '0197f429-ed3a-7275-bd07-2d300a84c220',
                  eClass: 'classmodel:Reference',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-ed3a-7275-bd07-32dd716a34ea',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'элементы заказа',
                        },
                      },
                    ],
                    kind: 'Composition',
                    name: 'items',
                    target: '0197f429-e5e1-777f-9508-c6601dab323e',
                    lower: 0,
                    upper: -1,
                    opposite: '0197f429-ed3a-7275-bd07-36990b2ac16b',
                  },
                },
              ],
            },
          },
          {
            id: '0197f429-e5e1-777f-9508-c6601dab323e',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '0197f429-e5e1-777f-9508-c8c26742c987',
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
                  id: '0197f429-ed3a-7275-bd07-36990b2ac16b',
                  eClass: 'classmodel:Reference',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-ed3a-7275-bd07-394578d24242',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'заказ',
                        },
                      },
                    ],
                    kind: 'Association',
                    name: 'order',
                    target: '0197f429-e5e1-777f-9508-b641ee62a5f5',
                    opposite: '0197f429-ed3a-7275-bd07-2d300a84c220',

                    lower: 1,
                    upper: 1,
                  },
                },
                {
                  id: '0197f429-ed3a-7275-bd07-3c2dbf968c3a',
                  eClass: 'classmodel:Reference',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-ed3a-7275-bd07-434c6678bca1',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'продукт',
                        },
                      },
                    ],
                    kind: 'Association',
                    name: 'product',
                    target: '0197f429-e5e1-777f-9508-cdbcf6bc3c93',

                    lower: 1,
                    upper: 1,
                  },
                },
                {
                  id: '0197f429-ed3a-7275-bd07-45fe4f71568c',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-ed3a-7275-bd07-4b41614e5f43',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'количество',
                        },
                      },
                    ],
                    name: 'quantity',
                    dataType: '0197f429-e5e1-777f-9509-044b8d535c9b',

                    lower: 1,
                    upper: 1,
                  },
                },
                {
                  id: '0197f429-ed3a-7275-bd07-4fd93f18c234',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-ed3a-7275-bd07-52c3284aa73e',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'стоимость',
                        },
                      },
                    ],
                    name: 'price',
                    dataType: '0197f429-e5e1-777f-9509-170538969a7e',

                    lower: 1,
                    upper: 1,
                  },
                },
              ],
            },
          },
          {
            id: '0197f429-e5e1-777f-9508-cdbcf6bc3c93',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '0197f429-e5e1-777f-9508-d37e6445bac9',
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
                  id: '0197f429-e5e1-777f-9508-d5b1f09f9aed',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-e5e1-777f-9508-da74b603e76a',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'название',
                        },
                      },
                    ],
                    name: 'name',
                    dataType: '0197f429-e5e1-777f-9508-fecb083bb4df',

                    lower: 1,
                    upper: 1,
                  },
                },
              ],
            },
          },
          {
            id: '0197f429-e5e1-777f-9508-dc909d2b0a9e',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '0197f429-e5e1-777f-9508-e390e1caaea5',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'книга',
                  },
                },
              ],
              kind: 'Regular',
              name: 'Book',
              generals: ['0197f429-e5e1-777f-9508-cdbcf6bc3c93'],
              properties: [
                {
                  id: '0197f429-e5e1-777f-9508-e6880e451db7',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-e5e1-777f-9508-e8ddae7426f7',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'автор',
                        },
                      },
                    ],
                    name: 'author',
                    dataType: '0197f429-e5e1-777f-9508-fecb083bb4df',

                    lower: 1,
                    upper: 1,
                  },
                },
              ],
            },
          },
          {
            id: '0197f429-e5e1-777f-9508-ee762760f2b6',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '0197f429-e5e1-777f-9508-f0bcb59f6298',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'ручка',
                  },
                },
              ],
              kind: 'Regular',
              name: 'Pen',
              generals: ['0197f429-e5e1-777f-9508-cdbcf6bc3c93'],
              properties: [
                {
                  id: '0197f429-e5e1-777f-9508-f49e7a7537ae',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-e5e1-777f-9508-facd13126526',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'цвет',
                        },
                      },
                    ],
                    name: 'color',
                    dataType: '0197f429-e5e1-777f-9509-1e1e83eaa480',

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
            id: '0197f429-e5e1-777f-9508-fecb083bb4df',
            eClass: 'classmodel:StringType',
            data: {
              localizedName: [
                {
                  id: '0197f429-e5e1-777f-9509-0344c765ccc1',
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
            id: '0197f429-e5e1-777f-9509-044b8d535c9b',
            eClass: 'classmodel:NumericType',
            data: {
              localizedName: [
                {
                  id: '0197f429-e5e1-777f-9509-09af76b18988',
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
            id: '0197f429-e5e1-777f-9509-0f287fff11bb',
            eClass: 'classmodel:TimeType',
            data: {
              localizedName: [
                {
                  id: '0197f429-e5e1-777f-9509-109fcaaaa3ae',
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
            id: '0197f429-e5e1-777f-9509-170538969a7e',
            eClass: 'classmodel:NumericType',
            data: {
              localizedName: [
                {
                  id: '0197f429-e5e1-777f-9509-19cc84ddcd7a',
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
            id: '0197f429-e5e1-777f-9509-1e1e83eaa480',
            eClass: 'classmodel:EnumeratedType',
            data: {
              localizedName: [
                {
                  id: '0197f429-e5e1-777f-9509-225460e88b81',
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
                  id: '0197f429-e5e1-777f-9509-256cfd355764',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-e5e1-777f-9509-2abbde2679ea',
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
                  id: '0197f429-e5e1-777f-9509-2cbe786bbcae',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-e5e1-777f-9509-30789e2f39c0',
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
                  id: '0197f429-e5e1-777f-9509-35c10790ad73',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-e5e1-777f-9509-3b8604d6c076',
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
                  id: '0197f429-e5e1-777f-9509-3d33b01d8498',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    localizedName: [
                      {
                        id: '0197f429-e5e1-777f-9509-417bea64384d',
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
