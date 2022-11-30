import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/user/user.context";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"


const ListingDetails = ({ listing }) => {
    const { currentUser } = useContext(UserContext);

    return (
        <div className="listingDetails">
            <p className="listingName">
                {listing.name} - $
                {listing.offer
                    ? listing.discountedPrice?.toLocaleString()
                    : listing.regularPrice?.toLocaleString()}
            </p>
            <p className="listingLocation">{listing.location}</p>
            <p className="listingType">For {listing.type}</p>

            {listing.offer && (
                <p className="discountPrice">
                    ${listing.regularPrice - listing.discountedPrice} discount
                </p>
            )}
            <ul className="listingDetailsList">
                <li>
                    {listing.bedrooms > 1
                        ? `${listing.bedrooms} Bedrooms`
                        : "1 Bedroom"}
                </li>
                <li>
                    {listing.bathrooms > 1
                        ? `${listing.bathrooms} Bathrooms`
                        : "1 Bathroom"}
                </li>
                <li>{listing.parking && "Parking Spot"}</li>
                <li>{listing.furnished && "Furnished"}</li>
            </ul>

            <p className="listingLocationTitle">Location</p>

            <div className="leafletContainer">
                <MapContainer
                    style={{ height: "100%", width: "100%" }}
                    zoom={13}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://tile.openstreetmap.org/{z}/{x}/{y}.png' />
                    <Marker position={[0, 0]}></Marker>
                    <Popup>{listing?.location}</Popup>
                </MapContainer>
            </div>

            {currentUser?.uid !== listing.userRef && (
                <Link
                    to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                    className="primaryButton"
                >
                    Contact Landlord
                </Link>
            )}
        </div>
    )
}
export default ListingDetails;