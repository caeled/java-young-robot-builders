"""Compile the downloadable examples and compare exact output. Requires JDK 17+."""
import argparse
import json
import subprocess
import tempfile
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--jdk-bin', type=Path, help='Folder containing java and javac; defaults to PATH')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
expectations = json.loads((root / 'tests' / 'java-expected.json').read_text(encoding='utf-8'))
def executable(name):
    return str(args.jdk_bin / name) if args.jdk_bin else name

with tempfile.TemporaryDirectory(prefix='robot-java-') as build:
    sources = [str(root / 'examples' / f'{name}.java') for name in expectations]
    subprocess.run([executable('javac'), '--release', '17', '-d', build, *sources], check=True, timeout=60)
    for name, expected in expectations.items():
        result = subprocess.run([executable('java'), '-cp', build, name], check=True, capture_output=True, text=True, timeout=10)
        assert result.stdout.strip() == expected, f'{name}: expected {expected!r}, got {result.stdout!r}'
        print(f'{name}: compiled and expected output matched')
