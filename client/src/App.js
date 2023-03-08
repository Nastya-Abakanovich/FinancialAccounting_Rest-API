import React, {useEffect, useState} from 'react';
import Moment from 'moment';
import { FiTrash, FiEdit, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import './App.css';

class InputForm extends React.Component {
  constructor(props){
    super(props);
    this.onChange = this.handleChange.bind(this);
    this.onSubmit = this.handleSubmit.bind(this);
    this.state = {body: {sum: "", category: "", description: "", date: "", type: "expenses", filename: null}};
  }

  handleChange (e) {
    var newBody = this.state.body;
    newBody[e.target.name] = e.target.value;
    this.setState({body: newBody});     
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.addPosts(this.state.body);
    this.setState({body: {sum: "", category: "", description: "", date: "", type: "expenses", filename: null}});  
  };  
  
  render() {
    console.log('RENDER: '+this.state.body.sum)
    return (
      <form className="decor" name="inputData" 
        onSubmit={this.onSubmit}
      >
        <div className="form-inner">
            <h3>Введите данные</h3>
            <input type="number" step="0.01" min="0" max="42949672.90" name="sum" placeholder="Сумма" required 
            onChange={this.onChange} value={this.state.body.sum}
            />            
            <input type="text" name="category" maxLength="50" placeholder="Категория" onChange={this.onChange} value={this.state.body.category}/>         
            <input type="date" id="datePicker" name="date" placeholder="Дата" max="9999-12-31" onChange={this.onChange} value={this.state.body.date}/>   
            <textarea placeholder="Описание..." rows="6" name="description" onChange={this.onChange} value={this.state.body.description}></textarea>  
            <input type="radio" id="radio-1" name="type" value="expenses" checked={this.state.body.type === "expenses"} onChange={this.onChange}/>      
            <label htmlFor="radio-1">Расходы</label>  
            <input type="radio" id="radio-2" name="type" value="income" checked={this.state.body.type === "income"} onChange={this.onChange}/>      
            <label htmlFor="radio-2">Доходы</label>

            <input type="hidden" name="edit_id" />  
            <input type="file" name="fileToUpload"/>
            <input type="submit" value="Добавить" /> 
        </div>
    </form>
    );
  }
}

class DataTable extends React.Component {
  constructor(props){
    super(props);
    var items = props.items;
    this.state = {items: items, sortField: "", sortOrder: "asc"};
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.sortField !== "") {
      let sorted = nextProps.items.slice();
      sorted = sorted.sort((a, b) =>    
        a[this.state.sortField].toString().localeCompare(b[this.state.sortField].toString(), "ru", {
          numeric: true,
        }) * (this.state.sortOrder === "asc" ? 1 : -1)        
      );
      this.setState({items: sorted}); }
    else
      this.setState({items: nextProps.items});
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
      let sorted = this.props.items.slice();
      sorted = sorted.sort((a, b) => 
        a[newField].toString().localeCompare(b[newField].toString(), "ru", 
        {numeric: true,}) * (newSortOrder === "asc" ? 1 : -1)
      );
      this.setState({items: sorted});
    } else {
      this.setState({items: this.props.items});
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
      <table className="table_sort">  
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
          {this.state.items.map((item) => (  
            <tr key={item.spending_id}>       
            <td>{item.sum/100} BYN</td>
            <td>{item.category}</td>
            <td>{item.description}</td>
            <td>{Moment(item.date).format('DD.MM.YYYY')}</td>
            <td>{item.income ? "Доходы" : "Расходы"}</td>
            <td>{item.filename}</td>
            <td><FiTrash onClick={() => this.props.onClickDelete(item.spending_id)} /></td>
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
    // this.state = { backendData: []};
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
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

  // handleChange(e) {
  //   this.setState({ sum: e.target.value });
  // }

  // handleSubmit(e) {
  //   e.preventDefault();
  //   if (this.state.sum === 0) {
  //     return;
  //   }
  //   const newItem = {
  //     sum: this.state.sum,
  //     id: Date.now()
  //   };
  //   this.setState(state => ({
  //     items: state.items.concat(newItem),
  //     sum: 0
  //   }));
  // }

}

function App() {
  const [items, setItems] = useState([]);
  
    useEffect(() => {
      fetch("/api", {method: "GET"})
        .then(response => response.json())
        .then(data => { setItems(data.items) })
    }, [])

    const deleteItem = async (id) => {
       await fetch('/api/' + id,{ method: 'DELETE',})
        .then((response) => {
            if (response.status === 200) {
             setItems(actualItems => actualItems.filter(data => data.spending_id !== id));
            }
        }); 
      };

      const addPosts = async (body) => {

        await fetch('/api', {
           method: 'POST',
           body: JSON.stringify(body),
           headers: {
              'Content-type': 'application/json; charset=UTF-8',
           },
        })
           .then((response) => response.json())
           .then((data) => {
            // if (response.status === 200) {
              var newBody = body;
              newBody["spending_id"] = data.spending_id;
              newBody["sum"] *= 100;
              setItems((items) => [...items, newBody]);
              // setBody({sum: "", category: "", description: "", date: "", type: "expenses", filename: null});
            // }
           })
           .catch((err) => {
              console.log(err.message);
           });
     };

    return (
      <div className="wrapper">
        <div className="content">
          <InputForm 
            addPosts={addPosts}
          />
          {(items.length !== 0) ? (
          <DataTable 
            items={items}
            onClickDelete={deleteItem}
          />          
        ) : (
          <p>Loading...</p> 
        )}  
        </div> 
        <footer>Copyright &copy; 2023 | Made by Abakanovich</footer>   
      </div>
    )
  }

  export default App; 