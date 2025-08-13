export const simplifiedClassModelGrammar = `grammar CM

entry ClassModel:
    Localization*
    'classModel' name=ID
    (classes+=Class | dataTypes+=DataType)*;

Class:
    Localization*
    kind=ClassKind name=ID ('extends' generals+=[Class:ID] (',' generals+=[Class:ID])*)? ('{'
        properties+=Property*
    '}')?;

ClassKind:
    {infer ClassKind__Regular} 'class' |
    {infer ClassKind__Abstract} 'abstract' 'class' |
    {infer ClassKind__Interface} 'interface';

Property:
    Attribute | Reference;

Attribute:
    Localization*
    'attribute' name=ID dataType=[DataType:ID] Multiplicity?;

Reference:
    Localization*
    kind=ReferenceKind name=ID target=[Class:ID] Multiplicity?;

ReferenceKind:
    {infer ReferenceKind__Association} 'reference' |
    {infer ReferenceKind__Composition} 'composition' |
    {infer ReferenceKind__Aggregation} 'aggregation';

fragment Multiplicity:
    '[' lower=Natural ('..' upper=UnlimitedNatural)? ']';

DataType:
    StringType | NumericType | BooleanType | TimeType | UuidType | EnumeratedType;

StringType:
    Localization*
    'string' name=ID ('{'
        ('length' length=Natural)?
        ('minLength' minLength=Natural)?
        ('maxLength' maxLength=Natural)?
        ('pattern' pattern=STRING)?
    '}')?;

NumericType:
    Localization*
    'numeric' name=ID ('{'
        ('size' size=Natural)?
        ('totalDigits' totalDigits=Natural)?
        ('fractionDigits' fractionDigits=Natural)?
        ('minInclusive' minInclusive=Numeric)?
        ('minExclusive' minExclusive=Numeric)?
        ('maxInclusive' maxInclusive=Numeric)?
        ('maxExclusive' maxExclusive=Numeric)?
        ('measurementUnit' pattern=STRING)?
    '}')?;

BooleanType:
    Localization*
    'boolean' name=ID ('{' '}')?;

TimeType:
    Localization*
    'time' name=ID ('{'
        ('instantUnits' instantUnits+=TimeUnit+)?
        ('instantFractionDigits' instantFractionDigits=Natural)?
        ('durationUnits' durationUnits+=TimeUnit+)?
        ('durationFractionDigits' durationFractionDigits=Natural)?
        ('recurrence' recurrence=TimeUnit)?
    '}')?;

TimeUnit:
    {infer TimeUnit__Year} 'year' |
    {infer TimeUnit__Quarter} 'quarter' |
    {infer TimeUnit__Month} 'month' |
    {infer TimeUnit__Week} 'week' |
    {infer TimeUnit__Day} 'day' |
    {infer TimeUnit__Hour} 'hour' |
    {infer TimeUnit__Minute} 'minute' |
    {infer TimeUnit__Second} 'second';

UuidType:
    Localization*
    'uuid' name=ID ('{' '}')?;

EnumeratedType:
    Localization*
    'enumerated' name=ID ('{'
        literals+=EnumeratedTypeLiteral*
    '}')?;

EnumeratedTypeLiteral:
    Localization*
    name=ID;

fragment Localization:
    '@name' '(' localizedName+=Ecore_EStringToStringMapEntry ')' |
    '@description' '(' localizedDescription+=Ecore_EStringToStringMapEntry ')';

Ecore_EStringToStringMapEntry:
    key=STRING ',' value=STRING;

Numeric returns number:
    '-'? (INT | DECIMAL);

Natural returns number:
    INT;

UnlimitedNatural returns number:
    INT | '*';

terminal ID: /[_a-zA-Z][\\w_]*/;
terminal STRING: /'(\\\\.|[^'])*'/;
terminal INT returns number: /\\d+/;
terminal DECIMAL returns number: /(\\d*\\.\\d+|\\d+\\.\\d*)/;

hidden terminal WS: /\\s+/;
hidden terminal SL_COMMENT: /\\/\\/[^\\n\\r]*/;
hidden terminal ML_COMMENT: /\\/\\*[\\s\\S]*?\\*\\//;
`;
