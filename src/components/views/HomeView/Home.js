import React, { useState, useEffect } from "react";
import NavBar from "../../common/NavBar";
import fetcher from "../../../fetchHelper";
import "./style.css";
import no_results from "../../../assets/img/no_results.png";
import { useNavigate } from "react-router-dom";
import ItemCard from "../../common/ItemCard";

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
    const time = item.timeLost
      ? new Date(item.timeLost)
      : new Date(item.timeFound);
    const daysAgo = Math.floor((new Date() - time) / (24 * 60 * 60 * 1000));

    // Extract date components
    const year = time.getFullYear();
    const month = time.getMonth() + 1; // Months are zero-based (0 = January, 11 = December)
    const day = time.getDate();

    // Create date and time strings
    const dateStr = `${year}-${month}-${day}`;

    let card_status = "";
    if (item.isActive) card_status = "card";
    else card_status = "card opacity-25";

    return (
      <ItemCard
        id={item._id}
        name={item.itemName}
        dateStr={dateStr}
        card_status={card_status}
        imageUrls={item.imageUrls}
        location={item.locationLost ? item.locationLost : item.locationFound}
        daysAgo={daysAgo}
      />
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
