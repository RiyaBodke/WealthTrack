import axios from "axios";

export async function getTradeBook() {

    const token = sessionStorage.getItem("token");

    const response = await axios.get(
        "http://localhost:8000/tradebook",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
}