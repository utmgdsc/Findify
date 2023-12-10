import React from "react";
import no_img from "../../assets/img/no_img.png";

export default function ItemCard (props) {
  let id = props.id;
  let name = props.name;
  let dateStr = props.dateStr;
  let card_status = props.card_status;
  let imageUrls = props.imageUrls;
  let location = props.location;
  let daysAgo = props.daysAgo;
  let category = props.category;

  return (
    <div className={ `item-card col-lg-2 mx-2 p-0 col-md-3 col-sm-10 my-3 mx-3 ${card_status}` }>
      { imageUrls.length > 1 ? (
        <div id="carouselExample" className="carousel slide">
          <div className="carousel-inner">
            { imageUrls.map((i, index) => {
              let class_value = "";
              if (index === 0) class_value = "carousel-item active";
              else class_value = "carousel-item";
              return (
                <div className={ class_value } key={ index }>
                  <img
                    className="card-img-top item-img border"
                    src={ i }
                    alt=""
                  />
                </div>
              );
            }) }
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
      ) : imageUrls.length === 1 ? (
        <img
          className="card-img-top item-img border"
          src={ imageUrls[0] }
          alt=""
        />
      ) : (
        <img className="card-img-top item-img border" src={ no_img } alt="" />
      ) }
      <div className="card-body">
        <h5 className="card-title fw-bold">{ name }</h5>
        <p className="card-title my-0">Location: { location }</p>
        <p className="card-title">Date: { dateStr }</p>
      </div>
      <a
        className={ 'read-more-btn mx-3' +
          card_status === "card opacity-25"
          ? "btn btn-outline-primary disabled"
          : "btn btn-outline-primary"
        }
        role="button"
        href={ `/${category}/${id}` }
      >
        Read More
      </a>
      <div className="card-footer text-body-secondary">
        { daysAgo } days ago
      </div>
    </div>
  );
}
