import React, { useEffect, useState } from "react"

import "checkBoxOptions/CheckboxOptions.css" // Import the CSS file

interface CheckboxOption {
  value: string
  checked: boolean
}

interface CheckboxOptionsProps {
  option: string | null
  handleOptionChange: (selectedOption: string) => void
}

const CheckboxOptions: React.FC<CheckboxOptionsProps> = ({
  option,
  handleOptionChange
}) => {
  const [options, setOptions] = useState<CheckboxOption[]>([
    { value: "Striver Begineer", checked: false },
    { value: "Striver Medium", checked: false },
    { value: "Striver Expert ", checked: false }
  ])

  const [counter, setCounter] = useState<number>(0)
  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(false)

  const toggleOption = (value: string) => {
    setOptions((prevOptions) =>
      prevOptions.map((opt) => ({
        ...opt,
        checked: opt.value === value ? !opt.checked : opt.checked
      }))
    )
  }

  useEffect(() => {
    const selectedOption = options.find((opt) => opt.checked)?.value || null
    handleOptionChange(selectedOption)
    setCounter(options.filter((opt) => opt.checked).length)
  }, [options, handleOptionChange])

  const handleDropdownChange = (value: string) => {
    toggleOption(value)
  }

  const handleCheckboxChange = (isChecked: boolean) => {
    setCheckboxChecked(isChecked)
  }

  const handleCounterChange = (value: string) => {
    const numValue = parseInt(value)
    if (!isNaN(numValue)) {
      setCounter(numValue)
    }
  }

  const handleSubmit = () => {
    // Implement submit logic here
  }

  return (
    <div className="checkbox-options-container">
      {" "}
      {/* Apply the CSS class here */}
      <select onChange={(e) => handleDropdownChange(e.target.value)}>
        {options.map((opt: CheckboxOption) => (
          <option key={opt.value} value={opt.value}>
            {opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}
          </option>
        ))}
      </select>
      <div>
        <input
          type="checkbox"
          checked={checkboxChecked}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
        />
        <label>Repeat questions</label>
      </div>
      <div>
        <input
          type="number"
          value={counter}
          onChange={(e) => handleCounterChange(e.target.value)}
        />
        <label>Daily question limit</label>
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default CheckboxOptions
