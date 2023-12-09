import React, { useState, useEffect } from "react";
import NavBar from "../../common/NavBar";
import fetcher from "../../../fetchHelper";
import "./style.css";
import no_results from "../../../assets/img/no_results.png";
import { useNavigate } from "react-router-dom";
import ItemCard from "../../common/ItemCard";
import Footer from "../../common/Footer";

export default function Home() {
  let navigate = useNavigate();
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin(); // eslint-disable-next-line
  }, []);

  const checkAdmin = () => {
    let url = `admin/allLostItems/`;
    fetcher(url)
      .then((response) => {
        if (response.status === 200) {
          console.log("admin user");
          setIsAdmin(true);
          getAdminPosts();
        } else if (response.status == 403) {
          console.log("normal user");
          setIsAdmin(false);
          getUserPosts();
        } else {
          console.log("unexpected error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAdminPosts = () => {
    let url = `admin/allLostItems/`;
    fetcher(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((json) => {
            console.log(json.lostItems);
            setLostItems([...json.lostItems, ...lostItems]);
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

    url = `admin/allFoundItems/`;
    fetcher(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((json) => {
            console.log(json.foundItems);
            setFoundItems([...json.foundItems, ...foundItems]);
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

  const getUserPosts = () => {
    let url = `item/getUserPosts/`;
    fetcher(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((json) => {
            setLostItems(json.userPosts.lostItems);
            setFoundItems(json.userPosts.foundItems);
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

  const createItemCard = (item, category) => {
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
        category={category}
      />
    );
  };

  const createNoResultsCard = () => {
    return (
      <div className="col">
        <img src={no_results} alt="" className="card-img-top no-result" />
        <p className="no-resulst-text">
          Sorry! It looks like you have not made any reports previously.
        </p>
      </div>
    );
  };

  return (
    <>
      <NavBar />

      <div className="container surrounding-box text-center">
        <div className="row buttons" style={{ height: 20 + "vh" }}>
          <div className="col-6" id="requestLostItem">
            <a
              className="btn btn-outline-info"
              role="button"
              href="/requestLostItem"
            >
              Request Lost Item Query
            </a>
          </div>
          <div className="col-6" id="reportFoundItem">
            <a
              className="btn btn-outline-info"
              role="button"
              href="/reportFoundItem"
            >
              Report Unidentified Item Found
            </a>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="container py-5">
              <div className="row">
                <div className="col-12 ">
                  <div className="item-list p-2">
                    <ul className="nav nav-tabs item-tabs justify-content-center">
                      <li className="nav-item items-link">
                        <a
                          className="nav-link active p-2"
                          data-bs-toggle="tab"
                          href="#lost"
                        >
                          {isAdmin
                            ? "All Lost Items"
                            : "Past lost item queries"}
                        </a>
                      </li>
                      <li className="nav-item items-link">
                        <a
                          className="nav-link p-2"
                          data-bs-toggle="tab"
                          href="#found"
                        >
                          {isAdmin
                            ? "All Found Items"
                            : "Past found item queries"}
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
                                ? lostItems.map((item) =>
                                    createItemCard(item, "lostitem")
                                  )
                                : createNoResultsCard()}
                            </div>
                          </div>
                          <div id="found" className="tab-pane fade ">
                            <div className="row">
                              {foundItems.length !== 0
                                ? foundItems.map((item) =>
                                    createItemCard(item, "founditem")
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
      <Footer />
    </>
  );
}
