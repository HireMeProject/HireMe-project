import React , {useState} from 'react';
import Navbar from "../../components/Navbar/Navbar";
import Welcome from "../../components/Home/Welcome";
import "./Home.css";
import Categories from '../../components/Home/Categories';
import FeaturedJobs from '../../components/Home/FeaturedJobs';
import Footer from "../../components/Footer/Footer";
const Home = () => {


  return (
    <div>
      <Navbar  />
      <Welcome />
      <Categories />
      <FeaturedJobs />
      <Footer />
    </div>
  )
}

export default Home
