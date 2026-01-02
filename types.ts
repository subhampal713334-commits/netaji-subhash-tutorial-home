
export type UserRole = 'student' | 'admin';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  name: string;
  phone: string; // Changed from email
  role: UserRole;
  status: ApprovalStatus; // New field for approval workflow
  className?: string; // e.g., "Class 10"
  created_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image_url: string;
  created_at?: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  created_at: string;
}

export interface LiveClass {
  id: string;
  // Updated from course_id to class to match Supabase schema
  class: string;
  title: string;
  meet_link: string;
  start_time: string; // ISO string or simple time format
  end_time: string;   // ISO string or simple time format
}

export interface Material {
  id: string;
  // Updated from course_id to class to match Supabase schema
  class: string;
  title: string;
  // Updated from pdf_url to resource_url to match Supabase schema
  resource_url: string;
  // Added type field as it's used to distinguish between PDF and Drive links
  type: 'pdf' | 'drive';
  created_at?: string;
}

export interface Schedule {
  id: string;
  class: string;
  content: string;
  updated_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
}
