import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Grid,
  GridColumn as Column,
  GridToolbar
} from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";

import { Label, Error } from "@progress/kendo-react-labels";

import { sampleProducts } from "./sample-products.jsx";

const minMaxValidation = (value) => {
  if(value < 0 || value > 30){
    return false;
  }
  return true;
}
const CommandCell = (props) => (
  <td colspan="1">
    <Button
      className="button"
      size={"x-small"}
    
      onClick={() => {
     console.log("Click!");
      }}
    >
      ADD
    </Button>
  </td>
);
const ValidationCell = props => {
  const handleOnChange = e => {
    props.onChange({
      dataItem: props.dataItem,
      field: props.field,
      syntheticEvent: e.syntheticEvent,
      value: e.value
    });
  };
  return (
    <td>
      <NumericTextBox
        required
        value={props.dataItem[props.field]}
        onChange={handleOnChange}
      />
      {!props.validationLogic(props.dataItem[props.field])&& <Error>This is not valid</Error>}
    </td>
  );
};

class App extends React.Component {
  state = {
    data: [...sampleProducts],
    editID: null
  };

  MyValidationCell = (props) => <ValidationCell {...props} validationLogic={minMaxValidation}/>
  render() {
    return (
      <Grid
        style={{ height: "420px" }}
        data={this.state.data.map(item => ({
          ...item,
          inEdit: item.ProductID === this.state.editID
        }))}
        editField="inEdit"
        onRowClick={this.rowClick}
        onItemChange={this.itemChange}
      >
        <GridToolbar>
          <div onClick={this.closeEdit}>
            <button
              title="Add new"
              className="k-button k-primary"
              onClick={this.addRecord}
            >
              Add new
            </button>
          </div>
        </GridToolbar>
        <Column field="ProductID" title="Id" width="50px" editable={false} />
        <Column
          field="ProductName"
          title="Name"
        />
        <Column
          field="FirstOrderedOn"
          title="First Ordered"
          editor="date"
          format="{0:d}"
        />
        <Column
          field="UnitsInStock"
          title="Units"
          width="150px"
          cell={this.MyValidationCell}
        />
        <Column  width='auto' cell={CommandCell} />
        <Column field="Discontinued" title="Discontinued" editor="boolean" />
      </Grid>
    );
  }

  rowClick = event => {
    this.setState({
      editID: event.dataItem.ProductID
    });
  };

  itemChange = event => {
    const inEditID = event.dataItem.ProductID;
    const data = this.state.data.map(item =>
      item.ProductID === inEditID
        ? { ...item, [event.field]: event.value }
        : item
    );
    this.setState({ data });
  };

  closeEdit = event => {
    if (event.target === event.currentTarget) {
      this.setState({ editID: null });
    }
  };

  addRecord = () => {
    const { data } = this.state;
    const newRecord = { ProductID: data.length + 1 };

    this.setState({
      data: [newRecord, ...data],
      editID: newRecord.ProductID
    });
  };
}

ReactDOM.render(<App />, document.querySelector("my-app"));
