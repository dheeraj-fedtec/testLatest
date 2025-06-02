import FormTemplate from '~/components/formTemplate/formTemplate';
import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect, useActionData, useOutletContext, Form } from '@remix-run/react';
import { Accordion, HeadingLevel, Button, ButtonGroup } from '@trussworks/react-uswds';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';


// export const action = async ({ request }: ActionFunctionArgs) => {
//   // `action` will be called on form submit
//   const formData = await request.formData();

//   return redirect('/home/submit-expense/expense-info');
// };

export default function ExpenseDetailsPage() {
  // const actionData = useActionData<typeof action>();

  let navigate = useNavigate(); 
  const routeChange = (path:string) =>{ 
    navigate(path);
  }

  const [formData, setFormData] = useState({
      basicInfo: [
        {
          type: 'input',
          id: 'firstName',
          name: 'First Name',
          value: '',
          required: true
        },
        
        {
          type: 'input',
          id: 'lastName',
          name: 'Last Name',
          value: '',
          required: true
        },
        {
          type: 'input',
          id: 'middleInitial',
          name: 'Middle Initial',
          value: '',
        },
        {
          type: 'input',
          id: 'email',
          name: 'Email',
          value: '',
          required: true
        },
        {
          type: 'date',
          id: 'birthdate',
          name: 'Birth Date',
          value: '',
          required: true
        }
      ],
      expenseInfo: [[
        {
          type: 'select',
          id: 'category',
          name: 'Category',
          value: '',
          required: true,
          options: [{text: 'Travel', value: 'Travel'}, {text: 'Non-Travel', value: 'Non-Travel'}]
        },
        {
          type: 'input',
          id: 'amount',
          name: 'Amount',
          value: '',
          required: true
        },
        {
          type: 'input',
          id: 'location',
          name: 'Location',
          value: '',
          required: true
        },
        {
          type: 'date',
          id: 'date',
          name: 'Transaction Date',
          value: '',
          required: true
        },
        {
          type: 'textArea',
          id: 'description',
          name: 'Description',
          value: ''
        },
      ]],
      notes: [
        {
          type: 'textArea',
          id: 'notes',
          name: 'Notes',
          value: ''
        }
      ]
    })

  const getAccordionData = (data:any) => {
    const accordionData:any = [];
    data.forEach((entry:any, index:number) => {
      accordionData.push({
        title: `Expense ${index+1}`,
        content: <FormTemplate title={`Expense ${index+1}`} formFields={entry} handleChange={null} review={'/home/submit-expense/expense-info'} />,
        expanded: true,
        id: index,
        // className?: string
        headingLevel: 'h3' as HeadingLevel
        // handleToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void
      })
    })
    return accordionData
  }

  const handleChange = (fieldId: string, newValue: string) => {
    setFormData((prev: any) => {
      const updatedFields = prev.basicInfo.map((field: any) =>
        field.id === fieldId ? { ...field, value: newValue } : field
      );
      return { ...prev, basicInfo: updatedFields };
    });
  };

  return (
    <div className="grid-container">
      <Form className='form-container'>
        <FormTemplate title="Basic Info" formFields={formData.basicInfo} handleChange={null} review={'/home/submit-expense/basic-info'} />
        <Accordion multiselectable={true} items={getAccordionData(formData.expenseInfo)}></Accordion>
        <FormTemplate formFields={formData.notes} handleChange={handleChange} />
        <ButtonGroup style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="button">Reject</Button>
          <Button type="submit">Approve</Button>
        </ButtonGroup>
      </Form>
    </div>
  )
}
