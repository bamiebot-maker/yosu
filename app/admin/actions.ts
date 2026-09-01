'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { ArticleStatus, ProjectStatus, OfficeCategory } from '@prisma/client';
import { hashPassword } from '@/lib/password';
import { getSession } from '@/lib/auth';

async function logAuditAction(userId: string | null | undefined, action: string, details: string) {
  try {
    let validUserId: string | null = null;
    if (userId) {
      const user = await db.user.findUnique({ where: { id: userId }, select: { id: true } });
      if (user) validUserId = user.id;
    }
    await db.auditLog.create({
      data: {
        userId: validUserId,
        action,
        details,
      },
    });
  } catch (error) {
    console.warn('AuditLog creation warning:', error);
  }
}

// ==========================================
// 1. NEWS GAZETTES ACTIONS
// ==========================================
export async function createNewsArticleAction(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const slug = (formData.get('slug') as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const summary = formData.get('summary') as string;
    const content = (formData.get('content') as string) || summary;
    const status = (formData.get('status') as ArticleStatus) || 'PUBLISHED';
    const isFeatured = formData.get('isFeatured') === 'true';
    const imageUrl = (formData.get('imageUrl') as string) || null;

    // Get default admin user
    const adminUser = await db.user.findFirst();
    if (!adminUser) throw new Error('No admin user found to assign authorship.');

    // Get or create default category
    let category = await db.newsCategory.findFirst();
    if (!category) {
      category = await db.newsCategory.create({
        data: { name: 'Governance & Gazettes', slug: 'governance-gazettes' },
      });
    }

    let featuredMediaId: string | null = null;
    if (imageUrl) {
      const media = await db.media.create({
        data: {
          filename: imageUrl.split('/').pop() || 'news-image.jpg',
          url: imageUrl,
          mimeType: 'image/jpeg',
          sizeBytes: 102400,
        },
      });
      featuredMediaId = media.id;
    }

    await db.newsArticle.create({
      data: {
        title,
        slug,
        summary,
        content,
        status,
        isFeatured,
        publishedAt: new Date(),
        authorId: adminUser.id,
        categoryId: category.id,
        featuredMediaId,
      },
    });

    revalidatePath('/admin/news');
    revalidatePath('/news');
    revalidatePath('/');
    return { success: true, message: 'News Gazette created successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create news article' };
  }
}

export async function updateNewsArticleAction(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const status = formData.get('status') as ArticleStatus;
    const isFeatured = formData.get('isFeatured') === 'true';
    const imageUrl = (formData.get('imageUrl') as string) || null;

    let featuredMediaId: string | undefined = undefined;
    if (imageUrl) {
      const media = await db.media.create({
        data: {
          filename: imageUrl.split('/').pop() || 'news-image.jpg',
          url: imageUrl,
          mimeType: 'image/jpeg',
          sizeBytes: 102400,
        },
      });
      featuredMediaId = media.id;
    }

    await db.newsArticle.update({
      where: { id },
      data: {
        title,
        summary,
        content,
        status,
        isFeatured,
        ...(featuredMediaId ? { featuredMediaId } : {}),
      },
    });

    revalidatePath('/admin/news');
    revalidatePath('/news');
    revalidatePath('/');
    return { success: true, message: 'News Gazette updated successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update news article' };
  }
}

export async function deleteNewsArticleAction(id: string) {
  try {
    const session = await getSession();
    const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN');
    if (!isSuperAdmin) {
      return { success: false, error: '403 Forbidden: Only a Super Admin can delete News Gazettes permanently.' };
    }

    const article = await db.newsArticle.delete({ where: { id } });
    await db.auditLog.create({
      data: {
        userId: session?.userId || null,
        action: 'NEWS_DELETE',
        details: `Super Admin permanently deleted News Gazette: ${article.title}`,
      },
    });

    revalidatePath('/admin/news');
    revalidatePath('/news');
    revalidatePath('/');
    return { success: true, message: 'News Gazette deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete news article' };
  }
}

// ==========================================
// 2. ANNOUNCEMENTS ACTIONS
// ==========================================
export async function createAnnouncementAction(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const type = (formData.get('type') as string) || 'INFO';
    const isPinned = formData.get('isPinned') === 'true';
    const isActive = formData.get('isActive') !== 'false';
    const linkUrl = (formData.get('linkUrl') as string) || null;

    await db.announcement.create({
      data: {
        title,
        content,
        type,
        isPinned,
        isActive,
        linkUrl,
      },
    });

    revalidatePath('/admin/announcements');
    revalidatePath('/');
    return { success: true, message: 'Announcement created successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create announcement' };
  }
}

export async function updateAnnouncementAction(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const type = formData.get('type') as string;
    const isPinned = formData.get('isPinned') === 'true';
    const isActive = formData.get('isActive') === 'true';
    const linkUrl = (formData.get('linkUrl') as string) || null;

    await db.announcement.update({
      where: { id },
      data: {
        title,
        content,
        type,
        isPinned,
        isActive,
        linkUrl,
      },
    });

    revalidatePath('/admin/announcements');
    revalidatePath('/');
    return { success: true, message: 'Announcement updated successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update announcement' };
  }
}

export async function deleteAnnouncementAction(id: string) {
  try {
    await db.announcement.delete({ where: { id } });
    revalidatePath('/admin/announcements');
    revalidatePath('/');
    return { success: true, message: 'Announcement deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete announcement' };
  }
}

