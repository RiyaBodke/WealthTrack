import axios from "axios";

export async function getHistory(financialYear, quarter) {

    const token = sessionStorage.getItem("token");

    const response = await axios.get(
        "http://localhost:8000/history",
        {
            headers: {
                Authorization: `Bearer ${token}`
            },

            params: {
                financialYear,
                quarter
            }
        }
    );

    return response.data;
}