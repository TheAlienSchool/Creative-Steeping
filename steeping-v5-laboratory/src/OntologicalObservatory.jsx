import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, addWeeks, isBefore, startOfDay } from 'date-fns';
import { supabase } from './supabaseClient';
import { Sparkles, Activity, Plus, Shield } from 'lucide-react';

export const OntologicalObservatory = ({ m, onClose, playStrikingBowl, playAlgoraveSynth }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isScheduling, setIsScheduling] = useState(false);
    
    // Cohort Form State
    const [cohortTitle, setCohortTitle] = useState('');
    const [cohortTime, setCohortTime] = useState('19:00'); // 7:00 PM Default
    const [isPublishing, setIsPublishing] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Calendar Events State
    const [events, setEvents] = useState([]);
    const [isFetchingEvents, setIsFetchingEvents] = useState(false);

    const maxDate = new Date(2034, 11, 31);

    // ==========================================
    // FETCH GOOGLE CALENDAR (EDGE FUNCTION)
    // ==========================================
    useEffect(() => {
        async function fetchCalendar() {
            setIsFetchingEvents(true);
            try {
                // Time window limits to +/- 3 months of the current viewed month to keep response small
                const { data, error } = await supabase.functions.invoke('sync-google-calendar');
                
                if (error) {
                    console.error("Calendar Sync Error:", error);
                } else if (data && Array.isArray(data)) {
                    setEvents(data);
                }
            } catch (e) {
                console.error("Calendar Invocation Failed:", e);
            } finally {
                setIsFetchingEvents(false);
            }
        }
        fetchCalendar();
    }, [currentMonth]); // In reality, you'd fetch based on currentMonth range, but the endpoint handles a 3 month window by default.

    // ==========================================
    // CALENDAR PAGING LOGIC
    // ==========================================
    const renderHeader = () => {
        return (
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingBottom: 'var(--space-md)', borderBottom: `1px solid ${m.accent}40`,
                marginBottom: 'var(--space-md)'
            }}>
                <button
                    onClick={() => { playStrikingBowl(50); setCurrentMonth(subMonths(currentMonth, 1)); }}
                    style={{ background: 'none', border: 'none', color: m.accent, cursor: 'pointer', fontFamily: 'var(--fMono)' }}
                >
                    [ PREV ]
                </button>
                <div style={{ fontFamily: 'var(--fSerif)', fontSize: '2rem', color: m.text1, fontStyle: 'italic' }}>
                    {format(currentMonth, 'MMMM yyyy')}
                </div>
                <button
                    disabled={isBefore(maxDate, addMonths(currentMonth, 1))}
                    onClick={() => { playStrikingBowl(55); setCurrentMonth(addMonths(currentMonth, 1)); }}
                    style={{ background: 'none', border: 'none', color: m.accent, cursor: 'pointer', fontFamily: 'var(--fMono)', opacity: isBefore(maxDate, addMonths(currentMonth, 1)) ? 0.3 : 1 }}
                >
                    [ NEXT ]
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const startDate = startOfWeek(currentMonth);
        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} style={{ 
                    fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.7rem', 
                    letterSpacing: '0.15em', textAlign: 'center', opacity: 0.7 
                }}>
                    {format(addDays(startDate, i), 'EEE').toUpperCase()}
                </div>
            );
        }
        return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isSelected = isSameDay(day, selectedDate);
                const isPast = isBefore(day, startOfDay(new Date()));

                // Find events for this specific day
                const dayEvents = events.filter(e => isSameDay(new Date(e.start), cloneDay));

                days.push(
                    <div
                        key={day}
                        onClick={() => {
                            if (!isCurrentMonth) return;
                            playStrikingBowl(60 + parseInt(formattedDate)); // Pitch rises with the date
                            setSelectedDate(cloneDay);
                            setIsScheduling(true);
                        }}
                        style={{
                            padding: '1.5rem 0.5rem', textAlign: 'center', cursor: isCurrentMonth ? 'pointer' : 'default',
                            fontFamily: 'var(--fSerif)', fontSize: '1.3rem', transition: 'all 0.3s', position: 'relative',
                            color: isSelected ? m.bg : (isCurrentMonth ? m.text1 : m.text2),
                            background: isSelected ? m.accent : 'transparent',
                            opacity: isCurrentMonth ? (isPast ? 0.4 : 1) : 0.1,
                            border: `1px solid ${isSelected ? m.accent : 'transparent'}`
                        }}
                        onMouseEnter={e => {
                            if (!isSelected && isCurrentMonth) {
                                e.currentTarget.style.border = `1px dashed ${m.accent}`;
                                if(playAlgoraveSynth) playAlgoraveSynth(60, 0.05); // Subtle hover sonic
                            }
                        }}
                        onMouseLeave={e => {
                            if (!isSelected) e.currentTarget.style.border = `1px solid transparent`;
                        }}
                    >
                        <div>{formattedDate}</div>
                        {isCurrentMonth && dayEvents.length > 0 && (
                            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                                {dayEvents.map((evt, idx) => (
                                    <div key={idx} style={{ 
                                        width: '4px', height: '4px', borderRadius: '50%', 
                                        backgroundColor: isSelected ? m.bg : m.accent 
                                    }} title={evt.summary} />
                                ))}
                            </div>
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(<div key={day} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>{days}</div>);
            days = [];
        }
        return rows;
    };

    // ==========================================
    // COHORT CREATION LOGIC
    // ==========================================
    const handlePublishCohort = async () => {
        if (!cohortTitle || !cohortTime) return;
        setIsPublishing(true);
        playStrikingBowl && playStrikingBowl(45); // Deep commitment strike

        const startDateStr = format(selectedDate, 'yyyy-MM-dd');
        const endDate = addWeeks(selectedDate, 9);
        const week3CloseDate = addWeeks(selectedDate, 3); // Calculated closure

        // Build the cohort meta
        const cohortData = {
            theme: cohortTitle,
            capacity: 14,
            active_start_date: startDateStr,
            active_end_date: format(endDate, 'yyyy-MM-dd'),
            status: 'enrolling'
        };

        try {
            // In reality, this inserts into `steeping_circles` logic.
            const { error } = await supabase.from('steeping_circles').insert(cohortData);
            
            if (error) throw error;

            if (playAlgoraveSynth) playAlgoraveSynth(72, 1); // Success chime
            setSuccessMsg(`Cohort initialized. The portal seals for new entrants on ${format(week3CloseDate, 'MMMM do, yyyy')}.`);
            
            setTimeout(() => {
                setIsScheduling(false);
                setCohortTitle('');
                setSuccessMsg('');
            }, 5000);

        } catch (e) {
            console.error("Failed to seed cohort", e);
            if (playAlgoraveSynth) playAlgoraveSynth(40, 1); // Error chime
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9000, backgroundColor: m.bg, 
            display: 'flex', flexDirection: 'column', 
            animation: 'fadeIn 1s ease forwards', overflowY: 'auto'
        }}>
            {/* AMBIENT GRID */}
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.1,
                backgroundImage: `linear-gradient(${m.accent} 1px, transparent 1px), linear-gradient(90deg, ${m.accent} 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: 'var(--space-xl)' }}>
                {/* OBSERVATORY HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xxl)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Shield style={{ color: m.accent }} size={24} />
                        <h1 style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '1rem', letterSpacing: '0.4em' }}>THE ONTOLOGICAL OBSERVATORY</h1>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', color: m.text1, fontFamily: 'var(--fMono)',
                        fontSize: '0.8rem', letterSpacing: '0.2em', cursor: 'pointer'
                    }}>
                        [ CLOSE OCELLUS ]
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 2fr', gap: '4rem', alignItems: 'start' }}>
                    
                    {/* LEFT COLUMN: TELEMETRY & MASTER CONTROLS */}
                    <div>
                        <div style={{ fontFamily: 'var(--fSerif)', fontSize: '4rem', color: m.text1, lineHeight: 1, marginBottom: 'var(--space-xl)', fontStyle: 'italic' }}>
                            Orchestrating<br/>the <span style={{ color: m.accent }}>Sanctuary.</span>
                        </div>

                        {/* LIVE TELEMETRY MOCKUP */}
                        <div style={{ border: `1px solid ${m.accent}30`, padding: 'var(--space-xl)', background: `linear-gradient(135deg, ${m.accent}05 0%, transparent 100%)`, marginBottom: '2rem' }}>
                            <h3 style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={16} /> LIVE RESONANCE
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontFamily: 'var(--fSerif)', fontSize: '2.5rem', color: m.text1 }}>03</div>
                                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.text2, letterSpacing: '0.1em' }}>ACTIVE CIRCLES</div>
                                </div>
                                <div>
                                    <div style={{ fontFamily: 'var(--fSerif)', fontSize: '2.5rem', color: m.text1 }}>42</div>
                                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.text2, letterSpacing: '0.1em' }}>MEMBRANE PINGS (24H)</div>
                                </div>
                            </div>
                        </div>

                        {/* SCHEDULING FORM */}
                        <div style={{ opacity: isScheduling ? 1 : 0.3, transition: 'opacity 0.5s ease', pointerEvents: isScheduling ? 'auto' : 'none' }}>
                            <div style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.8rem', letterSpacing: '0.2em', marginBottom: '1.5rem', borderBottom: `1px dashed ${m.accent}40`, paddingBottom: '0.5rem' }}>
                                [ INITIATE COHORT ]
                            </div>
                            
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontFamily: 'var(--fMono)', color: m.text2, fontSize: '0.65rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>THEME / COHORT NAME</label>
                                <input 
                                    type="text" 
                                    value={cohortTitle}
                                    onChange={(e) => setCohortTitle(e.target.value)}
                                    placeholder="e.g. The Architecture of the Pause"
                                    style={{ 
                                        width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${m.accent}`, 
                                        color: m.text1, fontFamily: 'var(--fSerif)', fontSize: '1.5rem', fontStyle: 'italic',
                                        padding: '0.5rem 0', outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontFamily: 'var(--fMono)', color: m.text2, fontSize: '0.65rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>START DATE</label>
                                    <div style={{ fontFamily: 'var(--fSerif)', fontSize: '1.2rem', color: m.text1 }}>
                                        {format(selectedDate, 'MMM do, yyyy')}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontFamily: 'var(--fMono)', color: m.text2, fontSize: '0.65rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>TIME OF DAY (PT)</label>
                                    <input 
                                        type="time" 
                                        value={cohortTime}
                                        onChange={(e) => setCohortTime(e.target.value)}
                                        style={{ 
                                            background: 'transparent', border: 'none', color: m.text1, 
                                            fontFamily: 'var(--fMono)', fontSize: '1.2rem', outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, lineHeight: 1.6, marginBottom: '2rem', padding: '1rem', borderLeft: `2px solid ${m.accent}40` }}>
                                This action generates a 9-week temporal arc. Enrollment will irreversibly seal on <span style={{ color: m.accent }}>{format(addWeeks(selectedDate, 3), 'MMM do, yyyy')}</span>.
                            </div>

                            {successMsg ? (
                                <div style={{ color: m.accent, fontFamily: 'var(--fSerif)', fontStyle: 'italic', fontSize: '1.2rem' }}>
                                    {successMsg}
                                </div>
                            ) : (
                                <button 
                                    onClick={handlePublishCohort}
                                    disabled={!cohortTitle || isPublishing}
                                    style={{
                                        width: '100%', background: cohortTitle ? m.accent : 'transparent', 
                                        color: cohortTitle ? m.bg : m.accent, border: `1px solid ${m.accent}`,
                                        padding: '1rem', fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.2em',
                                        cursor: cohortTitle ? 'pointer' : 'not-allowed', transition: 'all 0.3s ease',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                                    }}
                                    onMouseEnter={e => { if(cohortTitle) e.currentTarget.style.boxShadow = `0 0 20px ${m.accent}40`; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    {isPublishing ? 'ALIGNING MATRIX...' : (
                                        <> <Plus size={16} /> COMMENCE STEEPING CIRCLE </>
                                    )}
                                </button>
                            )}

                        </div>
                    </div>

                    {/* RIGHT COLUMN: THE CALENDAR MATRIX */}
                    <div style={{ borderLeft: `1px solid ${m.accent}20`, paddingLeft: '4rem' }}>
                        {renderHeader()}
                        {renderDays()}
                        {renderCells()}
                    </div>

                </div>
            </div>
        </div>
    );
};
