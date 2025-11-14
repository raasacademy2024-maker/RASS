# Batch Management User Guide

## Quick Start Guide for Batch-Wise Features

This guide helps administrators, instructors, and students understand and use the new batch management features.

---

## For Administrators

### Viewing Batch Analytics

1. **Navigate to Analytics**
   - Go to `/admin/analytics` or use the navigation menu
   - Select a course from the dropdown
   - Select a batch from the batch dropdown

2. **What You'll See**
   - **Key Metrics**: Total students, average progress, attendance rate, quiz average
   - **Assignments**: Total, submissions, graded, pending review
   - **Attendance**: Sessions, present/absent/late counts, percentage
   - **Live Sessions**: Total, upcoming, completed
   - **Top Performers**: Students with highest progress
   - **At-Risk Students**: Students with < 30% progress who need attention

### Transferring Students Between Batches

1. **From Batch Management Page** (to be integrated)
   - Select the course
   - Click "Transfer Students" on the source batch card
   
2. **In the Transfer Modal**
   - Select target batch from dropdown
   - See available capacity in real-time
   - Check/uncheck students to transfer
   - Use "Select All" for bulk operations
   - Review the transfer preview
   - Click "Transfer" (will be disabled if capacity exceeded)

3. **Capacity Validation**
   - ✓ Green message: Enough capacity
   - ✗ Red message: Not enough capacity
   - System prevents over-capacity transfers

### Merging Batches

**Use Case**: Combine two small batches into one larger batch

**API Endpoint**: `POST /api/batches/{sourceBatchId}/merge`

**Request**:
```json
{
  "targetBatchId": "batch_id_to_merge_into"
}
```

**What Happens**:
- All students moved to target batch
- All assignments transferred
- All attendance records updated
- All announcements updated
- Source batch deleted
- Enrollment counts updated

**Requirements**:
- Admin access only
- Both batches must be from same course
- Target batch must have enough capacity
- Increase target batch capacity if needed before merging

### Archiving Batches

**Use Case**: Temporarily deactivate a batch without deleting data

**API Endpoint**: `POST /api/batches/{batchId}/archive`

**Effect**:
- Batch marked as inactive (`isActive: false`)
- Batch hidden from active batch lists
- All data preserved
- Can be restored later

### Restoring Batches

**Use Case**: Reactivate an archived batch

**API Endpoint**: `POST /api/batches/{batchId}/restore`

**Effect**:
- Batch marked as active (`isActive: true`)
- Batch appears in active batch lists
- All data intact

---

## For Instructors

### Viewing Your Batch Analytics

1. **Navigate to Analytics**
   - Go to `/instructor/analytics` 
   - Select your course from dropdown
   - Select a batch

2. **Focus Areas**
   - **Students Needing Attention**: Low-progress students
   - **Pending Assignments**: Submissions waiting for grading
   - **Attendance Patterns**: Identify attendance issues
   - **Top Performers**: Recognize high-achievers

### Creating Batch-Specific Content

#### Assignments
When creating an assignment:
```
Title: Module 3 Assignment
Description: ...
Batch (Optional): [Select specific batch]
```
- Leave batch empty for all students
- Select batch for batch-specific assignment

#### Live Sessions
When scheduling a session:
```
Title: React Hooks Deep Dive
Date & Time: ...
Batch (Optional): [Select specific batch]
```
- Leave batch empty for all students
- Select batch for batch-specific session

#### Announcements
When posting an announcement:
```
Title: Upcoming Test
Content: ...
Target Batches: [Select one or more batches]
```
- Can select multiple batches
- Students only see announcements for their batch

### Viewing Batch-Wise Students

1. **Navigate to Students Page**
   - Go to `/instructor/students`
   - Select course
   - Use batch filter dropdown
   - Options: All Batches, Specific Batch, No Batch

2. **Student Information Shows**
   - Name and email
   - Batch assignment
   - Course progress
   - Enrollment date

---

## For Students

### Viewing Your Batch Information

1. **Dashboard**
   - Your batch is displayed on each course card
   - Shows: Batch name, start date, end date
   - Example: "📅 Batch: MERN Stack - Jan 2025"

2. **Course Content**
   - Assignments tagged with your batch
   - Live sessions for your batch
   - Announcements targeted to your batch

### What Batch Assignment Means

- You see content specific to your batch
- Your progress is tracked within your batch
- Your batch determines your schedule
- Instructors can compare batch performance

