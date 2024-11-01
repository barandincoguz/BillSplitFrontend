import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Process from "./Process";
import axiosInstance from "../interceptor/axiosInstance";
import Sidebar from "./Sidebar";
const EventDetails = () => {
    const { eventId } = useParams();
    const [validIds, setValidIds] = useState([]);
    const [loading, setLoading] = useState(true); // Yükleme durumu
    useEffect(() => {
        const getValidEvents = async () => {
            try {
                const response = await axiosInstance.get("/event/getAllEvents");
                const events = response.data;

                // Geçerli event ID'leri set et
                const ids = events.map((event) => event.id);
                setValidIds(ids);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false); // Yükleme tamamlandı
            }
        };

        getValidEvents();
    }, []);

    const eventIdNumber = parseInt(eventId, 10);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!validIds.includes(eventIdNumber)) {
        return <Navigate to="/error" />;
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-5 col-md-5 col-sm-12 ">
                    <Sidebar eventId={eventIdNumber} />
                </div>
                <div className="col-lg-6 col-md-7 col-sm-12">
                    <Process eventId={eventIdNumber} />
                </div>
            </div>
        </div>
    );
};
export default EventDetails;
