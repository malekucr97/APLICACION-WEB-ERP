export class baseEntity {

    Module : string;

    Attributes : AttributeEntity[];
}

export class AttributeEntity {

    Name : string;

    ObjectValue : object ;

    Type : AttributeType;
}

enum AttributeType {
    Nvarchar = 0,
    Integer = 1,
    Datetime = 2,
    Double = 3,
    Byte = 4
  }