import React, { useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa'; // Import icons from react-icons

const ToggleButton = (props) => {
    const { onColor = 'bg-sky-500', offColor = 'bg-gray-500', onClick } = props
    const [isToggled, setIsToggled] = useState(false);

  // Function to handle toggle state change
  const handleToggle = () => {
    setIsToggled(!isToggled);
    if( onClick ) {
        onClick(!isToggled)
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-14 h-8 p-1 rounded-full transition-all duration-300 ${isToggled ? onColor : offColor}`}
    >
      <div
        className={`w-6 h-6 bg-backgroundMain rounded-full shadow-md transform transition-transform duration-300 ${
          isToggled ? 'translate-x-6' : 'translate-x-0'
        } flex justify-center items-center`}
      >
        {isToggled ? (
            <FaMoon className="w-4 h-4 text-white" />
        ) : (
            <FaSun className="w-4 h-4 text-black" />
        )}
      </div>
    </button>
  );
}

export default ToggleButton;
