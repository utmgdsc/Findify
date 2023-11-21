import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
import fetcher from "../../../fetchHelper";
import { useParams } from "react-router-dom";
import no_img from "../../../assets/img/no_img.png";
import NavBar from "../../common/NavBar";
import { format } from "date-fns";

export default function Handoff() {
  const { id } = useParams();
  const [idtwo, setid] = useState("");
  const token = localStorage.getItem("token");
  let navigate = useNavigate();
  const [validated, setValidated] = useState(false);

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

  useEffect(() => {
    getItemDetails(); // eslint-disable-next-line
  }, []);

  const getItemDetails = () => {
    let url = `item/lostRequest/${id}`;
    fetcher(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((json) => {
            console.log(json.lostItem);
            setitemData({
              ...itemdata,
              itemName: json.lostItem.itemName,
              type: json.lostItem.type,
              colour: json.lostItem.colour,
              files: json.lostItem.imageUrls,
              description: json.lostItem.description,
              // timeLost: format(json.lostItem.timeLost, "MMMM do yyyy"),
              timeSubmitted: json.lostItem.createdAt,
              locationLost: json.lostItem.locationLost,
              brand: json.lostItem.brand,
              size: json.lostItem.size,
            });
            setid(json.lostItem._id);
            //setselectedDate(itemdata.timeLost);
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

  const submitHandler = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    var controller = new AbortController();
    const signal = controller.signal;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const jsonData = {
        lostRequestId: idtwo,
        itemName: itemdata.itemName,
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
              console.log("got 200");
              console.log(json);
              //SuccessfulMatches();
            });
          } else {
            // Handle other status codes
            return response.text().then((errorMessage) => {
              controller.abort();
            });
          }
        })
        .catch((err) => {
          console.log("errored out");
          console.log(err);
          const errorObject = JSON.parse(err);
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
                  Location lost
                </label>
                <input
                  class="form-control"
                  id="inputLocation"
                  type="text"
                  value={itemdata.locationLost}
                  disabled={true}
                />
              </div>
            </div>
            <div class="row gx-3 mb-3">
              <div className="col-md-6">
                <label class="small mb-1 fw-bold">
                  Date when item was lost
                </label>
                <input
                  class="form-control"
                  id="inputCategory"
                  type="text"
                  value={itemdata.timeLost}
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

            <div>
              <button
                type="submit"
                class="btn btn-danger mb-2 mt-2"
                style={{ "margin-right": "4px" }}
              >
                Handover
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
            <div>{viewItem()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
