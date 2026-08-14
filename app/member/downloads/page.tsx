import React from 'react';
import { db } from '@/lib/db';
import { DownloadCentre, MemberDownloadResource } from '@/components/member/download-centre';

export const revalidate = 60; // Cache for 60 seconds

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default async function MemberDownloadsPage() {
  const downloadRecords = await db.downloadResource.findMany({
    where: { isPublic: true },
    include: {
      fileMedia: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const resources: MemberDownloadResource[] = downloadRecords.map((res) => ({
    id: res.id,
    title: res.title,
    description: res.description,
    category: res.category,
    fileUrl: res.fileMedia.url,
    fileSizeFormatted: formatBytes(res.fileMedia.sizeBytes || 102400),
    mimeType: res.fileMedia.mimeType,
    createdAt: res.createdAt,
    downloadsCount: res.downloadsCount,
  }));

  return <DownloadCentre resources={resources} />;
}
