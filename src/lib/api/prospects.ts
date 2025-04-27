// src/lib/api/prospects.ts
import { api } from './client';
import type { Prospect } from '$lib/types';

// APIと連携するためのプロスペクト型定義（Pydanticスキーマに合わせる）
export interface ProspectCreate {
  name: string;
  company_name?: string;
  business_category: string;
  contact_email?: string;
  contact_phone?: string;
  interest_level?: string;
  status: string;
  next_follow_up_date?: string;
  notes?: string;
}

// プロスペクト関連のAPIサービス
export const prospectsApi = {
  // プロスペクト一覧を取得
  async getProspects(): Promise<Prospect[]> {
    return api.get<Prospect[]>('/prospects/');
  },
  
  // プロスペクト詳細を取得
  async getProspect(id: number): Promise<Prospect> {
    return api.get<Prospect>(`/prospects/${id}`);
  },
  
  // プロスペクトを作成
  async createProspect(prospectData: ProspectCreate): Promise<Prospect> {
    return api.post<Prospect>('/prospects/', prospectData);
  },
  
  // プロスペクト情報を更新
  async updateProspect(id: number, prospectData: Partial<ProspectCreate>): Promise<Prospect> {
    return api.put<Prospect>(`/prospects/${id}`, prospectData);
  },
  
  // プロスペクトを削除
  async deleteProspect(id: number): Promise<void> {
    return api.delete(`/prospects/${id}`);
  }
};