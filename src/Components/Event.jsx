import { useEffect, useState } from "react";
import { HiMinusCircle, HiOutlinePencil } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../interceptor/axiosInstance"; // Use custom axios instance
import "./styles/event.css";
import WelcomeDashboard from "./WelcomeDashboard";

const Event = () => {
    const [eventList, setEventList] = useState([]);
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editEventId, setEditEventId] = useState(null);
    //const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    // const dateDotRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
    const navigate = useNavigate();

    // Fetch the event list
    const fetchEventList = async () => {
        try {
            const response = await axiosInstance.get("/event/getAllEvents");
            setEventList(response.data);
            console.log("Liste getirildi", response.data);
        } catch (error) {
            console.log("Veri çekme hatası:", error);
        }
    };

    // Show edit form
    const showEditForm = (event) => {
        setIsEditing(true);
        setEditEventId(event.id);
        setName(event.name || "");
        setDate(event.date || "");
    };

    // Edit event
    const editEvent = async () => {
        if (!name || !date) {
            setError("Etkinlik adı ve Tarihini giriniz");
            return;
        }
        if (!date) {
            setError(
                "Tarih formatı geçerli değil. Lütfen DD/MM/YYYY formatında girin."
            );
            return;
        }

        const updatedEvent = { name, date };

        try {
            const response = await axiosInstance.put(
                `/event/update/${editEventId}`,
                updatedEvent
            );
            if (response.status === 200) {
                console.log("Etkinlik güncellendi:", response.data);
                fetchEventList();
                setIsEditing(false);
                setName("");
                setDate("");
                setError("");
            }
        } catch (error) {
            console.log("Etkinlik güncelleme hatası:", error);
        }
    };

    useEffect(() => {
        fetchEventList();
    }, []);

    // Delete event
    const deleteEvent = async (id) => {
        try {
            const response = await axiosInstance.delete(`/event/delete/${id}`);
            if (response.status === 200) {
                console.log("Etkinlik silindi:", id);
                fetchEventList();
            }
        } catch (error) {
            console.log("Silme hatası:", error);
        }
    };

    // Add event
    const addEventOnSubmit = async () => {
        if (!name || !date) {
            setError("Etkinlik adı ve Tarihini giriniz ");
            return;
        }
        if (!date) {
            setError(
                "Tarih formatı geçerli değil. Lütfen DD/MM/YYYY veya DD.MM.YYYY formatında girin."
            );
            return;
        }
        const newEvent = { name, date };

        try {
            const response = await axiosInstance.post(
                "/event/createEvent",
                newEvent
            );
            setEventList([...eventList, response.data]);
            console.log("Yeni etkinlik eklendi:", response.data);
            setName("");
            setDate("");
            setError("");
        } catch (error) {
            console.log("Etkinlik ekleme hatası:", error);
        }
    };

    const handleEventClick = (id) => {
        navigate(`/event/${id}`);
    };

    return (
        <div className="EventFormAndList">
            <WelcomeDashboard className="dashboard" />
            <div className="eventForm">
                {isEditing ? (
                    <>
                        <h3>Etkinlik Düzenle</h3>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Etkinlik adı"
                        />
                        <input
                            type="text"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="GG/AA/YYYY VEYA GG.AA.YYYY"
                        />
                        <button onClick={editEvent}>Güncelle</button>
                        <button onClick={() => setIsEditing(false)}>
                            İptal
                        </button>
                    </>
                ) : (
                    <>
                        <h3>Yeni Etkinlik</h3>
                        <input
                            value={name}
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Etkinlik adı giriniz"
                        />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="GG/AA/YYYY VEYA GG.AA.YYYY"
                        />
                        <button onClick={addEventOnSubmit}>Oluştur</button>
                    </>
                )}
                {error && <p className="error">{error}</p>}
            </div>
            <div className="listEventsContainer">
                {Array.isArray(eventList) &&
                    eventList.map((event) => (
                        <div
                            key={event.id}
                            className="listEvents"
                            onClick={() => handleEventClick(event.id)}
                        >
                            {event.name}
                            <br />
                            {event.date}
                            <div className="operations">
                                <HiMinusCircle
                                    style={{
                                        cursor: "pointer",
                                        color: "red",
                                        fontSize: "24px",
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteEvent(event.id);
                                    }}
                                />
                                <HiOutlinePencil
                                    style={{
                                        cursor: "pointer",
                                        color: "green",
                                        fontSize: "24px",
                                        marginLeft: "10px",
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showEditForm(event);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Event;
