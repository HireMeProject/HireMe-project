import React from 'react';
import { useLocation } from 'react-router-dom';

const RoleSwitch = ({ChangeRole,role}) => {
    const location = useLocation();
  const isSignupPage = location.pathname === '/Signup';

  return (
    <div className='RoleSwitch-button'>
        <button className={`Job-Seeker-button ${role === "candidate" ? "selected" : "notSelected"}`} onClick={ChangeRole} value="candidate">Job Seeker</button>
        <button className={`Recruiter-button ${role === "recruiter" ? "selected" : "notSelected"}`} onClick={ChangeRole}  value="recruiter">Recruiter</button>
        {!isSignupPage && (
                  <button className={`Recruiter-button ${role === "admin" ? "selected" : "notSelected"}`} onClick={ChangeRole}  value="admin">Admin</button>
        )}
    </div>
  )
}

export default RoleSwitch
