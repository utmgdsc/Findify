import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./style.css";
import { set } from "mongoose";

export default function RequestLost() {
  let navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [validated, setValidated] = useState(false);
  const [selectedDate, setselectedDate] = useState(null);
  const [data, setData] = useState({
    name: "",
    category: "",
    colour: "",
    images: "",
    description: "",
    timeLost: "",
    timeSubmitted: new Date(),
    location: "",
    brand: "",
    size: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    category: "",
    colour: "",
    images: "",
    description: "",
    timeLost: "",
    timeSubmitted: "",
    location: "",
    submit: "",
  });

  const dateLostHandler = (date) => {
    setselectedDate(date);
    setData({ ...data, timeLost: date });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    var controller = new AbortController();
    const signal = controller.signal;
    const jsonData = {
      //name: data.name,
      type: data.category,
      colour: data.colour,
      images: data.images,
      description: data.description,
      timeLost: data.timeLost,
      timeSubmitted: data.name,
      locationLost: data.location,
      brand: data.brand,
      size: data.size,
      //host -- user
    };

    console.log(jsonData);
    return fetch("http://localhost:3000/item/lostRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
      signal: signal,
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((json) => {
            console.log(json);
            setDisabled(false);
            setValidated(true);
            setErrors({ ...errors, submit: "" });
            navigate("/login", { replace: true });
          });
        } else {
          // Handle other status codes
          return response.text().then((errorMessage) => {
            const errorObject = JSON.parse(errorMessage);
            setErrors({
              ...errors,
              submit: errorObject.message,
            });
            controller.abort();
          });
        }
      })
      .catch((err) => {
        const errorObject = JSON.parse(err);
        setErrors({ ...errors, submit: errorObject.message });
        console.log(err);
        setDisabled(true);
        setValidated(false);
      });
  };

  return (
    <div className="auth-wrapper container h-40">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
          <div className="card rounded-3" id="requestlostitem-card">
            <div className="card-body p-4">
              <form noValidate onSubmit={submitHandler}>
                <h3 className="text-center">Request a Lost Item</h3>
                <div className="mb-3">
                  <label>Item Name</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder="Item name"
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                  />
                  <span style={{ fontSize: 12, color: "red" }}>
                    Example: Iphone 13 Pro, Blue Jansport Bagpack
                  </span>
                </div>

                <div className="mb-3">
                  <label>Location Lost</label>
                  <select
                    required
                    class="form-select form-select-sm"
                    aria-label=".form-select-sm example"
                    onChange={(e) =>
                      setData({ ...data, location: e.target.value })
                    }
                  >
                    <option selected>Please select an option</option>
                    <option value="1">CC</option>
                    <option value="2">DH</option>
                    <option value="3">DW</option>
                    <option value="4">KN</option>
                    <option value="5">IB</option>
                    <option value="6">MN</option>
                    <option value="7">BG</option>
                    <option value="8">HB</option>
                    <option value="9">DV</option>
                    <option value="10">Residence</option>
                    <option value="11">Miway</option>
                    <option value="12">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label>Date when item was Lost</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => dateLostHandler(date)}
                    maxDate={data.timeSubmitted}
                    required
                    isClearable
                  />
                </div>

                <div className="mb-3">
                  <label>Category</label>
                  <select
                    required
                    class="form-select form-select-sm"
                    aria-label=".form-select-sm example"
                    onChange={(e) =>
                      setData({ ...data, category: e.target.value })
                    }
                  >
                    <option selected>Please select an option</option>
                    <option value="1">Electronic</option>
                    <option value="2">Clothing</option>
                    <option value="3">Bag</option>
                    <option value="4">Keys</option>
                    <option value="5">T-Card</option>
                    <option value="6">Books</option>
                    <option value="7">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label>Colour of the item</label>
                  <select
                    required
                    class="form-select form-select-sm"
                    aria-label=".form-select-sm example"
                    onChange={(e) =>
                      setData({ ...data, colour: e.target.value })
                    }
                  >
                    <option selected>Please select an option</option>
                    <option value="1">Black</option>
                    <option value="2">White</option>
                    <option value="3">Grey</option>
                    <option value="4">Blue</option>
                    <option value="5">Red</option>
                    <option value="6">Green</option>
                    <option value="7">Purple</option>
                    <option value="8">Pink</option>
                    <option value="9">Yellow</option>
                    <option value="10">Orange</option>
                    <option value="11">Brown</option>
                    <option value="12">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label>Brand</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder="Please add the brand name if known"
                    onChange={(e) =>
                      setData({ ...data, brand: e.target.value })
                    }
                  />
                  <span style={{ fontSize: 12, color: "red" }}>
                    Please write N/A if not known
                  </span>
                </div>
                <div className="mb-3">
                  <label>Size of the item</label>
                  <select
                    required
                    class="form-select form-select-sm"
                    aria-label=".form-select-sm example"
                    onChange={(e) => setData({ ...data, size: e.target.value })}
                  >
                    <option selected>Please select an option</option>
                    <option value="1">XXS</option>
                    <option value="2">XS</option>
                    <option value="3">S</option>
                    <option value="4">M</option>
                    <option value="5">L</option>
                    <option value="6">XL</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label class="form-label" for="customFile">
                    Upload Images (Optional)
                  </label>
                  <input
                    type="file"
                    class="form-control"
                    id="customFile"
                    accept="image/*"
                    multiple
                    size={3000000} // 3000 kb = 3 mb
                  />
                </div>
                <div className="mb-3">
                  <label>Additional Description</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder="Please add any other information"
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="signup-button mb-2 mt-2"
                    disabled={disabled}
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
