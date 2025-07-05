import React from "react";
import "./aboutPage.scss";

export default function AboutPage() {
  return (
    <div className="aboutPage">
      <div className="textContainer">
        <div className="wrapper">
          <div className="title">About Us</div>
          <div className="info">
            <p>
              Welcome to Heaven Root! We are dedicated to helping you find the
              perfect property for your needs.
              <br />
              <br />
              Our platform offers a wide range of listings, detailed information,
              and easy booking options. Whether you are looking for a cozy guest
              house or a spacious apartment, we are here to make your search
              simple and enjoyable.
              <br />
              <br />
              Thank you for choosing Heaven Root!
            </p>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/about.png" alt="About" />
      </div>
    </div>
  );
}