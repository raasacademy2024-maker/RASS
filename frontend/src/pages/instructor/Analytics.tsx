import { useState, useEffect } from 'react';
import { analyticsAPI, courseAPI, batchAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TrendingUp, AlertTriangle, Award, Users, BookOpen, Target } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
}

interface Batch {
  _id: string;
  name: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface Analytics {
  overview: {
    totalStudents: number;
    completedStudents: number;
    averageProgress: number;
    batchEngagementScore: number;
  };
  topPerformers: Array<{
    student: Student;
    batch?: Batch;
    completionPercentage: number;
    enrolledAt: string;
    lastAccessed?: string;
  }>;
  studentsAtRisk: Array<{
    student: Student;
    batch?: Batch;
    completionPercentage: number;
    daysSinceLastAccess: number;
    isAtRisk: boolean;
  }>;
  assignments: {
    total: number;
    totalSubmissions: number;
    averageGrade: number;
  };
  quizzes: {
    total: number;
    totalAttempts: number;
    averageScore: number;
  };
}

export default function InstructorAnalytics() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchBatches();
      fetchAnalytics();
    }
  }, [selectedCourse, selectedBatch]);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getInstructorCourses();
      setCourses(response.data);
    } catch (err: any) {
      setError('Failed to load courses');
    }
  };

  const fetchBatches = async () => {
    if (!selectedCourse) return;
    try {
      const response = await batchAPI.getCourseBatches(selectedCourse);
      setBatches(response.data);
    } catch (err: any) {
      console.error('Failed to load batches:', err);
    }
  };

  const fetchAnalytics = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    setError('');
    try {
      const response = await analyticsAPI.getCourseAnalytics(
        selectedCourse,
        selectedBatch || undefined
      );
      setAnalytics(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instructor Analytics</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Select Course</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {batches.length > 0 && (
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Select Batch (Optional)</label>
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger>
                    <SelectValue placeholder="All batches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All batches</SelectItem>
                    {batches.map((batch) => (
                      <SelectItem key={batch._id} value={batch._id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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

      {analytics && !loading && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.overview.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.overview.completedStudents} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.overview.averageProgress}%</div>
                <p className="text-xs text-muted-foreground">Course completion</p>
              </CardContent>
            </Card>

            {selectedBatch && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.batchEngagementScore}%</div>
                  <p className="text-xs text-muted-foreground">Batch engagement</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.assignments.total}</div>
                <p className="text-xs text-muted-foreground">
                  Avg grade: {analytics.assignments.averageGrade}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Tabs defaultValue="top-performers" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
              <TabsTrigger value="at-risk">Students at Risk</TabsTrigger>
              <TabsTrigger value="performance">Performance Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="top-performers">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Top Performing Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topPerformers.length === 0 ? (
                      <p className="text-muted-foreground">No students enrolled yet</p>
                    ) : (
                      analytics.topPerformers.map((performer, index) => (
                        <div
                          key={performer.student._id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{performer.student.name}</p>
                              <p className="text-sm text-muted-foreground">{performer.student.email}</p>
                              {performer.batch && (
                                <p className="text-xs text-muted-foreground">Batch: {performer.batch.name}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              {performer.completionPercentage}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Enrolled: {formatDate(performer.enrolledAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="at-risk">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Students at Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.studentsAtRisk.length === 0 ? (
                      <p className="text-muted-foreground">No students at risk</p>
                    ) : (
                      analytics.studentsAtRisk.map((student) => (
                        <div
                          key={student.student._id}
                          className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50"
                        >
                          <div>
                            <p className="font-medium">{student.student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.student.email}</p>
                            {student.batch && (
                              <p className="text-xs text-muted-foreground">Batch: {student.batch.name}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-orange-600">
                              {student.completionPercentage}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {student.daysSinceLastAccess} days inactive
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Assignment Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Assignments:</span>
                      <span className="font-bold">{analytics.assignments.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Submissions:</span>
                      <span className="font-bold">{analytics.assignments.totalSubmissions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Grade:</span>
                      <span className="font-bold text-green-600">
                        {analytics.assignments.averageGrade}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quiz Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Quizzes:</span>
                      <span className="font-bold">{analytics.quizzes.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Attempts:</span>
                      <span className="font-bold">{analytics.quizzes.totalAttempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Score:</span>
                      <span className="font-bold text-blue-600">
                        {analytics.quizzes.averageScore}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
