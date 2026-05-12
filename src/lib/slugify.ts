export function slugify(text: string): string {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };

  for (const [key, value] of Object.entries(trMap)) {
    text = text.replace(new RegExp(key, 'g'), value);
  }

  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (except spaces and hyphens)
    .replace(/[\s_-]+/g, '-')  // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, '');  // Remove leading and trailing hyphens
}

export function getSeoFileName(originalName: string): string {
  const lastDotIndex = originalName.lastIndexOf('.');
  if (lastDotIndex === -1) return slugify(originalName) + '-' + Math.random().toString(36).substring(2, 7);
  
  const name = originalName.substring(0, lastDotIndex);
  const ext = originalName.substring(lastDotIndex + 1).toLowerCase();
  
  // Add a short random suffix to ensure uniqueness but keep it readable
  const suffix = Math.random().toString(36).substring(2, 7);
  
  return `${slugify(name)}-${suffix}.${ext}`;
}
