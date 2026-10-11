import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

// COMPONENTS IMPORT
import { UserManagementTable } from "../../components/tables"
import { Add, Delete, Edit, SearchBar, Filter, SortBy } from "../../components/button"
import { PendingUsersCard, TotalUsersCard } from "../../components/cards"

export default function UserManagement(){
    
    const [users, setUsers] = useState([]);

    useEffect( () => {

        const fetchUsers = async () => {
            try{

                const token = sessionStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:8000/api/users",
                    {
                        headers : {
                            Authorization : `Bearer ${token}`
                        }
                    }
                );

                console.log(response.data);

                setUsers(response.data.users);

            }catch(error){

                console.error(error);

            }
        };

        fetchUsers();
    }, [])

    const totalUsers = users.length;

    const activeUsers = users.filter(
        user => user.status === "Active"
    ).length;

    const inactiveUsers = users.filter(
        user => user.status === "Inactive"
    ).length;

    return(
        <div className="flex flex-col bg-transparent gap-6">

            <div className="grid grid-cols-5 gap-5">

                < TotalUsersCard className="col-span-1" totalUsers= {totalUsers}/>

                
            </div>

            <div className="flex justify-between items-baseline">
                
                <SearchBar />

                <div className="flex gap-2">

                    <Add name="Clients" />

                    <SortBy />

                </div>

            </div>

            <UserManagementTable users={users} />
            
        </div>
    )
}