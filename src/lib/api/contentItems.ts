// src/lib/api/contentItems.ts
import { api } from './client';
import type { ContentItem } from '$lib/types';

// APIと連携するためのコンテンツアイテム型定義
export interface ContentItemCreate {
  client_id: number;
  content_type: 'video' | 'photo' | 'story';
  title?: string;
  description?: string;
  instagram_post_url: string;
}

// コンテンツアイテム関連のAPIサービス
export const contentItemsApi = {
  // コンテンツアイテム一覧を取得
  async getContentItems(clientId?: number): Promise<ContentItem[]> {
    try {
      const params: Record<string, string> = {};
      if (clientId) {
        params.client_id = clientId.toString();
      }
      
      return await api.get<ContentItem[]>('/content-items/', params);
    } catch (error) {
      console.error('Error fetching content items:', error);
      return [];
    }
  },
  
  // コンテンツアイテム詳細を取得
  async getContentItem(id: number): Promise<ContentItem> {
    return api.get<ContentItem>(`/content-items/${id}`);
  },
  
  // コンテンツアイテムを作成
  async createContentItem(data: ContentItemCreate): Promise<ContentItem> {
    return api.post<ContentItem>('/content-items/', data);
  },
  
  // コンテンツアイテム情報を更新
  async updateContentItem(id: number, data: Partial<ContentItemCreate>): Promise<ContentItem> {
    return api.put<ContentItem>(`/content-items/${id}`, data);
  },
  
  // コンテンツアイテムを削除
  async deleteContentItem(id: number): Promise<void> {
    return api.delete(`/content-items/${id}`);
  },
  
  // 特定のクライアントのコンテンツアイテム数を取得
  async getContentCountByClient(clientId: number): Promise<number> {
    try {
      const items = await this.getContentItems(clientId);
      return items.length;
    } catch (error) {
      console.error(`Error getting content count for client ${clientId}:`, error);
      return 0;
    }
  },
  
  // 特定のタイプのコンテンツアイテム数を取得
  async getContentCountByType(type: 'video' | 'photo' | 'story'): Promise<number> {
    try {
      const items = await this.getContentItems();
      return items.filter(item => item.content_type === type).length;
    } catch (error) {
      console.error(`Error getting content count for type ${type}:`, error);
      return 0;
    }
  }
};