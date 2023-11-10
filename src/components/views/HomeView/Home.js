import React, { useState, useEffect } from "react";
import NavBar from "../../common/NavBar";
import fetcher from "../../../fetchHelper";
import "./style.css";
import no_img from "../../../assets/img/no_img.png";
import no_results from "../../../assets/img/no_results.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  let navigate = useNavigate();
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    getUserRequests(); // eslint-disable-next-line
  }, []);

  const getUserRequests = () => {
    let url = `item/getUserPosts/`;
    fetcher(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((json) => {
            console.log(json.userPosts);
            console.log(json.userPosts.lostItems[0]);
            setLostItems([...json.userPosts.lostItems, ...lostItems]);
            setLostItems(json.userPosts.lostItems);
            setFoundItems(json.userPosts.foundItems);
            console.log(lostItems);
            console.log(foundItems);
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

  const createItemCard = (item) => {
    const timeLost = new Date(item.timeLost);
    const daysAgo = Math.floor((new Date() - timeLost) / (24 * 60 * 60 * 1000));

    // Extract date components
    const year = timeLost.getFullYear();
    const month = timeLost.getMonth() + 1; // Months are zero-based (0 = January, 11 = December)
    const day = timeLost.getDate();

    // Extract time components
    const hours = timeLost.getHours();
    const minutes = timeLost.getMinutes();
    const seconds = timeLost.getSeconds();

    // Create date and time strings
    const dateStr = `${year}-${month}-${day}`;
    const timeStr = `${hours}:${minutes}:${seconds}`;

    let card_status = "";
    if (item.isActive) card_status = "card";
    else card_status = "card opacity-25";

    return (
      <div className="col-lg-3 col-md-6 col-sm-10 my-4">
        <div className={card_status}>
          <div id="carouselExample" className="carousel slide">
            <div className="carousel-inner">
              {item.imageUrls.length !== 0 ? (
                item.imageUrls.map((i, index) => {
                  let class_value = "";
                  if (index === 0) class_value = "carousel-item active";
                  else class_value = "carousel-item";
                  return (
                    <div className={class_value} key={item.id}>
                      <img src={i} alt="" width="200px" height="200px" />
                    </div>
                  );
                })
              ) : (
                <img src={no_img} alt="" width="200px" height="200px" />
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
            <h4 className="card-title">{item.itemName}</h4>
            <p className="card-title">Location: {item.locationLost}</p>
            <p className="card-title">Date: {dateStr}</p>

            <a
              className="btn btn-outline-success"
              role="button"
              href={`/lostitem/${item._id}`}
            >
              Read More
            </a>
          </div>
          <div className="card-footer text-body-secondary">
            {daysAgo} days ago
          </div>
        </div>
      </div>
    );
  };

  const createNoResultsCard = () => {
    return (
      <div className="col">
        <img src={no_results} alt="" className="card-img-top no-result" />
        <p>Sorry! It looks like you have not made any reports previously.</p>
      </div>
    );
  };

  return (
    <>
      <NavBar />

      <div className="body-home container-fluid text-center">
        <div className="row" style={{ height: 20 + "vh" }}>
          <div className="col" id="requestLostItem">
            <a
              className="btn w-75 h-75 p-2 mt-5"
              role="button"
              href="/requestLostItem"
            >
              Request lost item query
            </a>
          </div>
          <div className="col" id="reportFoundItem">
            <a
              className="btn w-75 h-75 p-2 mt-5"
              role="button"
              href="/reportFoundItem"
            >
              Report unidentified item found
            </a>
          </div>
        </div>

        <div className="row" style={{ height: 80 + "vh" }}>
          <div className="col">
            <div className="container py-5">
              <div className="row">
                <div className="col-12 ">
                  <div className="bg-white rounded p-2">
                    <ul className="nav nav-tabs justify-content-center ">
                      <li className="nav-item ">
                        <a
                          className="nav-link active"
                          data-bs-toggle="tab"
                          href="#lost"
                        >
                          Past lost item queries
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-bs-toggle="tab"
                          href="#found"
                        >
                          Past unidentified items reported
                        </a>
                      </li>
                    </ul>
                    <div className="row">
                      <div className="col-12">
                        <div className="tab-content p-4 ">
                          <div
                            id="lost"
                            className="tab-pane fade in active show"
                          >
                            <div className="row">
                              {lostItems.length !== 0
                                ? lostItems.map((item) => createItemCard(item))
                                : createNoResultsCard()}
                            </div>
                          </div>
                          <div id="found" className="tab-pane fade ">
                            <div className="row">
                              {foundItems.length !== 0
                                ? foundItems.map((item) => createItemCard(item))
                                : createNoResultsCard()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
