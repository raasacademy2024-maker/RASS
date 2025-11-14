import { useState, useEffect } from 'react';
import { analyticsAPI, enrollmentAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Trophy, Medal, Award } from 'lucide-react';

interface Student {
  _id: string;
  name: string;
  email: string;
  profile?: {
    avatar?: string;
  };
}

interface LeaderboardEntry {
  student: Student;
  progressPercentage: number;
  modulesCompleted: number;
  totalModules: number;
  enrolledAt: string;
  rank: number;
}

interface Batch {
  _id: string;
  name: string;
}

export default function BatchLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myRank, setMyRank] = useState<number | null>(null);

  useEffect(() => {
    fetchMyEnrollment();
  }, []);

  const fetchMyEnrollment = async () => {
    try {
      const response = await enrollmentAPI.getMyEnrollments();
      const enrollments = response.data;
      
      // Get the first enrollment with a batch
      const enrollmentWithBatch = enrollments.find((e: any) => e.batch);
      
      if (enrollmentWithBatch && enrollmentWithBatch.batch) {
        fetchLeaderboard(enrollmentWithBatch.batch._id);
      } else {
        setError('You are not enrolled in any batch');
        setLoading(false);
      }
    } catch (err: any) {
      setError('Failed to load enrollment information');
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (batchId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await analyticsAPI.getBatchLeaderboard(batchId);
      setBatch(response.data.batch);
      setLeaderboard(response.data.leaderboard);
      
      // Find current user's rank
      const userEmail = localStorage.getItem('userEmail');
      const myEntry = response.data.leaderboard.find(
        (entry: LeaderboardEntry) => entry.student.email === userEmail
      );
      if (myEntry) {
        setMyRank(myEntry.rank);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return null;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-200';
      case 2:
        return 'bg-gray-50 border-gray-200';
      case 3:
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Batch Leaderboard</h1>
          {batch && (
            <p className="text-muted-foreground mt-2">
              {batch.name}
            </p>
          )}
        </div>
        {myRank && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Your Rank</p>
            <p className="text-3xl font-bold text-primary">#{myRank}</p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {!loading && leaderboard.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.student._id}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-all ${getRankBgColor(entry.rank)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10">
                      {getRankIcon(entry.rank) || (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">#{entry.rank}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {entry.student.profile?.avatar ? (
                        <img
                          src={entry.student.profile.avatar}
                          alt={entry.student.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {entry.student.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      <div>
                        <p className="font-medium">{entry.student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.modulesCompleted} of {entry.totalModules} modules completed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - entry.progressPercentage / 100)}`}
                          className="text-primary transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold">{entry.progressPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && leaderboard.length === 0 && !error && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No leaderboard data available yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
