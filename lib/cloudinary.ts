import crypto from 'crypto';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = 'yosu_assets'
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'demo';
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // If real Cloudinary credentials are provided
  if (apiKey && apiSecret && cloudName !== 'demo') {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(fileBuffer)]);
    formData.append('file', blob, fileName);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }

    return {
      secure_url: data.secure_url,
      public_id: data.public_id,
      width: data.width || 800,
      height: data.height || 600,
      format: data.format || 'jpg',
      bytes: data.bytes || fileBuffer.length,
    };
  }

  // Fallback for local development or demo environment
  const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const publicUrl = `/uploads/${safeName}`;

  return {
    secure_url: publicUrl,
    public_id: `local_${safeName}`,
    width: 800,
    height: 600,
    format: fileName.split('.').pop() || 'jpg',
    bytes: fileBuffer.length,
  };
}

export function getCloudinaryOptimizedUrl(url: string, width: number = 800, quality: number = 80): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
}
