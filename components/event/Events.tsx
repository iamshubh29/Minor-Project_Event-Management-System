"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { createEvent, getEvents, deleteEvent as deleteEventAction, RemainerStudents, getEventAttendance } from "@/app/actions/events";

interface Attendance {
  name: string;
  email: string;
  rollNo: string;
  present: boolean;
}

interface Event {
  _id: string;
  eventName: string;
  eventDate: string;
  attendance: Attendance[];
}

export default function EventManager() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const res = await getEvents();
    if (res) {
      setEvents(res);
    } else {
      toast.error("Failed to fetch events");
    }
    setLoading(false);
  }

  async function createPTPEvent() {
    if (!eventName || !eventDate) {
      toast.error("Please fill in all fields");
      return;
    }
    if (new Date(eventDate) < new Date()) {
      toast.error("Event date cannot be in the past");
      return;
    }

    const res = await createEvent(eventName, eventDate);

    if (res?.ok) {
      toast.success("Event created successfully!");
      setEventName("");
      setEventDate("");
      fetchEvents(); // 👈 Refresh the list only
    } else {
      toast.error("Failed to create event");
    }
  }
  async function handleReminderEvent(id: string){
    setLoading(true);
    const res = await RemainerStudents(id)
    if(res?.success){
      toast.success("✅ Reminder emails sent successfully to all registered students!")
    }else{
      toast.error("❌ Failed to send reminder emails")
    }
    setLoading(false);
  }

  async function handleDeleteEvent(id: string) {
    const res = await deleteEventAction(id);
    if (res?.ok) {
      toast.success("Event deleted successfully!");
      fetchEvents(); // 👈 Update the list automatically
    } else {
      toast.error("Failed to delete event");
    }
  }

  function downloadAsCsv(filename: string, rows: any[]) {
    const headers = Object.keys(rows[0] || { name: '', email: '', rollNumber: '', universityRollNo: '', branch: '', year: '', phoneNumber: '', attendanceCount: 0, lastAttendanceAt: '' });
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [headers.join(',')]
      .concat(
        rows.map(r => headers.map(h => escape(r[h])).join(','))
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleDownloadAttendance(id: string) {
    try {
      const res = await getEventAttendance(id);
      if (!res?.ok) {
        toast.error(res?.error || 'Failed to download');
        return;
      }
      if (!res.rows || res.rows.length === 0) {
        toast.info('No student data found for this event');
        return;
      }
      const filename = `${res.eventName.replace(/[^a-z0-9-_]+/gi, '_')}_attendance.csv`;
      downloadAsCsv(filename, res.rows);
    } catch (e) {
      toast.error('Failed to download');
    }
  }

  return (
    <Tabs defaultValue="create" className="w-full mb-10">
      <TabsList className="mb-4">
        <TabsTrigger value="create">New Event</TabsTrigger>
        <TabsTrigger value="list">All Events</TabsTrigger>
      </TabsList>

      <TabsContent value="create">
        <Card>
          <CardContent className="space-y-4 p-4">
            <Input
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <Input
              placeholder="Event Date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              type="date"
            />
            <Button onClick={createPTPEvent}>Create Event</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="list">
        <ScrollArea className="h-[400px] w-full">
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="text-center text-muted-foreground">No events found.</p>
            ) : (
              events.map((event) => (
                <Card key={event._id}>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold">{event.eventName}</h3>
                    <p className="text-sm">Date: {event.eventDate}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        variant="outline" 
                        onClick={() => handleDownloadAttendance(event._id)}
                        disabled={loading}
                      >
                        📊 Download Attendance
                      </Button>
                      <Button 
                        variant="default" 
                        className="bg-orange-500 hover:bg-orange-600 text-white" 
                        onClick={() => handleReminderEvent(event._id)}
                        disabled={loading}
                      >
                        📧 Send Reminder
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteEvent(event._id)}
                        disabled={loading}
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