// ==========================================
// 3. EXECUTIVE OFFICERS & APPOINTMENTS ACTIONS
// ==========================================
export async function createExecutiveAppointmentAction(formData: FormData) {
  try {
    const fullName = formData.get('fullName') as string;
    const officeTitle = formData.get('officeTitle') as string;
    const stateOfOrigin = formData.get('stateOfOrigin') as string;
    const department = formData.get('department') as string;
    const level = formData.get('level') as string;
    const phoneNumber = (formData.get('phoneNumber') as string) || (formData.get('phone') as string) || null;
    const bio = formData.get('bio') as string;
    const imageUrl = (formData.get('imageUrl') as string) || null;

    const currentSession = await db.administrationSession.findFirst({ where: { isCurrent: true } });
    if (!currentSession) throw new Error('No active session found.');

    // Find or create Office
    let office = await db.office.findFirst({ where: { title: officeTitle } });
    if (!office) {
      office = await db.office.create({
        data: {
          title: officeTitle,
          category: OfficeCategory.EXECUTIVE_COUNCIL,
          defaultOrder: 10,
        },
      });
    }

    let avatarMediaId: string | null = null;
    if (imageUrl) {
      const media = await db.media.create({
        data: {
          filename: imageUrl.split('/').pop() || 'executive-photo.jpg',
          url: imageUrl,
          mimeType: 'image/jpeg',
          sizeBytes: 102400,
        },
      });
      avatarMediaId = media.id;
    }

    // Create Person
    const person = await db.person.create({
      data: {
        fullName,
        stateOfOrigin,
        department,
        level,
        phoneNumber,
        bio,
        avatarMediaId,
      },
    });

    // Create Appointment
    await db.officeAppointment.create({
      data: {
        personId: person.id,
        officeId: office.id,
        sessionId: currentSession.id,
        status: 'ACTIVE',
      },
    });

    revalidatePath('/admin/executives');
    revalidatePath('/leadership');
    revalidatePath('/');
    return { success: true, message: 'Executive Officer appointed successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to appoint officer' };
  }
}

export async function updateExecutiveAppointmentAction(appointmentId: string, formData: FormData) {
  try {
    const fullName = formData.get('fullName') as string;
    const officeTitle = (formData.get('officeTitle') as string) || null;
    const stateOfOrigin = formData.get('stateOfOrigin') as string;
    const department = formData.get('department') as string;
    const phoneNumber = (formData.get('phoneNumber') as string) || (formData.get('phone') as string) || null;
    const bio = formData.get('bio') as string;
    const imageUrl = (formData.get('imageUrl') as string) || null;

    const appointment = await db.officeAppointment.findUnique({
      where: { id: appointmentId },
      include: { person: true, office: true },
    });

    if (!appointment) throw new Error('Appointment not found');

    let avatarMediaId: string | undefined = undefined;
    if (imageUrl) {
      const media = await db.media.create({
        data: {
          filename: imageUrl.split('/').pop() || 'executive-photo.jpg',
          url: imageUrl,
          mimeType: 'image/jpeg',
          sizeBytes: 102400,
        },
      });
      avatarMediaId = media.id;
    }

    // Update Person details including phone number
    await db.person.update({
      where: { id: appointment.personId },
      data: {
        fullName,
        stateOfOrigin,
        department,
        phoneNumber,
        bio,
        ...(avatarMediaId ? { avatarMediaId } : {}),
      },
    });

    // Update Office Title / Executive Position if provided
    if (officeTitle && officeTitle !== appointment.office.title) {
      let office = await db.office.findFirst({ where: { title: officeTitle } });
      if (!office) {
        office = await db.office.create({
          data: {
            title: officeTitle,
            category: OfficeCategory.EXECUTIVE_COUNCIL,
            defaultOrder: 10,
          },
        });
      }

      await db.officeAppointment.update({
        where: { id: appointmentId },
        data: { officeId: office.id },
      });
    }

    revalidatePath('/admin/executives');
    revalidatePath('/leadership');
    revalidatePath('/');
    return { success: true, message: 'Executive Officer updated successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update officer' };
  }
}

export async function deleteExecutiveAppointmentAction(appointmentId: string) {
  try {
    const session = await getSession();
    const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN');
    if (!isSuperAdmin) {
      return { success: false, error: '403 Forbidden: Only a Super Admin can delete Executive records permanently.' };
    }

    const appointment = await db.officeAppointment.delete({
      where: { id: appointmentId },
      include: { person: true },
    });

    await db.auditLog.create({
      data: {
        userId: session?.userId || null,
        action: 'EXECUTIVE_DELETE',
        details: `Super Admin permanently deleted Executive record: ${appointment.person?.fullName || appointmentId}`,
      },
    });

    revalidatePath('/admin/executives');
    revalidatePath('/leadership');
    revalidatePath('/');
    return { success: true, message: 'Executive Officer deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete officer' };
  }
}

// ==========================================
// 4. ADMINISTRATION SESSIONS ACTIONS
// ==========================================
export async function createSessionAction(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const slug = (formData.get('slug') as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const theme = formData.get('theme') as string;
    const isCurrent = formData.get('isCurrent') === 'true';

    if (isCurrent) {
      await db.administrationSession.updateMany({ data: { isCurrent: false } });
    }

    await db.administrationSession.create({
      data: {
        title,
        slug,
        theme,
        startDate: new Date(),
        isCurrent,
      },
    });

    revalidatePath('/admin/sessions');
    revalidatePath('/leadership');
    revalidatePath('/');
    return { success: true, message: 'Administration Session created successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create session' };
  }
}

export async function setActiveSessionAction(sessionId: string) {
  try {
    await db.administrationSession.updateMany({ data: { isCurrent: false } });
    await db.administrationSession.update({
      where: { id: sessionId },
      data: { isCurrent: true },
    });

    revalidatePath('/admin/sessions');
    revalidatePath('/leadership');
    revalidatePath('/');
    return { success: true, message: 'Active platform administration updated!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to set active session' };
  }
}

