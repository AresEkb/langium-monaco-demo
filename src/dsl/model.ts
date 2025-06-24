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
      id: '019782f8-c579-718e-af73-b43ea10eafe1',
      eClass: 'classmodel:ClassModel',
      data: {
        localizedName: [
          {
            id: '019782f8-ce29-70ef-871f-dd5845e4c1da',
            eClass: 'ecore:EStringToStringMapEntry',
            data: {
              key: 'ru-RU',
              value: 'Модель данных интернет-магазина',
            },
          },
        ],
        name: 'OnlineStore',
        classes: [
          {
            id: '019782f8-c579-718e-af73-b96cd6d02510',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '019782f8-c579-718e-af73-bf94951cca06',
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
                  id: '019782f8-c579-718e-af73-c82ec9b669ce',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-c579-718e-af73-cc76d0100a1d',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'имя',
                        },
                      },
                    ],
                    name: 'firstName',
                    dataType: '019782f8-c579-718e-af73-ed91348a2293',
                    lower: 0,
                    upper: 1,
                  },
                },
                {
                  id: '019782f8-c579-718e-af73-d0713c81856b',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-c579-718e-af73-d70f9480a404',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'фамилия',
                        },
                      },
                    ],
                    name: 'lastName',
                    dataType: '019782f8-c579-718e-af73-ed91348a2293',
                    lower: 0,
                    upper: 1,
                  },
                },
                {
                  id: '019782f8-c579-718e-af73-d9849cf60440',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-0ac3c303ea99',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'дата рождения',
                        },
                      },
                    ],
                    name: 'birthDate',
                    dataType: '019782f8-c579-718e-af73-fd00f5b674a0',
                    lower: 0,
                    upper: 1,
                  },
                },
                {
                  id: '019782f8-ce28-776d-836d-0e6fd4c79c62',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-11a0f11a8e64',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'электронная почта',
                        },
                      },
                    ],
                    name: 'email',
                    dataType: '019782f8-c579-718e-af73-ed91348a2293',
                    lower: 1,
                    upper: 1,
                  },
                },
              ],
              generals: [],
            },
          },
          {
            id: '019782f8-c579-718e-af73-de15f6bb461b',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '019782f8-ce28-776d-836d-165f6a43d918',
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
                  id: '019782f8-ce28-776d-836d-192093fc18d0',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-1e590f912d39',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'адресс доставки',
                        },
                      },
                    ],
                    name: 'deliveryAddress',
                    dataType: '019782f8-c579-718e-af73-ed91348a2293',
                  },
                },
                {
                  id: '019782f8-ce28-776d-836d-21e43590147e',
                  eClass: 'classmodel:Reference',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-27617ce975da',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'пользователь',
                        },
                      },
                    ],
                    name: 'user',
                    target: '019782f8-c579-718e-af73-b96cd6d02510',
                  },
                },
                {
                  id: '019782f8-ce28-776d-836d-2a587231f60e',
                  eClass: 'classmodel:Reference',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-2de633842238',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'элементы заказа',
                        },
                      },
                    ],
                    name: 'items',
                    target: '019782f8-c579-718e-af73-e162958f6c83',
                  },
                },
              ],
              generals: [],
            },
          },
          {
            id: '019782f8-c579-718e-af73-e162958f6c83',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '019782f8-c579-718e-af73-e6fbe721080f',
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
                  id: '019782f8-ce28-776d-836d-30e8d814a74a',
                  eClass: 'classmodel:Reference',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-342fa8af21de',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'заказ',
                        },
                      },
                    ],
                    name: 'order',
                    target: '019782f8-c579-718e-af73-de15f6bb461b',
                  },
                },
                {
                  id: '019782f8-ce28-776d-836d-3ab78fae3319',
                  eClass: 'classmodel:Reference',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-3cab37fb324d',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'продукт',
                        },
                      },
                    ],
                    name: 'product',
                    target: '019782f8-c579-718e-af73-ebdb3ffc7daa',
                  },
                },
                {
                  id: '019782f8-ce28-776d-836d-412b9b945456',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-47b3fe8fa629',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'количество',
                        },
                      },
                    ],
                    name: 'quantity',
                    dataType: '019782f8-c579-718e-af73-f5efc1458c96',
                  },
                },
                {
                  id: '019782f8-ce28-776d-836d-48a00d83aaa8',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-4fa08a3437a1',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'стоимость',
                        },
                      },
                    ],
                    name: 'price',
                    dataType: '019782f8-c579-718e-af74-02f65b6bd403',
                  },
                },
              ],
              generals: [],
            },
          },
          {
            id: '019782f8-c579-718e-af73-ebdb3ffc7daa',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '019782f8-ce28-776d-836d-5063e214fea2',
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
                  id: '019782f8-ce28-776d-836d-57bc0965ab7c',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-59c219b33131',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'название',
                        },
                      },
                    ],
                    name: 'name',
                    dataType: '019782f8-c579-718e-af73-ed91348a2293',
                  },
                },
              ],
              generals: [],
            },
          },
          {
            id: '019782f8-ce28-776d-836d-5cde1ee43512',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '019782f8-ce28-776d-836d-61fda2459c7f',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'книга',
                  },
                },
              ],
              kind: 'Regular',
              name: 'Book',
              generals: ['019782f8-c579-718e-af73-ebdb3ffc7daa'],
              properties: [
                {
                  id: '019782f8-ce28-776d-836d-64479ebb49a3',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-69f2402929ce',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'автор',
                        },
                      },
                    ],
                    name: 'author',
                    dataType: '019782f8-c579-718e-af73-ed91348a2293',
                  },
                },
              ],
            },
          },
          {
            id: '019782f8-ce28-776d-836d-6c41f9064ad8',
            eClass: 'classmodel:Class',
            data: {
              localizedName: [
                {
                  id: '019782f8-ce28-776d-836d-731869d036e4',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'ручка',
                  },
                },
              ],
              kind: 'Regular',
              name: 'Pen',
              generals: ['019782f8-c579-718e-af73-ebdb3ffc7daa'],
              properties: [
                {
                  id: '019782f8-ce28-776d-836d-77f92ededbc7',
                  eClass: 'classmodel:Attribute',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-78727282e10f',
                        eClass: 'ecore:EStringToStringMapEntry',
                        data: {
                          key: 'ru-RU',
                          value: 'цвет',
                        },
                      },
                    ],
                    name: 'color',
                    dataType: '019782f8-ce28-776d-836d-86bf75d613e2',
                  },
                },
              ],
            },
          },
        ],
        dataTypes: [
          {
            id: '019782f8-c579-718e-af73-ed91348a2293',
            eClass: 'classmodel:StringType',
            data: {
              localizedName: [
                {
                  id: '019782f8-c579-718e-af73-f2a3229b0a7b',
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
            id: '019782f8-c579-718e-af73-f5efc1458c96',
            eClass: 'classmodel:NumericType',
            data: {
              localizedName: [
                {
                  id: '019782f8-c579-718e-af73-fa49b8821aaf',
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
            id: '019782f8-c579-718e-af73-fd00f5b674a0',
            eClass: 'classmodel:TimeType',
            data: {
              localizedName: [
                {
                  id: '019782f8-ce28-776d-836d-7df967b5fc7f',
                  eClass: 'ecore:EStringToStringMapEntry',
                  data: {
                    key: 'ru-RU',
                    value: 'дата',
                  },
                },
              ],
              name: 'Date',
              instantUnits: ['Year', 'Month', 'Day'],
              durationUnits: [],
            },
          },
          {
            id: '019782f8-c579-718e-af74-02f65b6bd403',
            eClass: 'classmodel:NumericType',
            data: {
              localizedName: [
                {
                  id: '019782f8-ce28-776d-836d-81241caa05b5',
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
            id: '019782f8-ce28-776d-836d-86bf75d613e2',
            eClass: 'classmodel:EnumeratedType',
            data: {
              localizedName: [
                {
                  id: '019782f8-ce28-776d-836d-89003ebdd49e',
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
                  id: '019782f8-ce28-776d-836d-8e4b43fdb02a',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-9032926f4369',
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
                  id: '019782f8-ce28-776d-836d-966f02f8e7c4',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-9bc20deaebd5',
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
                  id: '019782f8-ce28-776d-836d-9fac6c33cfc3',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-a09c0506c60f',
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
                  id: '019782f8-ce28-776d-836d-a6c9291a9954',
                  eClass: 'classmodel:EnumeratedTypeLiteral',
                  data: {
                    localizedName: [
                      {
                        id: '019782f8-ce28-776d-836d-a8e184c17e68',
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
