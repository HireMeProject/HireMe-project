import React from 'react'

const RoleSwitch = ({ChangeRole,role}) => {
  return (
    <div className='RoleSwitch-button'>
        <button className={`Job-Seeker-button ${role === "candidate" ? "selected" : "notSelected"}`} onClick={ChangeRole} value="candidate">Job Seeker</button>
        <button className={`Recruiter-button ${role === "recruiter" ? "selected" : "notSelected"}`} onClick={ChangeRole}  value="recruiter">Recruiter</button>
    </div>
  )
}

export default RoleSwitch
