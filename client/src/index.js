import React from 'react';
import ReactDOM from 'react-dom/client';
import { FiTrash, FiEdit } from 'react-icons/fi';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

class InputForm extends React.Component {
  render() {
    return (
      <form class="decor" name="inputData" 
      // onSubmit={() => this.props.onSubmit(this)}
      >
        <div class="form-inner">
            <h3>Введите данные</h3>
            <input type="number" step="0.01" min="0" max="42949672.90" name="sum" placeholder="Сумма" required 
            // onChange={() => this.props.onChange(this)}
            />            
            <input type="text" name="category" maxlength="50" placeholder="Категория"/>         
            <input type="date" id="datePicker" name="date" placeholder="Дата" max="9999-12-31" />   
            <textarea placeholder="Описание..." rows="6" name="description" ></textarea>  
            <input type="radio" id="radio-1" name="type" value="expenses" checked />      
            <label for="radio-1">Расходы</label>  
            <input type="radio" id="radio-2" name="type" value="income" />      
            <label for="radio-2">Доходы</label>

            <input type="hidden" name="edit_id" />  
            <input type="file" name="fileToUpload"/>
            <input type="submit" value="Добавить" /> 
        </div>
    </form>
    );
  }
}

class DataTable extends React.Component {
  render() {
    return (
      <table class="table_sort">  
        <thead>
          <tr>
            <td width="130px">Сумма</td>
            <td width="150px">Категория</td>
            <td width="400px">Описание</td>
            <td width="100px">Дата</td>
            <td width="100px">Тип</td>
            <td width="100px"></td>
            <td width="40px"></td>
            <td width="40px"></td>
          </tr> 
        </thead>
        <tbody>             
          {this.props.items.map(item => ( 
            <tr>       
            <td>{item.sum} BYN</td>
            <td>{item.id} ID</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
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

  renderInputForm() {
    return (
      <InputForm
          // onSubmit={() => this.handleSubmit}
          // onChange={() => this.handleChange}
          // sum={this.state.sum}
      />
    );
  }

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
          {this.renderInputForm()}
          <DataTable 
          items={this.state.items}
          />
        </div> 
        <footer>Copyright &copy; 2023 | Made by Abakanovich</footer>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    <MainPage/>
    <React.StrictMode>
      <App />
    </React.StrictMode>    
  </div>
);