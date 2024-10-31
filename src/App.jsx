import { LuListMinus } from "react-icons/lu";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import "./App.css";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  let [newTodo, setNewTodo] = useState("");
  let [todos, setTodos] = useState([]);
  let [filter, setFilter] = useState("all"); // State for filtering

  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let date = now.getDate();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  let year = now.getFullYear();

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let storedTodos = JSON.parse(todoString);
      setTodos(storedTodos);
    }
  }, []);

  let saveToLs = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  let handleTodo = (e) => {
    setNewTodo(e.target.value);
  };

  let addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: uuidv4(), text: newTodo, isCompleted: false }]);
      setNewTodo("");
      saveToLs();
    }
  };

  let handleCompTask = (id) => {
    let updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(updatedTodos);
    saveToLs();
  };

  let handleDelete = (id) => {
    let updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveToLs();
  };

  let handleEdit = (e, id) => {
    let foundTodo = todos.find((todo) => todo.id === id);
    if (foundTodo) {
      e.target.value = foundTodo.text;
      handleDelete(id); // Optional: If you want to remove the task right away, or you can wait until a new value is submitted
    }
  };

  // Filter todos based on the filter state
  let completedTodos = todos.filter((todo) => todo.isCompleted);
  let incompleteTodos = todos.filter((todo) => !todo.isCompleted);

  // Choose what to display based on the filter
  let displayedTodos = [];
  if (filter === "completed") {
    displayedTodos = completedTodos;
  } else if (filter === "incomplete") {
    displayedTodos = incompleteTodos;
  } else {
    displayedTodos = [...completedTodos, ...incompleteTodos]; // all tasks combined for "all" filter
  }

  return (
    <>
      <div className="main w-full min-h-screen flex flex-col justify-center items-center text-white bg-zinc-900">
        <div>
          <h1 className="font-bold text-3xl text-gray-400 tracking-wider mb-2">
            Todo
          </h1>
          <div className=" max-w-[70vw] lg:w-[35vw] min-h-[80vh] lg:min-h-[80vh] bg-zinc-800 p-4 pl-2 lg:p-4 rounded-md flex flex-col justify-between">
            <div>
              <div className="date w-fit mx-auto leading-4">
                <h2 className="text-2xl w-fit mx-auto">{day}</h2>
                <h3 className="text-zinc-500">
                  {date} {month}, {year}
                </h3>
              </div>
              <div className="todos mt-10 m-4">
                <div className="addtodo flex relative">
                  <i className="absolute t-[30%] l-2 translate-y-[30%] translate-x-2">
                    <LuListMinus className="text-blue-600 text-xl" />
                  </i>
                  <input
                    className="bg-zinc-700 pl-8 px-2 py-1 rounded-sm w-[40vw] w-full"
                    type="text"
                    name="addTodo"
                    placeholder="Add Todo Here"
                    onChange={handleTodo}
                    value={newTodo}
                  />
                  <button
                    className="bg-blue-700 ml-2 px-2 rounded w-[30%] lg:w-[40%] lg"
                    onClick={addTodo}
                  >
                    Submit
                  </button>
                </div>

                {/* Render tasks based on the filter state */}
                {filter === "all" && (
                  <>
                    {incompleteTodos.length > 0 && (
                      <>
                        <h2 className="text-gray-400 mt-6">Incomplete Tasks</h2>
                        {incompleteTodos.map((todo) => (
                          <div
                            key={todo.id}
                            className="todo mt-5 text-gray-400 flex justify-between"
                          >
                            <div className="wrapper">
                              <input
                                type="checkbox"
                                onChange={() => handleCompTask(todo.id)}
                                checked={todo.isCompleted}
                              />
                              <p className="inline pl-2">{todo.text}</p>
                            </div>
                            <div className="config text-blue-500 flex my-auto">
                              <i
                                className="pl-3 cursor-pointer"
                                onClick={() => handleDelete(todo.id)}
                              >
                                <AiOutlineDelete />
                              </i>
                              <i
                                className="pl-3 cursor-pointer"
                                onClick={(e) => handleEdit(e, todo.id)}
                              >
                                <FaRegEdit />
                              </i>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {completedTodos.length > 0 && (
                      <>
                        <h2 className="text-gray-400 mt-6">Completed Tasks</h2>
                        {completedTodos.map((todo) => (
                          <div
                            key={todo.id}
                            className="todo mt-5 text-gray-400 flex justify-between"
                          >
                            <div className="wrapper">
                              <input
                                type="checkbox"
                                onChange={() => handleCompTask(todo.id)}
                                checked={todo.isCompleted}
                              />
                              <p className="inline pl-2">{todo.text}</p>
                            </div>
                            <div className="config text-blue-500 flex my-auto">
                              <i
                                className="pl-3 cursor-pointer"
                                onClick={() => handleDelete(todo.id)}
                              >
                                <AiOutlineDelete />
                              </i>
                              <i
                                className="pl-3 cursor-pointer"
                                onClick={(e) => handleEdit(e, todo.id)}
                              >
                                <FaRegEdit />
                              </i>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}

                {/* If the user is viewing only completed or incomplete tasks */}
                {filter !== "all" && displayedTodos.length > 0 && (
                  <>
                    <h2 className="text-gray-400 mt-6">
                      {filter === "completed"
                        ? "Completed Tasks"
                        : "Incomplete Tasks"}
                    </h2>
                    {displayedTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className="todo mt-5 text-gray-400 flex justify-between"
                      >
                        <div className="wrapper">
                          <input
                            type="checkbox"
                            onChange={() => handleCompTask(todo.id)}
                            checked={todo.isCompleted}
                          />
                          <p className="inline pl-2">{todo.text}</p>
                        </div>
                        <div className="config text-blue-500 flex my-auto">
                          <i
                            className="pl-3 cursor-pointer"
                            onClick={() => handleDelete(todo.id)}
                          >
                            <AiOutlineDelete />
                          </i>
                          <i
                            className="pl-3 cursor-pointer"
                            onClick={(e) => handleEdit(e, todo.id)}
                          >
                            <FaRegEdit />
                          </i>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            <div className="btns flex justify-around text-blue-500">
              <p onClick={() => setFilter("all")} className="cursor-pointer">
                All Tasks
              </p>
              <p
                onClick={() => setFilter("completed")}
                className="cursor-pointer"
              >
                Completed Tasks
              </p>
              <p
                onClick={() => setFilter("incomplete")}
                className="cursor-pointer"
              >
                Incomplete Tasks
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
