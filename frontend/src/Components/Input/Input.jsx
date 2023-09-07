import React from 'react'

export default function Input({name, type, placeholder, required, action}) {
  return (
    <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        {...action}
    />
  )
}