### If You're Not in a Batch

- No problem! You can still access all content
- Some content may not be batch-specific
- Your progress is still tracked
- You won't see batch information on dashboard

---

## Common Use Cases

### Scenario 1: Moving Late Enrollers
**Problem**: Students enrolled late need to move to a later batch

**Solution**:
1. Admin identifies late students
2. Uses batch transfer to move to appropriate batch
3. Students now see correct batch schedule

### Scenario 2: Combining Small Batches
**Problem**: Two batches have low enrollment

**Solution**:
1. Admin increases target batch capacity
2. Uses batch merge to combine batches
3. All students now in one larger batch
4. Reduced overhead for instructors

### Scenario 3: Archiving Past Batches
**Problem**: Old batches clutter the interface

**Solution**:
1. Admin archives completed batches
2. Batches hidden but data preserved
3. Can restore if needed for reports

### Scenario 4: Identifying Struggling Students
**Problem**: Need to find students needing help

**Solution**:
1. Instructor views batch analytics
2. Checks "At-Risk Students" section
3. Reaches out to students with < 30% progress
4. Provides additional support

### Scenario 5: Performance Comparison
**Problem**: Want to compare different batches

**Solution**:
1. Admin/Instructor views analytics for Batch A
2. Notes key metrics
3. Switches to Batch B
4. Compares attendance, quiz scores, progress
5. Identifies best practices to share

---

## Best Practices

### For Administrators

1. **Set Realistic Capacity**
   - Don't set capacity too low (prevents transfers)
   - Don't set too high (loses meaning)
   - Consider expected enrollment + 20%

2. **Regular Analytics Review**
   - Check at-risk students weekly
   - Monitor attendance patterns
   - Track assignment completion rates

3. **Clean Batch Management**
   - Archive old batches regularly
   - Use consistent naming (e.g., "MERN - Jan 2025")
   - Document batch purposes

4. **Before Merging**
   - Notify students
   - Increase target batch capacity
   - Verify same course
   - Backup data if needed

### For Instructors

1. **Use Batch-Specific Content**
   - Create assignments per batch when needed
   - Schedule batch-specific sessions
   - Target announcements appropriately

2. **Monitor Analytics**
   - Weekly check on progress
   - Identify struggling students early
   - Celebrate top performers

3. **Communication**
   - Keep batch students informed
   - Use batch-targeted announcements
   - Encourage peer learning within batches

### For Students

1. **Know Your Batch**
   - Check your batch info on dashboard
   - Note start/end dates
   - Understand your schedule

2. **Follow Batch Schedule**
   - Attend batch-specific sessions
   - Complete batch assignments on time
   - Check batch-targeted announcements

---

## Troubleshooting

### "Cannot transfer - capacity exceeded"
**Solution**: Admin needs to increase target batch capacity first

### "Batch not found"
**Solution**: Batch may have been archived or deleted. Contact admin.

### "Not authorized"
**Solution**: Only admins can merge/archive. Instructors can only manage their course batches.

### Analytics not loading
**Solution**: 
1. Refresh the page
2. Check internet connection
3. Try selecting a different batch
4. Contact support if issue persists

### Students not seeing batch content
**Solution**:
1. Verify student is enrolled in batch
2. Check batch is active
3. Verify content is assigned to correct batch

---

## Tips & Tricks

### For Faster Navigation
- Bookmark `/admin/analytics` or `/instructor/analytics`
- Use browser back button after viewing analytics
- Keep commonly used batch IDs handy

### For Better Organization
- Use date-based batch names: "Python - Jan 2025"
- Include batch level if relevant: "Advanced React - Q1"
- Be consistent across courses

### For Reporting
- Take screenshots of analytics for records
- Export student lists before transfers
- Document batch merges for tracking

---

## Support

### Getting Help
- Check BATCH_IMPLEMENTATION_SUMMARY.md for technical details
- Review API documentation for developers
- Contact system administrator for batch management

### Feature Requests
- Suggest improvements to development team
- Report bugs through proper channels
- Share feedback on user experience

---

## Keyboard Shortcuts (Future Enhancement)
*Coming soon: Keyboard shortcuts for common batch operations*

## Mobile Access (Current Status)
- Analytics pages are responsive
- Works on tablets and phones
- Optimized for mobile browsing

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Status**: Production Ready
