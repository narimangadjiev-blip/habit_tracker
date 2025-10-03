import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Plus, Edit2, ChevronLeft, ChevronRight, X } from 'lucide-react';

const HabitTrackerApp = () => {
  const [habits, setHabits] = useState([
    { id: 1, text: 'Лёг спать до 23:30', isGood: true },
    { id: 2, text: 'Не трогал телефон перед сном', isGood: true },
    { id: 3, text: 'Не трогал ногти', isGood: false },
    { id: 4, text: 'Не ел красное мясо', isGood: true }
  ]);

  const [records, setRecords] = useState({});
  const [currentScreen, setCurrentScreen] = useState('home');
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [checkingDate, setCheckingDate] = useState(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [editMode, setEditMode] = useState(false);
  const [newHabitText, setNewHabitText] = useState('');
  const [newHabitType, setNewHabitType] = useState(true);

  useEffect(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (!records[yesterday] && !records[today]) {
      setTimeout(() => {
        if (window.confirm('Отметь вчерашний день!')) {
          startChecking(yesterday);
        }
      }, 1000);
    }
  }, []);

  const startChecking = (date) => {
    setCheckingDate(date);
    setSwipeIndex(0);
    setCurrentScreen('swipe');
  };

  const handleSwipe = (direction) => {
    const habit = habits[swipeIndex];
    const isCorrect = direction === 'right';
    
    const dateKey = checkingDate;
    const newRecords = { ...records };
    
    if (!newRecords[dateKey]) {
      newRecords[dateKey] = {};
    }
    
    newRecords[dateKey][habit.id] = isCorrect;
    setRecords(newRecords);

    if (swipeIndex < habits.length - 1) {
      setSwipeIndex(swipeIndex + 1);
    } else {
      setCurrentScreen('result');
    }
  };

  const calculateDayScore = (date) => {
    const dateKey = typeof date === 'string' ? date : date.toDateString();
    const dayRecord = records[dateKey];
    
    if (!dayRecord) return null;
    
    const total = Object.keys(dayRecord).length;
    const correct = Object.values(dayRecord).filter(v => v).length;
    
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  const getColorForScore = (score) => {
    if (score === null) return 'bg-gray-100';
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getWeekData = () => {
    const week = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const score = calculateDayScore(date);
      
      week.push({
        day: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
        score: score || 0,
        date: date.toDateString()
      });
    }
    
    return week;
  };

  const getMonthData = () => {
    const month = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const score = calculateDayScore(date);
      
      if (score !== null) {
        month.push({
          day: date.getDate(),
          score: score
        });
      }
    }
    
    return month;
  };

  const addHabit = () => {
    if (newHabitText.trim()) {
      const newHabit = {
        id: Date.now(),
        text: newHabitText.trim(),
        isGood: newHabitType
      };
      setHabits([...habits, newHabit]);
      setNewHabitText('');
      setNewHabitType(true);
    }
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  // HOME SCREEN
  if (currentScreen === 'home') {
    const todayScore = calculateDayScore(new Date());
    const yesterdayDate = new Date(Date.now() - 86400000).toDateString();
    const hasYesterdayRecord = records[yesterdayDate];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Трекер привычек</h1>
            <p className="text-gray-600">Метод Франклина</p>
          </div>

          {/* Today Score */}
          {todayScore !== null && (
            <div className={`${getColorForScore(todayScore)} text-white rounded-3xl p-8 mb-6 shadow-lg`}>
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{todayScore}%</div>
                <div className="text-lg opacity-90">Сегодня</div>
              </div>
            </div>
          )}

          {/* Check Yesterday Button */}
          {!hasYesterdayRecord && (
            <button
              onClick={() => startChecking(yesterdayDate)}
              className="w-full bg-indigo-600 text-white rounded-2xl p-6 mb-4 shadow-lg hover:bg-indigo-700 transition"
            >
              <div className="text-xl font-semibold">📋 Отметить вчерашний день</div>
            </button>
          )}

          {/* Menu Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setCurrentScreen('reports')}
              className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="text-indigo-600" size={24} />
                <span className="text-lg font-medium text-gray-800">Отчёты</span>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </button>

            <button
              onClick={() => setCurrentScreen('habits')}
              className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Edit2 className="text-indigo-600" size={24} />
                <span className="text-lg font-medium text-gray-800">Управление привычками</span>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </button>

            <button
              onClick={() => setCurrentScreen('calendar')}
              className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Calendar className="text-indigo-600" size={24} />
                <span className="text-lg font-medium text-gray-800">Календарь</span>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SWIPE SCREEN
  if (currentScreen === 'swipe') {
    const habit = habits[swipeIndex];
    const progress = ((swipeIndex + 1) / habits.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex flex-col">
        {/* Progress */}
        <div className="max-w-md mx-auto w-full pt-8 mb-4">
          <div className="bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-gray-600 text-sm">
            {swipeIndex + 1} из {habits.length}
          </div>
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center max-w-md mx-auto w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full">
            <div className="text-center mb-8">
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                habit.isGood ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {habit.isGood ? '🟢 Хорошая привычка' : '🔴 Плохая привычка'}
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                {habit.text}
              </h2>

              <div className="flex items-center justify-between text-sm text-gray-500 px-4">
                <div className="text-red-500 font-medium">← Нет (плохо)</div>
                <div className="text-green-500 font-medium">Да (хорошо) →</div>
              </div>
            </div>

            {/* Swipe Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => handleSwipe('left')}
                className="flex-1 bg-red-500 text-white rounded-2xl py-6 text-xl font-semibold hover:bg-red-600 transition shadow-lg"
              >
                ✗
              </button>
              <button
                onClick={() => handleSwipe('right')}
                className="flex-1 bg-green-500 text-white rounded-2xl py-6 text-xl font-semibold hover:bg-green-600 transition shadow-lg"
              >
                ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RESULT SCREEN
  if (currentScreen === 'result') {
    const score = calculateDayScore(checkingDate);
    const colorClass = getColorForScore(score);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className={`${colorClass} text-white rounded-3xl p-12 shadow-2xl text-center`}>
            <div className="text-7xl font-bold mb-4">{score}%</div>
            <div className="text-2xl mb-8">
              {score >= 80 ? '🎉 Отличный день!' : score >= 50 ? '👍 Неплохо!' : '💪 Продолжай стараться!'}
            </div>
            
            <button
              onClick={() => {
                setCurrentScreen('home');
                setCheckingDate(null);
                setSwipeIndex(0);
              }}
              className="bg-white text-gray-800 rounded-2xl px-8 py-4 font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  // REPORTS SCREEN
  if (currentScreen === 'reports') {
    const weekData = getWeekData();
    const monthData = getMonthData();
    const weekAvg = weekData.length > 0 ? Math.round(weekData.reduce((sum, d) => sum + d.score, 0) / weekData.length) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-8">
            <button onClick={() => setCurrentScreen('home')} className="text-gray-600">
              <ChevronLeft size={28} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Отчёты</h2>
            <div className="w-7" />
          </div>

          {/* Week Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Неделя (средн: {weekAvg}%)</h3>
            <div className="flex items-end justify-between gap-2 h-48">
              {weekData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs font-medium text-gray-600">{day.score}%</div>
                  <div 
                    className={`w-full ${getColorForScore(day.score)} rounded-t-lg transition-all`}
                    style={{ height: `${day.score}%` }}
                  />
                  <div className="text-xs text-gray-500">{day.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Month Chart */}
          {monthData.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Месяц</h3>
              <div className="flex items-end gap-1 h-32">
                {monthData.map((day, i) => (
                  <div 
                    key={i}
                    className={`flex-1 ${getColorForScore(day.score)} rounded-t`}
                    style={{ height: `${day.score}%` }}
                    title={`${day.day}: ${day.score}%`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // HABITS MANAGEMENT SCREEN
  if (currentScreen === 'habits') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-8">
            <button onClick={() => setCurrentScreen('home')} className="text-gray-600">
              <ChevronLeft size={28} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Привычки</h2>
            <div className="w-7" />
          </div>

          {/* Add New Habit */}
          <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Добавить привычку</h3>
            <input
              type="text"
              value={newHabitText}
              onChange={(e) => setNewHabitText(e.target.value)}
              placeholder="Например: Пить 2л воды"
              className="w-full border-2 border-gray-200 rounded-xl p-3 mb-3 focus:border-indigo-500 outline-none"
            />
            
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setNewHabitType(true)}
                className={`flex-1 py-3 rounded-xl font-medium transition ${
                  newHabitType ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                🟢 Хорошая
              </button>
              <button
                onClick={() => setNewHabitType(false)}
                className={`flex-1 py-3 rounded-xl font-medium transition ${
                  !newHabitType ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                🔴 Плохая
              </button>
            </div>

            <button
              onClick={addHabit}
              className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition"
            >
              <Plus className="inline mr-2" size={20} />
              Добавить
            </button>
          </div>

          {/* Habits List */}
          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="bg-white rounded-2xl p-4 shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className={`text-2xl ${habit.isGood ? 'text-green-500' : 'text-red-500'}`}>
                    {habit.isGood ? '🟢' : '🔴'}
                  </span>
                  <span className="text-gray-800 font-medium">{habit.text}</span>
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // CALENDAR SCREEN
  if (currentScreen === 'calendar') {
    const daysInMonth = [];
    const today = new Date();
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const lastDay = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    for (let i = 0; i < startPadding; i++) {
      daysInMonth.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), i);
      daysInMonth.push(date);
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-8">
            <button onClick={() => setCurrentScreen('home')} className="text-gray-600">
              <ChevronLeft size={28} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Календарь</h2>
            <div className="w-7" />
          </div>

          {/* Month Navigation */}
          <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft size={24} />
              </button>
              <h3 className="text-xl font-semibold">
                {viewDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((date, i) => {
                if (!date) {
                  return <div key={i} />;
                }

                const score = calculateDayScore(date);
                const colorClass = getColorForScore(score);
                const isToday = date.toDateString() === today.toDateString();

                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (score === null) {
                        startChecking(date.toDateString());
                      }
                    }}
                    className={`aspect-square rounded-lg ${colorClass} ${
                      isToday ? 'ring-2 ring-indigo-600' : ''
                    } ${score === null ? 'opacity-20' : ''} transition hover:opacity-80 flex items-center justify-center`}
                  >
                    <span className={`text-sm font-medium ${score === null ? 'text-gray-600' : 'text-white'}`}>
                      {date.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Легенда</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg" />
                <span className="text-gray-700">80-100% (отлично)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg" />
                <span className="text-gray-700">50-79% (хорошо)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg" />
                <span className="text-gray-700">0-49% (плохо)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                <span className="text-gray-700">Не заполнено</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default HabitTrackerApp;
