import FormTemplate from "~/components/formTemplate/formTemplate";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  redirect,
  useActionData,
  useOutletContext,
  Form,
} from "@remix-run/react";
import {
  Accordion,
  HeadingLevel,
  Button,
  ButtonGroup,
} from "@trussworks/react-uswds";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { config, getBackendUrl } from "~/config";

export const action = async ({ request }: ActionFunctionArgs) => {
  // `action` will be called on form submit
  const formData = await request.formData();

  return redirect("/home/submit-expense/expense-info");
};

export default function BasicInfoPage() {
  const actionData = useActionData<typeof action>();

  let navigate = useNavigate();
  const routeChange = (path: string) => {
    navigate(path);
  };

  const { formData, setFormData } = useOutletContext<any>();

  const getAccordionData = (data: any) => {
    const accordionData: any = [];
    data.forEach((entry: any, index: number) => {
      accordionData.push({
        title: `Expense ${index + 1}`,
        content: (
          <FormTemplate
            title={`Expense ${index + 1}`}
            formFields={entry}
            actionData={actionData}
            handleChange={null}
            review={"/home/submit-expense/expense-info"}
          />
        ),
        expanded: true,
        id: index,
        // className?: string
        headingLevel: "h3" as HeadingLevel,
        // handleToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void
      });
    });
    return accordionData;
  };

  const convertDateFormat = (date: string) => {
    // const dateArray = date.split("/");
    const [month, day, year] = date.split("/");
    const iso = new Date(+year, +month - 1, +day).toISOString();

    return iso;
  };

  const onSubmit = () => {
    // console.log("submit clicked");

    // console.log(formData);

    const expenseData = formData.expenseInfo[0];
    const body: Record<string, any> = {};

    // console.log(expenseData);
    expenseData.forEach((element: any) => {
      if (element.id === "expenseDate") {
        body[element.id] = convertDateFormat(element.value);
      } else {
        // console.log(element.id, " ", element.value);
        body[element.id] = element.value;
      }
    });

    // console.log(body);

    sendExpense(body);
  };

  const sendExpense = async (body: any) => {
    try {
      const backendUrl = await getBackendUrl();
      const res = await fetch(`${backendUrl}/api/expenses/user/1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Response("Could not load expenses", { status: res.status });
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error sending expense:', error);
      throw new Response("Could not send expense", { status: 500 });
    }
  };

  return (
    <Form className="form-container">
      <FormTemplate
        title="Basic Info"
        formFields={formData.basicInfo}
        actionData={actionData}
        handleChange={null}
        review={"/home/submit-expense/basic-info"}
      />
      <Accordion
        multiselectable={true}
        items={getAccordionData(formData.expenseInfo)}
      ></Accordion>
      <ButtonGroup style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="button"
          onClick={() => routeChange("/home/submit-expense/expense-info")}
        >
          Previous
        </Button>
        <Button type="submit" onClick={onSubmit}>
          Submit
        </Button>
      </ButtonGroup>
    </Form>
  );
}
