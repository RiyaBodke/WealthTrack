import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { getProfile } from "../api/user";

const UserContext = createContext();

export function UserProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function clearUser() {

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("authStep");
        sessionStorage.removeItem("loginEmail");
        sessionStorage.removeItem("loginPassword");

        setUser(null);

    }

    async function loadUser(){

        const token = sessionStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try{
            
            const data = await getProfile();

            setUser(data.user);

        }catch(error){

            console.error(error);
            
            sessionStorage.removeItem("token");
            setUser(null);
        }

        setLoading(false);
    }
    
    useEffect(() => {
        loadUser();
    }, []);

    const portfolio = useMemo(() => {

        const portfolioAmount =
            Number(user?.portfolio_amount) || 0;

        const investedAmount =
            Number(user?.invested_amount) || 0;

        const cashBalance =
            Number(user?.cash_balance) || 0;

        const investedPercentage =
            portfolioAmount > 0
                ? Math.min(
                    Math.round(
                        (investedAmount / portfolioAmount) * 100
                    ),
                    100
                )
                : 0;

        return {
            portfolioAmount,
            investedAmount,
            cashBalance,
            investedPercentage
        };

    }, [user]);

    return (
        <UserContext.Provider
            value={{
                user,
                portfolio,

                setUser,
                loading,
                setLoading,
                loadUser,
                clearUser
            }}
        >
            {children}
        </UserContext.Provider>
    );

}


export function useUser(){
    
    return useContext(UserContext);

}