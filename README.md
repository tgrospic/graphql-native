# GraphQL native

## Start GraphQL server

```bash
npm install

npm start
```

## Examples

### Create user

[http://localhost:9876/graphql?query=createUser(...)](http://localhost:9876/graphql?query=mutation%20%7B%0A%20%20createUser(%0A%20%20%20%20value%3A%20%7B%0A%20%20%20%20%20%20firstName%3A%20%22pero%22%0A%20%20%20%20%20%20lastName%3A%20%22peri%C4%87%22%0A%20%20%20%20%20%20email%3A%20%22pero%40peric.com%22%0A%20%20%09%7D%0A%20%20)%20%7B%0A%20%20%20%20id%0A%20%20%20%20firstName%0A%20%20%20%20lastName%0A%20%20%20%20email%0A%20%20%20%20note%0A%20%20%7D%0A%7D)

```graphql
mutation {
  createUser(
    value: {
      firstName: "pero"
      lastName: "perić"
      email: "pero@peric.com"
  	}
  ) {
    id
    firstName
    lastName
    email
    note
  }
}
```

### Get users

[http://localhost:9876/graphql?query=users(...)](http://localhost:9876/graphql?query=query%20%7B%0A%20%20users(%0A%20%20%20%20limit%3A%2010%0A%20%20%20%20where%3A%20%7B%0A%20%20%20%20%20%20firstName%3A%20%7B%20like%3A%20%22pe%25%22%20%7D%0A%20%20%20%20%20%20createdAt%3A%20%7B%20gt%3A%20%222019-01-01%22%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20orderBy%3A%20%5B%5B%22createdAt%22%2C%20%22desc%22%5D%5D%0A%20%20)%20%7B%0A%20%20%20%20id%0A%20%20%20%20firstName%0A%20%20%20%20lastName%0A%20%20%20%20email%0A%20%20%20%20createdAt%0A%20%20%20%20orders%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20visitedAt%0A%20%20%20%20%20%20note%0A%20%20%20%20%20%20user%20%7B%0A%20%20%20%20%20%20%20%20firstName%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D)

```graphql
query {
  users(
    limit: 10
    where: {
      firstName: { like: "pe%" }
      createdAt: { gt: "2019-01-01" }
    }
    orderBy: [["createdAt", "desc"]]
  ) {
    id
    firstName
    lastName
    email
    createdAt
    orders {
      id
      visitedAt
      note
      user {
        firstName
      }
    }
  }
}
```

### Get schema types

[http://localhost:9876/graphql?query=__schema(...)](http://localhost:9876/graphql?query=query%20%7B%0A%20%20__schema%20%7B%0A%20%20%20%20types%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20kind%0A%20%20%20%20%20%20fields%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20description%0A%20%20%20%20%20%20%20%20type%20%7B%0A%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20kind%0A%20%20%20%20%20%20%20%20%20%20ofType%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D)

```graphql
query {
  __schema {
    types {
      name
      kind
      fields {
        name
        description
        type {
          name
          kind
          ofType {
            name
          }
        }
      }
    }
  }
}
```
