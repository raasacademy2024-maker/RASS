import { useState, useEffect } from 'react';
import { doubtAPI, enrollmentAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Brain, ThumbsUp, MessageSquare, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface Doubt {
  _id: string;
  title: string;
  question: string;
  codeSnippet?: string;
  language?: string;
  tags: string[];
  status: 'open' | 'ai-answered' | 'instructor-answered' | 'resolved' | 'closed';
  aiResponse?: {
    answer: string;
    generatedAt: string;
    confidence: number;
    codeExamples: string[];
  };
  instructorResponse?: {
    answer: string;
    respondedBy: {
      name: string;
    };
    respondedAt: string;
  };
  upvotes: string[];
  student: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export default function StudentDoubts() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [myDoubts, setMyDoubts] = useState<Doubt[]>([]);
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('my');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newDoubt, setNewDoubt] = useState({
    title: '',
    question: '',
    codeSnippet: '',
    language: '',
    tags: ''
  });

  useEffect(() => {
    fetchDoubts();
  }, [activeTab]);

  const fetchDoubts = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'my') {
        const response = await doubtAPI.getMyDoubts();
        setMyDoubts(response.data);
      } else {
        const enrollmentResponse = await enrollmentAPI.getMyEnrollments();
        const enrollments = enrollmentResponse.data;

        if (enrollments.length > 0) {
          const courseId = enrollments[0].course._id;
          const batchId = enrollments[0].batch?._id;
          
          const response = await doubtAPI.getCourseDoubts(courseId, batchId);
          setDoubts(response.data);
        }
      }
    } catch (err: any) {
      setError('Failed to load doubts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoubt = async () => {
    if (!newDoubt.title || !newDoubt.question) {
      setError('Title and question are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const enrollmentResponse = await enrollmentAPI.getMyEnrollments();
      const enrollments = enrollmentResponse.data;

      if (enrollments.length === 0) {
        setError('You are not enrolled in any course');
        return;
      }

      const courseId = enrollments[0].course._id;
      const batchId = enrollments[0].batch?._id;

      await doubtAPI.createDoubt({
        courseId,
        batchId,
        title: newDoubt.title,
        question: newDoubt.question,
        codeSnippet: newDoubt.codeSnippet,
        language: newDoubt.language,
        tags: newDoubt.tags.split(',').map(t => t.trim()).filter(t => t)
      });

      setNewDoubt({
        title: '',
        question: '',
        codeSnippet: '',
        language: '',
        tags: ''
      });
      setIsDialogOpen(false);
      fetchDoubts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create doubt');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateAISolution = async (doubtId: string) => {
    setGeneratingAI(true);
    setError('');

    try {
      const response = await doubtAPI.generateAISolution(doubtId);
      // Update the selected doubt with AI response
      if (selectedDoubt && selectedDoubt._id === doubtId) {
        setSelectedDoubt({
          ...selectedDoubt,
          aiResponse: response.data.aiResponse,
          status: 'ai-answered'
        });
      }
      fetchDoubts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate AI solution');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleUpvote = async (doubtId: string) => {
    try {
      await doubtAPI.upvoteDoubt(doubtId);
      fetchDoubts();
    } catch (err: any) {
      console.error('Failed to upvote:', err);
    }
  };

  const handleMarkResolved = async (doubtId: string) => {
    try {
      await doubtAPI.updateStatus(doubtId, 'resolved');
      fetchDoubts();
      setSelectedDoubt(null);
    } catch (err: any) {
      setError('Failed to mark as resolved');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline">Open</Badge>;
      case 'ai-answered':
        return <Badge className="bg-blue-500">AI Answered</Badge>;
      case 'instructor-answered':
        return <Badge className="bg-green-500">Instructor Answered</Badge>;
      case 'resolved':
        return <Badge className="bg-purple-500">Resolved</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const displayDoubts = activeTab === 'my' ? myDoubts : doubts;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Doubt Solver</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ask a Doubt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ask a New Doubt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="Brief summary of your doubt"
                  value={newDoubt.title}
                  onChange={(e) => setNewDoubt({ ...newDoubt, title: e.target.value })}
                />
              </div>

              <div>
                <Label>Question</Label>
                <Textarea
                  placeholder="Describe your doubt in detail"
                  value={newDoubt.question}
                  onChange={(e) => setNewDoubt({ ...newDoubt, question: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label>Code Snippet (Optional)</Label>
                <Textarea
                  placeholder="Paste your code here"
                  value={newDoubt.codeSnippet}
                  onChange={(e) => setNewDoubt({ ...newDoubt, codeSnippet: e.target.value })}
                  className="font-mono text-sm"
                  rows={6}
                />
              </div>

              <div>
                <Label>Programming Language (Optional)</Label>
                <Input
                  placeholder="e.g., JavaScript, Python, Java"
                  value={newDoubt.language}
                  onChange={(e) => setNewDoubt({ ...newDoubt, language: e.target.value })}
                />
              </div>

              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  placeholder="e.g., react, hooks, useState"
                  value={newDoubt.tags}
                  onChange={(e) => setNewDoubt({ ...newDoubt, tags: e.target.value })}
                />
              </div>

              <Button onClick={handleCreateDoubt} disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Doubt'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'my' ? 'default' : 'outline'}
          onClick={() => setActiveTab('my')}
        >
          My Doubts
        </Button>
        <Button
          variant={activeTab === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveTab('all')}
        >
          All Doubts
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {displayDoubts.map((doubt) => (
            <Card key={doubt._id} className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedDoubt(doubt)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{doubt.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{doubt.question}</p>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(doubt.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex gap-4">
                    {doubt.tags.length > 0 && (
                      <div className="flex gap-1">
                        {doubt.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {doubt.upvotes.length}
                    </span>
                    <span>{formatDate(doubt.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {displayDoubts.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {activeTab === 'my' ? 'You haven\'t asked any doubts yet' : 'No doubts available'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Doubt Detail Dialog */}
      {selectedDoubt && (
        <Dialog open={!!selectedDoubt} onOpenChange={() => setSelectedDoubt(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-start">
                <DialogTitle>{selectedDoubt.title}</DialogTitle>
                {getStatusBadge(selectedDoubt.status)}
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Question</h3>
                <p className="text-sm">{selectedDoubt.question}</p>
              </div>

              {selectedDoubt.codeSnippet && (
                <div>
                  <h3 className="font-semibold mb-2">Code Snippet</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{selectedDoubt.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {selectedDoubt.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex gap-2">
                    {selectedDoubt.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {!selectedDoubt.aiResponse && selectedDoubt.status === 'open' && (
                <Button
                  onClick={() => handleGenerateAISolution(selectedDoubt._id)}
                  disabled={generatingAI}
                  className="w-full"
                >
                  {generatingAI ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating AI Solution...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Get AI Solution
                    </>
                  )}
                </Button>
              )}

              {selectedDoubt.aiResponse && (
                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Solution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm whitespace-pre-wrap">{selectedDoubt.aiResponse.answer}</p>
                    
                    {selectedDoubt.aiResponse.codeExamples.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Code Examples</h4>
                        {selectedDoubt.aiResponse.codeExamples.map((code, idx) => (
                          <pre key={idx} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-2">
                            <code className="text-sm">{code}</code>
                          </pre>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Confidence: {Math.round((selectedDoubt.aiResponse.confidence || 0) * 100)}%
                    </p>
                  </CardContent>
                </Card>
              )}

              {selectedDoubt.instructorResponse && (
                <Card className="bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Instructor Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm whitespace-pre-wrap">{selectedDoubt.instructorResponse.answer}</p>
                    <p className="text-xs text-muted-foreground">
                      By {selectedDoubt.instructorResponse.respondedBy.name} on{' '}
                      {formatDate(selectedDoubt.instructorResponse.respondedAt)}
                    </p>
                  </CardContent>
                </Card>
              )}

              {selectedDoubt.status !== 'resolved' && selectedDoubt.status !== 'closed' && (
                <Button
                  onClick={() => handleMarkResolved(selectedDoubt._id)}
                  variant="outline"
                  className="w-full"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Resolved
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
