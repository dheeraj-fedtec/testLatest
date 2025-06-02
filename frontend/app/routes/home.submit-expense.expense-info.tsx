import FormTemplate from '~/components/formTemplate/formTemplate';
import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect, useActionData, useOutletContext, Form } from '@remix-run/react';
import { Accordion, HeadingLevel, Button, ButtonGroup } from '@trussworks/react-uswds';
import { useNavigate } from "react-router-dom";

export const action = async ({ request }: ActionFunctionArgs) => {
  // `action` will be called on form submit
  const formData = await request.formData();

  return redirect('/home/submit-expense/review');
};

export default function BasicInfoPage() {
  const actionData = useActionData<typeof action>();

  let navigate = useNavigate(); 
  const routeChange = (path:string) =>{ 
    navigate(path);
  }

  const { formData, setFormData } = useOutletContext<any>();

  const handleChange = (fieldId: string, newValue: string, index: number) => {
    setFormData((prev: any) => {
      const updatedEntry = prev.expenseInfo[index].map((field: any) =>
        field.id === fieldId ? { ...field, value: newValue } : field
      );

      const updatedExpenseInfo = [
        ...prev.expenseInfo.slice(0, index),
        updatedEntry,
        ...prev.expenseInfo.slice(index + 1)
      ];

      console.log(updatedExpenseInfo)

      return { ...prev, expenseInfo: updatedExpenseInfo };
    });
  };

  const addExpense = () => {
    setFormData((prev: any) => {
      const newExpense = [
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
          id: 'expenseDate',
          name: 'Expense Date',
          value: '',
          required: true
        },
        {
          type: 'input',
          id: 'description',
          name: 'Description',
          value: ''
        }
      ]
      return { ...prev, expenseInfo: [...prev.expenseInfo, newExpense] };
    });
  }

  const getAccordionData = (data:any) => {
    const accordionData:any = [];
    if (data) data.forEach((entry:any, index:number) => {
      accordionData.push({
        title: `Expense ${index+1}`,
        content: <FormTemplate title={`Expense ${index+1}`} formFields={entry} actionData={actionData} handleChange={(fieldId: string, value: string) => handleChange(fieldId, value, index)} />,
        expanded: true,
        id: index,
        headingLevel: 'h3' as HeadingLevel
      })
    })
    return accordionData
  }

  return (
    <Form method="post" className='form-container'>
      <Accordion multiselectable={true} items={getAccordionData(formData.expenseInfo)}></Accordion>
      <Button style={{ marginTop: '10px' }} type="button" onClick={() => addExpense()}>Add Expense</Button>
      <ButtonGroup style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="button" onClick={() => routeChange('/home/submit-expense/basic-info')}>Previous</Button>
        <Button type="submit">Next</Button>
      </ButtonGroup>
    </Form>
  )
}