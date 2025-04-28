// src/lib/api/statistics.ts
import { api } from './client';
import { clientsApi } from './clients';
import { prospectsApi } from './prospects';
import { contentItemsApi } from './contentItems';
import type { DashboardStats, RevenueData, ClientStatusData, ProspectStatusData, ContentItem } from '$lib/types';

// 統計データを取得するAPIサービス
export const statisticsApi = {
  // ダッシュボード統計データを取得
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // バックエンドに統計API実装がある場合
      return await api.get<DashboardStats>('/statistics/dashboard/');
    } catch (error) {
      console.warn('Could not fetch statistics from API, calculating from available data:', error);
      
      // API未実装の場合は、他のデータから計算する
      return calculateDashboardStats();
    }
  },
  
  // 月間収益データを取得
  async getRevenueData(): Promise<RevenueData[]> {
    try {
      // バックエンドに収益データAPI実装がある場合
      return await api.get<RevenueData[]>('/statistics/revenue/');
    } catch (error) {
      console.warn('Could not fetch revenue data from API, using simulated data:', error);
      
      // API未実装の場合は、シミュレーションデータを生成
      return generateRevenueData();
    }
  },
  
  // クライアントステータスデータを取得
  async getClientStatusData(): Promise<ClientStatusData[]> {
    try {
      // バックエンドに実装がある場合
      return await api.get<ClientStatusData[]>('/statistics/client-status/');
    } catch (error) {
      console.warn('Could not fetch client status data from API, calculating from available data:', error);
      
      // API未実装の場合は、クライアントデータから集計
      return calculateClientStatusData();
    }
  },
  
  // プロスペクトステータスデータを取得
  async getProspectStatusData(): Promise<ProspectStatusData[]> {
    try {
      // バックエンドに実装がある場合
      return await api.get<ProspectStatusData[]>('/statistics/prospect-status/');
    } catch (error) {
      console.warn('Could not fetch prospect status data from API, calculating from available data:', error);
      
      // API未実装の場合は、プロスペクトデータから集計
      return calculateProspectStatusData();
    }
  },
};

// 他のAPIデータから統計情報を計算
async function calculateDashboardStats(): Promise<DashboardStats> {
  try {
    // 各種データを取得
    const clients = await clientsApi.getClients();
    const prospects = await prospectsApi.getProspects();
    
    // コンテンツアイテムAPIが利用可能であれば取得
    let contentItems: ContentItem[] = [];
    try {
      contentItems = await contentItemsApi.getContentItems();
    } catch (e) {
      console.warn('Content items API not available:', e);
    }
    
    // 総クライアント数
    const totalClients = clients.length;
    
    // 総プロスペクト数
    const totalProspects = prospects.length;
    
    // 公開動画数
    const totalVideosPublished = contentItems.filter(item => item.content_type === 'video').length;
    
    // 月間収益 - すべてのクライアントの予想月間収益を合計
    const monthlyRevenue = clients.reduce((sum, client) => 
      sum + (client.estimated_monthly_revenue || 0), 0);
    
    // 成約率 - 契約したクライアント / プロスペクト数
    const closedProspects = prospects.filter(p => p.status === 'converted').length;
    const closingRate = totalProspects > 0 
      ? Math.round((closedProspects / totalProspects) * 100) 
      : 0;
    
    // コンバージョン率 - クライアント化したプロスペクトの割合
    const convertedProspects = prospects.filter(p => p.status === 'converted').length;
    const conversionRate = totalProspects > 0 
      ? Math.round((convertedProspects / totalProspects) * 100) 
      : 0;
    
    return {
      totalClients,
      totalProspects,
      totalVideosPublished,
      monthlyRevenue,
      closingRate,
      conversionRate
    };
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    
    // エラー時はデフォルト値を返す
    return {
      totalClients: 0,
      totalProspects: 0,
      totalVideosPublished: 0,
      monthlyRevenue: 0,
      closingRate: 0,
      conversionRate: 0
    };
  }
}

// クライアントステータスデータを計算
async function calculateClientStatusData(): Promise<ClientStatusData[]> {
  try {
    const clients = await clientsApi.getClients();
    
    // ステータスごとにグループ化
    const statusCounts: Record<string, number> = {};
    clients.forEach(client => {
      const status = client.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // 結果を配列形式に変換
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count: count as number
    }));
  } catch (error) {
    console.error('Error calculating client status data:', error);
    return [];
  }
}

// プロスペクトステータスデータを計算
async function calculateProspectStatusData(): Promise<ProspectStatusData[]> {
  try {
    const prospects = await prospectsApi.getProspects();
    
    // ステータスごとにグループ化
    const statusCounts: Record<string, number> = {};
    prospects.forEach(prospect => {
      const status = prospect.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // 結果を配列形式に変換
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count: count as number
    }));
  } catch (error) {
    console.error('Error calculating prospect status data:', error);
    return [];
  }
}

// シミュレーション収益データを生成
function generateRevenueData(): RevenueData[] {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  
  // 過去6ヶ月分のデータを生成
  return Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - 5 + i + 12) % 12;
    return {
      month: months[monthIndex],
      // 3000〜8000の範囲でランダムな収益を生成
      amount: Math.floor(3000 + Math.random() * 5000)
    };
  });
}