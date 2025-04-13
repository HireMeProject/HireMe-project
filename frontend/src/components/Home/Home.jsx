import React , {useState} from 'react';
import Navbar from "../Navbar/Navbar";
import Welcome from "../Home/Welcome";
import "./Home.css";
import Categories from './Categories';
import FeaturedJobs from './FeaturedJobs';
import Footer from "../Footer/Footer";
const Home = () => {
  const [toggle,setToggle]=useState(false);

  return (
    <div>
      <Navbar toggle={toggle} setToggle={setToggle} />
      <Welcome />
      <Categories />
      <FeaturedJobs />
      <Footer />
    </div>
  )
}

export default Home
