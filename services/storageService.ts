
import { ItemReport, Match, ItemType, ReportStatus } from '../types';

const REPORTS_KEY = 'retrieve_it_reports_v2';

/**
 * Validates report data and cleans potential encoding corruption
 */
const cleanData = (data: string): string => {
  // Removes non-printable characters and ensures valid UTF-8
  return data.replace(/[^\x20-\x7E\s]/g, '');
};

export const saveReport = (report: ItemReport): void => {
  try {
    const reports = getReports();
    // Ensure data integrity
    const sanitizedReport: ItemReport = {
      ...report,
      title: cleanData(report.title),
      description: cleanData(report.description),
      status: report.status || ReportStatus.ACTIVE
    };
    reports.push(sanitizedReport);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error("Storage Error: Failed to save report", error);
    // In a real app, we might fallback to IndexedDB or show a UI warning
  }
};

export const getReports = (): ItemReport[] => {
  try {
    const data = localStorage.getItem(REPORTS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Storage Corruption: Resetting reports database", error);
    localStorage.removeItem(REPORTS_KEY);
    return [];
  }
};

export const findMatches = (report: ItemReport): Match[] => {
  const allReports = getReports();
  const targetType = report.type === ItemType.LOST ? ItemType.FOUND : ItemType.LOST;
  
  return allReports
    .filter(r => r.type === targetType && r.status === ReportStatus.ACTIVE)
    .map(r => {
      let score = 0;
      let reasons: string[] = [];

      // Category match (Weighted)
      if (r.category === report.category) {
        score += 50;
        reasons.push("Category Match");
      }

      // Semantic title check (Simple)
      const rTitle = r.title.toLowerCase();
      const targetTitle = report.title.toLowerCase();
      if (rTitle.includes(targetTitle) || targetTitle.includes(rTitle)) {
        score += 30;
        reasons.push("Title Similarity");
      }

      // Date proximity check
      const date1 = new Date(r.date).getTime();
      const date2 = new Date(report.date).getTime();
      const diffDays = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
      if (diffDays <= 7) {
        score += 20;
        reasons.push("Reported within same week");
      }

      return {
        id: `m-${Math.random().toString(36).substr(2, 5)}`,
        reportId: report.id,
        matchId: r.id,
        score,
        reason: reasons.join(", ")
      };
    })
    .filter(m => m.score >= 40)
    .sort((a, b) => b.score - a.score);
};

export const getReportById = (id: string): ItemReport | undefined => {
  return getReports().find(r => r.id === id);
};
