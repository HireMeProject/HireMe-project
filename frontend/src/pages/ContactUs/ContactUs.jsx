import React from 'react'
import "./ContactUs.css"
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const ContactUs = () => {
  return (
    <div>
         <Navbar />

    {/* <!-- Hero Section --> */}
    <section className="hero">
        <div className="container">
            <h2>Contact HireMe</h2>
            <p>We're here to help and answer any questions you might have. We look forward to hearing from you!</p>
        </div>
    </section>

    {/* <!-- Contact Section --> */}
    <section className="contact-section">
        <div className="container">
            <div className="section-title">
                <h2>Get In Touch</h2>
                <p>Whether you're a job seeker with questions about our platform or an employer interested in our recruitment solutions, our team is ready to assist you.</p>
            </div>
            <div className="contact-container">
                <div className="contact-info">
                    <h3>Contact Information</h3>
                    <div className="contact-method">
                        <div className="contact-icon">
                            <i>📍</i>
                        </div>
                        <div className="contact-details">
                            <h4>Our Office</h4>
                            <p>123 Business Avenue<br />Tech City, TC 10001<br />Country</p>
                        </div>
                    </div>
                    <div className="contact-method">
                        <div className="contact-icon">
                            <i>📞</i>
                        </div>
                        <div className="contact-details">
                            <h4>Phone</h4>
                            <p><a href="tel:+1234567890">+1 (234) 567-890</a></p>
                            <p>Monday - Friday, 9am - 6pm</p>
                        </div>
                    </div>
                    <div className="contact-method">
                        <div className="contact-icon">
                            <i>✉️</i>
                        </div>
                        <div className="contact-details">
                            <h4>Email</h4>
                            <p><a href="mailto:info@hireme.com">info@hireme.com</a></p>
                            <p>We typically reply within 24 hours</p>
                        </div>
                    </div>
                    {/* <div className="contact-method">
                        <div className="contact-icon">
                            <i>💬</i>
                        </div>
                        <div className="contact-details">
                            <h4>Live Chat</h4>
                            <p><a href="#">Start live chat</a></p>
                            <p>Available during business hours</p>
                        </div>
                    </div> */}
                </div>
                <div className="contact-form">
                    <h3>Send Us a Message</h3>
                    <form action="#" method="POST">
                        <div className="form-group">
                            <label for="name">Your Name</label>
                            <input type="text" id="name" name="name" required />
                        </div>
                        <div className="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" name="email" required />
                        </div>
                        <div className="form-group">
                            <label for="subject">Subject</label>
                            <select id="subject" name="subject" required>
                                <option value="" disabled selected>Select a subject</option>
                                <option value="general">General Inquiry</option>
                                <option value="recruiter">Recruiter Support</option>
                                <option value="candidate">Candidate Support</option>
                                <option value="technical">Technical Support</option>
                                <option value="feedback">Feedback/Suggestions</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label for="message">Your Message</label>
                            <textarea id="message" name="message" required></textarea>
                        </div>
                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- FAQ Section --> */}
    <section className="faq-section">
        <div className="container">
            <div className="section-title">
                <h2>Frequently Asked Questions</h2>
                <p>Find quick answers to common questions about our platform and services.</p>
            </div>
            <div className="faq-container">
                <div className="faq-item">
                    <div className="faq-question">
                        <span>How do I create an account as a job seeker?</span>
                        <span className="faq-toggle">▼</span>
                    </div>
                    <div className="faq-answer">
                        <p>Creating an account is simple! Click on the "Register" button at the top right of any page, select "Job Seeker" as your account type, and fill out the required information. You'll need to provide your name, email address, and create a password. Once registered, you can complete your profile by adding your skills, work experience, and uploading your CV.</p>
                    </div>
                </div>
                <div className="faq-item">
                    <div className="faq-question">
                        <span>What are the subscription options for recruiters?</span>
                        <span className="faq-toggle">▼</span>
                    </div>
                    <div className="faq-answer">
                        <p>We offer three subscription tiers for recruiters: Basic (5 job postings/month), Professional (unlimited job postings with advanced analytics), and Enterprise (custom solutions for large organizations). All plans include applicant management tools and company profile features. You can compare plans and upgrade/downgrade at any time from your account dashboard.</p>
                    </div>
                </div>
                <div className="faq-item">
                    <div className="faq-question">
                        <span>Is there a fee for job seekers to use HireMe?</span>
                        <span className="faq-toggle">▼</span>
                    </div>
                    <div className="faq-answer">
                        <p>No, our platform is completely free for job seekers. You can create a profile, search for jobs, apply to positions, and track your applications without any charges. We believe in providing equal opportunities to all candidates regardless of their financial situation.</p>
                    </div>
                </div>
                <div className="faq-item">
                    <div className="faq-question">
                        <span>How can I delete my account?</span>
                        <span className="faq-toggle">▼</span>
                    </div>
                    <div className="faq-answer">
                        <p>To delete your account, go to your account settings and click on "Delete Account" at the bottom of the page. Please note that this action is irreversible and will permanently remove all your data from our system. If you're a recruiter with an active subscription, you'll need to cancel your subscription first.</p>
                    </div>
                </div>
                <div className="faq-item">
                    <div className="faq-question">
                        <span>What security measures protect my data?</span>
                        <span className="faq-toggle">▼</span>
                    </div>
                    <div className="faq-answer">
                        <p>We take data security very seriously. Our platform uses industry-standard encryption (SSL/TLS) for all data transfers, and we store sensitive information in encrypted form. Regular security audits, two-factor authentication options, and strict privacy controls help ensure your data remains protected. You can review our Privacy Policy for more details.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Map Section --> */}
    <section className="map-section">
        <div className="container">
            <div className="map-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3234.7396391248944!2d10.5886303!3d35.83086320000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd8b3b860b9a3b%3A0x35d82efedf0f5515!2sEPI%20digital%20school!5e0!3m2!1sfr!2stn!4v1748403521473!5m2!1sfr!2stn"  allowfullscreen="" loading="lazy" ></iframe>
                {/* <iframe src="https://www.google.com/maps/embed?pb=!3m1!4b1!4m6!3m5!1s0x12fd8b3b860b9a3b:0x35d82efedf0f5515!8m2!3d35.8308632!4d10.5886303!16s%2Fg%2F11tmn_mr5_?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D" allowfullscreen="" loading="lazy"></iframe> */}
            </div>
        </div>
    </section>

    {/* <!-- CTA Section --> */}
    {/* <section className="cta-section">
        <div className="container">
            <h2>Need Immediate Assistance?</h2>
            <p>Our support team is available to help you with any questions or issues you may have.</p>
            <div className="cta-buttons">
                <a href="tel:+1234567890" className="primary-button">Call Support</a>
                <a href="#" className="secondary-button">Start Live Chat</a>
            </div>
        </div>
    </section> */}

    

   <Footer />
    </div>
  )
}

export default ContactUs
