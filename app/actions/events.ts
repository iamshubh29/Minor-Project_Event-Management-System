'use server'
import Event from "@/models/Event";
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import Students from '@/models/Students'
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { generateToken } from '@/lib/auth';
import { any } from 'zod';
import jwt from 'jsonwebtoken';
import { sendMail } from '@/lib/email';
import { registrationTemplate } from '@/mail/studentRegistration';
import { AttendanceTemplate } from "@/mail/StudentAttendanceMail";
import { reminderEmailTemplate } from "@/mail/Remind";




export async function createEvent(eventName: string, eventDate: string) {
  try {
    await connectToDatabase();
    const newEvent = new Event({ eventName, eventDate });
    await newEvent.save();
    console.log("Event created:", newEvent);
    const plain = newEvent.toObject();
    revalidatePath('/admin/scanner');
    return {
      ok: true,
      event: {
        ...plain,
        _id: plain._id?.toString?.() ?? String(plain._id),
        createdAt: plain.createdAt?.toISOString?.() ?? plain.createdAt,
        updatedAt: plain.updatedAt?.toISOString?.() ?? plain.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return { ok: false, error: 'Failed to create event' };
  }
}


export async function getEvents() {
  try {
    await connectToDatabase();
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();
    const serialized = (events || []).map((e: any) => ({
      ...e,
      _id: e._id?.toString?.() ?? String(e._id),
      createdAt: e.createdAt?.toISOString?.() ?? e.createdAt,
      updatedAt: e.updatedAt?.toISOString?.() ?? e.updatedAt,
    }));
    console.log('Event Data', serialized);
    return serialized;
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

// Download helpers
export async function getEventAttendance(eventId: string) {
  try {
    await connectToDatabase();
    const event = await Event.findById(eventId).lean();
    if (!event) {
      return { ok: false, error: 'Event not found' };
    }

    // Pull students registered for this event
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



import { toZonedTime, format } from "date-fns-tz";
import { QrCode } from 'lucide-react';
import { yearsToDays } from 'date-fns';
import { eventNames } from "process";

const indiaTimeZone = "Asia/Kolkata"; // IST

export async function markStudentAttendence(userId: string) {
  try {
    await connectToDatabase();
 

    let user = await Students.findOne({
      qrCode: `${process.env.NEXT_PUBLIC_APP_URL || 'https://student-dashboard-sable.vercel.app'}/scan/${userId}`
    });


    if(!user){
      return { success: false, error: 'User not found' };

    }

    // ✅ Convert today's date to IST (without time)
    const todayIST = format(toZonedTime(new Date(), indiaTimeZone), 'yyyy-MM-dd');

    // ✅ Check if attendance is already marked for today
    const attendanceToday = user.attendance.find((a: any) => {
      const attendanceDateIST = format(
        toZonedTime(new Date(a.date), indiaTimeZone),
        'yyyy-MM-dd'
      );

      return attendanceDateIST === todayIST; // Compare only the date part
    });

    if (attendanceToday) {
      return {
        success: true,
        message: 'Attendance already marked for today',
        user: {
          id: user._id.toString(),
          name: user.name,
          rollNumber: user.rollNumber
        }
      };
    }

    // ✅ Store attendance date in UTC (safe for database)
    user.attendance.push({
      date: new Date().toISOString(),
      present: true
    });

    await user.save();
    const html = AttendanceTemplate(user.name,user.rollNumber,user.eventName)
    const mailResponse = await sendMail({
      to: user.email,
      subject: 'Thanks For Attending the Event',
      html
    });
    revalidatePath('/Student-Attendance');

    return {
      success: true,
      message: 'Attendance marked successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        rollNumber: user.rollNumber
      }
    };
  } catch (error) {
    console.error('Error marking attendance:', error);
    return { success: false, error: 'Failed to mark attendance' };
  }
}




export async function RemainerStudents(id: string) {
  try {
    await connectToDatabase();

    const event = await Event.findById(id);
    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    const students = await Students.find({ eventName: event.eventName });
    if (!students || students.length === 0) {
      return { success: false, message: 'No students found for this event' };
    }

    // Format event date for display
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
