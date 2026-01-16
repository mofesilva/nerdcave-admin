"use client";

import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';

interface DateTimePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function DateTimePicker({ value, onChange, placeholder = "Selecione data e hora", className = "" }: DateTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'date' | 'time'>('date');
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse value or use current date
    const parseValue = () => {
        if (value) {
            // Parse datetime-local format (YYYY-MM-DDTHH:mm)
            const [datePart, timePart] = value.split('T');
            const [year, month, day] = datePart.split('-').map(Number);
            const [hour, minute] = (timePart || '00:00').split(':').map(Number);
            return { year, month: month - 1, day, hour, minute };
        }
        const now = new Date();
        return {
            year: now.getFullYear(),
            month: now.getMonth(),
            day: now.getDate(),
            hour: now.getHours(),
            minute: 0
        };
    };

    const [selectedDate, setSelectedDate] = useState(parseValue);
    const [viewMonth, setViewMonth] = useState(selectedDate.month);
    const [viewYear, setViewYear] = useState(selectedDate.year);

    useEffect(() => {
        const parsed = parseValue();
        setSelectedDate(parsed);
        setViewMonth(parsed.month);
        setViewYear(parsed.year);
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    const handleSelectDay = (day: number) => {
        const newDate = { ...selectedDate, day, month: viewMonth, year: viewYear };
        setSelectedDate(newDate);
        // NÃO fecha, apenas atualiza e vai para hora
        setView('time');
    };

    const handleSelectHour = (hour: number) => {
        const newDate = { ...selectedDate, hour };
        setSelectedDate(newDate);
        // NÃO fecha, apenas atualiza
    };

    const handleSelectMinute = (minute: number) => {
        const newDate = { ...selectedDate, minute };
        setSelectedDate(newDate);
        // NÃO fecha, apenas atualiza
    };

    const handleConfirm = () => {
        // Formatar como datetime-local (YYYY-MM-DDTHH:mm) sem conversão de timezone
        const year = selectedDate.year;
        const month = (selectedDate.month + 1).toString().padStart(2, '0');
        const day = selectedDate.day.toString().padStart(2, '0');
        const hour = selectedDate.hour.toString().padStart(2, '0');
        const minute = selectedDate.minute.toString().padStart(2, '0');
        const formatted = `${year}-${month}-${day}T${hour}:${minute}`;
        onChange(formatted);
        setIsOpen(false);
    };

    const formatDisplayValue = () => {
        if (!value) return placeholder;
        const parsed = parseValue();
        return `${parsed.day.toString().padStart(2, '0')}/${(parsed.month + 1).toString().padStart(2, '0')}/${parsed.year} às ${parsed.hour.toString().padStart(2, '0')}:${parsed.minute.toString().padStart(2, '0')}`;
    };

    const formatPreview = () => {
        return `${selectedDate.day.toString().padStart(2, '0')}/${(selectedDate.month + 1).toString().padStart(2, '0')}/${selectedDate.year} às ${selectedDate.hour.toString().padStart(2, '0')}:${selectedDate.minute.toString().padStart(2, '0')}`;
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setIsOpen(false);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(viewYear, viewMonth);
        const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
        const days = [];

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-9 h-9" />);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = day === selectedDate.day && viewMonth === selectedDate.month && viewYear === selectedDate.year;
            const isToday = day === new Date().getDate() && viewMonth === new Date().getMonth() && viewYear === new Date().getFullYear();

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isSelected
                            ? 'bg-primary text-primary-foreground'
                            : isToday
                                ? 'bg-nerdcave-lime/20 text-nerdcave-lime'
                                : 'text-foreground hover:bg-muted'
                        }`}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    const renderTimeSelector = () => {
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

        return (
            <div className="flex gap-4">
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-2 text-center">Hora</p>
                    <div className="max-h-48 overflow-y-auto scrollbar-thin">
                        {hours.map(hour => (
                            <button
                                key={hour}
                                type="button"
                                onClick={() => handleSelectHour(hour)}
                                className={`w-full py-2 text-sm rounded-lg transition-colors cursor-pointer ${hour === selectedDate.hour
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-foreground hover:bg-muted'
                                    }`}
                            >
                                {hour.toString().padStart(2, '0')}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-2 text-center">Minuto</p>
                    <div className="max-h-48 overflow-y-auto scrollbar-thin">
                        {minutes.map(minute => (
                            <button
                                key={minute}
                                type="button"
                                onClick={() => handleSelectMinute(minute)}
                                className={`w-full py-2 text-sm rounded-lg transition-colors cursor-pointer ${minute === selectedDate.minute
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-foreground hover:bg-muted'
                                    }`}
                            >
                                {minute.toString().padStart(2, '0')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => { setIsOpen(!isOpen); setView('date'); }}
                className={`w-full flex items-center justify-between gap-2 px-4 py-3 bg-background border border-border rounded-xl text-left transition-all duration-200 cursor-pointer ${isOpen ? 'border-primary' : 'hover:border-muted-foreground/50'
                    }`}
            >
                <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
                        {formatDisplayValue()}
                    </span>
                </span>
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-1 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-80 mt-2 bg-card border border-border rounded-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                    {/* Tabs */}
                    <div className="flex border-b border-border">
                        <button
                            type="button"
                            onClick={() => setView('date')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors cursor-pointer ${view === 'date'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Calendar className="w-4 h-4 inline-block mr-2" />
                            Data
                        </button>
                        <button
                            type="button"
                            onClick={() => setView('time')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors cursor-pointer ${view === 'time'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Clock className="w-4 h-4 inline-block mr-2" />
                            Hora
                        </button>
                    </div>

                    <div className="p-4">
                        {view === 'date' ? (
                            <>
                                {/* Month navigation */}
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        type="button"
                                        onClick={handlePrevMonth}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm font-semibold text-foreground">
                                        {MONTHS[viewMonth]} {viewYear}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleNextMonth}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Weekdays */}
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {WEEKDAYS.map((day, i) => (
                                        <div key={i} className="w-9 h-9 flex items-center justify-center text-xs text-muted-foreground font-medium">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar grid */}
                                <div className="grid grid-cols-7 gap-1">
                                    {renderCalendar()}
                                </div>
                            </>
                        ) : (
                            renderTimeSelector()
                        )}
                    </div>

                    {/* Preview + Confirm */}
                    <div className="px-4 pb-4 space-y-3">
                        <div className="bg-muted rounded-lg p-3 text-center">
                            <p className="text-sm text-foreground font-medium">
                                {formatPreview()}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Confirmar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
