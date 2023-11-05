import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NavBar from "../../common/NavBar";
import "./style.css";

export default function RequestLost() {
  const token = localStorage.getItem("token");

  let navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [validated, setValidated] = useState(false);
  const [selectedDate, setselectedDate] = useState(null);
  const [data, setData] = useState({
    name: "",
    category: "",
    colour: "",
    images: [],
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

  const [others, setOthers] = useState({
    otherLocation: false,
    otherColour: false,
    otherCategory: false,
  });

  const dateLostHandler = (date) => {
    setselectedDate(date);
    setData({ ...data, timeLost: date });
  };

  const imagehandler = (e) => {
    let imageurls = [];

    for (let i = 0; i < e.target.files.length; i++) {
      console.log(e.target.files[i]);
      if (e.target.files[i].size < 3000000)
        imageurls.push(URL.createObjectURL(e.target.files[i]));
      else setData({ ...data, images: "Warning: A file is larger than 3mb." });
    }
    console.log(imageurls);
    setData({ ...data, images: imageurls });
    console.log(data);
  };

  const locationhandler = (e) => {
    setOthers({ ...others, otherLocation: false });
    if (e.target.value == "Other") {
      setOthers({ ...others, otherLocation: true });
      setErrors({
        ...errors,
        location: "If other, please specify the location.",
      });
    }
    if (e.target.value == "Residence") {
      setOthers({ ...others, otherLocation: true });
      setErrors({
        ...errors,
        location: "If residence, Please specify which residence.",
      });
    }
    if (e.target.value == "Miway") {
      setOthers({ ...others, otherLocation: true });
      setErrors({
        ...errors,
        location: "If Miway, please specify the route. Example: 44N",
      });
    }
    setData({ ...data, location: e.target.value });
  };

  const colorhandler = (e) => {
    setOthers({ ...others, otherColour: false });
    if (e.target.value == "Other") {
      setOthers({ ...others, otherColour: true });
      setErrors({
        ...errors,
        colour: "If other, please specify the colour.",
      });
    }
    setData({ ...data, colour: e.target.value });
  };

  const categoryhandler = (e) => {
    setOthers({ ...others, otherCategory: false });
    if (e.target.value == "Other") {
      setOthers({ ...others, otherCategory: true });
      setErrors({
        ...errors,
        category: "If other, please specify the category.",
      });
    }
    setData({ ...data, category: e.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    var controller = new AbortController();
    const signal = controller.signal;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setDisabled(false);
    } else {
      const jsonData = {
        itemName: data.name,
        type: data.category,
        colour: data.colour,
        imageUrls: data.images,
        description: data.description,
        timeLost: data.timeLost,
        timeSubmitted: data.timeSubmitted,
        locationLost: data.location,
        brand: data.brand,
        size: data.size,
      };

      console.log(jsonData);
      console.log(token);
      return fetch("http://localhost:3000/item/lostRequest", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
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
              navigate("/home", { replace: true });
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
    }
  };

  return (
    <>
      <NavBar />
      <div className="body-request-lost">
        <div className="container h-40">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card rounded-3" id="requestlostitem-card">
                <div className="card-body p-4">
                  <form
                    noValidate
                    validated={validated}
                    onSubmit={submitHandler}
                  >
                    <h3 className="text-center">Request a Lost Item</h3>
                    <div className="mb-3">
                      <label>Item Name</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder="Item name"
                        onChange={(e) =>
                          setData({ ...data, name: e.target.value })
                        }
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
                        aria-label=".form-select-sm"
                        onChange={(e) => locationhandler(e)}
                      >
                        <option selected>Please select an option</option>
                        <option value="CC">CC</option>
                        <option value="DH">DH</option>
                        <option value="DW">DW</option>
                        <option value="KN">KN</option>
                        <option value="IB">IB</option>
                        <option value="MN">MN</option>
                        <option value="BG">BG</option>
                        <option value="HB">HB</option>
                        <option value="DV">DV</option>
                        <option value="Residence">Residence</option>
                        <option value="Miway">Miway</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {others.otherLocation ? (
                      <div className="mb-3">
                        <span style={{ fontSize: 12 }}>{errors.location}</span>
                        <input
                          required
                          type="text"
                          className="other-input"
                          size="sm"
                          onChange={(e) => {
                            setData({ ...data, location: e.target.value });
                          }}
                        />
                      </div>
                    ) : null}

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
                        aria-label=".form-select-sm"
                        onChange={(e) => categoryhandler(e)}
                      >
                        <option selected>Please select an option</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Bag">Bag</option>
                        <option value="Keys">Keys</option>
                        <option value="T-Card">T-Card</option>
                        <option value="Books">Books</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {others.otherCategory ? (
                      <div className="mb-3">
                        <span style={{ fontSize: 12 }}>{errors.category}</span>
                        <input
                          required
                          type="text"
                          className="other-input"
                          size="sm"
                          onChange={(e) => {
                            setData({ ...data, category: e.target.value });
                          }}
                        />
                      </div>
                    ) : null}

                    <div className="mb-3">
                      <label>Colour of the item</label>
                      <select
                        required
                        class="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        onChange={(e) => colorhandler(e)}
                      >
                        <option selected>Please select an option</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Grey">Grey</option>
                        <option value="Blue">Blue</option>
                        <option value="Red">Red</option>
                        <option value="Green">Green</option>
                        <option value="Purple">Purple</option>
                        <option value="Pink">Pink</option>
                        <option value="Yellow">Yellow</option>
                        <option value="Orange">Orange</option>
                        <option value="Brown">Brown</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {others.otherColour ? (
                      <div className="mb-3">
                        <span style={{ fontSize: 12 }}>{errors.colour}</span>
                        <input
                          required
                          type="text"
                          className="other-input"
                          size="sm"
                          onChange={(e) => {
                            setData({ ...data, colour: e.target.value });
                          }}
                        />
                      </div>
                    ) : null}

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
                        onChange={(e) =>
                          setData({ ...data, size: e.target.value })
                        }
                      >
                        <option selected>Please select an option</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
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
                        onChange={imagehandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Additional Description</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Please add any other information"
                        onChange={(e) =>
                          setData({ ...data, description: e.target.value })
                        }
                      />
                    </div>
                    <span style={{ fontSize: 15, color: "red" }}>
                      {errors.submit}
                    </span>
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
      </div>
    </>
  );
}
