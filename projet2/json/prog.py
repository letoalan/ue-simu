#!/usr/bin/env python3
"""Convertit récursivement les fichiers JSON en Markdown lisible, sans dépendance externe."""
import argparse
import json
import sys
from pathlib import Path

DEFAULT_EXCLUDES = {".git", "node_modules", ".venv", "venv", "__pycache__", "dist", "build"}


def escape(value):
    return str(value).replace("\\", "\\\\").replace("`", "\\`").replace("*", "\\*").replace("_", "\\_").replace("[", "\\[").replace("]", "\\]").replace("<", "&lt;").replace(">", "&gt;").replace("\n", " ").replace("\r", " ")


def scalar(value):
    if isinstance(value, str):
        return escape(value) if value else '"" (chaîne vide)'
    return "`" + json.dumps(value, ensure_ascii=False, allow_nan=False) + "`"


def render(value, depth=0, max_depth=10):
    indent = "  " * depth
    lines = []
    if isinstance(value, (dict, list)) and depth >= max_depth:
        content = json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False)
        lines.append(indent + "```json")
        lines.extend(indent + line for line in content.splitlines())
        lines.append(indent + "```")
    elif isinstance(value, dict):
        if not value:
            return [indent + "`{}` (objet vide)"]
        for key, item in value.items():
            label = escape(key) if key else '"" (clé vide)'
            if isinstance(item, (dict, list)):
                lines.append(indent + "- **" + label + "** :")
                lines.extend(render(item, depth + 1, max_depth))
            else:
                lines.append(indent + "- **" + label + "** : " + scalar(item))
    elif isinstance(value, list):
        if not value:
            return [indent + "`[]` (liste vide)"]
        for index, item in enumerate(value, start=1):
            if isinstance(item, (dict, list)):
                lines.append(indent + f"- **Élément {index}** :")
                lines.extend(render(item, depth + 1, max_depth))
            else:
                lines.append(indent + "- " + scalar(item))
    else:
        lines.append(indent + scalar(value))
    return lines


def reject_constant(value):
    raise ValueError(f"Constante non conforme au JSON : {value}")


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"Clé JSON dupliquée : {key!r}")
        result[key] = value
    return result


def is_inside(path, parent):
    try:
        path.relative_to(parent)
        return True
    except ValueError:
        return False


COUNTRY_GEO_INFO = {
    "allemagne": {"name": "Allemagne", "code": "DE", "cap": "Berlin", "cap_lon": 13.4050, "cap_lat": 52.5200},
    "france": {"name": "France", "code": "FR", "cap": "Paris", "cap_lon": 2.3522, "cap_lat": 48.8566},
    "italie": {"name": "Italie", "code": "IT", "cap": "Rome", "cap_lon": 12.4964, "cap_lat": 41.9028},
    "pologne": {"name": "Pologne", "code": "PL", "cap": "Varsovie", "cap_lon": 21.0122, "cap_lat": 52.2297},
    "suede": {"name": "Suède", "code": "SE", "cap": "Stockholm", "cap_lon": 18.0686, "cap_lat": 59.3293},
    "suède": {"name": "Suède", "code": "SE", "cap": "Stockholm", "cap_lon": 18.0686, "cap_lat": 59.3293},
    "hongrie": {"name": "Hongrie", "code": "HU", "cap": "Budapest", "cap_lon": 19.0402, "cap_lat": 47.4979},
}


