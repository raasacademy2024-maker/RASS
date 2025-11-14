import { useState, useEffect } from 'react';
import { announcementAPI, enrollmentAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Megaphone, Pin, AlertCircle, Bell } from 'lucide-react';

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

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      // Get student's enrollments first
      const enrollmentResponse = await enrollmentAPI.getMyEnrollments();
      const enrollments = enrollmentResponse.data;

      if (enrollments.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch announcements for all enrolled courses
      const allAnnouncements: Announcement[] = [];
      
      for (const enrollment of enrollments) {
        try {
          const response = await announcementAPI.getCourseAnnouncements(
            enrollment.course._id,
            enrollment.batch?._id
          );
          allAnnouncements.push(...response.data);
        } catch (err) {
          console.error('Failed to load announcements for course:', enrollment.course.title);
        }
      }

      // Remove duplicates and sort by pinned status and date
      const uniqueAnnouncements = Array.from(
        new Map(allAnnouncements.map(a => [a._id, a])).values()
      );

      uniqueAnnouncements.sort((a, b) => {
        // Pinned first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        // Then by priority
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Finally by date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setAnnouncements(uniqueAnnouncements);
    } catch (err: any) {
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (announcementId: string) => {
    try {
      await announcementAPI.getAnnouncement(announcementId);
      // This marks it as read on the backend
    } catch (err) {
      console.error('Failed to mark as read:', err);
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

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <Bell className="h-4 w-4 animate-pulse" />;
    }
    return <Megaphone className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Announcements</h1>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with important course information
          </p>
        </div>
        {announcements.length > 0 && (
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{announcements.length}</p>
            <p className="text-xs text-muted-foreground">Total announcements</p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card
            key={announcement._id}
            className={`${
              announcement.isPinned ? 'border-primary shadow-md' : ''
            } ${isExpired(announcement.expiresAt) ? 'opacity-60' : ''} transition-all hover:shadow-lg`}
            onClick={() => markAsRead(announcement._id)}
          >
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getPriorityIcon(announcement.priority)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {announcement.isPinned && (
                      <Pin className="h-4 w-4 text-primary" />
                    )}
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                    <Badge variant="outline">{announcement.type}</Badge>
                    {announcement.batches.length > 0 && (
                      <Badge variant="secondary">
                        {announcement.batches.map(b => b.name).join(', ')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {announcement.content}
              </p>

              <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Posted by {announcement.createdBy.name}</span>
                </div>
                <span>{formatDate(announcement.createdAt)}</span>
              </div>

              {announcement.expiresAt && (
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <AlertCircle className="h-3 w-3" />
                  {isExpired(announcement.expiresAt)
                    ? 'Expired'
                    : `Expires on ${new Date(announcement.expiresAt).toLocaleString()}`}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {announcements.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Megaphone className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Announcements</h3>
              <p className="text-muted-foreground">
                You don't have any announcements at the moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
