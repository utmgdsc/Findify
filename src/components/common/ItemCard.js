import React from "react";
import no_img from "../../assets/img/no_img.png";

export default function ItemCard(props) {
  let id = props.id;
  let name = props.itemName;
  let dateStr = props.dateStr;
  let card_status = props.card_status;
  let imageUrls = props.imageUrls;
  let location = props.location;
  let daysAgo = props.daysAgo;

  return (
    <div className="col-lg-3 col-md-6 col-sm-10 my-4">
      <div className={card_status}>
        <div id="carouselExample" className="carousel slide">
          <div className="carousel-inner">
            {imageUrls.length !== 0 ? (
              imageUrls.map((i, index) => {
                let class_value = "";
                if (index === 0) class_value = "carousel-item active";
                else class_value = "carousel-item";
                return (
                  <div className={class_value} key={i.id}>
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
          <h4 className="card-title">{name}</h4>
          <p className="card-title">Location: {location}</p>
          <p className="card-title">Date: {dateStr}</p>

          <a
            className="btn btn-outline-success"
            role="button"
            href={`/lostitem/${id}`}
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
}
