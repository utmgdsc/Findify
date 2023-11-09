<<<<<<< HEAD
import React from "react";
import NavBar from "../../common/NavBar";
import "./style.css";
import blue_bag from "../../../assets/img/blue_bag.jpg";
import keys from "../../../assets/img/keys.jpg";
import wallet from "../../../assets/img/wallet.jpg";
import airpods from "../../../assets/img/airpods.jpg";
import no_results from "../../../assets/img/no_results.png";

export default function Home() {
  return (
    <>
      <NavBar />
      <div class="body-home">
        <div class="container-fluid  text-center">
          <div class="row" style={{ height: 20 + "vh" }}>
            <div class="col" id="requestLostItem">
              <a
                class="btn w-75 h-75 p-2"
                role="button"
                href="/requestLostItem"
              >
                Request lost item query
              </a>
            </div>
            <div class="col" id="reportFoundItem">
              <a
                class="btn w-75 h-75 p-2"
                role="button"
                href="/reportFoundItem"
              >
                Report unidentified item found
              </a>
            </div>
          </div>

          <div class="row" style={{ height: 80 + "vh" }}>
            <div class="col">
              <div class="container py-5">
                <div class="row">
                  <div class="col-12 ">
                    <div class="bg-white rounded p-2">
                      <ul class="nav nav-tabs justify-content-center ">
                        <li class="nav-item ">
                          <a
                            class="nav-link active"
                            data-bs-toggle="tab"
                            href="#lost"
                          >
                            Past lost item queries
                          </a>
                        </li>
                        <li class="nav-item">
                          <a
                            class="nav-link"
                            data-bs-toggle="tab"
                            href="#found"
                          >
                            Past unidentified items reported
                          </a>
                        </li>
                      </ul>
                      <div class="row">
                        <div class="col-12">
                          <div class="tab-content p-4 ">
                            <div id="lost" class="tab-pane fade in active show">
                              <div class="row">
                                <div class="col-lg-3 col-md-6 col-sm-10 my-4">
                                  <div class="card">
                                    <img
                                      src={blue_bag}
                                      class="card-img-top"
                                      alt=""
                                      width="200px"
                                      height="200px"
                                    />
                                    <div class="card-body">
                                      <h4 class="card-title">Blue puma bag</h4>
                                      <p class="card-title">
                                        Location: CCT Starbucks
                                      </p>
                                      <p class="card-text">
                                        Time: 12:00-2:00 pm
                                      </p>
                                      <a
                                        class="btn btn-outline-success"
                                        role="button"
                                        href="/itemDetails/1"
                                      >
                                        Read More
                                      </a>
                                    </div>
                                    <div class="card-footer text-body-secondary">
                                      2 days ago
                                    </div>
                                  </div>
                                </div>
                                <div class="col-lg-3 col-md-6 col-sm-10 my-4">
                                  <div class="card opacity-25">
                                    <img
                                      src={keys}
                                      class="card-img-top"
                                      alt=""
                                      width="200px"
                                      height="200px"
                                    />
                                    <div class="card-body">
                                      <h4 class="card-title">House keys</h4>
                                      <p class="card-title">
                                        Location: IB bus stop
                                      </p>
                                      <p class="card-text">
                                        Time: 9:00-11:00 am
                                      </p>
                                      <a
                                        class="btn btn-outline-success"
                                        role="button"
                                        href="/itemDetails/2"
                                      >
                                        Read More
                                      </a>
                                    </div>
                                    <div class="card-footer text-body-secondary">
                                      1 week ago
                                    </div>
                                  </div>
                                </div>
                                <div class="col-lg-3 col-md-6 col-sm-10 my-4">
                                  <div class="card">
                                    <img
                                      src={wallet}
                                      class="card-img-top"
                                      alt=""
                                      width="200px"
                                      height="200px"
                                    />
                                    <div class="card-body">
                                      <h4 class="card-title">Wallet</h4>
                                      <p class="card-title">Location: MN1270</p>
                                      <p class="card-text">
                                        Time: 10:00 am-12:00 pm
                                      </p>
                                      <a
                                        class="btn btn-outline-success"
                                        role="button"
                                        href="/itemDetails/3"
                                      >
                                        Read More
                                      </a>
                                    </div>
                                    <div class="card-footer text-body-secondary">
                                      6 days ago
                                    </div>
                                  </div>
                                </div>
                                <div class="col-lg-3 col-md-6 col-sm-10 my-4">
                                  <div class="card">
                                    <img
                                      src={airpods}
                                      class="card-img-top"
                                      alt=""
                                      width="200px"
                                      height="200px"
                                    />
                                    <div class="card-body">
                                      <h4 class="card-title">Airpods</h4>
                                      <p class="card-title">
                                        Location: Deerfield cafeteria
                                      </p>
                                      <p class="card-text">
                                        Time: 8:00-10:00 am
                                      </p>
                                      <a
                                        class="btn btn-outline-success"
                                        role="button"
                                        href="/itemDetails/4"
                                      >
                                        Read More
                                      </a>
                                    </div>
                                    <div class="card-footer text-body-secondary">
                                      4 days ago
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div id="found" class="tab-pane fade ">
                              <div class="row">
                                <div class="col">
                                  <img
                                    src={no_results}
                                    alt=""
                                    class="card-img-top no-result"
                                  />
                                  <p>
                                    Sorry! It looks like you have not made any
                                    reports previously.
                                  </p>
                                </div>
                              </div>
=======
import React, { useState, useEffect } from "react";
import NavBar from "../../common/NavBar";
import fetcher from "../../../fetchHelper";
import "./style.css";
import no_img from "../../../assets/img/no_img.png";
import no_results from "../../../assets/img/no_results.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  let navigate = useNavigate();
  const [lostItems, setLostItems] = useState({ next: null, results: [] });
  const [foundItems, setFoundItems] = useState({ next: null, results: [] });

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
            setLostItems({
              ...json,
              results: [...json.userPosts.lostItems, ...lostItems.results],
            });
            setFoundItems({
              ...json,
              results: [...json.userPosts.foundItems, ...lostItems.results],
            });
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
    const itemDateCreated = new Date(item.dateCreated);
    const daysAgo = Math.floor(
      (new Date() - itemDateCreated) / (24 * 60 * 60 * 1000)
    );
    let card_status = "";
    if (item.isActive) card_status = "card";
    else card_status = "card opacity-25";

    return (
      <div className="col-lg-3 col-md-6 col-sm-10 my-4">
        <div className={card_status}>
          <div id="carouselExample" className="carousel slide">
            <div className="carousel-inner">
              {item.image ? (
                item.image.map((i, index) => {
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
            <h4 className="card-title">{item.title}</h4>
            <p className="card-title">Location: {item.locationFound}</p>
            <p className="card-text">Time: {item.timeFound}</p>
            <a
              className="btn btn-outline-success"
              role="button"
              href={`/itemDetails/${item.id}`}
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

      <div className="container-fluid mt-5 text-center">
        <div className="row" style={{ height: 20 + "vh" }}>
          <div className="col" id="requestLostItem">
            <a
              className="btn w-75 h-75 p-2"
              role="button"
              href="/requestLostItem"
            >
              Request lost item query
            </a>
          </div>
          <div className="col" id="reportFoundItem">
            <a
              className="btn w-75 h-75 p-2"
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
                              {lostItems.results.length !== 0
                                ? lostItems.results.map((item) =>
                                    createItemCard(item)
                                  )
                                : createNoResultsCard()}
                            </div>
                          </div>
                          <div id="found" className="tab-pane fade ">
                            <div className="row">
                              {foundItems.results.length !== 0
                                ? foundItems.results.map((item) =>
                                    createItemCard(item)
                                  )
                                : createNoResultsCard()}
>>>>>>> 9005127b42abcc77431f4c1a61a0ed43b4ec9999
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
