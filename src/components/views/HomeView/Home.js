import React, { useState, useEffect } from "react";
import NavBar from "../../common/NavBar";
import fetcher from "../../../fetchHelper";
import "./style.css";
import no_img from "../../../assets/img/no_img.png";
import no_results from "../../../assets/img/no_results.png";

export default function Home() {
  const [lostItems, setLostItems] = useState({ next: null, results: [] });
  const [foundItems, setFoundItems] = useState({ next: null, results: [] });

  useEffect(() => {
    getLostItems(); // eslint-disable-next-line
    getFoundItems(); // eslint-disable-next-line
  }, []);

  const getLostItems = () => {
    let url = `user/getLostItems/`;
    fetcher(url)
      .then((response) => response.json())
      .then((json) => {
        setLostItems({
          ...json,
          results: [...json.results, ...lostItems.results],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getFoundItems = () => {
    let url = `user/getFoundItems/`;
    fetcher(url)
      .then((response) => response.json())
      .then((json) => {
        setFoundItems({
          ...json,
          results: [...json.results, ...foundItems.results],
        });
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
                              {lostItems
                                ? lostItems.results.map((item) =>
                                    createItemCard(item)
                                  )
                                : createNoResultsCard()}
                            </div>
                          </div>
                          <div id="found" className="tab-pane fade ">
                            <div className="row">
                              {foundItems
                                ? foundItems.results.map((item) =>
                                    createItemCard(item)
                                  )
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
