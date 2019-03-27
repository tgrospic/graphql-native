import { FIELD } from './field'

// Item fields
export const fields = {
  id:        { type: FIELD.PK_NUM_SEQ, description: 'key' },
  itemId:    { type: FIELD.NUMBER,     description: 'self reference' },
  itype:     { type: FIELD.STRING,     description: 'item type' },
  valString: { type: FIELD.STRING,     description: 'string value' },
  valInt:    { type: FIELD.NUMBER,     description: 'integer value' },
  valDate:   { type: FIELD.DATE,       description: 'date value' },
  info:      { type: FIELD.STRING,     description: 'info/description' },
}
