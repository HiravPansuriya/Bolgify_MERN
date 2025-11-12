export function generateAvatar(name, size = 128) 
{
    if(!name || name.trim() === "") name = "User";

    const words = name.trim().split(/\s+/);
    let initials = "";

    if(words.length === 1) 
    {
        initials = words[0].substring(0, 1).toUpperCase();
    } 
    else 
    {
        initials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }

    const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="100%" height="100%" rx="${size / 2}" ry="${size / 2}" fill="hsl(${hue}, 65%, 45%)"/>
      <text x="50%" y="50%" dy="0.09em" text-anchor="middle" dominant-baseline="middle"
            font-family="Arial, sans-serif" font-size="${Math.floor(size * 0.44)}"
            fill="white" font-weight="600">${initials}</text>
    </svg>
    `;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
