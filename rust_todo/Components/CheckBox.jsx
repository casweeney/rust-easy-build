import React from "react";

import ICON from "./SVG/ICON";

const CheckBox = ({toggleCompleted, index, todo}) => {
  return (
    <label className="container">
      <input 
        type="checkbox" 
        checked={todo.completed} 
        onChange={() => toggleCompleted(index)}
      />
      <ICON />
    </label>
  );
};

export default CheckBox;
