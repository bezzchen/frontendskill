"""Package integrity checks exercise real copied files, without network access."""
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'check_skill_package.py'


class PackageTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        seed = self.root / 'seed'
        (seed / 'references').mkdir(parents=True)
        (seed / 'SKILL.md').write_text('---\nname: example\ndescription: Example package.\n---\n[contract](references/contract.md)\n')
        (seed / 'references' / 'contract.md').write_text('# Contract\n[adapter](adapter.md#scope)\n')
        (seed / 'references' / 'adapter.md').write_text('# Adapter\n')
        (seed / 'references' / 'LICENSE.txt').write_text('Example license\n')
        (seed / 'README.md').write_text('[repository](../../missing.md)\n')
        self.manifest = {
            'schema_version': '2.0-experimental', 'path_base': 'skill-directory',
            'source_paths_base': 'upstream-repository',
            'integrations': [{
                'id': 'example-director', 'role': 'director',
                'source_url': 'https://example.com/repo', 'source_revision': 'a' * 40,
                'source_paths': ['skills/example/SKILL.md'],
                'source_hashes': {'skills/example/SKILL.md': {'algorithm': 'sha256', 'value': 'b' * 64}},
                'adapter_path': 'references/adapter.md', 'prerequisites': [],
                'decision_scope': ['design'], 'fallback': {'id': 'builtin-fallback', 'reference_path': 'references/contract.md', 'behavior': 'Use brief'},
                'tested_hosts': [], 'compatibility_status': 'candidate',
                'attribution': {'author': 'Example', 'work': 'Example', 'license': 'Example', 'license_path': 'references/LICENSE.txt'},
            }],
            'methodology_references': [{
                'id': 'review-method', 'role': 'rendered-review-methodology',
                'source_url': 'https://example.com/review', 'source_revision': 'c' * 40,
                'source_paths': ['review.md'], 'adapter_path': 'references/contract.md',
                'tested_hosts': [], 'compatibility_status': 'provenance-only', 'attribution': 'Example method',
            }],
        }
        (seed / 'integrations.lock.json').write_text(json.dumps(self.manifest))
        self.package = self.root / 'installed'
        shutil.copytree(seed, self.package)

    def run_check(self):
        return subprocess.run([sys.executable, str(SCRIPT), str(self.package)], capture_output=True, text=True)

    def write_manifest(self):
        (self.package / 'integrations.lock.json').write_text(json.dumps(self.manifest))

    def assert_rejected(self, fragment):
        result = self.run_check()
        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn(fragment, result.stderr)

    def test_complete_folder_passes_and_readme_is_not_runtime(self):
        result = self.run_check()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('PASS', result.stdout)

    def test_skill_only_copy_fails(self):
        shutil.rmtree(self.package / 'references')
        (self.package / 'integrations.lock.json').unlink()
        self.assert_rejected('integrations.lock.json')

    def test_missing_linked_reference_fails(self):
        (self.package / 'references' / 'contract.md').unlink()
        self.assert_rejected('contract.md')

    def test_relative_link_escape_fails(self):
        (self.root / 'outside.md').write_text('Outside')
        with (self.package / 'SKILL.md').open('a') as f:
            f.write('[escape](../outside.md)\n')
        self.assert_rejected('escapes package')

    def test_symlink_escape_fails(self):
        outside = self.root / 'outside.md'
        outside.write_text('Outside')
        target = self.package / 'references' / 'adapter.md'
        target.unlink()
        target.symlink_to(outside)
        self.assert_rejected('escapes package')

    def test_manifest_path_escape_fails(self):
        (self.root / 'license.txt').write_text('Outside')
        self.manifest['integrations'][0]['attribution']['license_path'] = '../license.txt'
        self.write_manifest()
        self.assert_rejected('escapes package')

    def test_malformed_manifest_fails_cleanly(self):
        (self.package / 'integrations.lock.json').write_text('{broken')
        self.assert_rejected('invalid JSON')

    def test_malformed_revision_fails(self):
        self.manifest['integrations'][0]['source_revision'] = 'main'
        self.write_manifest()
        self.assert_rejected('source_revision')

    def test_malformed_hash_fails(self):
        self.manifest['integrations'][0]['source_hashes']['skills/example/SKILL.md']['value'] = 'unknown'
        self.write_manifest()
        self.assert_rejected('sha256')

    def test_hash_must_belong_to_declared_source(self):
        self.manifest['integrations'][0]['source_hashes']['other.md'] = {'algorithm': 'sha256', 'value': 'b' * 64}
        self.write_manifest()
        self.assert_rejected('undeclared source')

    def test_duplicate_ids_across_manifest_sections_fail(self):
        self.manifest['methodology_references'][0]['id'] = 'example-director'
        self.write_manifest()
        self.assert_rejected('duplicate id')

    def test_missing_frontmatter_field_fails(self):
        (self.package / 'SKILL.md').write_text('---\nname: example\n---\n')
        self.assert_rejected('description')

    def test_empty_frontmatter_value_does_not_consume_next_field(self):
        (self.package / 'SKILL.md').write_text('---\nname:\ndescription: Example\n---\n')
        self.assert_rejected('name')

    def test_missing_required_identity_field_fails(self):
        del self.manifest['integrations'][0]['role']
        self.write_manifest()
        self.assert_rejected('role')

    def test_wrong_manifest_shape_fails_without_traceback(self):
        self.manifest['integrations'] = [None]
        self.write_manifest()
        self.assert_rejected('must be an object')
        self.assertNotIn('Traceback', self.run_check().stderr)

    def test_reference_style_links_are_checked(self):
        with (self.package / 'SKILL.md').open('a') as f:
            f.write('[missing][guide]\n\n[guide]: references/missing.md\n')
        self.assert_rejected('missing.md')

    def test_local_file_uri_links_are_rejected(self):
        for scheme in ('file', 'filesystem', 'vscode', 'vscode-insiders'):
            with self.subTest(scheme=scheme):
                (self.package / 'references' / 'adapter.md').write_text(
                    f'[guide]({scheme}:///definitely-not-present/cfa-required-guide.md)\n')
                self.assert_rejected('local filesystem URI')

    def test_external_links_and_code_examples_are_not_local_dependencies(self):
        with (self.package / 'SKILL.md').open('a') as f:
            f.write('[web](https://example.com/missing)\n[http](http://example.com/missing)\n[email](mailto:help@example.com)\n[anchor](#scope)\n```md\n[example](missing.md)\n```\n`[example](also-missing.md)`\n')
        result = self.run_check()
        self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == '__main__':
    unittest.main()