export async function deleteSessionAction(sessionId: string) {
  try {
    await db.administrationSession.delete({ where: { id: sessionId } });
    revalidatePath('/admin/sessions');
    revalidatePath('/leadership');
    revalidatePath('/');
    return { success: true, message: 'Session deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete session' };
  }
}

// ==========================================
// 5. TRANSPARENCY PROJECTS ACTIONS
// ==========================================
export async function createProjectAction(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const slug = (formData.get('slug') as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const summary = formData.get('summary') as string;
    const description = (formData.get('description') as string) || summary;
    const status = (formData.get('status') as ProjectStatus) || 'IN_PROGRESS';
    const progressPercentage = parseInt(formData.get('progressPercentage') as string) || 0;

    await db.project.create({
      data: {
        title,
        slug,
        summary,
        description,
        status,
        progressPercentage,
      },
    });

    revalidatePath('/admin/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true, message: 'Project created successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create project' };
  }
}

export async function updateProjectAction(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const summary = (formData.get('summary') as string) || title;
    const description = (formData.get('description') as string) || summary || title;
    const status = formData.get('status') as ProjectStatus;
    const progressPercentage = parseInt(formData.get('progressPercentage') as string) || 0;

    await db.project.update({
      where: { id },
      data: {
        title,
        summary,
        description,
        status,
        progressPercentage,
      },
    });

    revalidatePath('/admin/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true, message: 'Project updated successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update project' };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await db.project.delete({ where: { id } });
    revalidatePath('/admin/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true, message: 'Project deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete project' };
  }
}

// ==========================================
// 6. CONSTITUTION VERSIONS ACTIONS (DEFERRED TO SECTION 14)
// ==========================================

// ==========================================
// 7. USER & RBAC GOVERNANCE ACTIONS
// ==========================================
export async function createUserAction(formData: FormData) {
  try {
    const session = await getSession();
    const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN');

    const fullName = formData.get('fullName') as string;
    const email = (formData.get('email') as string).toLowerCase().trim();
    const password = formData.get('password') as string;
    const roleCode = (formData.get('roleCode') as string) || 'SECRETARY_GENERAL';

    // Restrict SUPER_ADMIN role assignment to existing Super Admins
    if (roleCode === 'SUPER_ADMIN' && !isSuperAdmin) {
      return { success: false, error: '403 Forbidden: Only a Super Admin can assign the Super Admin role.' };
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('A user with this email address already exists.');

    const person = await db.person.create({
      data: {
        fullName,
        email,
        stateOfOrigin: 'Oyo',
      },
    });

    const role = await db.role.findFirst({ where: { code: roleCode as any } });
    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        personId: person.id,
        isActive: true,
      },
    });

    if (role) {
      await db.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });
    }

    // Audit Log
    await db.auditLog.create({
      data: {
        userId: session?.userId || null,
        action: 'USER_CREATE',
        details: `Provisioned user account for ${email} with role ${roleCode}`,
      },
    });

    revalidatePath('/admin/users');
    return { success: true, message: `User account for ${fullName} provisioned successfully!` };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to provision user' };
  }
}

export async function toggleUserStatusAction(userId: string) {
  try {
    const session = await getSession();
    const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN');

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } },
    });
    if (!user) throw new Error('User account not found');

    const targetIsSuperAdmin = user.userRoles.some((ur) => ur.role.code === 'SUPER_ADMIN');
    if (targetIsSuperAdmin && !isSuperAdmin) {
      return { success: false, error: '403 Forbidden: Only a Super Admin can modify another Super Admin account status.' };
    }

    const newActiveState = !user.isActive;

    await db.user.update({
      where: { id: userId },
      data: { isActive: newActiveState },
    });

    // Audit Log
    await db.auditLog.create({
      data: {
        userId: session?.userId || null,
        action: 'USER_UPDATE_STATUS',
        details: `Toggled user status for ${user.email} to ${newActiveState ? 'ACTIVE' : 'SUSPENDED'}`,
      },
    });

    revalidatePath('/admin/users');
    return { success: true, message: `User access status changed to ${newActiveState ? 'ACTIVE' : 'SUSPENDED'}` };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to toggle status' };
  }
}

export async function resetUserPasswordAction(userId: string) {
  try {
    const session = await getSession();
    const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN');

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } },
    });
    if (!user) throw new Error('User account not found');

    const targetIsSuperAdmin = user.userRoles.some((ur) => ur.role.code === 'SUPER_ADMIN');
    if (targetIsSuperAdmin && !isSuperAdmin) {
      return { success: false, error: '403 Forbidden: Only a Super Admin can reset a Super Admin password.' };
    }

    const defaultPassword = 'YosuReset2026!';
    const passwordHash = await hashPassword(defaultPassword);

    await db.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Audit Log
    await db.auditLog.create({
      data: {
        userId: session?.userId || null,
        action: 'USER_PASSWORD_RESET',
        details: `Reset password for user ${user.email}`,
      },
    });

    revalidatePath('/admin/users');
    return { success: true, message: 'Password reset to default temporary credential (YosuReset2026!)' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to reset password' };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const session = await getSession();
    const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN');

    if (!isSuperAdmin) {
      return { success: false, error: '403 Forbidden: Only a Super Admin can delete user accounts.' };
    }

    if (session?.userId === userId) {
      return { success: false, error: 'Security Guard: You cannot delete your currently logged-in Super Admin account.' };
    }

    const targetUser = await db.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } },
    });

    if (!targetUser) throw new Error('Target user account not found.');

    const targetIsSuperAdmin = targetUser.userRoles.some((ur) => ur.role.code === 'SUPER_ADMIN');
    if (targetIsSuperAdmin) {
      const superAdminCount = await db.userRole.count({
        where: { role: { code: 'SUPER_ADMIN' } },
      });
      if (superAdminCount <= 1) {
        return { success: false, error: 'Security Guard: Cannot delete the last remaining Super Admin account.' };
      }
    }

    // Delete user (cascades userRoles)
    await db.user.delete({ where: { id: userId } });

    // Clean person record if detached
    if (targetUser.personId) {
      await db.person.delete({ where: { id: targetUser.personId } }).catch(() => {});
    }

    // Audit Log
    await db.auditLog.create({
      data: {
        userId: session?.userId || null,
        action: 'USER_DELETE',
        details: `Super Admin permanently deleted user account: ${targetUser.email}`,
      },
    });

    revalidatePath('/admin/users');
    return { success: true, message: `Account ${targetUser.email} permanently deleted.` };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete user account' };
  }
}

