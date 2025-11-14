import { useState, useEffect } from 'react';
import { announcementAPI, batchAPI, courseAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Megaphone, Pin, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: string;
  isPinned: boolean;
  batches: Array<{ _id: string; name: string }>;
  createdBy: { name: string };
  createdAt: string;
  expiresAt?: string;
}

interface Course {
  _id: string;
  title: string;
}

interface Batch {
  _id: string;
  name: string;
}

export default function InstructorAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    type: 'general',
    batchIds: [] as string[],
    isPinned: false,
    expiresAt: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchBatches();
      fetchAnnouncements();
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getInstructorCourses();
      setCourses(response.data);
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0]._id);
      }
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

  const fetchAnnouncements = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    setError('');
    try {
      const response = await announcementAPI.getCourseAnnouncements(selectedCourse);
      setAnnouncements(response.data);
    } catch (err: any) {
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      setError('Title and content are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await announcementAPI.createAnnouncement({
        courseId: selectedCourse,
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        priority: newAnnouncement.priority,
        type: newAnnouncement.type,
        batchIds: newAnnouncement.batchIds,
        isPinned: newAnnouncement.isPinned,
        expiresAt: newAnnouncement.expiresAt || undefined
      });

      setNewAnnouncement({
        title: '',
        content: '',
        priority: 'medium',
        type: 'general',
        batchIds: [],
        isPinned: false,
        expiresAt: ''
      });
      setIsDialogOpen(false);
      fetchAnnouncements();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await announcementAPI.deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (err: any) {
      setError('Failed to delete announcement');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Announcements</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="Announcement title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                />
              </div>

              <div>
                <Label>Content</Label>
                <Textarea
                  placeholder="Announcement content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={newAnnouncement.priority}
                    onValueChange={(value: any) => setNewAnnouncement({ ...newAnnouncement, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Type</Label>
                  <Select
                    value={newAnnouncement.type}
                    onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="schedule-change">Schedule Change</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Target Batches (Optional - leave empty for all)</Label>
                <Select
                  value=""
                  onValueChange={(batchId) => {
                    if (!newAnnouncement.batchIds.includes(batchId)) {
                      setNewAnnouncement({
                        ...newAnnouncement,
                        batchIds: [...newAnnouncement.batchIds, batchId]
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select batches" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch._id} value={batch._id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newAnnouncement.batchIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newAnnouncement.batchIds.map((batchId) => {
                      const batch = batches.find(b => b._id === batchId);
                      return batch ? (
                        <Badge key={batchId} variant="secondary">
                          {batch.name}
                          <button
                            onClick={() => setNewAnnouncement({
                              ...newAnnouncement,
                              batchIds: newAnnouncement.batchIds.filter(id => id !== batchId)
                            })}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              <div>
                <Label>Expires At (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={newAnnouncement.expiresAt}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiresAt: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newAnnouncement.isPinned}
                  onCheckedChange={(checked) => setNewAnnouncement({ ...newAnnouncement, isPinned: checked })}
                />
                <Label>Pin this announcement</Label>
              </div>

              <Button onClick={handleCreateAnnouncement} disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Announcement'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Course Selector */}
      {courses.length > 1 && (
        <Card>
          <CardContent className="pt-6">
            <Label>Select Course</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

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

      {!loading && (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement._id} className={announcement.isPinned ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {announcement.isPinned && <Pin className="h-4 w-4 text-primary" />}
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                      <Badge variant="outline">{announcement.type}</Badge>
                      {announcement.batches.length > 0 && (
                        <Badge variant="secondary">
                          {announcement.batches.length} batch(es)
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap mb-4">{announcement.content}</p>
                
                {announcement.batches.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground mb-1">Target Batches:</p>
                    <div className="flex flex-wrap gap-1">
                      {announcement.batches.map((batch) => (
                        <Badge key={batch._id} variant="secondary" className="text-xs">
                          {batch.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>By {announcement.createdBy.name}</span>
                  <span>{formatDate(announcement.createdAt)}</span>
                </div>

                {announcement.expiresAt && (
                  <div className="flex items-center gap-1 text-xs text-orange-600 mt-2">
                    <AlertCircle className="h-3 w-3" />
                    Expires: {formatDate(announcement.expiresAt)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {announcements.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No announcements yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
