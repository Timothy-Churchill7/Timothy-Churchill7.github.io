# Planet assets

Drop real logos / textures here to replace the placeholders. The scene looks
up files by a stable `slug` per planet, so **no code changes are needed** — just
match the filename.

Convention (added/used in Phase 2+):

```
public/assets/planets/<slug>-icon.svg      # icon shown on the planet + panel
public/assets/planets/<slug>-texture.jpg   # optional surface texture (equirectangular)
```

Example slugs: `education`, `research`, `finance`, `emergency-medicine`,
`athletics`, `leadership`, `work`, `skills`.

Until real files are added, planets render with a solid color + a text label.
