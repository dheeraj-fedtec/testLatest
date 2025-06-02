import type { MetaFunction } from "@remix-run/node";
import {
  Button,
  StepIndicator,
  StepIndicatorStep,
} from "@trussworks/react-uswds";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "@remix-run/react";
import { useState } from "react";
import { LoaderFunction, redirect } from "@remix-run/node";
import { getSession } from "~/src/services/sessions";

// export const loader: LoaderFunction = async ({ request }) => {
//   const session = await getSession(request);
//   const token = session.get("access_token");

//   if (!token) return redirect("/login");
//   return null;
// };

export const meta: MetaFunction = () => {
  return [
    { title: "Expense Form" },
    { name: "description", content: "content" },
  ];
};

export default function ExpensesPage() {
  const location = useLocation();
  let navigate = useNavigate();
  const routeChange = (path: string) => {
    navigate(path);
  };

  const checkStepStatus = (id: number) => {
    const currentStep: any = wizardSteps.find((step) =>
      location.pathname.includes(step.route)
    );
    if (currentStep.id == id) return "current";
    if (currentStep.id > id) return "complete";
    return "incomplete";
  };

  const isBaseRoute = () => {
    return location?.pathname?.split("/").length === 3;
  };

  const wizardSteps = [
    {
      label: "Basic Info",
      route: "/basic-info",
      id: 0,
    },
    {
      label: "Expense Info",
      route: "/expense-info",
      id: 1,
    },
    {
      label: "Review",
      route: "/review",
      id: 2,
    },
  ];

  const [formData, setFormData] = useState({
    basicInfo: [
      {
        type: "input",
        id: "firstName",
        name: "First Name",
        value: "",
        required: true,
      },

      {
        type: "input",
        id: "lastName",
        name: "Last Name",
        value: "",
        required: true,
      },
      {
        type: "input",
        id: "middleInitial",
        name: "Middle Initial",
        value: "",
      },
      {
        type: "input",
        id: "email",
        name: "Email",
        value: "",
        required: true,
      },
      {
        type: "date",
        id: "birthdate",
        name: "Birth Date",
        value: "",
        required: true,
      },
    ],
    expenseInfo: [
      [
        {
          type: "select",
          id: "category",
          name: "Category",
          value: "",
          required: true,
          options: [
            { text: "Travel", value: "TRAVEL" },
            { text: "Non-Travel", value: "NON-TRAVEL" },
          ],
        },
        {
          type: "input",
          id: "amount",
          name: "Amount",
          value: "",
          required: true,
        },
        {
          type: "input",
          id: "location",
          name: "Location",
          value: "",
          required: true,
        },
        {
          type: "date",
          id: "transactionDate",
          name: "Transaction Date",
          value: "",
          required: true,
        },
        {
          type: "textArea",
          id: "description",
          name: "Description",
          value: "",
        },
      ],
    ],
  });

  return (
    <div className="grid-container">
      <h1>Submit an Expense</h1>
      {isBaseRoute() ? (
        <Button
          type="button"
          onClick={() => routeChange("/home/submit-expense/basic-info")}
        >
          New Expense
        </Button>
      ) : (
        <StepIndicator
          counters="default"
          headingLevel="h2"
          ofText="of"
          stepText="Step"
        >
          {wizardSteps.map((step: any) => (
            <StepIndicatorStep
              key={step.id}
              label={step.label}
              status={checkStepStatus(step.id)}
              onClick={() => routeChange("/home/submit-expense" + step.route)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </StepIndicator>
      )}
      <div>
        <Outlet context={{ formData, setFormData }} />
      </div>
    </div>
  );
}
