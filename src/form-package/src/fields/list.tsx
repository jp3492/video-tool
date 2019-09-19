import React, { useState } from 'react'
import useForm, { Fields } from '../useForm'

export const List = ({
  id,
  formId,
  label,
  description,
  fields,
  value,
  onChange,
  onBlur,
  touched,
  error
}) => {
  const { valid, Form, getValues, resetForm } = useForm({ name: formId + "#" + id, fields })
  const [editingItem, setEditingItem] = useState(null)

  const handleAdd = values => {
    if (editingItem !== null) {
      onChange(id, value.map((v, i) => i === editingItem ? { ...v, ...values } : v))
      resetForm()
      setEditingItem(null)
    } else {
      onChange(id, [...value, values])
      resetForm()
    }
  }

  const handleRemove = index => onChange(id, value.filter((v, i) => i !== index))

  const handleEdit = index => {
    setEditingItem(index)
    resetForm(value.find((v, i) => i === index))
  }

  return (
    <div
      onBlur={() => onBlur(id)}
      className={`rf-list field-${id}`}>
      <label className="rf-field-label">
        {label}
      </label>
      <span className="rf-field-description">
        {description}
      </span>
      <Form />
      <button onClick={() => handleAdd(getValues())} disabled={!valid}>
        {
          editingItem !== null ?
            "Update Item" :
            "Add Item"
        }
      </button>
      <ul>
        {
          value.map((v, i) => (
            <li>
              <label>
                {JSON.stringify(v)}
              </label>
              <b onClick={() => handleEdit(i)}>
                Edit
              </b>
              <b onClick={() => handleRemove(i)}>
                Remove
              </b>
            </li>
          ))
        }
      </ul>
      <span className="rf-field-error">
        {touched ? error : null}
      </span>
    </div>
  )
}

// export const List = ({
//   id,
//   formId,
//   label,
//   description,
//   fields,
//   getListValues,
//   value,
//   onChange,
//   onBlur
// }) => {
//   const [editing, setEditing]: [any, any] = useState([])

//   const valid = useListSubscription(formId, id)

//   const handleAdd = () => onChange(id, [...value, getListValues(formId, id)])

//   const handleEdit = index => {
//     if (editing.includes(index)) {
//       setEditing(editing.filter(e => e !== index))
//     } else {
//       setEditing([...editing, index])
//     }
//   }
//   console.log(value);

//   const handleRemove = index => onChange(id, value.filter((v, i) => i !== index))
//   console.log(fields);

//   return (
//     <div className={`rf-multiple-select field-${id}`}>
//       <label>
//         {label}
//       </label>
//       <span>
//         {description}
//       </span>
//       <Fields
//         fields={fields}
//         type="list"
//         id={id}
//         prefix={id} />
//       <ul>
//         {
//           value.map((v, i) => {

//             return (
//               <li key={i}>
//                 <label>
//                   {JSON.stringify(v)}
//                 </label>
//                 <b onClick={() => handleEdit(i)}>
//                   Edit
//               </b>
//                 <b onClick={() => handleRemove(i)}>
//                   X
//               </b>
//               </li>
//             )
//           })
//         }
//       </ul>
//       <button onClick={handleAdd}>
//         Add
//       </button>
//     </div>
//   )
// }