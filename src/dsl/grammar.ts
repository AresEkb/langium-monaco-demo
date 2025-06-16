export const dslGrammar = `grammar ClassModel

entry ClassModel:
    _NL? Localization* _NL?
    'classModel' name=ID
    (classes+=Class | dataTypes+=DataType)*;

Class:
    _NL? Localization* _NL?
    kind=ClassKind name=ID ('extends' generals+=[Class:ID] (',' generals+=[Class:ID])*)? ('{'
        properties+=Property*
    _NL? _NL? '}')?;

ClassKind:
    {infer ClassKind__Regular} 'class' |
    {infer ClassKind__Abstract} 'abstract' 'class' |
    {infer ClassKind__Interface} 'interface';

Property:
    Attribute | Reference;

Attribute:
    _NL? Localization* _NL?
    'attribute' name=ID dataType=[DataType:ID];

Reference:
    _NL? Localization* _NL?
    'reference' name=ID target=[Class:ID];

DataType:
    StringType | NumericType | BooleanType | TimeType | UuidType | EnumeratedType;

StringType:
    _NL? Localization* _NL?
    'string' name=ID ('{'
        (_NL? 'length' length=INT)?
        (_NL? 'minLength' minLength=INT)?
        (_NL? 'maxLength' maxLength=INT)?
        (_NL? 'pattern' pattern=STRING)?
    _NL? '}')?;

NumericType:
    _NL? Localization* _NL?
    'numeric' name=ID ('{'
        (_NL? 'size' size=INT)?
        (_NL? 'totalDigits' totalDigits=INT)?
        (_NL? 'fractionDigits' fractionDigits=INT)?
        (_NL? 'minInclusive' minInclusive=INT)?
        (_NL? 'minExclusive' minExclusive=INT)?
        (_NL? 'maxInclusive' maxInclusive=INT)?
        (_NL? 'maxExclusive' maxExclusive=INT)?
        (_NL? 'measurementUnit' pattern=STRING)?
    _NL? '}')?;

BooleanType:
    _NL? Localization* _NL?
    'boolean' name=ID ('{' _NL? '}')?;

TimeType:
    _NL? Localization* _NL?
    'time' name=ID ('{'
        (_NL? 'instantUnits' instantUnits+=TimeUnit+)?
        (_NL? 'instantFractionDigits' instantFractionDigits=INT)?
        (_NL? 'durationUnits' durationUnits+=TimeUnit+)?
        (_NL? 'durationFractionDigits' durationFractionDigits=INT)?
        (_NL? 'recurrence' recurrence=TimeUnit)?
    _NL? '}')?;

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
    _NL? Localization* _NL?
    'uuid' name=ID ('{' _NL? '}')?;

EnumeratedType:
    _NL? Localization* _NL?
    'enumerated' name=ID ('{'
        literals+=EnumeratedTypeLiteral*
    _NL? _NL? '}')?;

EnumeratedTypeLiteral:
    _NL? Localization* _NL?
    name=ID;

fragment Localization:
    _NL? '@name' '(' localizedName+=Ecore_EStringToStringMapEntry ')' |
    _NL? '@description' '(' localizedDescription+=Ecore_EStringToStringMapEntry ')';

Ecore_EStringToStringMapEntry:
    key=STRING ',' value=STRING;

_NL returns string: '__NL__';

terminal ID: /[_a-zA-Z][\\w_]*/;
terminal INT: /\\d+/;
terminal STRING: /'(\\\\.|[^'])*'/;

hidden terminal WS: /\\s+/;
hidden terminal ML_COMMENT: /\\/\\*[\\s\\S]*?\\*\\//;
hidden terminal SL_COMMENT: /\\/\\/[^\\n\\r]*/;
`;