export async function deleteMediaAction(id: string) {
  try {
    const session = await getSession();
    const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN');
    if (!isSuperAdmin) {
      return { success: false, error: '403 Forbidden: Only a Super Admin can delete media assets.' };
    }

    await db.media.delete({ where: { id } });
    revalidatePath('/admin/media');
    return { success: true, message: 'Media asset deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete media asset' };
  }
}

// ==========================================
// 8. DYNAMIC HOUSE OF REPRESENTATIVES ACTIONS
// ==========================================
export async function createRepresentativeAction(formData: FormData) {
  try {
    const session = await getSession();
    const fullName = formData.get('fullName') as string;
    const stateOfOrigin = formData.get('stateOfOrigin') as string;
    const positionTitle = (formData.get('positionTitle') as string) || 'Representative';
    const photoUrl = (formData.get('photoUrl') as string) || null;
    const sessionId = formData.get('sessionId') as string;

    let targetSessionId = sessionId;
    if (!targetSessionId) {
      const activeSession = await db.administrationSession.findFirst({ where: { isCurrent: true } })
        || await db.administrationSession.findFirst();
      if (!activeSession) throw new Error('No administration session found.');
      targetSessionId = activeSession.id;
    }

    await db.houseRepresentative.create({
      data: {
        fullName,
        stateOfOrigin,
        positionTitle,
        photoUrl,
        sessionId: targetSessionId,
      },
    });

    await logAuditAction(
      session?.userId,
      'REPRESENTATIVE_CREATE',
      `Created House Representative ${fullName} for state ${stateOfOrigin}`
    );

    revalidatePath('/admin/representatives');
    revalidatePath('/leadership');
    revalidatePath('/');
    return { success: true, message: 'House Representative added successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to add representative' };
  }
}

export async function updateRepresentativeAction(id: string, formData: FormData) {
  try {
    const session = await getSession();
    const fullName = formData.get('fullName') as string;
    const stateOfOrigin = formData.get('stateOfOrigin') as string;
    const positionTitle = formData.get('positionTitle') as string;
    const photoUrl = (formData.get('photoUrl') as string) || null;

    await db.houseRepresentative.update({
      where: { id },
      data: {
        fullName,
        stateOfOrigin,
        positionTitle,
        ...(photoUrl ? { photoUrl } : {}),
      },
    });

    await logAuditAction(
      session?.userId,
      'REPRESENTATIVE_UPDATE',
      `Updated House Representative ${fullName}`
    );

    revalidatePath('/admin/representatives');
    revalidatePath('/leadership');
    revalidatePath('/');
    return { success: true, message: 'House Representative updated successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update representative' };
  }
}

export async function deleteRepresentativeAction(id: string) {
  try {
    const session = await getSession();
    const rep = await db.houseRepresentative.delete({ where: { id } });

    await logAuditAction(
      session?.userId,
      'REPRESENTATIVE_DELETE',
      `Deleted House Representative ${rep.fullName}`
    );

    revalidatePath('/admin/representatives');
    revalidatePath('/leadership');
    revalidatePath('/');
    return { success: true, message: 'House Representative deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete representative' };
  }
}

// ==========================================
// 9. DYNAMIC ACHIEVEMENTS SYSTEM ACTIONS
// ==========================================
export async function createAchievementAction(formData: FormData) {
  try {
    const session = await getSession();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const progressPercentage = parseInt((formData.get('progressPercentage') as string) || '0', 10);
    const imageUrl = (formData.get('imageUrl') as string) || null;
    const sessionId = formData.get('sessionId') as string;

    let targetSessionId = sessionId;
    if (!targetSessionId) {
      const activeSession = await db.administrationSession.findFirst({ where: { isCurrent: true } })
        || await db.administrationSession.findFirst();
      if (!activeSession) throw new Error('No administration session found.');
      targetSessionId = activeSession.id;
    }

    const status = progressPercentage >= 100 ? 'COMPLETED' : progressPercentage > 0 ? 'ONGOING' : 'UPCOMING';

    await db.achievement.create({
      data: {
        title,
        description,
        progressPercentage,
        status,
        imageUrl,
        sessionId: targetSessionId,
      },
    });

    await db.auditLog.create({
      data: {
        userId: session?.userId || null,
        action: 'ACHIEVEMENT_CREATE',
        details: `Created Achievement: ${title} (${progressPercentage}% complete)`,
      },
    });

    revalidatePath('/admin/achievements');
    revalidatePath('/leadership');
    revalidatePath('/');
    return { success: true, message: 'Achievement record created successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create achievement' };
  }
}

