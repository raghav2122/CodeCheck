import CheckboxOptions from "checkBoxOptions/checkBoxOptions"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"

import "checkBoxOptions/CheckboxOptions.css"

interface PopupProps {
  config: PlasmoCSConfig
}

const Popup: React.FC<PopupProps> = ({ config }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleOptionChange = (selectedOption: string) => {
    setSelectedOption(selectedOption)
  }

  useEffect(() => {
    // Do something with the selectedOption, e.g., update the configuration
    console.log("Selected Option:", selectedOption)
  }, [selectedOption])

  return (
    <div className="popup-container">
      <h2 className="popup-title">Leetcode Maxxing</h2>
      <p>Choose your goal: {selectedOption}</p>
      <div className="checkbox-container">
        <CheckboxOptions
          option={selectedOption}
          handleOptionChange={handleOptionChange}
        />
      </div>
    </div>
  )
}

export default Popup
