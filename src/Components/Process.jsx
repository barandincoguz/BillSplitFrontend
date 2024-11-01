import axios from "axios";
import { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import axiosInstance from "../interceptor/axiosInstance";
const Process = ({ eventId }) => {
    const [processList, setProcessList] = useState([]);
    const [clickedIndexes, setClickedIndexes] = useState([]);
    const numericId = Number(eventId);

    const fetchProcessList = async () => {
        try {
            const getProcessList = await axiosInstance.get(
                "http://localhost:8080/api/person/process",
                { params: { eventId: numericId } }
            );
            setProcessList(getProcessList.data);
        } catch (error) {
            console.error("Fetching failed", error);
        }
    };

    const handleClick = (index) => {
        let newClickedIndexes;
        if (clickedIndexes.includes(index)) {
            newClickedIndexes = clickedIndexes.filter((i) => i !== index);
        } else {
            newClickedIndexes = [...clickedIndexes, index];
        }
        setClickedIndexes(newClickedIndexes);
        localStorage.setItem(
            "clickedIndexes",
            JSON.stringify(newClickedIndexes)
        );
    };

    useEffect(() => {
        handleCalc();
    }, []);

    const handleCalc = () => {
        fetchProcessList();
    };

    useEffect(() => {
        const storedClickedIndexes = localStorage.getItem("clickedIndexes");
        if (storedClickedIndexes) {
            setClickedIndexes(JSON.parse(storedClickedIndexes));
        }
    }, []);

    return (
        <div
            className="container-fluid py-4"
            style={{ height: "100vh", overflow: "hidden" }}
        >
            <div className="row">
                <div
                    className="col-lg-3 col-md-4 col-sm-12 mb-4"
                    style={{
                        height: "100%",
                        maxHeight: "calc(100vh - 120px)",
                        overflowY: "auto",
                    }}
                >
                    {processList.slice(0, 2).map((msg, index) => (
                        <div
                            key={index}
                            className="card text-center mb-3 shadow-sm"
                            style={{
                                backgroundColor: "#f0e5d8",
                                borderRadius: "20px",
                                padding: "20px",
                                transition:
                                    "transform 0.3s ease, background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.backgroundColor =
                                    "#e5d8c2";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.backgroundColor =
                                    "#f0e5d8";
                            }}
                        >
                            <p className="card-text">{msg}</p>
                        </div>
                    ))}

                    <div className="text-center mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                backgroundImage:
                                    "linear-gradient(to right, #E55D87, #5FC3E4)",
                                border: "none",
                                borderRadius: "10px",
                                padding: "12px 24px",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                                transition: "background-position 0.5s",
                                backgroundSize: "200% auto",
                                color: "#fff",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundPosition =
                                    "right center")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundPosition =
                                    "left center")
                            }
                            onClick={handleCalc}
                        >
                            Hesapla
                        </button>
                    </div>
                </div>

                {/* Right Section for Remaining Messages, Scrollable */}
                <div
                    className="col-lg-9 col-md-8 col-sm-12"
                    style={{ maxHeight: "80vh", overflowY: "auto" }}
                >
                    {processList.slice(2).map((msg, index) => (
                        <div
                            key={index}
                            className="card text-center m-3 shadow-sm"
                            style={{
                                position: "relative",
                                borderRadius: "12px",
                                padding: "20px",
                                backgroundColor: "#ffffff",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            <p className="card-text">{msg}</p>
                            <TiTick
                                className="position-absolute"
                                onClick={() => handleClick(index)}
                                style={{
                                    right: "1.5rem",
                                    fontSize: "3rem",
                                    cursor: "pointer",
                                    color: clickedIndexes.includes(index)
                                        ? "green"
                                        : "red",
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Process;
