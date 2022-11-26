const Input = ({ type, className, placeholder, value, id }) => {
    
    return (
        <input
            id={id}
            type={type}
            className={className}
            placeholder={placeholder}
            value={value}
        />
    );
};
export default Input;