export async function updateAchievementAction(id: string, formData: FormData) {
  try {
    const session = await getSession();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const progressPercentage = parseInt((formData.get('progressPercentage') as string) || '0', 10);
    const imageUrl = (formData.get('imageUrl') as string) || null;

    const status = progressPercentage >= 100 ? 'COMPLETED' : progressPercentage > 0 ? 'ONGOING' : 'UPCOMING';

    await db.achievement.update({
      where: { id },
      data: {
        title,
        description,
        progressPercentage,
        status,
        ...(imageUrl ? { imageUrl } : {}),
      },
    });

    await db.auditLog.create({
      data: {
        userId: session?.userId || null,
        action: 'ACHIEVEMENT_UPDATE',
        details: `Updated Achievement: ${title} (${progressPercentage}% complete)`,
      },
    });

    revalidatePath('/admin/achievements');
    revalidatePath('/leadership');
    revalidatePath('/');
    return { success: true, message: 'Achievement updated successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update achievement' };
  }
}

export async function deleteAchievementAction(id: string) {
  try {
    const session = await getSession();
    const ach = await db.achievement.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userId: session?.userId || null,
        action: 'ACHIEVEMENT_DELETE',
        details: `Deleted Achievement: ${ach.title}`,
      },
    });

    revalidatePath('/admin/achievements');
    revalidatePath('/leadership');
    revalidatePath('/');
    return { success: true, message: 'Achievement deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete achievement' };
  }
}

// ==========================================
// 10. NEWS INTERACTION ACTIONS (LIKES & SHARES)
// ==========================================
export async function likeArticleAction(articleId: string) {
  try {
    const article = await db.newsArticle.update({
      where: { id: articleId },
      data: { likeCount: { increment: 1 } },
    });
    revalidatePath(`/news/${article.slug}`);
    revalidatePath('/news');
    return { success: true, likeCount: article.likeCount };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to register like' };
  }
}

export async function shareArticleAction(articleId: string) {
  try {
    const article = await db.newsArticle.update({
      where: { id: articleId },
      data: { shareCount: { increment: 1 } },
    });
    revalidatePath(`/news/${article.slug}`);
    return { success: true, shareCount: article.shareCount };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to register share' };
  }
}

// ==========================================
// 11. PRESIDENTIAL WELCOME ADDRESS & CMS ACTIONS
// ==========================================
export async function upsertPresidentialWelcomeAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const id = formData.get('id') as string | null;
    const presidentName = formData.get('presidentName') as string;
    const officeTitle = (formData.get('officeTitle') as string) || 'Executive President';
    const stateOfOrigin = (formData.get('stateOfOrigin') as string) || 'Ekiti State';
    const sessionTitle = (formData.get('sessionTitle') as string) || '2026/2027 Progress Era Session';
    const portraitUrl = (formData.get('portraitUrl') as string) || null;
    const welcomeSummary = formData.get('welcomeSummary') as string;
    const fullMessage = (formData.get('fullMessage') as string) || welcomeSummary;

    // Deactivate previous active welcome messages if setting active
    await db.presidentialWelcome.updateMany({
      data: { isActive: false },
    });

    let welcome;
    if (id) {
      welcome = await db.presidentialWelcome.update({
        where: { id },
        data: {
          presidentName,
          officeTitle,
          stateOfOrigin,
          sessionTitle,
          portraitUrl,
          welcomeSummary,
          fullMessage,
          isActive: true,
        },
      });
    } else {
      welcome = await db.presidentialWelcome.create({
        data: {
          presidentName,
          officeTitle,
          stateOfOrigin,
          sessionTitle,
          portraitUrl,
          welcomeSummary,
          fullMessage,
          isActive: true,
        },
      });
    }

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPDATE_PRESIDENTIAL_WELCOME',
        details: `Updated Presidential Welcome Message for ${presidentName}`,
      },
    });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/welcome-message');
    return { success: true, message: 'Presidential Welcome Address saved successfully!', data: welcome };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to save welcome message' };
  }
}

// ==========================================
// 12. DYNAMIC ABOUT CONTENT CMS ACTIONS
// ==========================================
export async function upsertAboutContentAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const sectionKey = formData.get('sectionKey') as string;
    const title = formData.get('title') as string;
    const subtitle = (formData.get('subtitle') as string) || null;
    const content = formData.get('content') as string;
    const iconName = (formData.get('iconName') as string) || 'BookOpen';
    const displayOrder = parseInt((formData.get('displayOrder') as string) || '0', 10);

    const about = await db.aboutContent.upsert({
      where: { sectionKey },
      update: {
        title,
        subtitle,
        content,
        iconName,
        displayOrder,
      },
      create: {
        sectionKey,
        title,
        subtitle,
        content,
        iconName,
        displayOrder,
      },
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPDATE_ABOUT_CONTENT',
        details: `Updated About Content Section: ${sectionKey}`,
      },
    });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/about-content');
    return { success: true, message: 'About Content saved successfully!', data: about };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to save about content' };
  }
}

export async function deleteAboutContentAction(id: string) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    await db.aboutContent.delete({ where: { id } });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/about-content');
    return { success: true, message: 'About section deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete about section' };
  }
}

// ==========================================
// 13. SITE SETTINGS CMS ACTIONS (CONTACT & MAP)
// ==========================================
export async function updateSiteSettingsAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const settingsToUpdate = [
      { key: 'contact_address', label: 'Office Address', group: 'CONTACT' },
      { key: 'contact_email', label: 'Official Email', group: 'CONTACT' },
      { key: 'contact_phone', label: 'Helpline Phone', group: 'CONTACT' },
      { key: 'contact_whatsapp', label: 'Official WhatsApp', group: 'CONTACT' },
      { key: 'contact_map_url', label: 'Google Maps Embed URL', group: 'CONTACT' },
      { key: 'social_facebook', label: 'Facebook URL', group: 'FOOTER' },
      { key: 'social_twitter', label: 'Twitter/X URL', group: 'FOOTER' },
      { key: 'social_instagram', label: 'Instagram URL', group: 'FOOTER' },
      { key: 'social_linkedin', label: 'LinkedIn URL', group: 'FOOTER' },
    ] as const;

    for (const item of settingsToUpdate) {
      const val = formData.get(item.key) as string | null;
      if (val !== null) {
        await db.siteSetting.upsert({
          where: { key: item.key },
          update: { value: val },
          create: {
            key: item.key,
            value: val,
            label: item.label,
            group: item.group,
          },
        });
      }
    }

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPDATE_SITE_SETTINGS',
        details: 'Updated Site Settings and Contact Preview configurations',
      },
    });

    revalidatePath('/');
    revalidatePath('/contact');
    revalidatePath('/admin/settings');
    return { success: true, message: 'Site & Contact Settings saved successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update site settings' };
  }
}

