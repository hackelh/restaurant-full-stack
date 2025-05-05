import './Form.css'

function Form({ fields, values, onChange, onSubmit, submitText = 'Enregistrer' }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={values[field.name] || ''}
              onChange={(e) => onChange({ ...values, [field.name]: e.target.value })}
              required={field.required}
              placeholder={field.placeholder}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={values[field.name] || ''}
              onChange={(e) => onChange({ ...values, [field.name]: e.target.value })}
              required={field.required}
            >
              <option value="">{field.placeholder || 'Sélectionner...'}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || 'text'}
              id={field.name}
              name={field.name}
              value={values[field.name] || ''}
              onChange={(e) => onChange({ ...values, [field.name]: e.target.value })}
              required={field.required}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              step={field.step}
            />
          )}
        </div>
      ))}
      <div className="form-actions">
        <button type="submit" className="submit-button">
          {submitText}
        </button>
      </div>
    </form>
  )
}

export default Form
