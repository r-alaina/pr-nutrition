'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import DatePicker from 'react-datepicker'
import { addDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css'
import './week-selector.css' // We will create this for custom styling

type Props = {
    path: string
    label?: string
    required?: boolean
}

export const WeekSelectorField: React.FC<Props> = ({ path, label, required }) => {
    const { value, setValue } = useField<string>({ path })

    const dateValue = value ? new Date(value) : null

    const handleDateChange = (date: Date | null) => {
        if (date) {
            // Ensure we set it to the start of the day or ISO string
            setValue(date.toISOString())
        } else {
            setValue(null)
        }
    }

    // Filter only Mondays (0 is Sunday, 1 is Monday)
    const isMonday = (date: Date) => {
        const day = date.getDay()
        return day === 1
    }

    // Custom styling for the week range
    const getDayClass = (date: Date) => {
        if (!dateValue) return ''
        const start = startOfWeek(dateValue, { weekStartsOn: 1 })
        const end = endOfWeek(dateValue, { weekStartsOn: 1 })

        // Check if the date is within the selected week
        if (date >= start && date <= end) {
            return 'selected-week-day'
        }
        return ''
    }

    return (
        <div className="field-type date-field">
            <label className="field-label">
                {label || 'Week Of'}
                {required && <span className="required">*</span>}
            </label>
            <div className="week-selector-wrapper">
                <DatePicker
                    selected={dateValue}
                    onChange={handleDateChange}
                    filterDate={isMonday}
                    calendarStartDay={1} // Start week on Monday
                    placeholderText="Select a Monday"
                    className="payload-input" // Attempt to match payload styles
                    dateFormat="MMMM d, yyyy"
                    dayClassName={getDayClass}
                    wrapperClassName="w-full"
                />
                <div className="field-description">
                    Select the Monday to define the menu for that entire week (Mon-Sun).
                </div>
            </div>
            <style jsx global>{`
        .week-selector-wrapper .react-datepicker-wrapper {
            width: 100%;
            max-width: 400px;
        }
        .week-selector-wrapper input {
            width: 100%;
            padding: 10px;
            background: var(--theme-input-bg);
            border: 1px solid var(--theme-elevation-100);
            color: var(--theme-elevation-800);
            border-radius: 4px;
            font-size: 1rem;
        }
        /* Highlight the selected week */
        .selected-week-day {
            background-color: var(--theme-success-100) !important;
            color: var(--theme-success-700) !important;
            border-radius: 0 !important;
        }
        .react-datepicker__day--selected {
            background-color: var(--theme-success-500) !important;
            color: white !important;
        }
      `}</style>
        </div>
    )
}
