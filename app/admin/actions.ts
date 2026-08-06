'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { ArticleStatus, ProjectStatus, OfficeCategory } from '@prisma/client';
import { hashPassword } from '@/lib/password';
import { getSession } from '@/lib/auth';

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
    const stateOfOrigin = formData.get('stateOfOrigin') as string;
    const department = formData.get('department') as string;
    const bio = formData.get('bio') as string;
    const imageUrl = (formData.get('imageUrl') as string) || null;

    const appointment = await db.officeAppointment.findUnique({
      where: { id: appointmentId },
      include: { person: true },
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

    await db.person.update({
      where: { id: appointment.personId },
      data: {
        fullName,
        stateOfOrigin,
        department,
        bio,
        ...(avatarMediaId ? { avatarMediaId } : {}),
      },
    });

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
    const summary = formData.get('summary') as string;
    const description = formData.get('description') as string;
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
// 6. CONSTITUTION VERSIONS ACTIONS
// ==========================================
export async function createConstitutionVersionAction(formData: FormData) {
  try {
    const versionName = formData.get('versionName') as string || formData.get('title') as string;
    const isCurrent = formData.get('isCurrent') === 'true';

    const activeSession = await db.administrationSession.findFirst({ where: { isCurrent: true } })
      || await db.administrationSession.findFirst();

    if (!activeSession) throw new Error('No administration session found.');

    if (isCurrent) {
      await db.constitutionVersion.updateMany({ data: { isCurrent: false } });
    }

    await db.constitutionVersion.create({
      data: {
        versionName,
        sessionId: activeSession.id,
        effectiveDate: new Date(),
        isCurrent,
      },
    });

    revalidatePath('/admin/constitution');
    revalidatePath('/constitution');
    return { success: true, message: 'Constitution version created successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create constitution version' };
  }
}

export async function deleteConstitutionVersionAction(id: string) {
  try {
    const session = await getSession();
    const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN');
    if (!isSuperAdmin) {
      return { success: false, error: '403 Forbidden: Only a Super Admin can delete Constitution versions permanently.' };
    }

    const version = await db.constitutionVersion.delete({ where: { id } });
    await db.auditLog.create({
      data: {
        userId: session?.userId || null,
        action: 'CONSTITUTION_DELETE',
        details: `Super Admin permanently deleted Constitution version: ${version.versionName}`,
      },
    });

    revalidatePath('/admin/constitution');
    revalidatePath('/constitution');
    return { success: true, message: 'Constitution version deleted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete version' };
  }
}

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
