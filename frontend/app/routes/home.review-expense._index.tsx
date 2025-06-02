import { Button, ButtonGroup, Icon } from "@trussworks/react-uswds";
import TableTemplate from "~/components/tableTemplate/tableTemplate";
import { useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { getSession } from "~/src/services/sessions";
import { expenseService } from "~/src/services/expense.service";
import { config, getBackendUrl } from "~/config";

type Expense = {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
  birthDate: string;
  category: string;
  amount: number;
  location: string;
  expenseDate: string;
  description: string;
};

type PageInfo = {
  content: Expense[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};

const mockResponse: PageInfo = {
  content: [
    {
      id: 1,
      userId: "a8c72f44-9ded-49ee-b7b4-9a9957a6fb2e",
      firstName: "test",
      lastName: "mctester",
      middleInitial: "s",
      birthDate: "2000-01-20",
      category: "TRAVEL",
      amount: 40.95,
      location: "Maryland",
      expenseDate: "2025-05-05",
      description: "Gucci Sunglasses",
    },
    {
      id: 2,
      userId: "a8c72f44-9ded-49ee-b7b4-9a9957a6fb2e",
      firstName: "test",
      lastName: "tester",
      middleInitial: "s",
      birthDate: "2000-01-20",
      category: "NON_TRAVEL",
      amount: 2000.95,
      location: "Virginia",
      expenseDate: "2025-05-06",
      description: "RTX 4090",
    },
    {
      id: 3,
      userId: "a8c72f44-9ded-49ee-b7b4-9a9957a6fb2e",
      firstName: "test",
      lastName: "tester",
      middleInitial: "n/a",
      birthDate: "2025-05-07",
      category: "TRAVEL",
      amount: 3434.0,
      location: "USA",
      expenseDate: "2025-05-07",
      description: "Starbucks",
    },
    {
      id: 4,
      userId: "a8c72f44-9ded-49ee-b7b4-9a9957a6fb2e",
      firstName: "test",
      lastName: "tester",
      middleInitial: "n/a",
      birthDate: "2025-05-07",
      category: "TRAVEL",
      amount: 3434.0,
      location: "USA",
      expenseDate: "2025-05-07",
      description: "Starbucks",
    },
    {
      id: 5,
      userId: "a8c72f44-9ded-49ee-b7b4-9a9957a6fb2e",
      firstName: "test",
      lastName: "tester",
      middleInitial: "",
      birthDate: "2025-05-07",
      category: "TRAVEL",
      amount: 3434.0,
      location: "USA",
      expenseDate: "2025-05-07",
      description: "Starbucks",
    },
    {
      id: 6,
      userId: "a8c72f44-9ded-49ee-b7b4-9a9957a6fb2e",
      firstName: "test",
      lastName: "tester",
      middleInitial: "asdf",
      birthDate: "2025-05-07",
      category: "TRAVEL",
      amount: 90000.0,
      location: "USA",
      expenseDate: "2025-05-10",
      description: "frontend test",
    },
    {
      id: 7,
      userId: "a8c72f44-9ded-49ee-b7b4-9a9957a6fb2e",
      firstName: "test",
      lastName: "tester",
      middleInitial: "P",
      birthDate: "2025-05-08",
      category: "TRAVEL",
      amount: 123.0,
      location: "USA",
      expenseDate: "2025-05-06",
      description: "sdfa",
    },
    {
      id: 8,
      userId: "a8c72f44-9ded-49ee-b7b4-9a9957a6fb2e",
      firstName: "test",
      lastName: "tester",
      middleInitial: "P",
      birthDate: "2025-04-30",
      category: "NON_TRAVEL",
      amount: 23523.0,
      location: "USA",
      expenseDate: "2025-05-24",
      description: "sdjfalksd",
    },
  ],
  pageable: {
    pageNumber: 0,
    pageSize: 20,
    sort: { empty: true, sorted: false, unsorted: true },
    offset: 0,
    unpaged: false,
    paged: true,
  },
  last: true,
  totalPages: 1,
  totalElements: 8,
  size: 20,
  number: 0,
  sort: { empty: true, sorted: false, unsorted: true },
  first: true,
  numberOfElements: 8,
  empty: false,
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const backendUrl = await getBackendUrl();
    const res = await fetch(`${backendUrl}/api/users`);
    if (!res.ok) {
      throw new Response("Could not load expenses", { status: res.status });
    }
    const data = await res.json();
    return json(data);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw new Response("Could not load expenses", { status: 500 });
  }
};

export default function ReviewExpense() {
  let navigate = useNavigate();
  const routeChange = (path: string) => {
    navigate(path);
  };

  const renderActionsButtons = (id: any, amount: number) => {
    if (amount > 500) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Button
            style={{ height: "1.5rem", width: "1.5rem" }}
            type="button"
            aria-label="View expense"
            unstyled
            onClick={() => routeChange(`/home/review-expense/${id}`)}
          >
            <Icon.Visibility size={3} aria-hidden={true} />
          </Button>
        </div>
      );
    }
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Button
          style={{ height: "1.5rem", width: "1.5rem" }}
          type="button"
          aria-label="View expense"
          unstyled
          onClick={() => routeChange(`/home/review-expense/${id}`)}
        >
          <Icon.Visibility size={3} aria-hidden={true} />
        </Button>
        <Button
          style={{ height: "1.5rem", width: "1.5rem", color: "green" }}
          type="button"
          aria-label="Approve expense"
          unstyled
        >
          <Icon.CheckCircle size={3} aria-hidden={true} />
        </Button>
        <Button
          style={{ height: "1.5rem", width: "1.5rem", color: "red" }}
          type="button"
          aria-label="Reject expense"
          unstyled
        >
          <Icon.Cancel size={3} aria-hidden={true} />
        </Button>
        <Button
          style={{ height: "1.5rem", width: "1.5rem", color: "black" }}
          type="button"
          aria-label="View history"
          unstyled
        >
          <Icon.History size={3} aria-hidden={true} />
        </Button>
      </div>
    );
  };

  const formatTableRows = (data: any[]) => {

    console.log(data);

    let newRowContent: any = [];

    data.forEach((user) => {
      let name = user["firstName"] + " " + user["lastName"];

      user["expenses"]?.forEach((expense: Record<string, any>) => {
        newRowContent.push({
          name: name,
          type: expense["category"],
          amount: expense["amount"],
          transactionDate: expense["expenseDate"],
          location: expense["location"],
          description: expense["description"],
          actions: renderActionsButtons(expense["id"], expense["amount"]),
        });
      });
    });
    return newRowContent;
  };

  // const formatTableRows = (data: any[]) => {
  //   const userData = data[0];
  //   const expenseData = data[0].expenses;
  //   // console.log(userData);
  //   // console.log(expenseData);
  //   // console.log("-----\n", data);
  //   const rows: any[] = [];
  //   expenseData?.forEach((entry: any) => {
  //     rows.push({
  //       name: `${userData.firstName} ${userData.lastName}`,
  //       type: entry.category,
  //       amount: entry.amount,
  //       dateCreated: entry.transactionDate,
  //       // dateUpdated: "4/1/2025",
  //       // status: ,
  //       actions: renderActionsButtons(entry.id, entry.amount),
  //     });
  //   });
  //   return rows;
  // };

  const [tableContent, setTableContent] = useState({
    cols: [
      { label: "Name", key: "name" },
      { label: "Type", key: "type" },
      { label: "Amount", key: "amount" },
      { label: "Transaction Date", key: "transactionDate" },
      //{ label: "Date Updated", key: "dateUpdated" },
      //{ label: "Status", key: "status" },
      { label: "Location", key: "location" },
      { label: "Description", key: "description" },
      { label: "Actions", key: "actions" },
    ],
    rows: formatTableRows(useLoaderData<any>()),
  });

  const expenseTabs = [
    { label: "Pending", id: 0 },
    { label: "Approved", id: 1 },
    { label: "All", id: 2 },
  ];

  const [activeTabId, setActiveTabId] = useState(0);

  return (
    <div className="grid-container">
      <h1>Expenses</h1>
      <ButtonGroup type="segmented" className="full-width-buttons">
        {expenseTabs.map((tab: any, i: number) => (
          <Button
            key={`tab-${i}`}
            type="button"
            className={activeTabId == tab.id ? "usa-button--active" : ""}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </ButtonGroup>
      <div>
        <TableTemplate
          title="Pending Expenses"
          tableData={tableContent}
        ></TableTemplate>
      </div>
    </div>
  );
}