// ==========================================
// 14. CONSTITUTION CMS ACTIONS
// ==========================================
export async function createConstitutionVersionAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const versionName = formData.get('versionName') as string;
    const edition = (formData.get('edition') as string) || '1st Harmonized Edition';
    const sessionId = formData.get('sessionId') as string;
    const effectiveDateStr = formData.get('effectiveDate') as string;
    const assentedBy = (formData.get('assentedBy') as string) || null;
    const speakerCertBy = (formData.get('speakerCertBy') as string) || null;
    const pdfMediaId = (formData.get('pdfMediaId') as string) || null;
    const isCurrent = formData.get('isCurrent') === 'true';

    if (isCurrent) {
      await db.constitutionVersion.updateMany({
        data: { isCurrent: false },
      });
    }

    const version = await db.constitutionVersion.create({
      data: {
        versionName,
        edition,
        sessionId,
        effectiveDate: new Date(effectiveDateStr),
        assentedBy,
        speakerCertBy,
        pdfMediaId,
        isCurrent,
      },
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CONSTITUTION_VERSION_CREATE',
        details: `Created Constitution Version: ${versionName}`,
      },
    });

    revalidatePath('/constitution');
    revalidatePath('/admin/constitution');
    revalidatePath('/history');
    return { success: true, message: 'Constitution Version created successfully!', data: version };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create constitution version' };
  }
}

export async function updateConstitutionVersionAction(id: string, formData: FormData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const versionName = formData.get('versionName') as string;
    const edition = (formData.get('edition') as string) || '1st Harmonized Edition';
    const effectiveDateStr = formData.get('effectiveDate') as string;
    const assentedBy = (formData.get('assentedBy') as string) || null;
    const speakerCertBy = (formData.get('speakerCertBy') as string) || null;
    const isCurrent = formData.get('isCurrent') === 'true';

    if (isCurrent) {
      await db.constitutionVersion.updateMany({
        where: { id: { not: id } },
        data: { isCurrent: false },
      });
    }

    const version = await db.constitutionVersion.update({
      where: { id },
      data: {
        versionName,
        edition,
        effectiveDate: new Date(effectiveDateStr),
        assentedBy,
        speakerCertBy,
        isCurrent,
      },
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CONSTITUTION_VERSION_UPDATE',
        details: `Updated Constitution Version: ${versionName}`,
      },
    });

    revalidatePath('/constitution');
    revalidatePath('/admin/constitution');
    revalidatePath('/history');
    return { success: true, message: 'Constitution Version updated successfully!', data: version };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update constitution version' };
  }
}

export async function deleteConstitutionVersionAction(id: string) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const ver = await db.constitutionVersion.findUnique({ where: { id } });
    if (ver?.isCurrent) {
      throw new Error('Cannot delete the active ratified constitution version.');
    }

    await db.constitutionVersion.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CONSTITUTION_VERSION_DELETE',
        details: `Deleted Constitution Version ID: ${id}`,
      },
    });

    revalidatePath('/constitution');
    revalidatePath('/admin/constitution');
    revalidatePath('/history');
    return { success: true, message: 'Constitution Version deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete constitution version' };
  }
}

