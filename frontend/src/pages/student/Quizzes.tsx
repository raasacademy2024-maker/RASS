import { useState, useEffect } from 'react';
import { quizAPI, enrollmentAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Clock, Award, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  questions: Question[];
  myAttempts?: number;
  maxAttempts: number;
  canAttempt?: boolean;
  bestScore?: number;
}

interface Question {
  _id?: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'coding';
  options?: string[];
  points: number;
  order?: number;
}

interface Answer {
  questionIndex: number;
  answer: string;
}

interface QuizResult {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  answers?: Array<{
    questionIndex: number;
    answer: string;
    isCorrect: boolean;
    pointsEarned: number;
    correctAnswer?: string;
    explanation?: string;
  }>;
}

export default function StudentQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuiz && !result) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = (selectedQuiz.duration * 60) - elapsed;
        
        if (remaining <= 0) {
          handleSubmit();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedQuiz, startTime, result]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const enrollmentResponse = await enrollmentAPI.getMyEnrollments();
      const enrollments = enrollmentResponse.data;

      if (enrollments.length > 0) {
        const courseId = enrollments[0].course._id;
        const batchId = enrollments[0].batch?._id;
        
        const response = await quizAPI.getCourseQuizzes(courseId, batchId);
        setQuizzes(response.data);
      }
    } catch (err: any) {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setAnswers({});
    setResult(null);
    setStartTime(Date.now());
    setTimeLeft(quiz.duration * 60);
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleSubmit = async () => {
    if (!selectedQuiz) return;

    const answersArray: Answer[] = Object.entries(answers).map(([index, answer]) => ({
      questionIndex: parseInt(index),
      answer
    }));

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    setSubmitting(true);
    setError('');

    try {
      const response = await quizAPI.submitQuiz(selectedQuiz._id, answersArray, timeSpent);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question: Question, index: number) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={answers[index] || ''}
            onValueChange={(value) => handleAnswerChange(index, value)}
          >
            {question.options?.map((option, optIdx) => (
              <div key={optIdx} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={option} id={`q${index}-opt${optIdx}`} />
                <Label htmlFor={`q${index}-opt${optIdx}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'true-false':
        return (
          <RadioGroup
            value={answers[index] || ''}
            onValueChange={(value) => handleAnswerChange(index, value)}
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="true" id={`q${index}-true`} />
              <Label htmlFor={`q${index}-true`}>True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`q${index}-false`} />
              <Label htmlFor={`q${index}-false`}>False</Label>
            </div>
          </RadioGroup>
        );

      case 'short-answer':
      case 'coding':
        return (
          <Input
            value={answers[index] || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder="Enter your answer"
            className="mt-2"
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (selectedQuiz && !result) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedQuiz.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">{selectedQuiz.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <Clock className="h-5 w-5" />
                  {formatTime(timeLeft)}
                </div>
                <p className="text-xs text-muted-foreground">Time remaining</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedQuiz.questions.map((question, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-medium">
                      Question {index + 1}: {question.question}
                    </p>
                    <Badge variant="secondary">{question.points} pts</Badge>
                  </div>
                  {renderQuestion(question, index)}
                </CardContent>
              </Card>
            ))}

            <div className="flex gap-4">
              <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Quiz'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedQuiz(null)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6" />
              Quiz Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <div className="text-6xl font-bold mb-2">
                {result.percentage}%
              </div>
              <p className="text-muted-foreground mb-4">
                {result.score} out of {result.maxScore} points
              </p>
              {result.passed ? (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Passed
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="mr-1 h-4 w-4" />
                  Failed
                </Badge>
              )}
            </div>

            {result.answers && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Answer Review</h3>
                {result.answers.map((ans, idx) => (
                  <Card key={idx} className={ans.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-2">
                        {ans.isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-2">
                            Question {ans.questionIndex + 1}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Your answer:</span> {ans.answer}
                          </p>
                          {!ans.isCorrect && ans.correctAnswer && (
                            <p className="text-sm text-green-700 mt-1">
                              <span className="font-medium">Correct answer:</span> {ans.correctAnswer}
                            </p>
                          )}
                          {ans.explanation && (
                            <p className="text-sm text-muted-foreground mt-2">
                              <AlertCircle className="inline h-4 w-4 mr-1" />
                              {ans.explanation}
                            </p>
                          )}
                        </div>
                        <Badge variant={ans.isCorrect ? 'default' : 'secondary'}>
                          {ans.pointsEarned} pts
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Button onClick={() => { setSelectedQuiz(null); setResult(null); fetchQuizzes(); }} className="w-full">
              Back to Quizzes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Quizzes</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <Card key={quiz._id}>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{quiz.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{quiz.duration} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Passing Score:</span>
                <span className="font-medium">{quiz.passingScore}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Attempts:</span>
                <span className="font-medium">
                  {quiz.myAttempts || 0} / {quiz.maxAttempts}
                </span>
              </div>
              {quiz.bestScore !== undefined && quiz.bestScore !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Best Score:</span>
                  <span className="font-medium text-green-600">{quiz.bestScore}%</span>
                </div>
              )}

              <Button
                onClick={() => startQuiz(quiz)}
                disabled={!quiz.canAttempt}
                className="w-full"
              >
                {quiz.canAttempt ? 'Start Quiz' : 'No Attempts Left'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {quizzes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No quizzes available yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
