import React from "react";
import SheetJSApp from "./SheetJSApp";


const CategoryForm = ({ handleSubmit, value, setValue }) => {
  
  return (
    <>
    <div className="">
    <SheetJSApp handleSubmit={handleSubmit} Category={true}/>
    </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
};

export default CategoryForm;
