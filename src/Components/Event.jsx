import axios from "axios";
import { useEffect, useState } from "react";
import { HiMinusCircle, HiOutlinePencil } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import "./styles/event.css";
const Event = () => {
  const [eventList, setEventList] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editEventId, setEditEventId] = useState(null);
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const dateDotRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;

  const navigate = useNavigate();
  const token = localStorage.getItem("token")

  {
    /* 
		fetching event list from backend by getAllEvents endpoint *tamamlandı
	*/
  }

  const fetchEventList = async () => {
    try {
      const response = await axios.get(
      "http://localhost:8080/api/event/getAllEvents"
    , 
        { 
          headers : { 
            Authorization : `Bearer ${token}`,
          },
        }
  );
    setEventList(response.data); // Listeyi güncelle
    console.log("Liste getirildi", response.data);
  } catch (error) {
    console.log("Veri çekme hatası:", error);
  }
};

  {
    /* 
		show edit form 
		*/
  }

  const showEditForm = (event) => {
    setIsEditing(true);
    setEditEventId(event.id);
    setName(event.name || "");
    setDate(event.date || "");
  };

  {
    /* 
		 edit event func  
		*/
  }

  const editEvent = async () => {
    if (!name || !date) {
      setError("Etkinlik adı ve Tarihini giriniz");
      return;
    }
    if (!dateRegex.test(date) && !dateDotRegex.test(date)) {
      setError(
        "Tarih formatı geçerli değil. Lütfen DD/MM/YYYY formatında girin."
      );
      return;
    }

    const updatedEvent = { name, date };

    try {
      const response = await axios.put(
        `http://localhost:8080/api/event/update/${editEventId}`,
        updatedEvent
      );

      if (response.status === 200) {
        console.log("Etkinlik güncellendi:", response.data);
        // Güncelleme işlemi başarılı olursa, veriyi yeniden fetch et
        fetchEventList();
        setIsEditing(false); // Düzenleme modundan çık
        setName("");
        setDate("");
        setError("");
      }
    } catch (error) {
      console.log("Etkinlik güncelleme hatası:", error);
    }
  };

  useEffect(() => {
    fetchEventList(); // Bileşen yüklendiğinde listeyi getir
  }, []);

  {
    /* 
		 delete event func  
		*/
  }

  const deleteEvent = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/event/delete/${id}`
      );
      if (response.status === 200) {
        console.log("Etkinlik silindi:", id);
        // Silme işlemi başarılı olursa, veriyi yeniden fetch et
        fetchEventList();
      }
    } catch (error) {
      console.log("Silme hatası:", error);
    }
  };

  {
    /* 
		 add event func  
		*/
  }

  const addEventOnSubmit = async () => {
    if (!name || !date) {
      setError("Etkinlik adı ve Tarihini giriniz ");
      return;
    }
    if (!(dateRegex.test(date) || dateDotRegex.test(date))) {
      setError(
        "Tarih formatı geçerli değil. Lütfen DD/MM/YYYY veya DD.MM.YYYY formatında girin."
      );
      return;
    }
    const newEvent = { name, date };
    try {
      const response = await axios.post(
        "http://localhost:8080/api/event/createEvent",
        newEvent
      );
      setEventList([...eventList, response.data]);
      console.log("Yeni etkinlik eklendi:", response.data);

      document.querySelector("#tarih").value = "";
      document.querySelector("#name").value = "";
      setName("");
      setDate("");
      setError("");
    } catch (error) {
      console.log("Etkinlik ekleme hatası:", error);
    }
  };
  const handleEventClick = (id) => {
    navigate(`/event/${id}`); // Navigate to the event detail page
  };

  return (
    <div className="EventFormAndList">
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
            <button id="btn" onClick={editEvent}>
              Güncelle
            </button>
            <button id="btn" onClick={() => setIsEditing(false)}>
              İptal
            </button>
          </>
        ) : (
          <>
            <h3>Yeni Etkinlik</h3>
            <input
              id="name"
              value={name}
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Etkinlik adı giriniz"
            />
            <input
              id="tarih"
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="GG/AA/YYYY VEYA GG.AA.YYYY"
            />
            <button id="btn" onClick={addEventOnSubmit}>
              Oluştur
            </button>
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
