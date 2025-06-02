import { Table } from '@trussworks/react-uswds';
import styles from './tableTemplate.module.css';
import { useNavigate } from '@remix-run/react';


type TableTemplateProps = {
  title?: string,
  tableData?: { cols:any[]; rows:any[]; };
};

export default function TableTemplate({ title, tableData}: TableTemplateProps) {
  // let navigate = useNavigate(); 
  // const routeChange = (path:string) =>{ 
  //   navigate(path);
  // }

  const renderTableData = (data:any) => {
    return (
      <Table stackedStyle='default' scrollable bordered className={styles.table}>
        <caption>{title}</caption>
        <thead>
          <tr>
            {data.cols.map((col:any, i:number) => (
              <th key={`col-${i}`} scope="col">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row:any, i:number) =>
            <tr key={`row-${i}`}>
              {data.cols.map((col:any, j:number) => (
                <td key={`cell-${i}-${j}`}>{row[col.key]}</td>
              ))}
            </tr>
          )}
        </tbody>
      </Table>
    )
  }


  return (
    <div className={styles.tableTemplate}>
      {renderTableData(tableData)}
    </div>
  )
}