def convert(source, destination, relative, max_depth, include_json):
    with source.open("r", encoding="utf-8-sig") as handle:
        data = json.load(handle, parse_constant=reject_constant, object_pairs_hook=unique_object)
    
    stem_lower = source.stem.lower()
    is_country_geo = isinstance(data, dict) and data.get("type") == "FeatureCollection" and stem_lower in COUNTRY_GEO_INFO

    lines = ["# " + escape(source.stem), "", "Source : `" + relative.as_posix().replace("`", "") + "`", ""]

    if is_country_geo:
        info = COUNTRY_GEO_INFO[stem_lower]
        lons, lats = [], []
        geom_types = set()
        for feat in data.get("features", []):
            geom = feat.get("geometry", {})
            gtype = geom.get("type", "Unknown")
            geom_types.add(gtype)
            coords = geom.get("coordinates", [])
            def add_pt(pt):
                if isinstance(pt, (list, tuple)) and len(pt) >= 2:
                    lons.append(pt[0])
                    lats.append(pt[1])
            if gtype == "Polygon":
                for ring in coords:
                    for pt in ring: add_pt(pt)
            elif gtype == "MultiPolygon":
                for poly in coords:
                    for ring in poly:
                        for pt in ring: add_pt(pt)

        min_lon = min(lons) if lons else 0
        max_lon = max(lons) if lons else 0
        min_lat = min(lats) if lats else 0
        max_lat = max(lats) if lats else 0

        # Calcul du chemin relatif vers le fichier SVG de la carte
        import os
        base_root = source.parents[len(relative.parents) - 1] if len(relative.parents) > 1 else source.parent
        svg_name = "suede.svg" if stem_lower in ("suede", "suède") else f"{stem_lower}.svg"
        
        # Chemins potentiels pour l'image de la carte
        possible_svg_paths = [
            source.parents[3] / "public" / "medias" / "images" / "maps" / svg_name,
            source.parents[4] / "public" / "medias" / "images" / "maps" / svg_name,
            source.parents[2] / "medias" / "images" / "maps" / svg_name,
        ]
        svg_rel_str = f"../../../../medias/images/maps/{svg_name}"
        for p in possible_svg_paths:
            if p.exists():
                try:
                    svg_rel_str = os.path.relpath(p, destination.parent).replace("\\", "/")
                    break
                except ValueError:
                    pass

        lines.extend([
            "## Situation géographique en Europe",
            "",
            f"![Situation de {info['name']} au sein de l'Union européenne]({svg_rel_str})",
            "",
            "## Détail des entités et coordonnées GeoJSON",
            "",
            f"<details>",
            f"<summary>Cliquez pour afficher les {len(lons):,} points de coordonnées géographiques</summary>",
            ""
        ])
        lines.extend(render(data, max_depth=max_depth))
        lines.extend(["", "</details>"])
    else:
        lines.extend(["## Contenu", ""])
        lines.extend(render(data, max_depth=max_depth))

    if include_json:
        raw = json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False)
        fence = "`" * max(3, max((len(part) for part in raw.split() if set(part) == {"`"}), default=0) + 1)
        while fence in raw:
            fence += "`"
        lines.extend(["", "## JSON reformatté", "", fence + "json", raw, fence])
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Recherche les JSON dans un dossier et ses sous-dossiers et les convertit en Markdown.")
    parser.add_argument("source", nargs="?", default=".", help="Dossier source (défaut : dossier courant).")
    parser.add_argument("-o", "--output", help="Dossier de sortie (défaut : SOURCE/markdown_json).")
    parser.add_argument("--in-place", action="store_true", help="Crée les .md à côté des .json, au lieu d'un dossier de sortie.")
    parser.add_argument("--overwrite", action="store_true", help="Autorise le remplacement des fichiers Markdown existants.")
    parser.add_argument("--exclude", action="append", default=[], metavar="NOM", help="Nom supplémentaire de dossier à ignorer (répétable).")
    parser.add_argument("--all", action="store_true", help="Inclut aussi les dossiers techniques exclus par défaut.")
    parser.add_argument("--include-json", action="store_true", help="Ajoute une copie JSON reformattée dans chaque Markdown.")
    parser.add_argument("--max-depth", type=int, default=10, help="Profondeur de listes avant affichage en bloc JSON (défaut : 10).")
    parser.add_argument("--dry-run", action="store_true", help="Affiche les conversions prévues sans écrire.")
    args = parser.parse_args()
    if args.in_place and args.output:
        parser.error("--in-place et --output sont incompatibles.")
    if args.max_depth < 1:
        parser.error("--max-depth doit être supérieur ou égal à 1.")
    source = Path(args.source).expanduser().resolve()
    if not source.is_dir():
        parser.error(f"Dossier source introuvable : {source}")
    output = None if args.in_place else (Path(args.output).expanduser().resolve() if args.output else source / "markdown_json")
    if output == source:
        parser.error("Le dossier de sortie doit être distinct de la source. Utilisez --in-place pour écrire à côté des JSON.")
    excludes = set(args.exclude) | (set() if args.all else DEFAULT_EXCLUDES)
    sources = []
    import os
    for root, dirs, files in os.walk(source, followlinks=False):
        root = Path(root)
        dirs[:] = sorted(d for d in dirs if d not in excludes and not (root / d).is_symlink() and not (output and is_inside((root / d).resolve(), output)))
        for name in sorted(files):
            candidate = root / name
            if candidate.suffix.lower() == ".json" and not candidate.is_symlink():
                sources.append(candidate)
    converted = skipped = errors = 0
    destinations = set()
    for item in sources:
        relative = item.relative_to(source)
        target = item.with_suffix(".md") if args.in_place else output / relative.with_suffix(".md")
        target_key = str(target.resolve()).casefold()
        if target_key in destinations:
            errors += 1
            print(f"ERREUR : collision de destination : {target}", file=sys.stderr)
            continue
        destinations.add(target_key)
        if target.exists() and not args.overwrite:
            skipped += 1
            print(f"IGNORÉ (existe déjà) : {target}")
            continue
        if args.dry_run:
            print(f"PRÉVU : {item} -> {target}")
            converted += 1
            continue
        try:
            convert(item, target, relative, args.max_depth, args.include_json)
            converted += 1
            print(f"CONVERTI : {relative} -> {target}")
        except (OSError, ValueError, RecursionError) as exc:
            errors += 1
            print(f"ERREUR : {relative} : {exc}", file=sys.stderr)
    print(f"\nJSON trouvés : {len(sources)} | {'Prévus' if args.dry_run else 'Convertis'} : {converted} | Ignorés : {skipped} | Erreurs : {errors}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())