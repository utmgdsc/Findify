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
        <div class="container-fluid text-center">
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
