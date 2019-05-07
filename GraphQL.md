# GraphQL - uputa za upotrebu (promiješati prije ...:)

## Getting started

Opis kompletnog GraphQL servera. Definiranje sheme (type/query/mutation) i resolver-a.

https://www.howtographql.com/graphql-js/1-getting-started/

## **Basic** types

`BaseType ::= String | Int | Float | Boolean | ID`

Pregled baznih tipova.  
https://graphql.org/graphql-js/basic-types/

## **Object** types

`ObjectType ::= { String ":" (BaseType | ObjectType) }`

Pregled kako se kreiraju objekt (kompleksni) tipovi koji grupiraju više baznih ili samih objekt tipova.  
https://graphql.org/graphql-js/object-types/

Primjer: definicija `User` objekta u GraphQL query jeziku.

```livescript
type User {           # `User` je objektni tip
  id: ID!             # `id` je bazni tip `ID`
  firstName: String!  # `firstName` je bazni tip `String`
  createdBy: User!    # `createdBy` je objektni tip koji je istog tipa kao i njegov parent
}
```

## **Schema** i malo više o GQL query jeziku

https://graphql.org/learn/schema/

## **GraphQL API specifikacija** sa definicijama u GQL i primjerima korištenja u JS-u

Ovo je nama bitno jer ovaj API koristimo za komunikaciju s GraphQL-om.

https://graphql.github.io/graphql-js/type/

## Definicija tip-a na tri načina

GQL jezik

```livescript
type Person {
  firstName: String!
  bestFriend: Person
}
```

Pomoću GQL JS API-ja (u to se prevodi GQL jezik)

```js
const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    bestFriend: { type: PersonType },
  })
})
```

Definirano sa našim `Item` objektom (retkom)

```js
{
  itype: "ENTITY",
  valString: "Person",
  items: [{
    itype: "STRING",
    valString: "firstName",
  }, {
    itype: "Person",
    valString: "bestFriend", // ovo još ne možemo napravit jer nemamo linkova
  },
}
```