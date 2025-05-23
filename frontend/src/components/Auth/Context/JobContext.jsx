import React, { createContext, useState, useEffect,useContext } from 'react';
// import { LoginContext } from '../../components/Auth/Context/AuthContext';
// import { ToastContainer } from 'react-toastify';
import axios from 'axios';
export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);


  const fetchJobs= async (filters = {}) => {
    setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/joboffers`, {
          params: {
            category: filters.filtreCategory, // ex: ['IT', 'Design']
            status: filters.filtreStatus, // ex: ['open']
            contractType: filters.filtreEmploymentType, // ex: ['Remote', 'Full-time']
            minsalary: filters.filtrePriceRange?.[0],
            maxsalary: filters.filtrePriceRange?.[1],
            page:page, limit:limit,
          },
        });
        console.log("jobs response in contexte:", response.data);
        setJobs(response.data.jobOffers.jobOffers);
        setTotalPages(Math.ceil(response.data.jobOffers.total / limit));
      } catch (error) {
        console.error("Error fetching jobs:", error);
        // toast.error("Failed to load companies. Please try again.");
      }
      finally {
      setLoading(false);
    }
    };

  return (
    <JobContext.Provider value={{
        jobs,
        loading,
        fetchJobs,
        page,
        setPage,
        totalPages,
      }}>
      {children}
    </JobContext.Provider>
  );
};