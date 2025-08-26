import AttendanceDashboard from "@/components/attendance/attendance-dashboard";

export default function AttendancePage() {
  return (
    <div className="container mx-auto py-8 px-4">
       <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">
        Attendance Tracker
      </h1>
      <AttendanceDashboard />
    </div>
  );
}
