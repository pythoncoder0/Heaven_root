import React from "react";
import "./contactPage.scss";

export default function ContactPage() {
  return (
    <div className="contactPage">
      <div className="textContainer">
        <div className="wrapper">
          <div className="title">Contact Us</div>
          <div className="info">
            <p>
              Have questions or need help? Reach out to us!
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:support@heavenroot.com">vishalkumarvishu02@gmail.com</a>
              <br />
              <strong>Phone:</strong> +91 8544700311
              <br />
              <strong>Address:</strong> Central University of Himachal Pradesh Shahpur Campus, Kangra, Himachal Pradesh, India 176206.
            </p>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/contact.png" alt="Contact" />
      </div>
    </div>
  );
}