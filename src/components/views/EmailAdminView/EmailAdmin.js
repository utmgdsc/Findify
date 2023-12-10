import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import fetcher from "../../../fetchHelper";
import { useNavigate } from "react-router-dom";
import NavBar from "../../common/NavBar";
import Footer from "../../common/Footer";
import "./style.css";
import contact_us from "../../../assets/img/contact_us.svg";

export default function Contact() {
  let navigate = useNavigate();
  const form = useRef();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();
    let url = `admin/emailAdmin`;
    const jsonData = {
      subject: subject,
      body: body,
    };
    fetcher(url, {
      method: "POST",
      body: JSON.stringify(jsonData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((json) => {
            console.log(json);
            console.log("successful admin");
          });
        } else {
          // Check if user is logged in
          if (localStorage.getItem("token") === null) {
            alert(
              "Sorry, looks like you're not logged in. Click ok to be redirected back to the login page"
            );
            //navigate("/login", { replace: true });
          } else {
            return response.text().then((errorMessage) => {
              const errorObject = JSON.parse(errorMessage);
              setErrorEmail(errorObject.message);
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        const errorObject = JSON.parse(err);
        setErrorEmail(errorObject.message);
      });
  };

  return (
    <div>
      <NavBar />
      <Footer />
      <div class="container">
        <div class="row mb-5 mt-3">
          <div class="col lg-8">
            <br />
            <br />
          </div>
        </div>
        <div class="row">
          <div class="col mb-5">
            <h1 className="display-7 mb-4" style={{ color: "aliceblue" }}>
              CONTACT US
            </h1>

            <span style={{ color: "aliceblue" }}>
              Need to get in touch us? Fill out the form with an enquiry and our
              team will get back to you within 2-3 business days.
            </span>

            <br />

            <img
              src={contact_us}
              alt="contact us"
              width="150px"
              height="150px"
            ></img>
          </div>
          <div
            class="col card d-flex align-items-right"
            style={{ padding: "20px" }}
          >
            <StyledContactForm>
              <form ref={form} onSubmit={submitHandler}>
                <label class="label-email" style={{ color: "black" }}>
                  Name
                </label>
                <input type="text" name="user_name" />
                <label class="label-email" style={{ color: "black" }}>
                  Subect
                </label>
                <input
                  type="email"
                  name="user_subject"
                  onChange={(e) => setSubject(e.target.value)}
                />
                <label class="label-email" style={{ color: "black" }}>
                  Body
                </label>
                <textarea
                  name="message"
                  onChange={(e) => setBody(e.target.value)}
                />
                <div class="d-flex justify-content-center">
                  <input type="submit" value="Send" />
                </div>
              </form>
            </StyledContactForm>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const StyledContactForm = styled.div`
  width: 400px;

  form {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    font-size: 16px;

    input {
      width: 100%;
      height: 35px;
      padding: 7px;
      outline: none;
      border-radius: 5px;
      border: 1px solid rgb(220, 220, 220);

      &:focus {
        border: 2px solid rgba(0, 206, 158, 1);
      }
    }

    textarea {
      max-width: 150%;
      min-width: 150%;
      width: 100%;
      max-height: 100px;
      min-height: 100px;
      padding: 7px;
      outline: none;
      border-radius: 5px;
      border: 1px solid rgb(220, 220, 220);

      &:focus {
        border: 2px solid rgba(0, 206, 158, 1);
      }
    }

    label {
      margin-top: 2rem;
      margin-bottom: 2px;
      font-size: 16px;
      color: aliceblue;
    }

    input[type="submit"] {
      margin-top: 2rem;
      cursor: pointer;
      background: rgb(249, 105, 14);
      color: white;
      border: none;
      width: 100px;
    }
  }
`;
