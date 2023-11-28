import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import axios from 'axios';

export default function ContactPage() {

  function sendEmail(e) {
    e.preventDefault();    //This is important, i'm not sure why, but the email won't send without it

    emailjs.sendForm('service_01tx5zz', 'template_hphnat6', e.target, 'P2fYZ6JxB9XKPylYH')
      .then((result) => {
          window.location.reload()  //This is if you still want the page to reload (since e.preventDefault() cancelled that behavior) 
      }, (error) => {
          console.log(error.text);
      });
  }

   return (
    <div>
      <h2>Contact Us</h2>
      <div className="about-section-background">
      <form className="contact-form" onSubmit={sendEmail}>
        <input type="hidden" name="contact_number" />
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="from_name" className="form-control" placeholder="Enter your name" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="from_email" className="form-control" placeholder="Enter your email" />
        </div>
        <div className="form-group">
        <label>Message</label>
      <textarea name="message" className="form-control" placeholder="Enter your message" />
        </div>
        <input type="submit" value="Send" className="btn btn-success" style={{ marginTop: '10px' }}/>
      </form>
      </div>
    </div>
  );

}







