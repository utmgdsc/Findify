import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fetcher from "../../../fetchHelper";
import no_results from "../../../assets/img/no_results.png";
import "./style.css";
import ItemCard from "../../common/ItemCard";

export default function Matches() {
  let navigate = useNavigate();
  const { id } = useParams();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getItemMatches(); // eslint-disable-next-line
  }, []);

  const getItemMatches = () => {
    console.log(id);
    let url = `item/getSimilarItems/${id}`;
    fetcher(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((json) => {
            console.log(json);
            setMatches([...json, ...matches]);
            console.log(matches);
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

  const createNoResultsCard = () => {
    return (
      <div className="col">
        <img src={no_results} alt="" className="card-img-top no-result" />
        <p>Sorry! There seems to be no matching items right now.</p>
        <p>
          We will email you if there are any new items reported that match your
          description
        </p>
      </div>
    );
  };

  return (
    <>
      <div className="container-fluid text-center">
        <div className="row" style={{ height: 80 + "vh" }}>
          <div className="col">
            <div className="container py-5">
              <div className="row">
                <div className="col-12 ">
                  <div className="bg-white rounded p-2">
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          {matches.length !== 0
                            ? matches.map((item) => {
                                const time = item.timeLost
                                  ? new Date(item.timeLost)
                                  : new Date(item.timeFound);
                                const daysAgo = Math.floor(
                                  (new Date() - time) / (24 * 60 * 60 * 1000)
                                );

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
                                    location={
                                      item.locationLost
                                        ? item.locationLost
                                        : item.locationFound
                                    }
                                    daysAgo={daysAgo}
                                  />
                                );
                              })
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
    </>
  );
}
