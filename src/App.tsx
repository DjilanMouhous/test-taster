import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import UserListTable from "./feat/user-list";

function App() {
  return (
    <div className="container mx-auto py-10">
      <UserListTable />
    </div>
  );
}

export default App;
