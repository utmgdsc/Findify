import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fetcher from "../../../fetchHelper";

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
            setMatches([...json.matches, ...matches]);
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

  return <></>;
}
