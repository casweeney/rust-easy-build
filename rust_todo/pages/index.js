import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit, MdConfirmationNumber } from "react-icons/md";
import axios from "axios";
import { format } from "date-fns";

// Import Components
import CheckBox from "../Components/CheckBox";

const index = () => {
  const [editText, setEditText] = useState();
  const [todos, setTodos] = useState([]);
  const [todosCopy, setTodosCopy] = useState(todos);
  const [todoInput, setTodoInput] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // state management
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState(search);

  useEffect(() => {
    fetchTodo()
  }, [count]);

  const editTodo = (index) => {
    setTodoInput(todos[index].title);
    setEditIndex(index);
  }

  const fetchTodo = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/todos");

      setTodos(response.data);
      setTodosCopy(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const addTodo = async () => {
    try {

      if(editIndex === -1) {
        console.log(todoInput)
        // Add new todo
        const response = await axios.post("http://127.0.0.1:8080/todos", {
          title: todoInput,
          completed: false
        });
        setTodos(response.data);
        setTodosCopy(response.data);
        setTodoInput("");
      } else {
        // Update existing todo
        const todoToUpdate = {...todos[editIndex], title: todoInput};
        const response = await axios.put(`http://127.0.0.1:8080/todos/${todoToUpdate.id}`, todoToUpdate);

        console.log(response);
        const updatedTodos = [...todos];
        updatedTodos[editIndex] = response.data;
        setTodos(updatedTodos);
        setTodoInput("");
        setEditIndex(-1);
        setCount(count + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8080/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  const toggleCompleted = async (index) => {
    try {
      const todoToUpdate = {
        ...todos[index],
        completed: !todos[index].completed
      };
      const response = await axios.put(`http://127.0.0.1:8080/todos/${todoToUpdate.id}`, todoToUpdate);
      const updatedTodos = [...todos];
      updatedTodos[index] = response.data;
      setTodos(updatedTodos);
      setCount(count + 1);
    } catch (error) {
      console.log(error);
    }
  }

  const searchTodo = async () => {
    const results = todos.filter((todo) => todo.title.toLowerCase().includes(searchInput.toLowerCase()));
    setSearchResults(results);
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid date" : format(date, "yyyy-MM-dd HH:mm:ss");
    } catch (error) {
      console.log(error);
    }
  }

  const renderTodos = (todosToRender) => {

    console.log(todosToRender);

    return todosToRender.map((todo, index) => (
      <li key={index} className="li">
        <CheckBox toggleCompleted={toggleCompleted} index={index} todo={todo} />
        <label htmlFor="" className="form-check-label"></label>
        <span className="todo-text">
          {`${todo.title} ${formatDate(todo.created_at)}`}
        </span>
        <span className="span-button" onClick={() => deleteTodo(todo.id)}>
          <i className="fa-solid fa-trash">
            <MdDelete />
          </i>
        </span>
        <span className="span-button" onClick={() => editTodo(index)}>
          <i className="fa-solid fa-trash">
            <MdEdit />
          </i>
        </span>
      </li>
    ))
  }

  const onHandleSearch = (value) => {
    const filteredTodo = todos.filter(({title}) => title.toLowerCase().includes(value.toLowerCase()));
    if(filteredTodo.length === 0) {
      setTodos(todosCopy);
    } else {
      setTodos(filteredTodo);
    }
  }

  const onClearSearch = () => {
    if(todos.length && todosCopy.length) {
      setTodos(todosCopy);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchItem), 1000);
    return () => clearTimeout(timer);
  }, [searchItem]);

  useEffect(() => {
    if(search) {
      onHandleSearch(search);
    } else {
      onClearSearch();
    }
  }, [search]);

  return <div className="main-body">
    <div className="todo-app">
      <div className="input-section">
        <input type="text" id="todoInput" placeholder="Add item..." value={todoInput} onChange={(e) => setTodoInput(e.target.value)} />
        <button onClick={() => addTodo()} className="add">
          {editIndex === -1 ? "Add" : "Update"}
        </button>

        <input type="text" id="search-input" placeholder="Search" value={searchItem} onChange={(e) => setSearchItem(e.target.value)} />
        <button onClick={() => {}}>
          Search
        </button>
      </div>

      <div className="todos">
        <ul className="todo-list">
          {
            renderTodos(todos)
          }
        </ul>
        {
          todos.length === 0 && (
            <div>
              <img className="face" src="/theblockchaincoders.jpg" alt="" />
              <h1 className="not-found">Not Found</h1>
            </div>
          )
        }
      </div>
    </div>
  </div>;
};

export default index;
