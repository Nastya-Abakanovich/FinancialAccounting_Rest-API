import React, {useEffect, useState} from 'react';
import Moment from 'moment';
import { FiTrash, FiEdit, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import './App.css';

// class InputForm extends React.Component {
//   render() {
//     return (
//       <form class="decor" name="inputData" 
//       // onSubmit={() => this.props.onSubmit(this)}
//       >
//         <div class="form-inner">
//             <h3>Введите данные</h3>
//             <input type="number" step="0.01" min="0" max="42949672.90" name="sum" placeholder="Сумма" required 
//             // onChange={() => this.props.onChange(this)}
//             />            
//             <input type="text" name="category" maxlength="50" placeholder="Категория"/>         
//             <input type="date" id="datePicker" name="date" placeholder="Дата" max="9999-12-31" />   
//             <textarea placeholder="Описание..." rows="6" name="description" ></textarea>  
//             <input type="radio" id="radio-1" name="type" value="expenses" checked />      
//             <label for="radio-1">Расходы</label>  
//             <input type="radio" id="radio-2" name="type" value="income" />      
//             <label for="radio-2">Доходы</label>

//             <input type="hidden" name="edit_id" />  
//             <input type="file" name="fileToUpload"/>
//             <input type="submit" value="Добавить" /> 
//         </div>
//     </form>
//     );
//   }
// }

class DataTable extends React.Component {
  constructor(props){
    super(props);
    var items = props.items;
    this.state = {items: items, itemsWithoutSorting: items, sortField: "", sortOrder: "asc"};
} 

handleSortingChange (newField) {
  let newSortOrder = "";
  if (newField === this.state.sortField) {
    if (this.state.sortOrder === "asc") {
      newSortOrder = "desc";
    }
    else {
      newSortOrder = "asc";
      newField = "";
    }
  } else {
    newSortOrder = "asc";
  }
  this.handleSorting(newField, newSortOrder);
  this.setState({sortField: newField, sortOrder: newSortOrder});  
};

handleSorting(newField, newSortOrder) {
  if (newField !== "") {
    let sorted = this.state.itemsWithoutSorting.slice();
    sorted = sorted.sort((a, b) => {
    return (
     a[newField].toString().localeCompare(b[newField].toString(), "ru", {
      numeric: true,
     }) * (newSortOrder === "asc" ? 1 : -1)
    );
   });
   this.setState({items: sorted});
  } else {
    this.setState({items: this.state.itemsWithoutSorting});
  }
 };

viewSortingRow(currField) {
  if (this.state.sortField === currField) {
    if (this.state.sortOrder === 'asc')
      return <FiChevronDown />;
    else 
    return <FiChevronUp />;
  } else {
    return "";
  }
};
 
  render() {
    return (
      <table class="table_sort">  
        <thead>
          <tr>
            <td width="130px" onClick={() => this.handleSortingChange("sum")}>Сумма {this.viewSortingRow("sum")}</td>
            <td width="150px" onClick={() => this.handleSortingChange("category")}>Категория {this.viewSortingRow("category")}</td>
            <td width="400px" onClick={() => this.handleSortingChange("description")}>Описание {this.viewSortingRow("description")}</td>
            <td width="100px" onClick={() => this.handleSortingChange("date")}>Дата {this.viewSortingRow("date")}</td>
            <td width="100px" onClick={() => this.handleSortingChange("income")}>Тип {this.viewSortingRow("income")}</td>
            <td width="100px">Файл</td>
            <td width="40px"></td>
            <td width="40px"></td>
          </tr> 
        </thead>
        <tbody>       
        {/* spendingId={item.spending_id}        */}
          {this.state.items.map((item) => (  
            <tr>       
            <td>{item.sum} BYN</td>
            <td>{item.category}</td>
            <td>{item.description}</td>
            <td>{Moment(item.date).format('DD.MM.YYYY')}</td>
            <td>{item.income ? "Доходы" : "Расходы"}</td>
            <td>{item.filename}</td>
            <td><FiTrash /></td>
            <td><FiEdit /></td> 
            </tr>  
          ))} 
        </tbody>  
      </table>
    );
  }
}

class MainPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { items: [{sum: 70, id:1}, {sum: 20, id:2}], sum: 10 };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // renderInputForm() {
  //   return (
  //     <InputForm
  //         // onSubmit={() => this.handleSubmit}
  //         // onChange={() => this.handleChange}
  //         // sum={this.state.sum}
  //     />
  //   );
  // }

  handleChange(e) {
    this.setState({ sum: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.sum === 0) {
      return;
    }
    const newItem = {
      sum: this.state.sum,
      id: Date.now()
    };
    this.setState(state => ({
      items: state.items.concat(newItem),
      sum: 0
    }));
  }

  render() {
    return (
      <div class="wrapper">
        <div class="content">
          {/* {this.renderInputForm()} */}
          <DataTable 
          // sums={this.props.sums}
          />
        </div> 
        <footer>Copyright &copy; 2023 | Made by Abakanovich</footer>
      </div>
    );
  }
}

function App() {
    const [backendData, setBackendData] = useState([{}]);
  
    useEffect(() => {
      fetch("/api").then(
        response => response.json()
      ).then(
        data => {
          setBackendData(data)
        }
      )
    }, [])
  
    return (
      <div>
        {/* {(typeof backendData.items === 'undefined') ? (
          <p>Loading...</p>
        ) : (
          backendData.items.map((item, i) => (
            <p key={i}>{item.user_id}, {item.spending_id}, {item.sum}, {item.date}, {item.category}, {item.description}, {item.income}, {item.filename}</p>
          ))  
        )} */}
        {(typeof backendData.items !== 'undefined') ? (
          <DataTable 
            items={backendData.items}
          />
        ) : (
          <p>Loading...</p> 
        )}
          
      </div>
    )
  }
  
  export default App;
  