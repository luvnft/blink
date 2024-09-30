import { PublicKey } from '@solana/web3.js';
import { User } from './user';
import { Blink } from './blink';

export interface Blinkboard {
  id: string;
  owner: User;
  name: string;
  description: string;
  coverImage: string;
  blinks: BlinkboardItem[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  tags: string[];
  collaborators: User[];
}

export interface BlinkboardItem {
  id: string;
  blink: Blink;
  position: {
    x: number;
    y: number;
  };
  scale: number;
  rotation: number;
  zIndex: number;
  addedAt: Date;
  addedBy: User;
}

export interface BlinkboardComment {
  id: string;
  blinkboard: Blinkboard;
  user: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  replies: BlinkboardComment[];
}

export interface BlinkboardActivity {
  id: string;
  blinkboard: Blinkboard;
  user: User;
  activityType: 'create' | 'update' | 'delete' | 'add_blink' | 'remove_blink' | 'like' | 'comment';
  details: any;
  createdAt: Date;
}

export interface CreateBlinkboardParams {
  name: string;
  description: string;
  coverImage: File;
  isPublic: boolean;
  tags?: string[];
}

export interface UpdateBlinkboardParams {
  id: string;
  name?: string;
  description?: string;
  coverImage?: File;
  isPublic?: boolean;
  tags?: string[];
}

export interface AddBlinkToBlinkboardParams {
  blinkboardId: string;
  blinkId: string;
  position: {
    x: number;
    y: number;
  };
  scale?: number;
  rotation?: number;
  zIndex?: number;
}

export interface UpdateBlinkPositionParams {
  blinkboardId: string;
  blinkItemId: string;
  position: {
    x: number;
    y: number;
  };
  scale?: number;
  rotation?: number;
  zIndex?: number;
}

export interface RemoveBlinkFromBlinkboardParams {
  blinkboardId: string;
  blinkItemId: string;
}

export interface BlinkboardSearchParams {
  query?: string;
  tags?: string[];
  ownerId?: string;
  isPublic?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'views' | 'likes';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface BlinkboardStats {
  totalBlinkboards: number;
  totalPublicBlinkboards: number;
  totalPrivateBlinkboards: number;
  averageBlinksPerBoard: number;
  mostUsedTags: { tag: string; count: number }[];
  topViewedBlinkboards: { blinkboard: Blinkboard; views: number }[];
  topLikedBlinkboards: { blinkboard: Blinkboard; likes: number }[];
}

export interface CollaboratorInvite {
  id: string;
  blinkboard: Blinkboard;
  invitedBy: User;
  invitedUser: User;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  respondedAt?: Date;
}

export interface CreateCollaboratorInviteParams {
  blinkboardId: string;
  invitedUserId: string;
}

export interface RespondToCollaboratorInviteParams {
  inviteId: string;
  response: 'accept' | 'decline';
}

export interface BlinkboardPermissions {
  canEdit: boolean;
  canAddBlinks: boolean;
  canRemoveBlinks: boolean;
  canInviteCollaborators: boolean;
  canChangeVisibility: boolean;
}

export interface BlinkboardCollaborator {
  user: User;
  permissions: BlinkboardPermissions;
  addedAt: Date;
  addedBy: User;
}

export interface UpdateCollaboratorPermissionsParams {
  blinkboardId: string;
  collaboratorId: string;
  permissions: Partial<BlinkboardPermissions>;
}

export interface BlinkboardExportParams {
  blinkboardId: string;
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  quality?: number; // For png and jpg
  includeMetadata?: boolean;
}

export interface BlinkboardImportParams {
  file: File;
  name: string;
  description?: string;
  isPublic: boolean;
  tags?: string[];
}

export interface BlinkboardTemplate {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  layout: BlinkboardItem[];
  category: string;
  createdBy: User;
  usageCount: number;
}

export interface CreateBlinkboardFromTemplateParams {
  templateId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  tags?: string[];
}