import React,{useEffect, useRef, useState} from 'react'
import { FiBriefcase, FiUsers, FiDollarSign, FiBell, FiSearch, FiBookmark } from 'react-icons/fi';
import axios from 'axios';
import io from 'socket.io-client';

const DashboardHeader = ({setSearchTerm,searchTerm}) => {
  // console.log("socket : ",socket)
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const token = localStorage.getItem("token");
    const role=localStorage.getItem("role");
    const [showNotifications, setShowNotifications] = useState(false);
    const socketRef = useRef(null);

    useEffect(()=>{
        const fetchUserProfile = async () => {
            try {
              // //console.log("Token récupéré pour la requête :", token);
              ////console.log("role :", role);
              let response="";
              if(role==="recruiter"){

 
               response = await axios.get("http://localhost:8000/profile", {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                validateStatus: (status) => true,
              });            
                          localStorage.setItem("profile-picture",response.data.recruiter.profilePhoto.url);
               setUser(response.data.recruiter);
}
              else if(role==="candidate"){
                response = await axios.get("http://localhost:8000/candidate/profile", {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                validateStatus: (status) => true,
              });          
              localStorage.setItem("profile-picture",response.data.candidate.profilePhoto.url);
                 setUser(response.data.candidate);

              }
               else {
                response = await axios.get("http://localhost:8000/profile-admin", {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                validateStatus: (status) => true,
              });          
              localStorage.setItem("profile-picture",response.data.user.profilePhoto.url);
                 setUser(response.data.user);

              }
            } catch (error) {
              console.error("Error fetching profile:", error.response?.data || error.message);
            }
          };
          fetchUserProfile();

    },[token])
    //notifications
    if(role==="recruiter"){

    
    useEffect(() => {
     
      const fetchNotifications = async () => {
        socketRef.current = io('http://localhost:8000', {
          auth: {
            token,
          },
        });
        const response = await axios.get('http://localhost:8000/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        });
          console.log('data', response.data);
        setNotifications(response.data);
        const unread = response.data.filter(notif => !notif.isRead).length;
      setUnreadCount(unread);
      };
  
      fetchNotifications();
      
      socketRef.current.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
  
      // Nettoyage
      return () => {
        socketRef.current.disconnect();
      };
    }, [token]);
  }
    const handleOpenNotifications = async() => {
      setShowNotifications(true);
      if(showNotifications===true){
        setShowNotifications(false);
        return;
      }
      try{
        console.log("token : ",token)
        const response=await axios.patch(`http://localhost:8000/notifications/read`, {},{
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          validateStatus: (status) => true,
        });
        
        setUnreadCount(0);
        console.log("response markAsread : ",response);
      }
      catch(error){
        console.error("Error mark as read notif:", error.response?.data || error.message);
      }
    };
  
    
  return (
    <header className="dashboard-header">
              <div className="search-bar">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search jobs, candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="user-actions">
                {role==="recruiter"?(
              <div className='notification_container'>
                <button onClick={handleOpenNotifications} className="notification-btn">
                  <FiBell />
                  <span className="badge" >{unreadCount}</span>
                </button>
                  <div className={`notification-dropdown ${showNotifications ? 'show' : ''}`}>
                    <ul>
                      {notifications?.length === 0 ? (
                        <li>Aucune notification</li>
                      ) : (
                        notifications?.map((notif, index) => (
                          <li key={index}>{notif.message}</li>
                        ))
                      )}
                    </ul>
                  </div>
                  </div>
                ):(
                  <>
                  </>
                )}
               

                <div className="user-profile">
                  <img src={user?.profilePhoto.url} alt="User" />
                </div>
              </div>
            </header>
  )
}

export default DashboardHeader
