import React, { useState, useEffect } from "react";
import SidebarRecruiter from "../Sidebar/SidebarRecruiter";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

const FiltreJobs = ({filtreCategory,filtreEmploymentType,filtrePriceRange,filtreStatus,
    setFiltreCategory,setFiltreEmploymentType,setFiltrePriceRange,setFiltreStatus}) => {
        const HandleCheckBoxChange = (e,setState,stateArray) => {
            console.log("e.target.value : ",e.target)
            // e.preventDefault();
            const{name,checked}=e.target;
                if (checked) {
                    setState([...stateArray, name]);
                  }        
            else{
                setState(stateArray.filter((item)=>item!==name));
            }

        };
          const HandleChangePrice = (e) => {
            // e.preventDefault();
            if(e.target.checked){
                setFiltrePriceRange(e.target.value.split("-"));
            }
            else{
                setFiltrePriceRange([0,10000]);
            }
            console.log("e.target.value : ",e.target.value)

          };
    console.log("filtre category range : ",filtreCategory)
  return (
    <div className='filtre-jobs-wrapper'>
      <div className="filtre-types">
        <h3>Type of employment</h3>
        <div className="filtre-content">
            <div><input type="checkbox" value="Part-time" name="Part-time" onChange={(e) => HandleCheckBoxChange(e, setFiltreEmploymentType, filtreEmploymentType)} checked={filtreEmploymentType.includes("Part-time")} /><label className='label-filtre-jobs'>Part-time</label></div>
            <div><input type="checkbox" value="Full-time" name="Full-time" onChange={(e) => HandleCheckBoxChange(e, setFiltreEmploymentType, filtreEmploymentType)} checked={filtreEmploymentType.includes("Full-time")} /><label className='label-filtre-jobs'>Full-time</label></div>
            <div><input type="checkbox" value="Remote" name="Remote" onChange={(e) => HandleCheckBoxChange(e, setFiltreEmploymentType, filtreEmploymentType)} checked={filtreEmploymentType.includes("Remote")} /><label className='label-filtre-jobs'>Remote</label></div>
            <div><input type="checkbox" value="Internship" name="Internship" onChange={(e) => HandleCheckBoxChange(e, setFiltreEmploymentType, filtreEmploymentType)} checked={filtreEmploymentType.includes("Internship")} /><label className='label-filtre-jobs'>Internship</label></div>
            <div><input type="checkbox" value="Contract" name="Contract" onChange={(e) => HandleCheckBoxChange(e, setFiltreEmploymentType, filtreEmploymentType)} checked={filtreEmploymentType.includes("Contract")} /><label className='label-filtre-jobs'>Contract</label></div>
        </div>
      </div>
      <div className="filtre-content">
        <h3>Category</h3>
            <div><input type="checkbox" value="Design" name="Design" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreCategory.includes("Design")} /><label className='label-filtre-jobs'>Design</label></div>
            <div><input type="checkbox" value="Sales" name="Sales" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreCategory.includes("Sales")} /><label className='label-filtre-jobs'>Sales</label></div>
            <div><input type="checkbox" value="Marketing" name="Marketing" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreCategory.includes("Marketing")} /><label className='label-filtre-jobs'>Marketing</label></div>
            <div><input type="checkbox" value="Business" name="Business" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreCategory.includes("Business")} /><label className='label-filtre-jobs'>Business</label></div>
            <div><input type="checkbox" value="IT" name="IT" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreCategory.includes("IT")} /><label className='label-filtre-jobs'>IT</label></div>
            <div><input type="checkbox" value="Finance" name="Finance" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreCategory.includes("Finance")} /><label className='label-filtre-jobs'>Finance</label></div>
            <div><input type="checkbox" value="Engineering" name="Engineering" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreCategory.includes("Engineering")} /><label className='label-filtre-jobs'>Engineering</label></div>
            <div><input type="checkbox" value="Technology" name="Technology" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreCategory.includes("Technology")} /><label className='label-filtre-jobs'>Technology</label></div>

        </div>
              <div className="filtre-types">
                <h3>Status</h3>
              <div><input type="checkbox" value="open" name="open" onChange={(e) => HandleCheckBoxChange(e, setFiltreStatus, filtreStatus)} checked={filtreStatus.includes("open")} /><label className='label-filtre-jobs'>open</label></div>
              <div><input type="checkbox" value="closed" name="closed" onChange={(e) => HandleCheckBoxChange(e, setFiltreStatus, filtreStatus)} checked={filtreStatus.includes("closed")} /><label className='label-filtre-jobs'>closed</label></div>
              </div>
      <div className="filtre-types">
        <h3>Price range</h3>
      <div><input type="checkbox" value="700-1000" name="700-1000" onChange={HandleChangePrice} /><label className='label-filtre-jobs' checked={filtrePriceRange.includes("700-1000")}>700$-1000$</label></div>
      <div><input type="checkbox" value="1000-1500" name="1000-1500" onChange={HandleChangePrice} /><label className='label-filtre-jobs' checked={filtrePriceRange.includes("1000-1500")}>1000$-1500$</label></div>
      <div><input type="checkbox" value="1500-2000" name="1500-2000" onChange={HandleChangePrice} /><label className='label-filtre-jobs' checked={filtrePriceRange.includes("1500-2000")}>1500$-2000$</label></div>
      <div><input type="checkbox" value="2000-" name="2000-" onChange={HandleChangePrice} /><label className='label-filtre-jobs' checked={filtrePriceRange.includes("2000-")}>2000$-above</label></div>

      </div>
    </div>
  )
}

export default FiltreJobs