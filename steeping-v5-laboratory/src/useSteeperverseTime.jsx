import { useMemo } from 'react';

// ============================================================
// useSteeperverseTime.jsx
// Foundational time architecture for The Steeping Space.
// Enforces Steeperverse Standard Time (SST) - universally 
// locking all boundary mathematics, dashboards, and calendars 
// to a unified timezone (EST), ignoring the Journeyer's local clock.
// ============================================================

export const useSteeperverseTime = () => {
    const SST_TIMEZONE = 'America/New_York'; // The physical locus of the Steeper

    const sstNow = useMemo(() => {
        // Returns the current Date strictly interpreted in SST
        const now = new Date();
        const sstString = now.toLocaleString('en-US', { timeZone: SST_TIMEZONE });
        return new Date(sstString);
    }, []);

    // Helper: Add days to an SST date (for the 10-day buffer)
    const addDaysSST = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    // Helper: Check if an SST date falls on a weekend
    const isWeekendSST = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
    };

    // The Cultural Awareness Matrix
    // Category A & C: Tooltips & Alt Day Triggers
    const SENSITIVITY_DATES = [
        { month: 1, date: 20, name: 'Dr. Martin Luther King Jr. Day (Observed)', type: 'tooltip' },
        { month: 3, date: 8, name: 'International Women\'s Day', type: 'tooltip' },
        { month: 3, date: 20, name: 'Vernal Equinox', type: 'tooltip' },
        { month: 5, date: 1, name: 'International Workers\' Day', type: 'tooltip' },
        { month: 6, date: 19, name: 'Juneteenth', type: 'tooltip' },
        { month: 6, date: 21, name: 'Summer Solstice', type: 'tooltip' },
        { month: 9, date: 22, name: 'Autumnal Equinox', type: 'tooltip' },
        { month: 10, date: 12, name: 'Indigenous Peoples\' Day', type: 'tooltip' },
        { month: 12, date: 21, name: 'Winter Solstice', type: 'tooltip' }
    ];

    // Category B: Major Global Pauses (10-Day Buffer Blocks)
    // These dates physically prevent new bookings from landing within a 10-day proximity.
    // Note: Lunar holidays (Ramadan, Eid, Diwali) will require annual DB updates or complex lunar calc.
    const BLOCK_DATES = [
        { month: 11, date: 26, name: 'Thanksgiving Arc', range: 4 }, // Late Nov block
        { month: 12, date: 20, name: 'The Winter Holiday Arc', range: 13 } // Dec 20 - Jan 2
    ];

    return {
        sstNow,
        addDaysSST,
        isWeekendSST,
        SST_TIMEZONE,
        SENSITIVITY_DATES,
        BLOCK_DATES
    };
};
