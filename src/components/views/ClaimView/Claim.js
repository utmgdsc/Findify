import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
import fetcher from "../../../fetchHelper";
import { useParams } from "react-router-dom";
import no_img from "../../../assets/img/no_img.png";
import NavBar from "../../common/NavBar";

export default function Claim() {
  const { id } = useParams();
  const [idtwo, setid] = useState("");
  const token = localStorage.getItem("token");
  let navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [isActive, setIsActive] = useState(null);

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
              timeFound: json.foundItem.timeFound.substring(0, 10),
              timeSubmitted: json.foundItem.createdAt,
              locationFound: json.foundItem.locationFound,
              brand: json.foundItem.brand,
              size: json.foundItem.size,
            });
            setid(json.foundItem._id);
            setIsActive(json.foundItem.isActive);
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

  const claimItem = (event) => {
    event.preventDefault();
    let url = `item/createPotentialMatch/`;
    const jsonData = {
      foundItemId: idtwo,
    };
    console.log(jsonData);
    if (!isActive) {
      navigate("/contact", { replace: true });
    } else {
      fetcher(url, {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json().then((json) => {
              console.log("success bro");
              console.log(json);
              setAlertVisible(true);
              setRequestSuccess(true);
              setAlertMessage(
                `Please contact ${json.hostEmail} to enquire about this item`
              );
            });
          } else {
            // Check if user is logged in
            if (localStorage.getItem("token") === null) {
              alert(
                "Sorry, looks like you're not logged in. Click ok to be redirected back to the login page"
              );
              navigate("/login", { replace: true });
            } else {
              return response.text().then((error) => {
                const errorObject = JSON.parse(error);
                setAlertVisible(true);
                setRequestSuccess(false);
                setAlertMessage(errorObject.message);
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
          const errorObject = JSON.parse(err);
          setAlertVisible(true);
          setRequestSuccess(false);
          setAlertMessage(errorObject.message);
        });
    }
  };

  const createImagesCard = (files) => {
    return (
      <div className="text-center">
        {files.length > 1 ? (
          <div id="carouselExample" className="carousel slide">
            <div className="carousel-inner">
              {files.map((i, index) => {
                let class_value =
                  index === 0 ? "carousel-item active" : "carousel-item";
                return (
                  <div className={class_value} key={index}>
                    <img
                      src={i}
                      alt=""
                      width="300px"
                      height="200px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                );
              })}
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
        ) : (
          <div>
            {files.length === 1 ? (
              <img
                src={files[0]}
                alt=""
                width="300px"
                height="200px"
                style={{ objectFit: "fill" }}
              />
            ) : (
              <img
                src={no_img}
                alt=""
                width="200px"
                height="150px"
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
        )}
      </div>
    );
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
          <form noValidate validated={validated}>
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
                  value={itemdata.type}
                  disabled={true}
                />
              </div>

              <div className="col-md-6">
                <label class="small mb-1 fw-bold" for="inputlocation">
                  Location Found
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

            <div class="text-center">
              <button
                type="button "
                class="btn btn-primary item-may-be-mine-button mb-2 mt-2"
                style={{ "margin-right": "4px" }}
                onClick={claimItem}
              >
                This Item May be Mine!
              </button>
              <br />
              {!isActive ? (
                <span style={{ fontSize: 15, color: "red" }}>
                  You will be redirected to contact the Admin.
                </span>
              ) : null}
            </div>

            {alertVisible && requestSuccess !== null && (
              <div
                className={`alert ${
                  requestSuccess ? "alert-success" : "alert-danger"
                } alert-dismissible fade show`}
                role="alert"
              >
                {alertMessage}
                <button
                  type="button"
                  class="btn-close"
                  onClick={() => setAlertVisible(false)}
                  aria-label="Close"
                ></button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div class="body-claim">
        <NavBar />
        <div class=" container-xl px-4 ">
          <div class="container-claim card mb-4 mt-4">
            <div class="card-header text-center fw-bold">ITEM DETAILS</div>
            <div class="card-body justify-content-center">
              <div>{viewItem()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
