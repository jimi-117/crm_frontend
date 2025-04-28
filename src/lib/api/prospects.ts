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
  status: string; // statusはバックエンドと一致する文字列である必要がある
  next_follow_up_date?: string;
  notes?: string;
}

// プロスペクト関連のAPIサービス（デバッグログ強化版）
export const prospectsApi = {
  // プロスペクト一覧を取得
  async getProspects(): Promise<Prospect[]> {
    console.log('Fetching prospects list');
    try {
      const prospects = await api.get<Prospect[]>('/prospects/');
      console.log(`Successfully fetched ${prospects.length} prospects`);
      
      // ステータスを新しいフォーマットに変換
      return prospects.map(prospect => ({
        ...prospect,
        status: convertApiProspectStatus(prospect.status)
      }));
    } catch (error) {
      console.error('Error fetching prospects:', error);
      throw error;
    }
  },
  
  // プロスペクト詳細を取得
  async getProspect(id: number): Promise<Prospect> {
    console.log(`Fetching prospect with ID: ${id}`);
    try {
      const prospect = await api.get<Prospect>(`/prospects/${id}`);
      console.log('Successfully fetched prospect details');
      
      // ステータスを新しいフォーマットに変換
      return {
        ...prospect,
        status: convertApiProspectStatus(prospect.status)
      };
    } catch (error) {
      console.error(`Error fetching prospect ID ${id}:`, error);
      throw error;
    }
  },
  
  // おすすめプロスペクトを取得
  async getRecommendedProspects(limit: number = 3): Promise<Prospect[]> {
    console.log(`Fetching ${limit} recommended prospects`);
    try {
      // エンドポイントを修正 - バックエンドのURLに合わせる
      const prospects = await api.get<Prospect[]>('/prospects/recommended/', { 
        limit: limit.toString() 
      });
      console.log(`Successfully fetched ${prospects.length} recommended prospects`);
      
      // ステータスを新しいフォーマットに変換
      return prospects.map(prospect => ({
        ...prospect,
        status: convertApiProspectStatus(prospect.status)
      }));
    } catch (error) {
      console.error('Error fetching recommended prospects:', error);
      // 422エラーが出る場合、推奨プロスペクト機能がバックエンドに実装されていない可能性があるので、空配列を返す
      if (error instanceof Error && error.message.includes('422')) {
        console.log('Recommended prospects endpoint might not be implemented, returning empty array');
        return [];
      }
      throw error;
    }
  },
  
  // プロスペクトを作成
  async createProspect(prospectData: ProspectCreate): Promise<Prospect> {
    console.log('Creating new prospect with data:', prospectData);
    try {
      // バックエンドのステータス形式に変換（必要であれば）
      const apiData = {
        ...prospectData,
        // バックエンドのステータス形式に合わせる（必要であれば）
        // status: convertToApiStatus(prospectData.status)
      };
      
      const result = await api.post<Prospect>('/prospects/', apiData);
      console.log('Successfully created prospect with ID:', result.id);
      return result;
    } catch (error) {
      console.error('Error creating prospect:', error);
      throw error;
    }
  },
  
  // プロスペクト情報を更新
  async updateProspect(id: number, prospectData: Partial<ProspectCreate>): Promise<Prospect> {
    console.log(`Updating prospect ID ${id} with data:`, prospectData);
    try {
      const result = await api.put<Prospect>(`/prospects/${id}`, prospectData);
      console.log(`Successfully updated prospect ID ${id}`);
      return result;
    } catch (error) {
      console.error(`Error updating prospect ID ${id}:`, error);
      throw error;
    }
  },
  
  // プロスペクトを削除
  async deleteProspect(id: number): Promise<void> {
    console.log(`Deleting prospect ID ${id}`);
    try {
      await api.delete(`/prospects/${id}`);
      console.log(`Successfully deleted prospect ID ${id}`);
    } catch (error) {
      console.error(`Error deleting prospect ID ${id}:`, error);
      throw error;
    }
  }
};