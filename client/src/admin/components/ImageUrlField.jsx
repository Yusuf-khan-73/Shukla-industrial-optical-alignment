/**
 * Image URL field with optional file upload.
 * Location: client/src/admin/components/ImageUrlField.jsx
 */
import { useState } from 'react';
import { toast } from 'react-toastify';
import { uploadAdminImage } from '@api/admin';
import { resolveImageUrl } from '@utils/resolveImageUrl';
import { TOAST_DURATION_MS } from '@utils/toastConfig';

const ImageUrlField = ({ label, value, onChange, altValue, onAltChange, showAlt = true }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadAdminImage(file);
      onChange(url);
      toast.success('Image uploaded', { autoClose: TOAST_DURATION_MS });
    } catch {
      toast.error('Upload failed', { autoClose: TOAST_DURATION_MS });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="full-width">
      <label className="form-label">{label}</label>
      <div className="d-flex flex-wrap gap-3 align-items-start">
        {value && (
          <img src={resolveImageUrl(value, Date.now())} alt={altValue || label} className="admin-image-preview" />
        )}
        <div className="flex-grow-1">
          <input
            type="url"
            className="form-control mb-2"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
          />
          <input
            type="file"
            className="form-control form-control-sm"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
          {uploading && <small className="text-muted">Uploading…</small>}
          {showAlt && onAltChange && (
            <input
              type="text"
              className="form-control mt-2"
              value={altValue || ''}
              onChange={(e) => onAltChange(e.target.value)}
              placeholder="Alt text"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUrlField;
