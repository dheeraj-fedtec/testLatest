import { Button, TextInput, Label, Select, DatePicker, Textarea } from '@trussworks/react-uswds';
import styles from './formTemplate.module.css';
import { useNavigate } from '@remix-run/react';


type FormTemplateProps = {
  title?: string,
  formFields: { type: string; id: string; name: string; value: string, }[];
  actionData?:any;
  handleChange:any;
  review?:string;
};

export default function FormTemplate({ title, formFields, actionData, handleChange, review }: FormTemplateProps) {
  let navigate = useNavigate(); 
  const routeChange = (path:string) =>{ 
    navigate(path);
  }

  const renderField = (field:any) => {
    if (review)  return (
      <div key={field.name}>
        <Label htmlFor={field.id}>{field.name}</Label>
        <TextInput id={field.id} name={field.id} type="text" disabled value={field.value || ''} />
        {actionData?.errors?.[field.id] && (
          <span className="usa-error-message">{actionData.errors[field.id]}</span>
        )}
      </div>
    )
    switch (field.type) {
      case 'input':
        return (
          <div key={field.name}>
            <Label htmlFor={field.id}>
              {field.name}
              <span style={{ color: 'red' }}>{field.required ? ' *' : ''}</span>
            </Label>
            <TextInput
              id={field.id}
              name={field.id}
              type="text"
              required={field.required}
              value={field.value || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
            {actionData?.errors?.[field.id] && (
              <span className="usa-error-message">{actionData.errors[field.id]}</span>
            )}
          </div>
        );
      case 'date':
        return (
          <div key={field.name}>
            <Label htmlFor={field.id}>
              {field.name}
              <span style={{ color: 'red' }}>{field.required ? ' *' : ''}</span>
            </Label>
            <DatePicker
              id={field.id}
              name={field.id}
              required={field.required}
              value={field.value || ''}
              onChange={(e) => handleChange(field.id, e)}
            />
          </div>
        );
      case 'select':
        return (
          <div key={field.name}>
            <Label htmlFor={field.id}>
              {field.name}
              <span style={{ color: 'red' }}>{field.required ? ' *' : ''}</span>
            </Label>
            <Select
              id={field.id}
              name={field.id}
              required={field.required}
              value={field.value || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
            >
              <option value={''}>
                - Select -{' '}
              </option>
              {field.options.map((option:any) => (
                <option key={option.value} value={option.value}>
                 {option.text}
               </option>
              ))}
            </Select>
          </div>
        )
      case 'textArea':
        return (
          <div key={field.name} style={{ gridColumn: 'span 3' }}>
            <Label htmlFor={field.id}>
              {field.name}
              <span style={{ color: 'red' }}>{field.required ? ' *' : ''}</span>
            </Label>
            <Textarea
              id={field.id}
              name={field.id}
              required={field.required}
              value={field.value || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
            {actionData?.errors?.[field.id] && (
              <span className="usa-error-message">{actionData.errors[field.id]}</span>
            )}
          </div>
        );
      case 'review':
        return (
          <div key={field.name}>
            <Label htmlFor={field.id}>{field.name}</Label>
            <TextInput id={field.id} name={field.id} type="text" disabled value={field.value || ''} />
            {actionData?.errors?.[field.id] && (
              <span className="usa-error-message">{actionData.errors[field.id]}</span>
            )}
          </div>
        )
      default:
        return null;
    }
  }


  return (
    <div className={styles.form}>
      {title ? (<h2>
        { title }
        {review ? (<Button style={{ marginLeft: '5px' }} type="button" onClick={() => routeChange(review)} unstyled>Edit</Button>) : null}
      </h2>) : null}
      <div className={styles.formFields}>
        {formFields && formFields.map((field) => renderField(field))}
      </div>
    </div>
  )
}
