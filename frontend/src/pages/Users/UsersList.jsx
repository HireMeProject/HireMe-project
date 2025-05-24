import React ,{useState,useEffect}from 'react';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';
import "./UsersList.css"

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState({});
    const [userId,setUserId]=useState("");
    const [profileMode,setProfileMode]=useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [filtreStatus, setFiltreStatus] = useState("");
    const token = localStorage.getItem("token");
    const [statuses, setStatuses] = useState([]);
    const [roles, setRoles] = useState({});
  
  const navigate = useNavigate();
  useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/users`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
               params:{
                status: filtreStatus,
              page:page, limit:limit,
            }
            }
          );
          console.log("Users response:", response.data);
          setUsers(response.data.users.users);
          setTotalPages(Math.ceil(response.data.users.total / limit));
  
          // Initialiser l'état des statuts
          const initialStatuses =[];
          response.data.users.users.forEach((user) => {
            initialStatuses[user._id] = user.status;
          });
          setStatuses(initialStatuses);
console.log("users list length: ",response.data.users.users.length)

        } catch (error) {
          console.error("Error fetching Users:", error);
          toast.error("Failed to load companies. Please try again.");
        }
      };
      fetchUsers();

    }, [token,page,limit,filtreStatus]);
console.log("totalpages: ",totalPages)
    //set the new status
    const HandleChangeStatus = async (e, Id) => {
      e.preventDefault();
      const newStatus = e.target.value;
      setStatuses((prevStatus) => ({
        ...prevStatus,
        [Id]: newStatus,
      }));
      
      try {
        console.log("app id: ", Id);
        console.log("data envoyé", newStatus);
        const response = await axios.patch(
          `http://localhost:8000/user-status/${Id}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            validateStatus: (status) => true,
  
          }
        );
        if (response.status === 200) {
          console.log(
            "User data statussss:",
            response.data.user.status
          );
          toast.success("Update successful! ", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error(response.data.message || "Identifiants incorrects.", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error in changing status:", error);
        toast.error("Failed to load companies. Please try again.");
      }
    };
     const HandleChangeFiltreStatus = (e) => {
      e.preventDefault();
      setFiltreStatus(e.target.value);
    };
    //change profile mode and set User id
    const changeProfileMode=(e,Id,role)=>{
      setUserId(Id);
      e.preventDefault();
        localStorage.setItem("UserProfileId",Id);

     
        setTimeout(() => navigate("/user-profile"), 1000);  
     
    }
  
  return (
  <div className="users-wrapper">
      <ToastContainer />
      <SidebarAdmin />
      <div className="my-job-list-container">
        <div className="my-users-title-container">All users</div>
    
        <div className="my-users-container">
          <div className="my-users-filter-container">
            <div className="my-users-list-title">
              All users List
            </div>
            <div className="filter-user-container">
              <div className=""></div>
              <div>
                <select className="filter-status" onChange={HandleChangeFiltreStatus}>
                  <option value="">status</option>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div className="my-users-list-container">
            <div className="my-users-fields-container">
              <div className="my-users-fiels">name</div>
              <div className="my-users-fiels">role</div>
              <div className="my-users-fiels">email</div>
              <div className="my-users-fiels">date created</div>
              <div className="my-users-fiels">status</div>
              {/* <div className="my-users-fiels">subscribed</div>               */}
              <div className="my-users-fiels">user profile</div>


            </div>
            <div className="my-users">
              {users.map((user) => (
                <div key={user._id} className="my-user">
                  <div className="user-title ">
                    {user?.name}
                  </div>
                  <div className="user-name app-title-style">
                    {user?.role}
                  </div>
                  <div className="user-email">
                    {user?.email}
                  </div>
                  <div className="user-date">
                  {user?.createdAt?.split('T')[0]}
                  </div>
                  <div className="user-status">
                    <select
                      value={statuses[user?._id] || ""}
                      onChange={(e) => HandleChangeStatus(e, user?._id)}
                      name="status"
                    >
                      <option value="">status</option>
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                  </div>
                  <div className="check-candidate-profile-btn-container">
                    <button className="check-candidate-profile-btn" onClick={(e)=>changeProfileMode(e,user._id,user.role,)}><i class="bi bi-person-square"></i><div>profile</div></button>
                  </div>
                  {/* <div className="check-candidate-profile-btn-container">
                    <button className="check-candidate-profile-btn" onClick={(e)=>changeCompanyMode(e,user._id)}><i class="bi bi-person-square"></i><div>Company</div></button>
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
        {/* ):null} */}
      </div>
    </div>
  );
};

export default UsersList
