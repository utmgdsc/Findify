import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
import fetcher from "../../../fetchHelper";

export default function Match() {
  const token = localStorage.getItem("token");
  let navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [selectedDate, setselectedDate] = useState(null);
  const [itemdata, setitemData] = useState({
    itemName: "",
    type: "",
    colour: "",
    files: "",
    description: "",
    timeLost: "",
    timeSubmitted: "",
    locationLost: "",
    brand: "",
    size: "",
  });

  const [errorSubmit, setErrorSubmit] = useState(" ");
  const [errorEmpty, setErrorEmpty] = useState("Value cannot be empty.");

  const [others, setOthers] = useState({
    otherLocation: false,
    otherLocationText: "",
    otherColour: false,
    otherColourText: "",
    otherCategory: false,
    otherCategoryText: "",
  });

  useEffect(() => {
    getItemDetails(); // eslint-disable-next-line
  }, []);

  const getItemDetails = () => {
    let url = `item/lostRequest/`;
    fetcher(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((json) => {
            console.log(json.lostItem);
            setitemData({
              itemName: json.lostItem.itemName,
              type: json.lostItem.type,
              colour: json.lostItem.colour,
              files: json.lostItem.files,
              description: json.lostItem.description,
              timeLost: json.lostItem.timeLost,
              timeSubmitted: json.lostItem.timeSubmitted,
              locationLost: json.lostItem.locationLost,
              brand: json.lostItem.brand,
              size: json.lostItem.size,
            });
            setselectedDate(json.lostItem.timeLost);
            console.log(itemdata);
          });
        } else {
          // Check if user is logged in
          if (localStorage.getItem("token") === null) {
            alert(
              "Sorry, looks like you're not logged in. Click ok to be redirected back to the login page"
            );
            navigate("/login", { replace: true });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dateLostHandler = (date) => {
    setselectedDate(date);
    setitemData({ ...itemdata, timeLost: date });
    setDisabled(false);
  };

  const itemNameHandler = (e) => {
    setitemData({ ...itemdata, itemName: e.target.value });
    setDisabled(false);
  };

  const descriptionHandler = (e) => {
    setitemData({ ...itemdata, description: e.target.value });
    setDisabled(false);
  };

  const locationhandler = (e) => {
    setOthers({ ...others, otherLocation: false });
    if (e.target.value == "Other") {
      setOthers({
        ...others,
        otherLocation: true,
        otherLocationText: "If other, please specify the location.",
      });
    }
    if (e.target.value == "Residence") {
      setOthers({
        ...others,
        otherLocation: true,
        otherLocationText: "If residence, Please specify which residence.",
      });
    }
    if (e.target.value == "Miway") {
      setOthers({
        ...others,
        otherLocation: true,
        otherLocationText: "If Miway, please specify the route. Example: 44N",
      });
    }
    setitemData({ ...itemdata, location: e.target.value });
    setDisabled(false);
  };

  const colorhandler = (e) => {
    setOthers({ ...others, otherColour: false });
    if (e.target.value == "Other") {
      setOthers({
        ...others,
        otherColour: true,
        otherColourText: "If other, please specify the colour.",
      });
    }
    setitemData({ ...itemdata, colour: e.target.value });
    setDisabled(false);
  };

  const categoryhandler = (e) => {
    setOthers({ ...others, otherCategory: false });
    if (e.target.value == "Other") {
      setOthers({
        ...others,
        otherCategory: true,
        otherCategoryText: "If other, please specify the category.",
      });
    }
    setitemData({ ...itemdata, category: e.target.value });
    setDisabled(false);
  };

  const brandhandler = (e) => {
    setitemData({ ...itemdata, brand: e.target.value });
    setDisabled(false);
  };

  const sizehandler = (e) => {
    setitemData({ ...itemdata, size: e.target.value });
    setDisabled(false);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    var controller = new AbortController();
    const form = event.currentTarget;
    const signal = controller.signal;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setDisabled(false);
    } else {
      const jsonData = {
        itemName: itemdata.name,
        type: itemdata.category,
        colour: itemdata.colour,
        description: itemdata.description,
        timeLost: itemdata.timeLost,
        timeSubmitted: itemdata.timeSubmitted,
        locationLost: itemdata.location,
        brand: itemdata.brand,
        size: itemdata.size,
      };

      console.log(jsonData);
      console.log(token);
      return fetch("http://localhost:3000/item/lostRequest", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        files: itemdata.files,
        body: JSON.stringify(jsonData),
        signal: signal,
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json().then((json) => {
              console.log(json);
              setDisabled(false);
              setErrorSubmit("");
            });
          } else {
            // Handle other status codes
            return response.text().then((errorMessage) => {
              const errorObject = JSON.parse(errorMessage);
              setErrorSubmit(errorObject.message);
              controller.abort();
            });
          }
        })
        .catch((err) => {
          const errorObject = JSON.parse(err);
          setErrorSubmit(errorObject.message);
          console.log(err);
          setDisabled(true);
        });
    }
  };

  return (
    <div class="body-match">
      <div class="container-xl px-4 mt-4">
        <div class="row">
          <div class="col-xl-4">
            <div class="card mb-4 mb-xl-0">
              <div class="card-header">Images</div>
              <div class="card-body text-center">
                <img
                  class="img-account-profile rounded-circle mb-2"
                  src="http://bootdey.com/img/Content/avatar/avatar1.png"
                  alt=""
                />
                <div class="small font-italic text-muted mb-4">
                  JPG or PNG no larger than 5 MB
                </div>
                <button class="btn btn-primary" type="button">
                  Upload new image
                </button>
              </div>
            </div>
          </div>
          <div class="col-xl-8">
            <div class="card mb-4">
              <div class="card-header">Item Details</div>
              <div class="card-body">
                <form>
                  <div class="mb-3">
                    <label class="small mb-1" for="inputUsername">
                      Item Name
                    </label>
                    <input
                      class="form-control"
                      id="inputUsername"
                      type="text"
                      placeholder={itemdata.itemName}
                      onChange={(e) => itemNameHandler(e)}
                    />
                  </div>
                  <div class="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label class="small mb-1" for="inputCategory">
                        Category
                      </label>
                      <select
                        id="inputCategory"
                        class="form-select form-select-sm"
                        aria-label=".form-select-sm"
                        onChange={(e) => categoryhandler(e)}
                      >
                        <option selected>{itemdata.type}</option>
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
                        <span style={{ fontSize: 12 }}>
                          {others.otherCategoryText}
                        </span>
                        <input
                          required
                          type="text"
                          className="other-input-match"
                          size="sm"
                          onChange={(e) => {
                            setitemData({
                              ...itemdata,
                              category: e.target.value,
                            });
                          }}
                        />
                      </div>
                    ) : null}

                    <div className="col-md-6">
                      <label class="small mb-1" for="inputlocation">
                        Location Lost
                      </label>
                      <select
                        class="form-select form-select-sm"
                        id="inputlocation"
                        aria-label=".form-select-sm"
                        onChange={(e) => locationhandler(e)}
                      >
                        <option selected>{itemdata.locationLost}</option>
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
                        <span style={{ fontSize: 12 }}>
                          {others.otherLocationText}
                        </span>
                        <input
                          required
                          type="text"
                          className="other-input-match"
                          size="sm"
                          onChange={(e) => {
                            setitemData({
                              ...itemdata,
                              location: e.target.value,
                            });
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div class="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label class="small mb-1">Date when item was Lost</label>
                      <DatePicker
                        selected={selectedDate}
                        class="form-control"
                        onChange={(date) => dateLostHandler(date)}
                        maxDate={new Date()}
                      />
                    </div>

                    <div class="col-md-6">
                      <label class="small mb-1" for="inputBrand">
                        Brand
                      </label>
                      <input
                        class="form-control"
                        id="inputBrand"
                        placeholder={itemdata.brand}
                        onChange={(e) => brandhandler(e)}
                      />
                    </div>
                  </div>
                  <div class="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label class="small mb-1" for="inputColour">
                        Colour of the item
                      </label>
                      <select
                        class="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        onChange={(e) => colorhandler(e)}
                      >
                        <option selected>{itemdata.colour}</option>
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
                        <span style={{ fontSize: 12 }}>
                          {others.otherColourText}
                        </span>
                        <input
                          required
                          type="text"
                          className="other-input-match"
                          size="sm"
                          onChange={(e) => {
                            setitemData({
                              ...itemdata,
                              colour: e.target.value,
                            });
                          }}
                        />
                      </div>
                    ) : null}

                    <div className="col-md-6">
                      <label class="small mb-1" for="inputSize">
                        Size of the item
                      </label>
                      <select
                        id="inputSize"
                        class="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        onChange={(e) => sizehandler(e)}
                      >
                        <option selected>{itemdata.size}</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                    </div>
                  </div>

                  <div class="row gx-3 mb-3">
                    <div class="mb-3">
                      <label class="small mb-1" for="inputDescription">
                        Additional Description
                      </label>
                      <input
                        class="form-control"
                        id="inputDescription"
                        type="text"
                        placeholder={itemdata.description}
                        onChange={(e) => descriptionHandler(e)}
                      />
                    </div>
                  </div>

                  <button
                    class="btn btn-primary"
                    type="button"
                    disabled={disabled}
                    onSubmit={submitHandler}
                  >
                    Save changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
