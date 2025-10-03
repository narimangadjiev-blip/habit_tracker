import React, { useState, useEffect } from 'react';

export default function App() {
  const [habits, setHabits] = useState([
    { id: 1, text: 'Лёг спать до 23:30', isGood: true },
    { id: 2, text: 'Не трогал телефон', isGood: true },
    { id: 3, text: 'Не трогал ногти', isGood: false },
    { id: 4, text: 'Не ел красное мясо', isGood: true }
  ]);

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('records');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('records', JSON.stringify(records));
  }, [records]);

  const getToday = () => new Date().toDateString();

  const markHabit = (habitId, value) => {
    const today = getToday();
    setRecords(prev => ({
      ...prev,
      [today]: { ...prev[today], [habitId]: value }
    }));
  };

  const calculateScore = (date) => {
    const dateKey = typeof date === 'string' ? date : date.toDateString();
    const dayRecord = records[dateKey];
    if (!dayRecord) return null;
    const total = Object.keys(dayRecord).length;
    const correct = Object.values(dayRecord).filter(v => v).length;
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  const todayScore = calculateScore(getToday());
  const scoreColor = todayScore >= 80 ? '#10b981' : todayScore >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', color: 'white', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Трекер привычек</h1>
          <p>Метод Франклина</p>
        </div>

        {todayScore !== null && (
          <div style={{ 
            background: scoreColor, 
            color: 'white', 
            borderRadius: '20px', 
            padding: '40px', 
            textAlign: 'center',
            marginBottom: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{todayScore}%</div>
            <div style={{ fontSize: '18px', marginTop: '10px' }}>Сегодня</div>
          </div>
        )}

        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ marginBottom: '15px', color: '#1f2937' }}>Сегодняшние привычки</h2>
          {habits.map(habit => {
            const todayValue = records[getToday()]?.[habit.id];
            return (
              <div key={habit.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px',
                borderRadius: '12px',
                marginBottom: '10px',
                background: '#f3f4f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>
                    {habit.isGood ? '🟢' : '🔴'}
                  </span>
                  <span style={{ fontSize: '16px' }}>{habit.text}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => markHabit(habit.id, false)}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#ef4444',
                      color: 'white',
                      fontSize: '16px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      opacity: todayValue === false ? 0.5 : 1
                    }}
                  >
                    ✗
                  </button>
                  <button
                    onClick={() => markHabit(habit.id, true)}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#10b981',
                      color: 'white',
                      fontSize: '16px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      opacity: todayValue === true ? 0.5 : 1
                    }}
                  >
                    ✓
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
