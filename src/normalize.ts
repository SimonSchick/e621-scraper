import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface WeirdDate {
  s: number;
  n: number;
}

interface PartialEntry {
  tags: string | string[];
  locked_tags: null | string | string[];
  created_at: WeirdDate | string;
}

const postPath = join(__dirname, '../posts');
for (const fileName of readdirSync(postPath)) {
  const path = join(postPath, fileName);
  const json = <PartialEntry[]>JSON.parse(readFileSync(path, 'utf8'));
  let changed = false;
  for (const r of json) {
    if (typeof r.created_at !== 'string') {
      r.created_at = new Date(r.created_at.s * 1000 + r.created_at.n / 1_000_000).toISOString();
      changed = true;
    }
    if (!Array.isArray(r.tags)) {
      r.tags = r.tags.split(' ');
      changed = true;
    }
    if (r.locked_tags && !Array.isArray(r.locked_tags)) {
      r.tags = r.locked_tags.split(' ');
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(path, JSON.stringify(json), 'utf8');
  }
  console.log(fileName);
}
