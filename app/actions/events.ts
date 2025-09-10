'use server';

import { connectToDatabase } from '@/lib/db';
import Event, { IEvent } from "@/models/Event";
import Students from '@/models/Students';
import { revalidatePath } from 'next/cache';
import { sendMail } from '@/lib/email';
import { AttendanceTemplate } from "@/mail/StudentAttendanceMail";
import { reminderEmailTemplate } from "@/mail/Remind";
import { toZonedTime, format } from "date-fns-tz";

const indiaTimeZone = "Asia/Kolkata"; // IST

export async function createEvent(eventName: string, eventDate: string) {
  try {
    await connectToDatabase();
    const newEvent = new Event({ eventName, eventDate });
    await newEvent.save();
    console.log("Event created:", newEvent);
    revalidatePath('/admin/scanner');

    const plainEvent = JSON.parse(JSON.stringify(newEvent));
    return { ok: true, event: plainEvent };
  } catch (error) {
    console.error("Error creating event:", error);
    return { ok: false, error: 'Failed to create event' };
  }
}

export async function getEvents() {
  try {
    await connectToDatabase();
    const events = await Event.find({}).sort({ createdAt: -1 }).lean<IEvent[]>();
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function deleteEvent(id: string) {
  try {
    await connectToDatabase();
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      console.error("Event not found:", id);
      return { ok: false, error: 'Event not found' };
    }
    console.log("Event deleted:", deletedEvent);
    revalidatePath('/admin/scanner');
    return { ok: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { ok: false, error: 'Failed to delete event' };
  }
}

export async function getEventAttendance(eventId: string) {
  try {
    await connectToDatabase();
    const event = await Event.findById(eventId).lean<IEvent | null>();

    if (!event) {
      return { ok: false, error: 'Event not found' };
    }

    const students = await Students.find({ eventName: event.eventName }).lean();

    const rows = (students || []).map((s: any) => ({
      name: s.name,
      email: s.email,
      rollNumber: s.rollNumber,
      universityRollNo: s.universityRollNo,
      branch: s.branch,
      year: s.year,
      phoneNumber: s.phoneNumber,
      attendanceCount: Array.isArray(s.attendance) ? s.attendance.length : 0,
      lastAttendanceAt:
        Array.isArray(s.attendance) && s.attendance.length > 0
          ? new Date(s.attendance[s.attendance.length - 1].date).toISOString()
          : '',
    }));

    return { ok: true, eventName: event.eventName, rows };
  } catch (error) {
    console.error('Error fetching event attendance:', error);
    return { ok: false, error: 'Failed to fetch event attendance' };
  }
}

export async function markStudentAttendence(userId: string) {
  try {
    await connectToDatabase();

    let user = await Students.findOne({
      qrCode: `${process.env.NEXT_PUBLIC_APP_URL || 'https://student-dashboard-sable.vercel.app'}/scan/${userId}`
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const todayIST = format(toZonedTime(new Date(), indiaTimeZone), 'yyyy-MM-dd');
    const attendanceToday = user.attendance.find((a: any) => {
      const attendanceDateIST = format(
        toZonedTime(new Date(a.date), indiaTimeZone),
        'yyyy-MM-dd'
      );
      return attendanceDateIST === todayIST;
    });

    if (attendanceToday) {
      return {
        success: true,
        message: 'Attendance already marked for today',
        user: JSON.parse(JSON.stringify({
          id: user._id.toString(),
          name: user.name,
          rollNumber: user.rollNumber
        }))
      };
    }

    user.attendance.push({
      date: new Date(),
      present: true
    });

    await user.save();
    const html = AttendanceTemplate(user.name, user.rollNumber, user.eventName);
    await sendMail({
      to: user.email,
      subject: 'Thanks For Attending the Event',
      html
    });
    revalidatePath('/Student-Attendance');

    return {
      success: true,
      message: 'Attendance marked successfully',
      user: JSON.parse(JSON.stringify({
        id: user._id.toString(),
        name: user.name,
        rollNumber: user.rollNumber
      }))
    };
  } catch (error) {
    console.error('Error marking attendance:', error);
    return { success: false, error: 'Failed to mark attendance' };
  }
}

export async function RemainerStudents(id: string) {
  try {
    await connectToDatabase();

    const event = await Event.findById(id).lean<IEvent | null>();
    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    const students = await Students.find({ eventName: event.eventName });
    if (!students || students.length === 0) {
      return { success: false, message: 'No students found for this event' };
    }

    const eventDate = new Date(event.eventDate);
    const formattedDate = eventDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mailPromises = students.map((student: any) =>
      sendMail({
        to: student.email,
        subject: `📅 Event Reminder: ${event.eventName} - ${formattedDate}`,
        html: reminderEmailTemplate(
          student.name,
          event.eventName,
          "RTU Campus, Kota",
          `${formattedDate} at 3:00 PM`
        ),
      })
    );

    await Promise.all(mailPromises);

    console.log(`Reminder emails sent to ${students.length} students for event: ${event.eventName}`);
    return {
      success: true,
      message: `Reminder emails sent successfully to ${students.length} students`
    };
  } catch (error) {
    console.error('Error in RemainerStudents:', error);
    return { success: false, message: 'Failed to send reminder emails' };
  }
}
