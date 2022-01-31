# GraphQL - quick introduction

## Getting started

Description of complete GraphQL server. Schema definition (type/query/mutation) and resolvers.

https://www.howtographql.com/graphql-js/1-getting-started/

## **Basic** types

`BaseType ::= String | Int | Float | Boolean | ID`

Overview of base types.  
https://graphql.org/graphql-js/basic-types/

## **Object** types

`ObjectType ::= { String ":" (BaseType | ObjectType) }`

More about _complex_ objects which groups more base or object types.  
https://graphql.org/graphql-js/object-types/

Example: definition of `User` object in GraphQL query language.

```livescript
type User {           # `User` je objektni tip
  id: ID!             # `id` je bazni tip `ID`
  firstName: String!  # `firstName` je bazni tip `String`
  createdBy: User!    # `createdBy` je objektni tip koji je istog tipa kao i njegov parent
}
```

## **Schema** and more about GraphQL

https://graphql.org/learn/schema/

## **GraphQL API specification** with definitions in GQL and examples in JS

This is of our interest here for use in communication with GraphQL.  
https://graphql.github.io/graphql-js/type/

## Two ways of defining a type in GQL

GQL language

```livescript
type Person {
  firstName: String!
  bestFriend: Person
}
```

GQL JS API (this is where GQL language is translated)

```js
const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    bestFriend: { type: PersonType },
  })
})
```

## Dynamic way to generate GQL schema (types)

The schema is stored in SQLite in one generic table `items` and represented
in JS as `Item` object.

```js
{
  itype: "ENTITY",
  valString: "Person",
  items: [{
    itype: "STRING",
    valString: "firstName",
  }, {
    itype: "Person",
    valString: "bestFriend", // for this links should be added
  },
}
```
