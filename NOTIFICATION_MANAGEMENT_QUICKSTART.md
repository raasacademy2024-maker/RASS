# Quick Start Guide - Notification Management

## For Admins/Instructors

### Accessing the Feature
1. Log in to the admin panel
2. Navigate to the Dashboard
3. Click on the **"Notification Management"** card (with Bell icon)

---

## Sending Notifications

### Option 1: Send to Course Students

**Use Case**: Notify all students in a specific course about updates, new content, or schedule changes.

**Steps**:
1. Click **"By Course"** mode
2. Select a course from the dropdown
3. See how many students will be notified
4. Choose notification type (Course Update recommended)
5. Enter title and message
6. Toggle "Send email notification" ON if you want emails sent
7. Click **"Send Notification"**

**Example**:
- Course: "Full Stack Web Development"
- Title: "New React Module Available"
- Message: "We've added Module 5 covering React Hooks. Check it out in your course dashboard!"
- Type: Course Update
- Send Email: ✓ Yes

---

### Option 2: Send to Selected Users

**Use Case**: Send custom notifications to specific users, regardless of course enrollment.

**Steps**:
1. Click **"Manual Selection"** mode
2. Use the search box to find users by name/email
3. Filter by role if needed (Student/Instructor/Admin)
4. Check the boxes next to users you want to notify
5. Or click "Select All" to select all visible users
6. Choose notification type
7. Enter title and message
8. Toggle "Send email notification" if needed
9. Click **"Send Notification"**

**Example**:
- Selected: John Doe, Jane Smith, Mike Johnson (3 students)
- Title: "Upcoming Workshop"
- Message: "You're invited to our exclusive React workshop on Saturday at 10 AM!"
- Type: Announcement
- Send Email: ✓ Yes

---

## Viewing History

**Purpose**: See all notifications you've sent and their delivery status.

**Steps**:
1. Click the **"History"** tab
2. Review the table showing:
   - Who received the notification
   - Title and type
   - Email delivery status (✓ Sent, ✗ Failed, ⚠ Pending)
   - Send date
3. Use pagination to browse through older notifications

---

## Checking Statistics

**Purpose**: Monitor overall notification system performance.

**Steps**:
1. Click the **"Statistics"** tab
2. View dashboard cards showing:
   - **Total Notifications**: All notifications sent
   - **Emails Sent**: Successfully delivered emails (green)
   - **Emails Failed**: Failed email deliveries (red)
   - **Pending**: Emails not yet sent (yellow)

---

## Testing Email Setup

**Before sending to many users**, test your email configuration:

**Steps**:
1. Click **"Test Email"** button
2. Enter a test email address (your own email recommended)
3. Check your inbox to verify:
   - Email was received
   - Formatting looks correct
   - Links work
   - No spam folder delivery

---

## Notification Types Explained

- **Course Update**: For course-related changes (new modules, content updates)
- **Announcement**: For important general announcements
- **System**: For system-level notifications (maintenance, updates)
- **Bulk**: For general purpose bulk notifications

Each type has its own professionally designed email template.

---

## Best Practices

### ✅ Do's
- ✓ Test email before sending to large groups
- ✓ Write clear, concise titles
- ✓ Use appropriate notification types
- ✓ Preview how many users will receive the notification
- ✓ Send emails for important notifications
- ✓ Check history to verify delivery

### ❌ Don'ts
- ✗ Don't send too many notifications (avoid spam)
- ✗ Don't use all caps in titles
- ✗ Don't forget to enable email for critical messages
- ✗ Don't send without reviewing the message
- ✗ Don't ignore failed email notifications

---

## Troubleshooting

### Emails Not Sending
1. Check environment variables are set correctly
2. Use "Test Email" to diagnose
3. Verify Gmail app password or SMTP settings
4. Check spam folder
5. Review error message in notification history

### Users Not Receiving In-App Notifications
1. Verify users are logged in to see notifications
2. Check notification history to confirm sending
3. Ensure correct users were selected

### Can't Find a User
1. Use the search box
2. Check the role filter
3. Verify user exists in the system

---

## Tips for Effective Notifications

1. **Be Specific**: Clear subject lines help users prioritize
2. **Keep it Short**: Get to the point quickly
3. **Include Action Items**: Tell users what they need to do
4. **Use Course Mode for Course Updates**: It's more efficient
5. **Timing Matters**: Send during business hours for better open rates
6. **Track Results**: Check history to see delivery status

---

## Example Scenarios

### Scenario 1: New Module Added
```
Mode: By Course
Course: Python Programming
Type: Course Update
Title: "New Module: Web Scraping with BeautifulSoup"
Message: "We've just added Module 8 covering web scraping techniques. Learn how to extract data from websites using Python!"
Email: ✓ Yes
```

### Scenario 2: Platform Maintenance
```
Mode: Manual Selection (Select All)
Filter: All Users
Type: System
Title: "Scheduled Maintenance - Sunday 2 AM"
Message: "The platform will be under maintenance on Sunday from 2 AM to 4 AM IST. Please save your work before then."
Email: ✓ Yes
```

### Scenario 3: Special Workshop Invitation
```
Mode: Manual Selection
Selected: Top 10 performing students
Type: Announcement
Title: "Exclusive Advanced React Workshop"
Message: "Congratulations! Based on your excellent performance, you're invited to our exclusive React workshop. Saturday at 10 AM."
Email: ✓ Yes
```

---

## Support

For technical issues or questions:
- Check the full API documentation: `NOTIFICATION_MANAGEMENT_API.md`
- Review implementation details: `NOTIFICATION_MANAGEMENT_SUMMARY.md`
- Contact the development team

---

## Quick Reference

| Action | Location | Shortcut |
|--------|----------|----------|
| Send by Course | Send Tab → By Course | - |
| Send to Users | Send Tab → Manual Selection | - |
| View History | History Tab | - |
| Check Stats | Statistics Tab | - |
| Test Email | Send Tab → Test Email Button | - |
| Back to Dashboard | Top Left → Back to Dashboard | - |

---

**Remember**: With great power comes great responsibility. Use this feature wisely to enhance user engagement without overwhelming them with notifications!
