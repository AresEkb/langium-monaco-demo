export const dslSample = `classModel model1

@name('ru-RU', 'тест')
@description('ru-RU', 'описание')
@name('fr-FR', 'french')
class Cls extends Qwe, Zxc, Rty {
  @name('ru-RU', 'атрибут')
  attribute a1 String100
  @name('ru-RU', 'ссылка')
  reference r1 Cls
  attribute a2 Int
}

abstract class Qwe {
}

@name('ru-RU', 'интерфейс')
interface Zxc {
}

interface Rty {
}

@name('ru-RU', 'строка')
string String100 {
  length 100
  pattern 'q\\\\we\\'c\\n"c'
}

@name('ru-RU', 'целое')
numeric Int {
  fractionDigits 0
}

time Date {
  instantUnits year month day
}

enumerated Enum {
  literal1
  @name('ru-RU', 'литерал2')
  literal2
}
`;
