import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getLandlordInfo } from "../../utils/firebase/firebase.utils";

const Contact = () => {
    const params = useParams();
    const [message, setMessage] = useState();
    const [landlord, setLandlord] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const getLandlord = async () => {
            const data = await getLandlordInfo(params.landlordId);
            setLandlord(data);
        }
        getLandlord();
    }, [params.landlordId]);

    const handleChange = (e) => {
        const { value } = e.target;
        setMessage(value);
    }

    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Contact Landlord</p>
            </header>

            {landlord !== null && (
                <main>
                    <div className="contactLandlord">
                        <p className="landlordName">Contact {landlord?.displayName}</p>
                    </div>

                    <form className="messageForm">
                        <div className="messageDiv">
                            <label htmlFor="message" className="messageLabel">Message</label>
                            <textarea
                                name="message"
                                id="message"
                                className="textarea"
                                value={message}
                                onChange={handleChange}
                            />
                        </div>
                        <a href={`mailto:${landlord.email}?Subject=${searchParams.get("listingName")}&body=${message}`}>
                            <button type="button" className="primaryButton">Send Message</button>
                        </a>
                    </form>
                </main>
            )}
        </div>
    )
}
export default Contact;
