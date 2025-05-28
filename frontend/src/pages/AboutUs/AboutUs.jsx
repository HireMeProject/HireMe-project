import React from 'react';
import './AboutUs.css'; // Create this CSS file for custom styling
// import teamImage from './images/team.jpg'; // Replace with your actual team image
import logo from '../../assets/HireMe-logo.png'; // Replace with your actual logo
import Navbar from '../../components/Navbar/Navbar';
import teamwork from "../../assets/teamwork.jpg"
import Footer from '../../components/Footer/Footer';

const AboutUs = () => {
  return (
   <>
   <Navbar />

    {/* <!-- Hero Section --> */}
    <section class="hero">
        <div class="container">
            <h2>About HireMe</h2>
            <p>Connecting talented professionals with top companies worldwide. Our mission is to simplify the hiring process for both recruiters and job seekers.</p>
        </div>
    </section>

    {/* <!-- About Section --> */}
    <section class="about-section">
        <div class="container">
            <div class="section-title">
                <h2>Our Story</h2>
                <p>HireMe was founded in 2025 with a vision to revolutionize the job recruitment industry by providing a seamless platform for both employers and job seekers.</p>
            </div>
            <div class="about-content">
                <div class="about-text">
                    <h3>Bridging the Gap Between Talent and Opportunity</h3>
                    <p>At HireMe, we understand the challenges faced by both recruiters and job seekers in today's competitive market. Our platform was designed to address these challenges head-on, providing tools and features that make the hiring process efficient, transparent, and effective.</p>
                    <p>For recruiters, we offer a comprehensive suite of tools to manage job postings, screen candidates, and make informed hiring decisions. For job seekers, we provide access to thousands of opportunities and the ability to showcase their skills to potential employers.</p>
                    <p>What sets us apart is our commitment to continuous innovation. We regularly update our platform with new features based on user feedback and industry trends, ensuring we remain at the forefront of recruitment technology.</p>
                </div>
                <div class="about-image">
                    <img src={teamwork} alt="HireMe Team" />
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Features Section --> */}
    <section class="features-section">
        <div class="container">
            <div class="section-title">
                <h2>Why Choose HireMe?</h2>
                <p>Discover the features that make our platform the preferred choice for thousands of recruiters and job seekers worldwide.</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i>💼</i>
                    </div>
                    <h3>For Recruiters</h3>
                    <p>Post unlimited job offers, manage applications, and find the perfect candidates with our advanced filtering system. Our subscription model gives you full control over your hiring process.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i>🔍</i>
                    </div>
                    <h3>For Job Seekers</h3>
                    <p>Search and filter through thousands of job opportunities. Apply for positions with just one click and track all your applications in one place - completely free of charge.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i>📊</i>
                    </div>
                    <h3>Smart Matching</h3>
                    <p>Our intelligent algorithm matches job seekers with relevant positions based on skills, experience, and preferences, saving time for both candidates and employers.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i>🛠️</i>
                    </div>
                    <h3>Profile Management</h3>
                    <p>Comprehensive profile tools for both companies and candidates. Showcase your skills, upload CVs, highlight achievements, and present your best professional self.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i>📈</i>
                    </div>
                    <h3>Analytics Dashboard</h3>
                    <p>Recruiters get detailed insights into their job postings' performance, applicant demographics, and hiring metrics to make data-driven decisions.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i>🔒</i>
                    </div>
                    <h3>Secure Platform</h3>
                    <p>We prioritize your data security and privacy with enterprise-grade encryption and strict privacy controls to protect all user information.</p>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Team Section --> */}
    <section class="team-section">
        <div class="container">
            <div class="section-title">
                <h2>Meet Our Team</h2>
                <p>The passionate professionals behind HireMe who work tirelessly to improve your recruitment experience.</p>
            </div>
            <div class="team-grid">
                <div class="team-member">
                    <img src="https://via.placeholder.com/150" alt="Team Member" />
                    <h3>Sarah Johnson</h3>
                    <p>CEO & Founder</p>
                    <div class="social-links">
                        <a href="#"><i>LinkedIn</i></a>
                        <a href="#"><i>Twitter</i></a>
                    </div>
                </div>
                <div class="team-member">
                    <img src="https://via.placeholder.com/150" alt="Team Member" />
                    <h3>Michael Chen</h3>
                    <p>CTO</p>
                    <div class="social-links">
                        <a href="#"><i>LinkedIn</i></a>
                        <a href="#"><i>Twitter</i></a>
                    </div>
                </div>
                {/* <div class="team-member">
                    <img src="https://via.placeholder.com/150" alt="Team Member" />
                    <h3>Emma Rodriguez</h3>
                    <p>Head of Product</p>
                    <div class="social-links">
                        <a href="#"><i>LinkedIn</i></a>
                        <a href="#"><i>Twitter</i></a>
                    </div>
                </div>
                <div class="team-member">
                    <img src="https://via.placeholder.com/150" alt="Team Member" />
                    <h3>David Kim</h3>
                    <p>Lead Developer</p>
                    <div class="social-links">
                        <a href="#"><i>LinkedIn</i></a>
                        <a href="#"><i>Twitter</i></a>
                    </div>
                </div> */}
            </div>
        </div>
    </section>

    {/* <!-- CTA Section --> */}
    <section class="cta-section">
        <div class="container">
            <h2>Ready to Transform Your Hiring Experience?</h2>
            <p>Join thousands of companies and professionals who have already discovered the HireMe advantage.</p>
            <div class="cta-buttons">
                <a href="register-recruiter.html" class="primary-button">Post Jobs Now</a>
                <a href="register-candidate.html" class="secondary-button">Find Your Dream Job</a>
            </div>
        </div>
    </section>

    {/* <!-- Footer --> */}
   <Footer />
    </>
  );
};

export default AboutUs;