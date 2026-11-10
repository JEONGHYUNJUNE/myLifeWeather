"""Inject a self-contained timed transcript reader into episode HTML."""
import json
import re
from pathlib import Path


def add_reader(page, episode, video_id, root):
    page = re.sub(r'<!--READER-START-->.*?<!--READER-END-->', '', page, flags=re.S)
    if 'class="pair"' not in page:
        return page
    asset = Path(__file__).parent / 'reader'
    config_path = root / 'data/hey-tablo/playback.json'
    audio = json.loads(config_path.read_text()).get(str(episode), {}) if config_path.exists() else {}
    config = {'youtube': video_id, 'spotify': audio.get('episodeId'), 'cloud': json.loads((root/'data/hey-tablo/supabase-public.json').read_text())}
    style = '<style>' + (asset / 'reader.css').read_text() + '</style>'
    markup = (asset / 'reader.html').read_text()
    # Keep the fixed dock outside main; the entry button belongs above the study toolbar.
    intro, dock = markup.split('<section id="reader-dock"', 1)
    script = (asset / 'vendor/supabase-2.108.2.js').read_text() + '\n' + (asset / 'reader-cloud.js').read_text() + '\n' + (asset / 'reader-core.js').read_text() + '\n' + (asset / 'reader.js').read_text().replace('READER_CONFIG', json.dumps(config))
    page = page.replace('<nav class="toolbar"', '<!--READER-START-->' + intro + '<!--READER-END--><nav class="toolbar"', 1)
    page = page.replace('</body>', '<!--READER-START-->' + style + '<section id="reader-dock"' + dock + '<script>' + script + '</script><!--READER-END--></body>')
    return page


if __name__ == '__main__':
    root = Path(__file__).resolve().parents[1]
    for ep in json.loads((root/'data/hey-tablo/episodes.json').read_text()):
        path = root / f'public/hey-tablo/ep-{ep["number"]}.html'
        path.write_text(add_reader(path.read_text(), ep['number'], ep['videoId'], root))
        print(ep['number'])