export async function addConstitutionArticleAction(versionId: string, formData: FormData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const articleNumber = parseInt(formData.get('articleNumber') as string, 10);
    const title = formData.get('title') as string;
    const overview = (formData.get('overview') as string) || null;
    const slug = (formData.get('slug') as string) || `article-${articleNumber}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    const article = await db.constitutionArticle.create({
      data: {
        versionId,
        articleNumber,
        title,
        overview,
        slug,
      },
    });

    revalidatePath('/constitution');
    revalidatePath('/admin/constitution');
    return { success: true, message: 'Constitution Article added successfully!', data: article };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to add article' };
  }
}

export async function addConstitutionSectionAction(articleId: string, formData: FormData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const sectionNumber = formData.get('sectionNumber') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const displayOrder = parseInt((formData.get('displayOrder') as string) || '0', 10);

    const sectionRecord = await db.constitutionSection.create({
      data: {
        articleId,
        sectionNumber,
        title,
        content,
        displayOrder,
      },
    });

    revalidatePath('/constitution');
    revalidatePath('/admin/constitution');
    return { success: true, message: 'Constitution Section added successfully!', data: sectionRecord };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to add section' };
  }
}

export async function addConstitutionAmendmentAction(versionId: string, formData: FormData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const proposedBy = formData.get('proposedBy') as string;
    const dateProposedStr = formData.get('dateProposed') as string;
    const dateRatifiedStr = (formData.get('dateRatified') as string) || null;
    const amendmentSummary = formData.get('amendmentSummary') as string;
    const fullText = formData.get('fullText') as string;

    const amendment = await db.constitutionAmendment.create({
      data: {
        versionId,
        proposedBy,
        dateProposed: new Date(dateProposedStr),
        dateRatified: dateRatifiedStr ? new Date(dateRatifiedStr) : null,
        amendmentSummary,
        fullText,
      },
    });

    revalidatePath('/constitution');
    revalidatePath('/admin/constitution');
    return { success: true, message: 'Constitution Amendment created successfully!', data: amendment };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to add amendment' };
  }
}

// ==========================================
// 15. CONTACT MESSAGES & INBOX ACTIONS
// ==========================================
export async function updateContactMessageStatusAction(id: string, status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED') {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const msg = await db.contactMessage.update({
      where: { id },
      data: {
        status,
        ...(status === 'READ' ? { readAt: new Date() } : {}),
      },
    });

    revalidatePath('/admin/contact-messages');
    return { success: true, message: `Message status updated to ${status}` };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update message status' };
  }
}

export async function replyContactMessageAction(id: string, replyMessage: string) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const msg = await db.contactMessage.update({
      where: { id },
      data: {
        status: 'REPLIED',
        replyMessage,
        repliedAt: new Date(),
      },
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CONTACT_MESSAGE_REPLY',
        details: `Replied to contact enquiry Ref: ${msg.referenceNo} (${msg.email})`,
      },
    });

    revalidatePath('/admin/contact-messages');
    return { success: true, message: `Reply recorded for Ref: ${msg.referenceNo}` };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to record reply' };
  }
}

export async function deleteContactMessageAction(id: string) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const msg = await db.contactMessage.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CONTACT_MESSAGE_DELETE',
        details: `Deleted contact enquiry Ref: ${msg.referenceNo}`,
      },
    });

    revalidatePath('/admin/contact-messages');
    return { success: true, message: 'Message deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete message' };
  }
}

// ==========================================
// 16. CONTACT SETTINGS & FAQ CMS ACTIONS
// ==========================================
export async function updateContactSettingsAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const keysToSave = [
      { key: 'contact_address', label: 'Office Address', group: 'CONTACT' as const },
      { key: 'contact_email', label: 'Official Email', group: 'CONTACT' as const },
      { key: 'contact_support_email', label: 'Support Email', group: 'CONTACT' as const },
      { key: 'contact_phone', label: 'Helpline Phone', group: 'CONTACT' as const },
      { key: 'contact_phone_alt', label: 'Alternative Phone', group: 'CONTACT' as const },
      { key: 'contact_whatsapp', label: 'Official WhatsApp', group: 'CONTACT' as const },
      { key: 'social_facebook', label: 'Facebook URL', group: 'FOOTER' as const },
      { key: 'social_instagram', label: 'Instagram URL', group: 'FOOTER' as const },
      { key: 'social_twitter', label: 'X (Twitter) URL', group: 'FOOTER' as const },
      { key: 'social_telegram', label: 'Telegram Channel', group: 'FOOTER' as const },
      { key: 'social_linkedin', label: 'LinkedIn Page', group: 'FOOTER' as const },
      { key: 'social_youtube', label: 'YouTube Channel', group: 'FOOTER' as const },
      { key: 'social_website', label: 'Website URL', group: 'FOOTER' as const },
      { key: 'contact_map_url', label: 'Google Maps Embed URL', group: 'CONTACT' as const },
      { key: 'office_hours_weekday', label: 'Weekday Office Hours', group: 'CONTACT' as const },
      { key: 'office_hours_saturday', label: 'Saturday Office Hours', group: 'CONTACT' as const },
      { key: 'office_hours_sunday', label: 'Sunday Office Hours', group: 'CONTACT' as const },
      { key: 'office_hours_holidays', label: 'Public Holiday Hours', group: 'CONTACT' as const },
      { key: 'contact_intro_title', label: 'Contact Page Intro Title', group: 'CONTACT' as const },
      { key: 'contact_intro_subtitle', label: 'Contact Page Intro Subtitle', group: 'CONTACT' as const },
    ];

    for (const item of keysToSave) {
      const val = formData.get(item.key) as string | null;
      if (val !== null) {
        await db.siteSetting.upsert({
          where: { key: item.key },
          update: { value: val },
          create: {
            key: item.key,
            value: val,
            label: item.label,
            group: item.group,
          },
        });
      }
    }

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPDATE_CONTACT_SETTINGS',
        details: 'Updated Contact Settings & Social Media Hub configurations',
      },
    });

    revalidatePath('/contact');
    revalidatePath('/admin/contact-settings');
    revalidatePath('/');
    return { success: true, message: 'Contact settings saved successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update contact settings' };
  }
}

export async function createFaqItemAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const question = formData.get('question') as string;
    const answer = formData.get('answer') as string;
    const category = (formData.get('category') as string) || 'GENERAL';
    const displayOrder = parseInt((formData.get('displayOrder') as string) || '0', 10);
    const isPublished = formData.get('isPublished') === 'true';

    const faq = await db.faqItem.create({
      data: {
        question,
        answer,
        category,
        displayOrder,
        isPublished,
      },
    });

    revalidatePath('/contact');
    revalidatePath('/admin/contact-settings');
    return { success: true, message: 'FAQ Item created successfully!', data: faq };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create FAQ item' };
  }
}

export async function updateFaqItemAction(id: string, formData: FormData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const question = formData.get('question') as string;
    const answer = formData.get('answer') as string;
    const category = (formData.get('category') as string) || 'GENERAL';
    const displayOrder = parseInt((formData.get('displayOrder') as string) || '0', 10);
    const isPublished = formData.get('isPublished') === 'true';

    const faq = await db.faqItem.update({
      where: { id },
      data: {
        question,
        answer,
        category,
        displayOrder,
        isPublished,
      },
    });

    revalidatePath('/contact');
    revalidatePath('/admin/contact-settings');
    return { success: true, message: 'FAQ Item updated successfully!', data: faq };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update FAQ item' };
  }
}

export async function deleteFaqItemAction(id: string) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    await db.faqItem.delete({ where: { id } });

    revalidatePath('/contact');
    revalidatePath('/admin/contact-settings');
    return { success: true, message: 'FAQ Item deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete FAQ item' };
  }
}

// ==========================================
// 17. STUDENT REGISTRATION DATABASE ACTIONS
// ==========================================
export async function updateStudentStatusAction(id: string, status: 'PENDING' | 'VERIFIED' | 'REJECTED', notes?: string) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const student = await db.studentRegistration.update({
      where: { id },
      data: {
        status,
        ...(notes ? { notes } : {}),
      },
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'STUDENT_STATUS_UPDATE',
        details: `Updated student status for ${student.fullName} (${student.regNumber}) to ${status}`,
      },
    });

    revalidatePath('/admin/students');
    return { success: true, message: `Student status updated to ${status}` };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update student status' };
  }
}

export async function deleteStudentRegistrationAction(id: string) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized.');

    const student = await db.studentRegistration.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'STUDENT_DELETE',
        details: `Deleted student registration record: ${student.fullName} (${student.regNumber})`,
      },
    });

    revalidatePath('/admin/students');
    return { success: true, message: 'Student registration record deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete student record' };
  }
}

// ==========================================
// 18. CONTROLLED REGISTRATION WINDOW ACTIONS
// ==========================================
export async function updateRegistrationSettingsAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session || !session.roleCodes.includes('SUPER_ADMIN')) {
      throw new Error('Unauthorized. Super Admin access required.');
    }

    const registrationOpen = formData.get('registrationOpen') === 'true';
    const opensAtStr = formData.get('opensAt') as string;
    const closesAtStr = formData.get('closesAt') as string;
    const academicSession = (formData.get('academicSession') as string) || '2026/2027';
    const notice = formData.get('notice') as string;
    const closedMessage = formData.get('closedMessage') as string;

    const opensAt = opensAtStr ? new Date(opensAtStr) : null;
    const closesAt = closesAtStr ? new Date(closesAtStr) : null;

    const existing = await db.registrationSettings.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (existing) {
      await db.registrationSettings.update({
        where: { id: existing.id },
        data: {
          registrationOpen,
          opensAt,
          closesAt,
          academicSession,
          notice,
          closedMessage,
        },
      });
    } else {
      await db.registrationSettings.create({
        data: {
          registrationOpen,
          opensAt,
          closesAt,
          academicSession,
          notice,
          closedMessage,
        },
      });
    }

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'REGISTRATION_WINDOW_UPDATE',
        details: `Updated registration window settings: Open=${registrationOpen}, Opens=${opensAtStr}, Closes=${closesAtStr}`,
      },
    });

    revalidatePath('/register');
    revalidatePath('/admin/registration-settings');
    revalidatePath('/admin/students');
    revalidatePath('/admin/dashboard');
    revalidatePath('/');

    return { success: true, message: 'Registration window settings saved successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update registration settings' };
  }
}

// ==========================================
// 21. ACADEMIC FACULTIES & DEPARTMENTS MANAGEMENT
// ==========================================
export async function getDepartmentsConfigAction() {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: 'academic_faculties_and_departments' },
    });
    if (!setting) {
      const defaultData: Record<string, string[]> = {
        'Faculty of Computing': [
          'Computer Science',
          'Cybersecurity',
          'Software Engineering',
          'Information Technology',
        ],
        'Faculty of Science': [
          'Biochemistry',
          'Microbiology',
          'Biotechnology',
          'Physics',
          'Chemistry',
          'Mathematics',
        ],
        'Faculty of Management Sciences': [
          'Accounting',
          'Business Administration',
          'Banking and Finance',
          'Public Administration',
        ],
        'Faculty of Agriculture': [
          'Agronomy',
          'Animal Science',
          'Agricultural Economics & Extension',
          'Fisheries and Aquaculture',
        ],
        'Faculty of Arts & Humanities': [
          'English Language',
          'History and International Studies',
          'Linguistics',
          'Islamic Studies',
        ],
        'Faculty of Social Sciences': [
          'Economics',
          'Political Science',
          'Sociology',
          'Criminology & Security Studies',
        ],
        'Faculty of Allied Health Sciences': [
          'Nursing Science',
          'Medical Laboratory Science',
          'Public Health',
        ],
      };
      await db.siteSetting.create({
        data: {
          key: 'academic_faculties_and_departments',
          label: 'Academic Faculties & Departments',
          value: JSON.stringify(defaultData),
          group: 'GENERAL',
          description: 'Configured academic faculties and departments list for YOSU FUD',
        },
      });
      return defaultData;
    }
    return JSON.parse(setting.value);
  } catch (error) {
    console.error('Error fetching departments config:', error);
    return {};
  }
}

export async function saveDepartmentsConfigAction(configData: Record<string, string[]>) {
  try {
    const session = await getSession();
    await db.siteSetting.upsert({
      where: { key: 'academic_faculties_and_departments' },
      update: {
        value: JSON.stringify(configData),
      },
      create: {
        key: 'academic_faculties_and_departments',
        label: 'Academic Faculties & Departments',
        value: JSON.stringify(configData),
        group: 'GENERAL',
        description: 'Configured academic faculties and departments list for YOSU FUD',
      },
    });

    await logAuditAction(session?.userId, 'UPDATE_DEPARTMENTS_CONFIG', 'Updated academic faculties and departments config.');

    revalidatePath('/admin/departments');
    revalidatePath('/register');
    revalidatePath('/member');

    return { success: true, message: 'Academic faculties and departments updated successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update faculties and departments.' };
  }
}




