'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function getPublishedHistoryChaptersAction() {
  try {
    const chapters = await db.administrationSession.findMany({
      where: { isPublished: true },
      include: {
        achievements: {
          orderBy: { displayOrder: 'asc' },
        },
        appointments: {
          include: {
            person: true,
            office: true,
          },
          orderBy: { displayOrder: 'asc' },
        },
        albums: {
          include: {
            mediaItems: {
              include: { media: true },
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
      orderBy: [
        { displayOrder: 'asc' },
        { startDate: 'asc' },
      ],
    });

    return { success: true, chapters };
  } catch (error: any) {
    console.error('Error fetching history chapters:', error);
    return { success: false, error: error.message || 'Failed to load history chapters' };
  }
}

export async function getAllHistoryChaptersAdminAction() {
  try {
    const chapters = await db.administrationSession.findMany({
      include: {
        achievements: { orderBy: { displayOrder: 'asc' } },
        appointments: {
          include: { person: true, office: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: [
        { displayOrder: 'asc' },
        { startDate: 'asc' },
      ],
    });

    return { success: true, chapters };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createHistoryChapterAction(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const slug = (formData.get('slug') as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const theme = (formData.get('theme') as string) || null;
    const presidentName = (formData.get('presidentName') as string) || null;
    const presidentPhotoUrl = (formData.get('presidentPhotoUrl') as string) || null;
    const presidentBio = (formData.get('presidentBio') as string) || null;
    const historicalNarrative = (formData.get('historicalNarrative') as string) || null;
    const motto = (formData.get('motto') as string) || null;
    const displayOrder = parseInt((formData.get('displayOrder') as string) || '0', 10);
    const isPublished = formData.get('isPublished') === 'true';
    const isCurrent = formData.get('isCurrent') === 'true';

    const startDateStr = formData.get('startDate') as string;
    const endDateStr = formData.get('endDate') as string;

    const startDate = startDateStr ? new Date(startDateStr) : new Date();
    const endDate = endDateStr ? new Date(endDateStr) : null;

    if (isCurrent) {
      await db.administrationSession.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const newChapter = await db.administrationSession.create({
      data: {
        title,
        slug,
        theme,
        presidentName,
        presidentPhotoUrl,
        presidentBio,
        historicalNarrative,
        motto,
        displayOrder,
        isPublished,
        isCurrent,
        startDate,
        endDate,
      },
    });

    revalidateHistoryPaths();
    return { success: true, chapter: newChapter, message: 'History chapter created successfully' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create history chapter' };
  }
}

export async function updateHistoryChapterAction(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const theme = (formData.get('theme') as string) || null;
    const presidentName = (formData.get('presidentName') as string) || null;
    const presidentPhotoUrl = (formData.get('presidentPhotoUrl') as string) || null;
    const presidentBio = (formData.get('presidentBio') as string) || null;
    const historicalNarrative = (formData.get('historicalNarrative') as string) || null;
    const motto = (formData.get('motto') as string) || null;
    const displayOrder = parseInt((formData.get('displayOrder') as string) || '0', 10);
    const isPublished = formData.get('isPublished') === 'true';
    const isCurrent = formData.get('isCurrent') === 'true';

    const startDateStr = formData.get('startDate') as string;
    const endDateStr = formData.get('endDate') as string;

    if (isCurrent) {
      await db.administrationSession.updateMany({
        where: { isCurrent: true, NOT: { id } },
        data: { isCurrent: false },
      });
    }

    const updated = await db.administrationSession.update({
      where: { id },
      data: {
        title,
        theme,
        presidentName,
        presidentPhotoUrl,
        presidentBio,
        historicalNarrative,
        motto,
        displayOrder,
        isPublished,
        isCurrent,
        ...(startDateStr ? { startDate: new Date(startDateStr) } : {}),
        ...(endDateStr ? { endDate: new Date(endDateStr) } : {}),
      },
    });

    revalidateHistoryPaths();
    return { success: true, chapter: updated, message: 'History chapter updated successfully' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update history chapter' };
  }
}

export async function deleteHistoryChapterAction(id: string) {
  try {
    await db.administrationSession.delete({
      where: { id },
    });

    revalidateHistoryPaths();
    return { success: true, message: 'History chapter deleted successfully' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete history chapter' };
  }
}

function revalidateHistoryPaths() {
  revalidatePath('/history');
  revalidatePath('/history/past-leadership');
  revalidatePath('/history/timeline');
  revalidatePath('/history/leader-stories');
  revalidatePath('/history/origin');
  revalidatePath('/history/heritage-archive');
  revalidatePath('/admin/history');
}
