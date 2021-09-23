import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";

import { getCategory, updateCategory } from "./helper/adminapicall";
import { isAutheticated } from "../auth/helper";

const UpdateCategory = ({ match }) => {
  const { user, token } = isAutheticated();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  //   const [name, setName] = useState("");
  const [values, setValues] = useState({
    name: "",
    error: "",
  });
  const { name } = values;

  const preload = (categoryId) => {
    getCategory(categoryId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
        });
      }
    });
  };
  useEffect(() => {
    preload(match.params.categoryId);
  }, []);

  const goBack = () => (
    <div className="mt-5">
      <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">
        Admin Home
      </Link>
    </div>
  );

  const handleChange = (event) => {
    setError("");
    setValues({ ...values, name: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    //backend request fired
    updateCategory(match.params.categoryId, user._id, token, name).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
          setError(data.error);
        } else {
          setValues({
            ...values,
            name: "",
          });
        }
      }
    );
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category udpated successfully</h4>;
    }
  };

  const warningMessage = () => {
    if (error) {
      return <h4 className="text-success">Failed to udpate category</h4>;
    }
  };

  const myCategoryForm = () => (
    <form>
      <div className="form-group">
        <p className="lead">Enter the category</p>
        <input
          type="text"
          className="form-control my-3"
          onChange={handleChange}
          value={name}
          autoFocus
          required
          placeholder="For Ex. Summer"
        />
        <button onClick={onSubmit} className="btn btn-outline-info">
          Update Category
        </button>
      </div>
    </form>
  );

  return (
    <Base
      title="Update Category"
      description="Update category"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {warningMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateCategory;
