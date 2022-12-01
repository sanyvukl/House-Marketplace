import { useState, useEffect, useContext, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user/user.context";
import { CategoryContext } from "../../context/category/category.context";
import Spinner from "../Spinner/spinner.component";
import { toast } from "react-toastify";
import { getStoreImagesUrl } from "../../utils/firebase/firebase.utils";
import { serverTimestamp } from "firebase/firestore";
// import config from "../../config.json";

const CreateListing = () => {
    const navigate = useNavigate();
    const { currentUser, isUserLoading } = useContext(UserContext);
    const { addListingItem } = useContext(CategoryContext);
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountedPrice: 0,
        address: "",
        latitude: "",
        longitude: "",
        images: [],
        furnished: false,
        offer: false,
        parking: false,
        userRef: "",
    });
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);

    const {
        type, name, bedrooms, bathrooms,
        regularPrice, discountedPrice,
        address, latitude, longitude,
        images, furnished, offer,
        parking, userRef,
    } = formData;

    useEffect(() => {
        if (currentUser) {
            setFormData({ ...formData, userRef: currentUser.uid });
        } else {
            navigate("/sign-in");
        }
    }, []);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        if (value === "true") {
            return setFormData({ ...formData, [name]: true });
        }
        if (value === "false") {
            return setFormData({ ...formData, [name]: false });
        }
        if (e.target.files) {
            return setFormData({ ...formData, [name]: e.target.files })
        }

        setFormData({ ...formData, [name]: value });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (images.length > 6) {
            toast.error("max is 6 images");
            return;
        }
        if (offer && (regularPrice < discountedPrice)) {
            toast.error("Discounted price must be lower");
            return;
        }
        if (discountedPrice === 0 && regularPrice > 0) {
            setFormData({ ...formData, discountedPrice: 0, offer: false });
        }
        let geolocation = {};
        let location;
        if (geolocationEnabled) {
            const responce = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${address}
                 &key=AIzaSyCjtfnkdDwh4I7yR1CV77cXIk5ljioYVxw`);
            const data = await responce.json();
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
            location = data.status === "ZERO_RESULTS" ? undefined : data.results[0]?.formatted_address;
            if (location === undefined) {
                toast.error("Enter correct address");
                return;
            }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
            location = address;
        }
        const imageUrls = await Promise.all(
            [...images].map((image) => getStoreImagesUrl(image))
        ).catch(() => {
            toast.error("Images not uploaded");
            return;
        });
        const listing = {
            type, name, bathrooms,
            bedrooms, regularPrice,
            discountedPrice, geolocation,
            imageUrls, location, offer,
            parking, furnished,
            timestamp: serverTimestamp(),
            userRef,
        };
        // Adding Listing
        const listingId = await addListingItem(listing);
        navigate(`/category/${type}/${listingId}`);
    };

    return isUserLoading ? <Spinner /> : (
        <div className="profile">
            <header>
                <p className="pageHeader">Create a Listing</p>
            </header>

            <main>
                <form onSubmit={onSubmitHandler}>
                    <label className="formLabel">
                        Sell / Rent
                    </label>
                    <div className="formButtons">
                        <button
                            name="type"
                            value="sale"
                            type="button"
                            onClick={onChangeHandler}
                            className={type === "sale" ? "formButtonActive" : "formButton"}
                            required
                        >
                            Sell
                        </button>
                        <button
                            name="type"
                            value="rent"
                            type="button"
                            onClick={onChangeHandler}
                            className={type === "rent" ? "formButtonActive" : "formButton"}
                            required
                        >
                            Rent
                        </button>
                    </div>
                    <label className="formLabel">
                        Name
                    </label>
                    <input
                        type="text"
                        className="formInputName"
                        name="name"
                        value={name}
                        onChange={onChangeHandler}
                        required />

                    <div className="formRooms flex">
                        <div>
                            <label className="formLabel">
                                Bedrooms
                            </label>
                            <input
                                type="number"
                                className="formInputSmall"
                                name="bedrooms"
                                value={bedrooms}
                                onChange={onChangeHandler}
                                min="1"
                                max="50"
                                required />
                        </div>
                        <div>
                            <label className="formLabel">
                                Bathrooms
                            </label>
                            <input
                                type="number"
                                className="formInputSmall"
                                name="bathrooms"
                                value={bathrooms}
                                onChange={onChangeHandler}
                                min="1"
                                max="50"
                                required />
                        </div>
                    </div>

                    <label className="formLabel">
                        Parking spot
                    </label>

                    <div className="formButtons">
                        <button
                            type="button"
                            name="parking"
                            value={true}
                            className={parking ? "formButtonActive" : "formButton"}
                            onClick={onChangeHandler}
                        >Yes</button>
                        <button
                            type="button"
                            name="parking"
                            value={false}
                            className={!parking && parking !== null ? "formButtonActive" : "formButton"}
                            onClick={onChangeHandler}
                        >No</button>
                    </div>

                    <label className="formLabel">
                        Furnished
                    </label>

                    <div className="formButtons">
                        <button
                            type="button"
                            name="furnished"
                            value={true}
                            className={furnished ? "formButtonActive" : "formButton"}
                            onClick={onChangeHandler}
                        >Yes</button>
                        <button
                            type="button"
                            name="furnished"
                            value={false}
                            className={!furnished && furnished !== null ? "formButtonActive" : "formButton"}
                            onClick={onChangeHandler}
                        >No</button>
                    </div>

                    <label className="formLabel">Address</label>
                    <textarea
                        name="address"
                        value={address}
                        onChange={onChangeHandler}
                        className="formInputAddress"
                        required
                    />

                    {!geolocationEnabled && (
                        <div className="formRooms flex">
                            <div>
                                <label className="formLabel">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    className="formInputSmall"
                                    name="latitude"
                                    value={latitude}
                                    onChange={onChangeHandler}
                                    required />
                            </div>
                            <div>
                                <label className="formLabel">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    className="formInputSmall"
                                    name="longitude"
                                    value={longitude}
                                    onChange={onChangeHandler}
                                    required />
                            </div>
                        </div>
                    )}

                    <label className="formLabel">
                        Offer
                    </label>

                    <div className="formButtons">
                        <button
                            type="button"
                            name="offer"
                            value={true}
                            className={offer ? "formButtonActive" : "formButton"}
                            onClick={onChangeHandler}
                        >Yes</button>
                        <button
                            type="button"
                            name="offer"
                            value={false}
                            className={!offer && offer !== null ? "formButtonActive" : "formButton"}
                            onClick={onChangeHandler}
                        >No</button>
                    </div>

                    <label className="formLabel">
                        Regular Price
                    </label>
                    <div className="formPriceDiv">
                        <input
                            type="number"
                            className="formInputSmall"
                            name="regularPrice"
                            value={regularPrice}
                            onChange={onChangeHandler}
                            min="50"
                            max="7500000000"
                            required
                        />
                        {type === "rent" && (
                            <p className="formPriceText">$ / Month</p>
                        )}
                    </div>

                    {offer && (
                        <Fragment>
                            <label className="formLabel">
                                Offer Price
                            </label>
                            <div className="formPriceDiv">
                                <input
                                    type="number"
                                    className="formInputSmall"
                                    name="discountedPrice"
                                    value={discountedPrice}
                                    onChange={onChangeHandler}
                                    min="50"
                                    max="7500000000"
                                    required
                                />
                                {type === "rent" && (
                                    <p className="formPriceText">$ / Month</p>
                                )}
                            </div>
                        </Fragment>
                    )}

                    <label className="formLabel">Images</label>
                    <p className="imagesInfo">The first image will be the cover (max 6).</p>
                    <input
                        type={"file"}
                        name="images"
                        className="formInputFile"
                        onChange={onChangeHandler}
                        max="6"
                        accept=".jpg,.png,.jpeg"
                        multiple
                        required
                    />
                    <button type="submit" className="primaryButton createListingButton">
                        Create Listing
                    </button>
                </form>
            </main>
        </div>
    );
}

export default CreateListing;
