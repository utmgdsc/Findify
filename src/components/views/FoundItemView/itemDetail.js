import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
import fetcher from "../../../fetchHelper";
import { useParams } from "react-router-dom";
import no_img from "../../../assets/img/no_img.png";
import NavBar from "../../common/NavBar";
import { format } from "date-fns";

export default function FoundRequest() {
  const { id } = useParams();
  const [idtwo, setid] = useState("");
  const token = localStorage.getItem("token");
  let navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [selectedDate, setselectedDate] = useState(null);
  const [errorSubmit, setErrorSubmit] = useState("");
  const [showView, setshowView] = useState(true);

  const [itemdata, setitemData] = useState({
    itemName: "",
    type: "",
    colour: "",
    files: "",
    description: "",
    timeFound: "",
    timeSubmitted: "",
    locationFound: "",
    brand: "",
    size: "",
  });

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
    let url = `item/foundRequest/${id}`;
    fetcher(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((json) => {
            console.log(json.foundItem);
            setitemData({
              ...itemdata,
              itemName: json.foundItem.itemName,
              type: json.foundItem.type,
              colour: json.foundItem.colour,
              files: json.foundItem.imageUrls,
              description: json.foundItem.description,
              // timeFound: format(json.lostItem.timeFound, "MMMM do yyyy"),
              timeSubmitted: json.foundItem.createdAt,
              locationFound: json.foundItem.locationFound,
              brand: json.foundItem.brand,
              size: json.foundItem.size,
            });
            setid(json.foundItem._id);
            //setselectedDate(itemdata.timeFound);
            console.log(itemdata);
            console.log();
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

  const deleteRequest = () => {
    let url = `item/foundRequest/${id}`;
    fetcher(url, { method: "DELETE" })
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((json) => {
            navigate("/home", { replace: true });
            console.log();
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

  const createImagesCard = (files) => {
    return (
      <div className="text-center">
        <div>
          <div id="carouselExample" className="carousel slide">
            <div className="carousel-inner">
              {files.length !== 0 ? (
                files.map((i, index) => {
                  let class_value = "";
                  if (index === 0) class_value = "carousel-item active";
                  else class_value = "carousel-item";
                  return (
                    <div className={class_value}>
                      <img src={i} alt="" width="300px" height="200px" />
                    </div>
                  );
                })
              ) : (
                <img src={no_img} alt="" width="200px" height="150px" />
              )}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label fw-bold" for="customFile">
                Update Images
              </label>
              <input
                type="file"
                className="form-control"
                id="customFile"
                accept="image/*"
                multiple
                onChange={imagehandler}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const imagehandler = (e) => {
    let imageurls = [];
    for (let i = 0; i < e.target.files.length; i++) {
      console.log(e.target.files[i]);
      if (e.target.files[i].size < 3000000)
        //imageurls.push(URL.createObjectURL(e.target.files[i]));
        imageurls.push(e.target.files[i]);
      else
        setitemData({
          ...itemdata,
          images: "Warning: A file is larger than 3mb.",
        });
    }
    console.log(imageurls);
    setitemData({ ...itemdata, images: imageurls });
    console.log(itemdata);
  };

  const dateLostHandler = (date) => {
    setselectedDate(date);
    setitemData({ ...itemdata, timeFound: date });
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
    if (e.target.value === "Other") {
      setOthers({
        ...others,
        otherLocation: true,
        otherLocationText: "If other, please specify the location.",
      });
    }
    if (e.target.value === "Residence") {
      setOthers({
        ...others,
        otherLocation: true,
        otherLocationText: "If residence, Please specify which residence.",
      });
    }
    if (e.target.value === "Miway") {
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
    if (e.target.value === "Other") {
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
    if (e.target.value === "Other") {
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
    const form = event.currentTarget;
    var controller = new AbortController();
    const signal = controller.signal;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setDisabled(false);
    } else {
      const jsonData = {
        lostRequestId: idtwo,
        itemName: itemdata.itemName,
        type: itemdata.category,
        colour: itemdata.colour,
        description: itemdata.description,
        timeFound: itemdata.timeFound,
        timeSubmitted: itemdata.timeSubmitted,
        locationFound: itemdata.location,
        brand: itemdata.brand,
        size: itemdata.size,
      };

      console.log(jsonData);
      console.log(token);
      return fetch("http://localhost:3000/item/foundRequest", {
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
              console.log("got 200");
              console.log(json);
              setDisabled(false);
              setErrorSubmit("");
              setshowView(true);
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
          console.log("errored out");
          console.log(err);
          const errorObject = JSON.parse(err);
          setErrorSubmit(errorObject.message);
          console.log(err);
          setDisabled(true);
        });
    }
  };

  const viewItem = () => {
    return (
      <div class="row">
        <div class="col-xl-4 text-center">
          <div class="card col-md-9 mx-auto">
            <div class="card-images">{createImagesCard(itemdata.files)}</div>
          </div>
        </div>
        <div class="col-xl-8">
          <form noValidate validated={validated} onSubmit={submitHandler}>
            <div class="mb-3">
              <label
                class=" small mb-1 fw-bold control-label"
                for="inputItemName"
              >
                Item name
              </label>
              <input
                class="form-control"
                id="inputItemName"
                type="text"
                value={itemdata.itemName}
                disabled={true}
              />
            </div>
            <div class="row gx-3 mb-3">
              <div className="col-md-6 ">
                <label class="small mb-1 fw-bold" for="inputCategory">
                  Category
                </label>
                <input
                  class="form-control"
                  id="inputCategory"
                  type="text"
                  value={itemdata.category}
                  disabled={true}
                />
              </div>

              <div className="col-md-6">
                <label class="small mb-1 fw-bold" for="inputlocation">
                  Location found
                </label>
                <input
                  class="form-control"
                  id="inputLocation"
                  type="text"
                  value={itemdata.locationFound}
                  disabled={true}
                />
              </div>
            </div>
            <div class="row gx-3 mb-3">
              <div className="col-md-6">
                <label class="small mb-1 fw-bold">
                  Date when item was found
                </label>
                <input
                  class="form-control"
                  id="inputCategory"
                  type="text"
                  value={itemdata.timeFound}
                  disabled={true}
                />
              </div>

              <div class="col-md-6">
                <label class="small mb-1 fw-bold" for="inputBrand">
                  Brand
                </label>
                <input
                  class="form-control"
                  id="inputBrand"
                  value={itemdata.brand}
                  disabled={true}
                />
              </div>
            </div>
            <div class="row gx-3 mb-3">
              <div className="col-md-6">
                <label class="small mb-1 fw-bold" for="inputColour">
                  Colour of the item
                </label>
                <input
                  class="form-control"
                  id="inputColour"
                  type="text"
                  value={itemdata.colour}
                  disabled={true}
                />
              </div>

              <div className="col-md-6">
                <label class="small mb-1 fw-bold" for="inputSize">
                  Size of the item
                </label>
                <input
                  class="form-control"
                  id="inputCategory"
                  type="text"
                  value={itemdata.size}
                  disabled={true}
                />
              </div>
            </div>

            <div class="row gx-3 mb-3">
              <div class="mb-3">
                <label class="small mb-1 fw-bold" for="inputDescription">
                  Additional description
                </label>
                <input
                  class="form-control"
                  id="inputDescription"
                  type="text"
                  value={itemdata.description}
                  disabled={true}
                />
              </div>
            </div>

            <span style={{ fontSize: 15, color: "red" }}>{errorSubmit}</span>

            <div>
              <button
                type="button"
                class="btn btn-danger mb-2 mt-2"
                style={{ "margin-right": "4px" }}
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                Delete Request
              </button>
              <button
                type="button"
                class="btn btn-success mb-2 mt-2"
                style={{ "margin-right": "4px" }}
                onClick={() => setshowView(false)}
              >
                Edit Request
              </button>
              <div
                class="modal fade"
                id="staticBackdrop"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabindex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="staticBackdropLabel">
                        Are you sure you want to delete the request?
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      This action can not be reversed.
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger"
                        onClick={deleteRequest}
                      >
                        Yes, delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const editItem = () => {
    return (
      <div class="row">
        <div class="col-xl-4 text-center">
          <div class="card col-md-9 mx-auto">
            <div class="card-images">{createImagesCard(itemdata.files)}</div>
          </div>
        </div>
        <div class="col-xl-8">
          <form noValidate validated={validated} onSubmit={submitHandler}>
            <div class="mb-3">
              <label
                class=" small mb-1 fw-bold control-label"
                for="inputItemName"
              >
                Item name
              </label>
              <input
                class="form-control"
                id="inputItemName"
                type="text"
                value={itemdata.itemName}
                onChange={(e) => itemNameHandler(e)}
              />
            </div>
            <div class="row gx-3 mb-3">
              <div className="col-md-6 ">
                <label class="small mb-1 fw-bold" for="inputCategory">
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
                <label class="small mb-1 fw-bold" for="inputlocation">
                  Location lost
                </label>
                <select
                  class="form-select form-select-sm"
                  id="inputlocation"
                  aria-label=".form-select-sm"
                  onChange={(e) => locationhandler(e)}
                >
                  <option selected>{itemdata.locationFound}</option>
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
                <label class="small mb-1 fw-bold">
                  Date when item was lost
                </label>
                <DatePicker
                  selected={selectedDate}
                  class="form-control"
                  onChange={(date) => dateLostHandler(date)}
                  maxDate={new Date()}
                />
              </div>

              <div class="col-md-6">
                <label class="small mb-1 fw-bold" for="inputBrand">
                  Brand
                </label>
                <input
                  class="form-control"
                  id="inputBrand"
                  value={itemdata.brand}
                  onChange={(e) => brandhandler(e)}
                />
              </div>
            </div>
            <div class="row gx-3 mb-3">
              <div className="col-md-6">
                <label class="small mb-1 fw-bold" for="inputColour">
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
                  <span style={{ fontSize: 12 }}>{others.otherColourText}</span>
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
                <label class="small mb-1 fw-bold" for="inputSize">
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
                <label class="small mb-1 fw-bold" for="inputDescription">
                  Additional description
                </label>
                <input
                  class="form-control"
                  id="inputDescription"
                  type="text"
                  value={itemdata.description}
                  onChange={(e) => descriptionHandler(e)}
                />
              </div>
            </div>

            <span style={{ fontSize: 15, color: "red" }}>{errorSubmit}</span>

            <div>
              <button
                type="submit"
                disabled={disabled}
                class="btn btn-primary mb-2 mt-2"
                style={{ "margin-right": "4px" }}
              >
                Save Changes
              </button>
              <button
                type="button"
                class="btn btn-secondary mb-2 mt-2 "
                style={{ "margin-right": "4px" }}
                onClick={() => getItemDetails()}
              >
                Reset Changes
              </button>
              <button
                type="button"
                class="btn btn-dark mb-2 mt-2 "
                style={{ "margin-right": "4px" }}
                onClick={() => setshowView(true)}
              >
                Cancel Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div class="body-match">
      <NavBar />
      <div class="container-xl px-4">
        <div class="card mb-4 mt-4">
          <div class="card-header text-center fw-bold">ITEM DETAILS</div>
          <div class="card-body justify-content-center">
            <div>{showView ? viewItem() : editItem()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
