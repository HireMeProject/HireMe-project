import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "./Alljobs.css";
import Navbar from "../../components/Navbar/Navbar";
import Welcomejobs from "../../components/Jobs/Welcomejobs"
import FiltreJobs from '../../components/Jobs/FiltreJobs';
import Jobs from '../../components/Jobs/Jobs';
import Footer from '../../components/Footer/Footer';

const Alljobs = () => {
        const [filtreCategory, setFiltreCategory] = useState([]);
        const [filtreStatus, setFiltreStatus] = useState([]);
        const [filtreEmploymentType, setFiltreEmploymentType] = useState([]);
        const [filtrePriceRange, setFiltrePriceRange] = useState([0,100000]);
    
  return (
    <div>
        <Navbar />
        <Welcomejobs />
        <div className='all-jobs-container'>
          <FiltreJobs filtreCategory={filtreCategory} setFiltreCategory={setFiltreCategory} filtreEmploymentType={filtreEmploymentType} setFiltreEmploymentType={setFiltreEmploymentType} filtreStatus={filtreStatus} setFiltreStatus={setFiltreStatus} filtrePriceRange={filtrePriceRange} setFiltrePriceRange={setFiltrePriceRange} />
          <Jobs filtreCategory={filtreCategory} filtreEmploymentType={filtreEmploymentType} filtreStatus={filtreStatus} filtrePriceRange={filtrePriceRange}/>
        </div>
        <Footer />
      
    </div>
  )
}

export default Alljobs
