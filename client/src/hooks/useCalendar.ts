import { useState } from 'react';

const MONTHS_LIST = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

export const WEEKDAYS_LIST = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

export type LessonType = {
  date: string,
  time: string,
  subject: string,
  topic: string,
  teacher: string,
  start_time: string,
  end_time: string,
  note?: string,
}

interface IUseCalendar {
  month: string;
  year: number;
  handlePrev: () => void;
  handleNext: () => void;
  calendar: {
    date: Date,
    day: number,
    isToday: boolean,
    events?: LessonType[],
  }[];
}

const useCalendar = (): IUseCalendar => {
  const [date, setDate] = useState(new Date());

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const month = MONTHS_LIST[date.getMonth()];
  const year = date.getFullYear();

  const monthDays = Array.from({ length: lastDay.getDate() }, (_, i) => {
    return {
      date: new Date(date.getFullYear(), date.getMonth(), i + 1),
      day: i + 1,
      isToday: i + 1 === new Date().getDate() && date.getMonth() === new Date().getMonth(),
    }
  });

  const emptyStart = new Array(firstDay.getDay() !== 0 ? firstDay.getDay() - 1 : 6).fill({ day: '', isToday: false });
  const emptyEnd = new Array(lastDay.getDay() !== 0 ? 7 - lastDay.getDay() : 0).fill({ day: '', isToday: false });

  const calendar = [
    ...emptyStart,
    ...monthDays,
    ...emptyEnd
  ];

  const handlePrev = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  }

  const handleNext = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }

  return {
    month,
    year,
    handlePrev,
    handleNext,
    calendar
  }
}

export default useCalendar;