import { FIELD } from './field'

// Order fields
export const fields = {
  id:        { type: FIELD.PK_NUM_SEQ, description: 'order identifier' },
  visitedAt: { type: FIELD.DATE,       description: 'order visited date' },
  note:      { type: FIELD.STRING,     description: 'order note' },
}

// OrderItem fields
export const itemFields = {
  id:          { type: FIELD.PK_NUM_SEQ, description: 'order item identifier' },
  code:        { type: FIELD.STRING,     description: 'product code' },
  name:        { type: FIELD.STRING,     description: 'name of the item' },
  description: { type: FIELD.STRING,     description: 'additional description' },
  quantity:    { type: FIELD.DECIMAL,    description: 'quantity' },
  measure:     { type: FIELD.STRING,     description: 'unit of measure' },
  price:       { type: FIELD.DECIMAL,    description: 'product price' },
  perPackage:  { type: FIELD.NUMBER,     description: 'number of items in the package' },
  perDay:      { type: FIELD.DECIMAL,    description: 'daily usage' },
  useDays:     { type: FIELD.NUMBER,     description: 'number of days to use the product' },
}

// OrderStatus fields
export const statusFields = {
  id:   { type: FIELD.PK_NUM_SEQ, description: 'status identifier' },
  name: { type: FIELD.STRING,     description: 'status name' },
  at:   { type: FIELD.DATE,       description: 'status date' },
}
