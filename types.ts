
export type UserRole = 'student' | 'admin';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  status: ApprovalStatus;
  className?: string;
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

export interface LiveClass {
  id: string;
  class: string;
  title: string;
  meet_link: string;
  start_time: string;
  end_time: string;
}

export interface Material {
  id: string;
  class: string;
  title: string;
  resource_url: string;
  type: 'pdf' | 'drive';
  created_at?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
}
