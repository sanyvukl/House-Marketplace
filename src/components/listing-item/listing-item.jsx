import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../../assets/svg/editIcon.svg";
import bedIcon from "../../assets/svg/bedIcon.svg";
import bathtubIcon from "../../assets/svg/bathtubIcon.svg";

import { useContext } from "react";
import { UserContext } from "../../context/user/user.context";

const ListingItem = ({ listing, id, onDelete, onEdit }) => {
    const { currentUser } = useContext(UserContext);
    const {
        type, imageUrls,
        name, location,
        regularPrice, discountedPrice,
        offer, bedrooms, bathrooms,
    } = listing;

    return (
        <li className="categoryListing">
            <Link to={`/category/${type}/${id}`} className="categoryListingLink">
                <img
                    src={imageUrls[0]}
                    alt={name}
                    className="categoryListingImg"
                />
                <div className="categoryListingDetails">
                    <p className="categoryListingLocation">{location}</p>
                    <p className="categoryListingName">{name}</p>
                    <p className="categoryListingPrice">${offer ? discountedPrice.toLocaleString("en-US") : regularPrice.toLocaleString("en-US")}
                        {type === "rent" ? " / Month" : ""}
                    </p>
                    <div className="categoryListingInfoDiv">
                        <img src={bedIcon} alt="bed" />
                        <p className="categoryListingInfoText">{bedrooms > 1 ? `${bedrooms} Bedrooms` : `${bedrooms} Bedroom`}</p>
                        <img src={bathtubIcon} alt="bath" />
                        <p className="categoryListingInfoText">
                            {bathrooms > 1 ? `${bathrooms} Bathrooms` : `${bathrooms} Bathroom`}
                        </p>
                    </div>
                </div>
            </Link>
            {(currentUser && onDelete && currentUser.uid === listing.userRef) && <DeleteIcon className="removeIcon" fill="rgb(231,76,60)" onClick={onDelete} />}
            {(currentUser && onEdit && currentUser.uid === listing.userRef) && <EditIcon className="editIcon" onClick={onEdit} />}
        </li>
    )
}
export default ListingItem;
