export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  staffId: string;
  staffName: string;
  serviceId: string;
  serviceName: string;
  startTime: Date;
  endTime: Date;
  branchId: string;
  status: "booked" | "completed" | "canceled";
}
