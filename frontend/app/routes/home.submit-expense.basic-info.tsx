import FormTemplate from '~/components/formTemplate/formTemplate';
import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect, useActionData, useOutletContext, Form } from '@remix-run/react';
import { Button, ButtonGroup } from '@trussworks/react-uswds';


const validateBasicInfo = (formData:any) => {
  const errors: Record<string, string> = {};

  const email = formData.get('email');

  if (!email || typeof email !== "string") {
    errors.email = "Email is required.";
  } else if (!email.includes("@")) {
    errors.email = "Please enter a valid email.";
  }

  return errors
}

export const action = async ({ request }: ActionFunctionArgs) => {
  // `action` will be called on form submit
  const formData = await request.formData();

  const errors = validateBasicInfo(formData);
  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  return redirect('/home/submit-expense/expense-info');
};

export default function BasicInfoPage() {
  const actionData = useActionData<typeof action>();

  const { formData, setFormData } = useOutletContext<any>();

  const handleChange = (fieldId: string, newValue: string) => {
    setFormData((prev: any) => {
      const updatedFields = prev.basicInfo.map((field: any) =>
        field.id === fieldId ? { ...field, value: newValue } : field
      );
      return { ...prev, basicInfo: updatedFields };
    });
  };

  return (
    <Form method="post" className='form-container'>
      <FormTemplate title="Basic Info" formFields={formData.basicInfo} actionData={actionData} handleChange={handleChange} />
      <ButtonGroup style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit">Next</Button>
      </ButtonGroup>
    </Form>
  )
}
