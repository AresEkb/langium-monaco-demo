export const classModelText = `@name('ru-RU', 'модель данных интернет-магазина')
classModel OnlineStore

@name('ru-RU', 'пользователь')
class User {

  @name('ru-RU', 'имя')
  attribute firstName String[0..1]

  @name('ru-RU', 'фамилия')
  attribute lastName String[0..1]

  @name('ru-RU', 'дата рождения')
  attribute birthDate Date[0..1]

  @name('ru-RU', 'электронная почта')
  attribute email String

}

@name('ru-RU', 'заказ')
class Order {

  @name('ru-RU', 'адресс доставки')
  attribute deliveryAddress String

  @name('ru-RU', 'пользователь')
  reference user User

  @name('ru-RU', 'элементы заказа')
  reference items OrderItem[0..*] opposite order

}

@name('ru-RU', 'элемент заказа')
class OrderItem {

  @name('ru-RU', 'заказ')
  reference order Order opposite items

  @name('ru-RU', 'продукт')
  reference product Product

  @name('ru-RU', 'количество')
  attribute quantity UnsignedInt

  @name('ru-RU', 'стоимость')
  attribute price Money

}

@name('ru-RU', 'продукт')
abstract class Product {

  @name('ru-RU', 'название')
  attribute name String

}

@name('ru-RU', 'книга')
class Book extends Product {

  @name('ru-RU', 'автор')
  attribute author String

}

@name('ru-RU', 'ручка')
class Pen extends Product {

  @name('ru-RU', 'цвет')
  attribute color Color

}

@name('ru-RU', 'строка')
string String {
}

@name('ru-RU', 'целое беззнаковое число')
numeric UnsignedInt {
  fractionDigits 0
  minInclusive 0
}

@name('ru-RU', 'дата')
time Date {
  instantUnits year month day
}

@name('ru-RU', 'денежный тип')
numeric Money {
  totalDigits 19
  fractionDigits 4
  minInclusive 0
}

@name('ru-RU', 'цвет')
enumerated Color {

  @name('ru-RU', 'красный')
  Red

  @name('ru-RU', 'зелёный')
  Green

  @name('ru-RU', 'синий')
  Blue

  @name('ru-RU', 'чёрный')
  Black

}
`;
