import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Trophy } from 'lucide-react';
import { db } from '../../lib/db';
import { useGuestToken } from '../../lib/hooks';
import { useParams } from 'react-router-dom';
import { Leaderboard } from '../Leaderboard';

const QUESTIONS = [
  {
    id: 1,
    question: "What is Hashem's favorite late-night snack?",
    options: ["Shawarma", "Indomie", "Pizza", "Dates & Milk"],
    answer: "Indomie"
  },
  {
    id: 2,
    question: "How many hours of sleep does Hashem actually get?",
    options: ["8 hours", "4 hours", "What is sleep?", "12 hours"],
    answer: "What is sleep?"
  },
  {
    id: 3,
    question: "What is Hashem's catchphrase?",
    options: ["Yallah!", "Inshallah", "Bro...", "Let's go!"],
    answer: "Bro..."
  },
  {
    id: 4,
    question: "If Hashem wasn't a developer, what would he be?",
    options: ["Chef", "Comedian", "Professional Sleeper", "Cat Herder"],
    answer: "Comedian"
  }
];

export function TriviaGame() {
  const { eventId } = useParams<{ eventId: string }>();
  const token = useGuestToken();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [guestName, setGuestName] = useState('Guest');

  useEffect(() => {
    if (eventId && token) {
      db.getGuest(eventId, token).then(g => {
        if (g) setGuestName(g.name);
      });
    }
  }, [eventId, token]);

  const handleAnswer = (option: string) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    const correct = option === QUESTIONS[currentQuestion].answer;
    setIsCorrect(correct);
    
    if (correct) setScore(score + 100);

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        finishGame(score + (correct ? 100 : 0));
      }
    }, 1500);
  };

  const finishGame = async (finalScore: number) => {
    setShowResult(true);
    if (eventId && token) {
      await db.saveScore({
        event_id: eventId,
        guest_token: token,
        guest_name: guestName,
        game_id: 'trivia',
        score: finalScore
      });
    }
  };

  if (showResult) {
    return (
      <div className="text-center p-8 flex flex-col items-center justify-center h-full overflow-y-auto">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="bg-yellow-400 p-6 rounded-full mb-6 shadow-xl border-b-8 border-yellow-600"
        >
          <Trophy className="w-16 h-16 text-yellow-900" />
        </motion.div>
        <h2 className="text-3xl font-black text-white mb-2">Game Over!</h2>
        <p className="text-xl text-slate-300 mb-8">You scored {score} points</p>
        
        <button 
          onClick={() => {
            setCurrentQuestion(0);
            setScore(0);
            setShowResult(false);
            setSelectedOption(null);
            setIsCorrect(null);
          }}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-8 rounded-2xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all mb-8"
        >
          Play Again
        </button>

        <Leaderboard gameId="trivia" />
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div className="bg-slate-700/50 px-4 py-2 rounded-xl border border-slate-600">
          <span className="text-slate-400 text-sm font-bold uppercase">Question</span>
          <p className="text-white font-mono text-xl">{currentQuestion + 1}/{QUESTIONS.length}</p>
        </div>
        <div className="bg-slate-700/50 px-4 py-2 rounded-xl border border-slate-600">
          <span className="text-slate-400 text-sm font-bold uppercase">Score</span>
          <p className="text-yellow-400 font-mono text-xl">{score}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-white mb-8 text-center leading-tight">
          {question.question}
        </h2>

        <div className="grid gap-3">
          {question.options.map((option) => {
            let buttonStyle = "bg-slate-700 border-slate-900 text-slate-200";
            
            if (selectedOption === option) {
              if (option === question.answer) {
                buttonStyle = "bg-green-500 border-green-700 text-white";
              } else {
                buttonStyle = "bg-red-500 border-red-700 text-white";
              }
            } else if (selectedOption && option === question.answer) {
              buttonStyle = "bg-green-500 border-green-700 text-white opacity-50";
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedOption}
                className={`w-full p-4 rounded-xl border-b-4 font-bold text-lg transition-all ${buttonStyle} ${!selectedOption && 'active:border-b-0 active:translate-y-1 hover:bg-slate-600'}`}
              >
                <div className="flex items-center justify-between">
                  {option}
                  {selectedOption === option && (
                    option === question.answer ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
