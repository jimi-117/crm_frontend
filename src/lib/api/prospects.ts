// src/lib/api/prospects.ts
import { api } from './client';
import type { Prospect, ProspectStatus } from '$lib/types';
import { convertApiProspectStatus } from '$lib/utils/statusUtils';

// APIと連携するためのプロスペクト型定義（Pydanticスキーマに合わせる）
export interface ProspectCreate {
  name: string;
  company_name?: string;
  business_category: string;
  contact_email?: string;
  contact_phone?: string;
  interest_level?: string;
  status: ProspectStatus;
  next_follow_up_date?: string;
  notes?: string;
}

// プロスペクト関連のAPIサービス
export const prospectsApi = {
  // プロスペクト一覧を取得
  async getProspects(): Promise<Prospect[]> {
    const prospects = await api.get<Prospect[]>('/prospects/');
    
    // ステータスを新しいフォーマットに変換
    return prospects.map(prospect => ({
      ...prospect,
      status: convertApiProspectStatus(prospect.status)
    }));
  },
  
  // プロスペクト詳細を取得
  async getProspect(id: number): Promise<Prospect> {
    const prospect = await api.get<Prospect>(`/prospects/${id}`);
    
    // ステータスを新しいフォーマットに変換
    return {
      ...prospect,
      status: convertApiProspectStatus(prospect.status)
    };
  },
  
  // おすすめプロスペクトを取得
  async getRecommendedProspects(limit: number = 3): Promise<Prospect[]> {
    const prospects = await api.get<Prospect[]>('/prospects/recommended', { 
      limit: limit.toString() 
    });
    
    // ステータスを新しいフォーマットに変換
    return prospects.map(prospect => ({
      ...prospect,
      status: convertApiProspectStatus(prospect.status)
    }));
  },
  
  // プロスペクトを作成
  async createProspect(prospectData: ProspectCreate): Promise<Prospect> {
    // 新しいステータスをそのままAPIに送信
    return api.post<Prospect>('/prospects/', prospectData);
  },
  
  // プロスペクト情報を更新
  async updateProspect(id: number, prospectData: Partial<ProspectCreate>): Promise<Prospect> {
    // 新しいステータスをそのままAPIに送信
    return api.put<Prospect>(`/prospects/${id}`, prospectData);
  },
  
  // プロスペクトを削除
  async deleteProspect(id: number): Promise<void> {
    return api.delete(`/prospects/${id}`);
  }
};