import axios from "axios";
import { useEffect, useState } from "react";
import { HiMinusCircle, HiOutlinePencil } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import "./styles/sidebar.css";
import axiosInstance from "../interceptor/axiosInstance";
const Sidebar = ({ eventId }) => {
    const [ad, setAd] = useState("");
    const [soyad, setSoyad] = useState("");
    const [odedigiTutar, setOdedigiTutar] = useState(""); // Initialize as an empty string
    const [id, setId] = useState(null);
    const [personList, setPersonList] = useState([]);
    const [error, setError] = useState("");
    const [edittedPerson, setEdittedPerson] = useState(null);
    const navigate = useNavigate();
    const regex = /^[A-Za-zçÇğĞıİöÖşŞüÜ ]+$/;
    const numericId = Number(eventId);
    const [eventCard, setEventCard] = useState({});
    const validateForm = (ad, soyad, odedigiTutar, regex, setError) => {
        setError("");
        if (String(odedigiTutar).trim() === "" || isNaN(odedigiTutar)) {
            setError("Lütfen ödediğiniz tutarı giriniz");
            return false;
        }
        if (!regex.test(ad.trim()) || !regex.test(soyad.trim())) {
            setError("Ad veya soyad sadece harf içerebilir.");
            return false;
        }
        return true;
    };
    const fetchEventById = async () => {
        try {
            const response = await axiosInstance.get(
                `/event/getEventById/${numericId}`
            );
            if (response && response.data) {
                setEventCard(await response.data);
            }
            console.log(eventCard);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchEventById();
    }, []);

    const fetchPersonList = async () => {
        try {
            const response = await axiosInstance.get(`/person/event/getList`, {
                params: { eventId: numericId },
            });
            if (response && response.data) {
                setPersonList(response.data);
            }
        } catch (error) {
            console.error("Fetching failed", error);
        }
    };
    useEffect(() => {
        fetchPersonList();
    }, []);

    const handleRemove = async (id) => {
        try {
            const response = await axiosInstance.delete(`/person/delete/${id}`);
            if (response.status === 200) {
                // API başarılı yanıt verirse
                const updatedList = personList.filter(
                    (person) => person.id !== id
                );
                setPersonList(updatedList);

                console.log("person  deleted id :  ", id);
            }
        } catch (error) {
            console.error("Error removing person:", error);
        }
    };

    const showEditForm = (person) => {
        const editForm = document.querySelector(".editForm");
        editForm.style.visibility = "visible";
        editForm.style.opacity = 1;
        setEdittedPerson(person);
        setId(person.id);
        setAd(person.ad);
        setSoyad(person.soyad);
        setOdedigiTutar(person.odedigiTutar);
    };

    const handleEdit = async (event) => {
        event.preventDefault();
        if (!validateForm(ad, soyad, odedigiTutar, regex, setError)) {
            return;
        }

        if (edittedPerson) {
            const updatedPerson = {
                id,
                ad,
                soyad,
                odedigiTutar: parseFloat(odedigiTutar).toFixed(2),
            };
            try {
                console.log("edited person : " + id);

                // Get token from localStorage
                const token = localStorage.getItem("token");

                // Manually set the Authorization header with the JWT token
                await axios.put(
                    `http://localhost:8080/api/person/update/${id}`,
                    updatedPerson,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const updatedList = personList.map((person) =>
                    person.id === id ? updatedPerson : person
                );
                setPersonList(updatedList);
                setEdittedPerson(null);
                const editForm = document.querySelector(".editForm");
                editForm.style.visibility = "hidden";
                editForm.style.opacity = 0;
                document.querySelector("form").reset();
                setAd("");
                setSoyad("");
                setOdedigiTutar(""); // Reset to empty string
            } catch (error) {
                console.error("Error updating person:", error);
            }
        }
    };
    const handleGoBack = () => {
        navigate("/event"); // Navigate back to event page
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm(ad, soyad, odedigiTutar, regex, setError)) {
            return;
        }

        if (!error) {
            const newPerson = {
                ad,
                soyad,
                odedigiTutar: parseFloat(odedigiTutar).toFixed(2),
            };
            try {
                const response = await axiosInstance.post(
                    "/person/createPerson",
                    { ...newPerson },
                    { params: { eventId: eventId } }
                );
                setPersonList([...personList, response.data]);
                console.log(personList);
                document.querySelector("form").reset();
                setAd("");
                setSoyad("");
                setOdedigiTutar(""); // Reset to empty string
            } catch (error) {
                console.error("Error adding person:", error);
            }
        }
    };

    return (
        <>
            <div className="editForm">
                <div className="mainForm">
                    <form className="form" onSubmit={handleEdit}>
                        <label htmlFor="Ad">Ad</label>
                        <input
                            type="text"
                            name="Ad"
                            id="Ad"
                            required
                            value={ad}
                            onChange={(e) => setAd(e.target.value)}
                        />
                        <label htmlFor="Soyad">Soyad</label>
                        <input
                            type="text"
                            name="Soyad"
                            id="Soyad"
                            required
                            value={soyad}
                            onChange={(e) => setSoyad(e.target.value)}
                        />
                        <label htmlFor="odedigiTutar">Ödediği Tutar</label>
                        <input
                            type="number"
                            name="odedigiTutar"
                            id="odedigiTutar"
                            step="0.01"
                            min="0"
                            required
                            value={odedigiTutar}
                            onChange={(e) => setOdedigiTutar(e.target.value)}
                        />
                        {error && <h4>{error}</h4>}
                        <button
                            type="submit"
                            id="submitButton"
                            className="buttons"
                        >
                            GÜNCELLE
                        </button>
                    </form>
                    <div className="eventCardWrapper">
                        <div className="card text-center shadow-lg border-light mt-5">
                            <div className="card-body">
                                <h5
                                    className="card-title text-success"
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: "bold",
                                        color: "#343a40",
                                    }}
                                >
                                    {eventCard.name}
                                </h5>
                                <p
                                    className="card-text"
                                    style={{
                                        fontSize: "1.125rem",
                                        color: "#6c757d",
                                    }}
                                >
                                    Etkinlik Tarihi: {eventCard.date}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sidebar col-md-5">
                <div className="mainForm">
                    <form className="form" onSubmit={handleSubmit}>
                        <label htmlFor="Ad">Ad</label>
                        <input
                            type="text"
                            name="Ad"
                            id="Ad"
                            required
                            value={ad}
                            onChange={(e) => setAd(e.target.value)}
                        />
                        <label htmlFor="Soyad">Soyad</label>
                        <input
                            type="text"
                            name="Soyad"
                            id="Soyad"
                            required
                            value={soyad}
                            onChange={(e) => setSoyad(e.target.value)}
                        />
                        <label htmlFor="odedigiTutar">Ödediği Tutar</label>
                        <input
                            type="number"
                            name="odedigiTutar"
                            id="odedigiTutar"
                            step="0.01"
                            min="0"
                            required
                            value={odedigiTutar}
                            onChange={(e) => setOdedigiTutar(e.target.value)}
                        />
                        {error && <h4>{error}</h4>}
                        <button type="submit" className="buttons">
                            KİŞİ EKLE
                        </button>
                    </form>
                    <div className="eventCardWrapper">
                        <div className="card text-center shadow-lg border-light mt-5">
                            <div className="card-body">
                                <h5
                                    className="card-title text-success"
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: "bold",
                                        color: "#343a40",
                                    }}
                                >
                                    {eventCard.name}
                                </h5>
                                <p
                                    className="card-text"
                                    style={{
                                        fontSize: "1.125rem",
                                        color: "#6c757d",
                                    }}
                                >
                                    Etkinlik Tarihi: {eventCard.date}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card goBackCard text-center shadow-lg border-light mt-4">
                        <div className="card-body">
                            <h5
                                className="card-title"
                                style={{
                                    fontSize: "1.25rem",
                                    fontWeight: "bold",
                                    color: "#007bff",
                                }}
                            >
                                Back to Event Page
                            </h5>
                            <button
                                className="btn btn-primary mt-2"
                                onClick={handleGoBack}
                            >
                                Back to Events
                            </button>
                        </div>
                    </div>
                </div>

                <div className="listPersons">
                    {personList.map((person) => (
                        <div key={person.id} className="personCard">
                            <div>
                                <strong>Ad:</strong> {person.ad}
                            </div>
                            <div>
                                <strong>Soyad:</strong> {person.soyad}
                            </div>
                            <div>
                                <strong>Ödediği Tutar:</strong>{" "}
                                {person.odedigiTutar}
                            </div>
                            <HiMinusCircle
                                onClick={() => handleRemove(person.id)}
                                style={{
                                    cursor: "pointer",
                                    color: "red",
                                    fontSize: "24px",
                                }}
                            />
                            <HiOutlinePencil
                                onClick={() => showEditForm(person)}
                                style={{
                                    cursor: "pointer",
                                    color: "green",
                                    fontSize: "24px",
                                    marginLeft: "10px",
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
